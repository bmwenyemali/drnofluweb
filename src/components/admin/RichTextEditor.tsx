"use client";

import { useState, useCallback, useRef } from "react";
import Image from "next/image";
import {
  Bold,
  Italic,
  List,
  Link as LinkIcon,
  Image as ImageIcon,
  Heading1,
  Heading2,
  Quote,
  Eye,
  Edit,
  Upload,
  Loader2,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { uploadToCloudinary } from "@/lib/cloudinary";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  minHeight?: string;
  imageFolder?: string;
}

export function RichTextEditor({
  value,
  onChange,
  placeholder = "Écrivez votre contenu ici...",
  className,
  minHeight = "300px",
  imageFolder = "website/articles",
}: RichTextEditorProps) {
  const [activeTab, setActiveTab] = useState<"edit" | "preview">("edit");

  // Image dialog state
  const [imageDialogOpen, setImageDialogOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [imageAlt, setImageAlt] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadPreview, setUploadPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Link dialog state
  const [linkDialogOpen, setLinkDialogOpen] = useState(false);
  const [linkText, setLinkText] = useState("");
  const [linkUrl, setLinkUrl] = useState("");

  const insertText = useCallback(
    (before: string, after: string = "") => {
      const textarea = document.getElementById(
        "rich-editor",
      ) as HTMLTextAreaElement;
      if (!textarea) return;

      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const selectedText = value.substring(start, end);
      const newText =
        value.substring(0, start) +
        before +
        selectedText +
        after +
        value.substring(end);

      onChange(newText);

      // Set cursor position after insertion
      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(
          start + before.length,
          start + before.length + selectedText.length,
        );
      }, 0);
    },
    [onChange, value],
  );

  const openLinkDialog = useCallback(() => {
    const textarea = document.getElementById(
      "rich-editor",
    ) as HTMLTextAreaElement;
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const selectedText = value.substring(start, end);
      setLinkText(selectedText || "");
    }
    setLinkUrl("https://");
    setLinkDialogOpen(true);
  }, [value]);

  const insertLink = useCallback(() => {
    if (!linkUrl || linkUrl === "https://") return;

    const textarea = document.getElementById(
      "rich-editor",
    ) as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = linkText || linkUrl;

    const newText =
      value.substring(0, start) +
      `[${text}](${linkUrl})` +
      value.substring(end);

    onChange(newText);
    setLinkDialogOpen(false);
    setLinkText("");
    setLinkUrl("");
  }, [linkText, linkUrl, onChange, value]);

  const openImageDialog = useCallback(() => {
    setImageUrl("");
    setImageAlt("");
    setUploadPreview(null);
    setImageDialogOpen(true);
  }, []);

  const handleFileSelect = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      if (!file.type.startsWith("image/")) {
        alert("Veuillez sélectionner une image");
        return;
      }

      if (file.size > 10 * 1024 * 1024) {
        alert("L'image ne doit pas dépasser 10 Mo");
        return;
      }

      // Show local preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadPreview(reader.result as string);
      };
      reader.readAsDataURL(file);

      // Upload to Cloudinary
      setIsUploading(true);
      try {
        const result = await uploadToCloudinary(file, imageFolder);
        setImageUrl(result.url);
      } catch (error: any) {
        console.error("Upload error:", error);
        alert(error.message || "Erreur lors de l'upload");
        setUploadPreview(null);
      } finally {
        setIsUploading(false);
      }
    },
    [imageFolder],
  );

  const insertImage = useCallback(() => {
    if (!imageUrl) return;

    const textarea = document.getElementById(
      "rich-editor",
    ) as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const alt = imageAlt || "Image";

    const newText =
      value.substring(0, start) +
      `\n\n![${alt}](${imageUrl})\n\n` +
      value.substring(start);

    onChange(newText);
    setImageDialogOpen(false);
    setImageUrl("");
    setImageAlt("");
    setUploadPreview(null);
  }, [imageUrl, imageAlt, onChange, value]);

  const toolbarButtons = [
    { icon: Heading1, action: () => insertText("## ", ""), title: "Titre" },
    {
      icon: Heading2,
      action: () => insertText("### ", ""),
      title: "Sous-titre",
    },
    { icon: Bold, action: () => insertText("**", "**"), title: "Gras" },
    { icon: Italic, action: () => insertText("*", "*"), title: "Italique" },
    { icon: Quote, action: () => insertText("> ", ""), title: "Citation" },
    { icon: List, action: () => insertText("- ", ""), title: "Liste" },
    { icon: LinkIcon, action: openLinkDialog, title: "Lien" },
    { icon: ImageIcon, action: openImageDialog, title: "Image" },
  ];

  // Simple markdown to HTML converter
  const renderMarkdown = (text: string): string => {
    // Process images FIRST (before links since ![alt](url) contains [alt](url))
    let html = text.replace(
      /!\[([^\]]*)\]\(([^)]+)\)/g,
      '<img src="$2" alt="$1" class="rounded-lg my-4 max-w-full" />',
    );

    // Then process the rest
    html = html
      // Escape HTML (but not in img tags we just created)
      // Headers
      .replace(
        /^### (.*$)/gim,
        '<h3 class="text-lg font-semibold mt-4 mb-2">$1</h3>',
      )
      .replace(
        /^## (.*$)/gim,
        '<h2 class="text-xl font-bold mt-6 mb-3">$1</h2>',
      )
      .replace(
        /^# (.*$)/gim,
        '<h1 class="text-2xl font-bold mt-6 mb-4">$1</h1>',
      )
      // Bold and Italic
      .replace(/\*\*\*(.*?)\*\*\*/g, "<strong><em>$1</em></strong>")
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.*?)\*/g, "<em>$1</em>")
      // Links (but not img src which we already processed)
      .replace(
        /\[([^\]]+)\]\(([^)]+)\)/g,
        '<a href="$2" class="text-primary-600 hover:underline" target="_blank" rel="noopener">$1</a>',
      )
      // Blockquotes
      .replace(
        /^> (.*$)/gim,
        '<blockquote class="border-l-4 border-primary-500 pl-4 my-4 italic text-gray-600">$1</blockquote>',
      )
      // Lists
      .replace(/^- (.*$)/gim, '<li class="ml-4">$1</li>')
      // Paragraphs
      .replace(/\n\n/g, '</p><p class="mb-4">')
      .replace(/\n/g, "<br />");

    // Wrap in paragraph
    html = `<p class="mb-4">${html}</p>`;

    return html;
  };

  return (
    <div className={cn("border rounded-lg overflow-hidden", className)}>
      <Tabs
        value={activeTab}
        onValueChange={(v) => setActiveTab(v as "edit" | "preview")}
      >
        <div className="flex items-center justify-between border-b bg-gray-50 px-2">
          {/* Toolbar */}
          <div className="flex items-center gap-1 py-1">
            {toolbarButtons.map((button, index) => (
              <Button
                key={index}
                type="button"
                variant="ghost"
                size="icon"
                onClick={button.action}
                disabled={activeTab === "preview"}
                title={button.title}
                className="h-8 w-8"
              >
                <button.icon className="h-4 w-4" />
              </Button>
            ))}
          </div>

          {/* Tabs */}
          <TabsList className="h-8">
            <TabsTrigger value="edit" className="text-xs h-7">
              <Edit className="h-3 w-3 mr-1" />
              Éditer
            </TabsTrigger>
            <TabsTrigger value="preview" className="text-xs h-7">
              <Eye className="h-3 w-3 mr-1" />
              Aperçu
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="edit" className="m-0">
          <Textarea
            id="rich-editor"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className={cn(
              "border-0 rounded-none resize-none focus-visible:ring-0",
            )}
            style={{ minHeight }}
          />
        </TabsContent>

        <TabsContent value="preview" className="m-0">
          <div
            className="prose prose-sm max-w-none p-4 overflow-auto"
            style={{ minHeight }}
            dangerouslySetInnerHTML={{ __html: renderMarkdown(value) }}
          />
        </TabsContent>
      </Tabs>

      <div className="px-3 py-2 border-t bg-gray-50 text-xs text-gray-500">
        Supporte Markdown. **gras**, *italique*, [lien](url), ![image](url)
      </div>

      {/* Image Upload Dialog */}
      <Dialog open={imageDialogOpen} onOpenChange={setImageDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Insérer une image</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {/* Upload zone */}
            <div
              className={cn(
                "border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors",
                uploadPreview
                  ? "border-primary-500 bg-primary-50"
                  : "border-gray-300 hover:border-gray-400",
              )}
              onClick={() => fileInputRef.current?.click()}
            >
              {uploadPreview ? (
                <div className="relative">
                  <img
                    src={uploadPreview}
                    alt="Aperçu"
                    className="max-h-48 mx-auto rounded"
                  />
                  {isUploading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-white/80 rounded">
                      <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
                      <span className="ml-2 text-sm font-medium">
                        Upload en cours...
                      </span>
                    </div>
                  )}
                  {imageUrl && !isUploading && (
                    <div className="absolute top-2 right-2">
                      <Button
                        type="button"
                        size="icon"
                        variant="destructive"
                        className="h-6 w-6"
                        onClick={(e) => {
                          e.stopPropagation();
                          setUploadPreview(null);
                          setImageUrl("");
                        }}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <Upload className="h-10 w-10 mx-auto text-gray-400 mb-2" />
                  <p className="text-sm text-gray-600">
                    Cliquez pour sélectionner une image
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    PNG, JPG, GIF jusqu&apos;à 10 Mo
                  </p>
                </>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileSelect}
              />
            </div>

            {/* Alt text */}
            <div className="space-y-2">
              <Label htmlFor="imageAlt">Description (alt text)</Label>
              <Input
                id="imageAlt"
                value={imageAlt}
                onChange={(e) => setImageAlt(e.target.value)}
                placeholder="Description de l'image"
              />
            </div>

            {/* Or enter URL manually */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-gray-500">
                  Ou coller une URL
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <Input
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setImageDialogOpen(false)}>
              Annuler
            </Button>
            <Button onClick={insertImage} disabled={!imageUrl || isUploading}>
              Insérer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Link Dialog */}
      <Dialog open={linkDialogOpen} onOpenChange={setLinkDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Insérer un lien</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="linkText">Texte du lien</Label>
              <Input
                id="linkText"
                value={linkText}
                onChange={(e) => setLinkText(e.target.value)}
                placeholder="Cliquez ici"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="linkUrl">URL</Label>
              <Input
                id="linkUrl"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                placeholder="https://..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setLinkDialogOpen(false)}>
              Annuler
            </Button>
            <Button
              onClick={insertLink}
              disabled={!linkUrl || linkUrl === "https://"}
            >
              Insérer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

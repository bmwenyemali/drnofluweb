"use client";

import { useState, useCallback } from "react";
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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  minHeight?: string;
}

export function RichTextEditor({
  value,
  onChange,
  placeholder = "Écrivez votre contenu ici...",
  className,
  minHeight = "300px",
}: RichTextEditorProps) {
  const [activeTab, setActiveTab] = useState<"edit" | "preview">("edit");

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

  const insertLink = useCallback(() => {
    const textarea = document.getElementById(
      "rich-editor",
    ) as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);

    const linkText = selectedText || prompt("Texte du lien:", "Cliquez ici");
    if (linkText === null) return;

    const linkUrl = prompt("URL du lien:", "https://");
    if (!linkUrl || linkUrl === "https://") return;

    const newText =
      value.substring(0, start) +
      `[${linkText}](${linkUrl})` +
      value.substring(end);

    onChange(newText);
  }, [onChange, value]);

  const insertImage = useCallback(() => {
    const textarea = document.getElementById(
      "rich-editor",
    ) as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;

    const imageUrl = prompt("URL de l'image:", "https://");
    if (!imageUrl || imageUrl === "https://") return;

    const altText = prompt("Description de l'image:", "Image");
    if (altText === null) return;

    const newText =
      value.substring(0, start) +
      `![${altText}](${imageUrl})` +
      value.substring(end);

    onChange(newText);
  }, [onChange, value]);

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
    { icon: LinkIcon, action: insertLink, title: "Lien" },
    { icon: ImageIcon, action: insertImage, title: "Image" },
  ];

  // Simple markdown to HTML converter
  const renderMarkdown = (text: string): string => {
    let html = text
      // Escape HTML
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
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
      // Links
      .replace(
        /\[([^\]]+)\]\(([^)]+)\)/g,
        '<a href="$2" class="text-primary-600 hover:underline" target="_blank" rel="noopener">$1</a>',
      )
      // Images
      .replace(
        /!\[([^\]]*)\]\(([^)]+)\)/g,
        '<img src="$2" alt="$1" class="rounded-lg my-4 max-w-full" />',
      )
      // Blockquotes
      .replace(
        /^&gt; (.*$)/gim,
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
    </div>
  );
}

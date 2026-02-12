"use client";

import { useState, useCallback } from "react";
import { Upload, FileText, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { uploadDocumentToCloudinary } from "@/lib/cloudinary";

interface FileUploadProps {
  value?: string;
  onChange: (url: string, fileSize?: number) => void;
  folder?: string;
  accept?: string;
  className?: string;
  placeholder?: string;
}

export function FileUpload({
  value,
  onChange,
  folder = "drnoflu/documents",
  accept = ".pdf,.doc,.docx,.xls,.xlsx",
  className,
  placeholder = "Cliquez pour sélectionner un fichier",
}: FileUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [fileName, setFileName] = useState<string>("");

  const handleUpload = useCallback(
    async (file: File) => {
      if (file.size > 50 * 1024 * 1024) {
        alert("Le fichier ne doit pas dépasser 50 Mo");
        return;
      }

      setIsUploading(true);
      setFileName(file.name);

      try {
        const result = await uploadDocumentToCloudinary(file, folder);
        onChange(result.url, result.fileSize);
      } catch (error) {
        console.error("Upload error:", error);
        alert("Erreur lors de l'upload du fichier");
        setFileName("");
      } finally {
        setIsUploading(false);
      }
    },
    [folder, onChange],
  );

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) handleUpload(file);
    },
    [handleUpload],
  );

  const handleRemove = useCallback(() => {
    onChange("");
    setFileName("");
  }, [onChange]);

  const getFileExtension = (url: string) => {
    const parts = url.split(".");
    return parts[parts.length - 1].toUpperCase();
  };

  return (
    <div className={cn("relative", className)}>
      {value ? (
        <div className="flex items-center gap-3 p-4 border rounded-lg bg-gray-50">
          <div className="flex-shrink-0 p-3 bg-primary-100 rounded-lg">
            <FileText className="h-6 w-6 text-primary-600" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              {fileName || "Document"}
            </p>
            <p className="text-xs text-gray-500">
              {getFileExtension(value)} • Fichier uploadé
            </p>
          </div>
          <Button
            type="button"
            size="icon"
            variant="ghost"
            onClick={handleRemove}
            className="flex-shrink-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <label className="flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-lg cursor-pointer hover:border-primary-500 hover:bg-primary-50 transition-colors">
          <input
            type="file"
            accept={accept}
            onChange={handleFileSelect}
            className="hidden"
            disabled={isUploading}
          />
          {isUploading ? (
            <>
              <Loader2 className="h-8 w-8 text-gray-400 animate-spin mb-2" />
              <span className="text-sm text-gray-500">Upload en cours...</span>
              <span className="text-xs text-gray-400 mt-1">{fileName}</span>
            </>
          ) : (
            <>
              <div className="p-3 bg-gray-100 rounded-full mb-3">
                <Upload className="h-6 w-6 text-gray-400" />
              </div>
              <span className="text-sm text-gray-500 text-center">
                {placeholder}
              </span>
              <span className="text-xs text-gray-400 mt-1">
                PDF, DOC, DOCX, XLS, XLSX (max 50 Mo)
              </span>
            </>
          )}
        </label>
      )}
    </div>
  );
}

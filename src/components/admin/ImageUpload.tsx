"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import { Upload, X, Loader2, ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { uploadToCloudinary } from "@/lib/cloudinary";

interface ImageUploadProps {
  value?: string;
  onChange: (url: string) => void;
  folder?: string;
  aspectRatio?: "square" | "video" | "portrait" | "auto";
  className?: string;
  placeholder?: string;
}

export function ImageUpload({
  value,
  onChange,
  folder = "drnoflu",
  aspectRatio = "auto",
  className,
  placeholder = "Cliquez pour ajouter une image",
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const aspectRatioClasses = {
    square: "aspect-square",
    video: "aspect-video",
    portrait: "aspect-[3/4]",
    auto: "min-h-[200px]",
  };

  const handleUpload = useCallback(
    async (file: File) => {
      if (!file.type.startsWith("image/")) {
        alert("Veuillez sélectionner une image");
        return;
      }

      if (file.size > 10 * 1024 * 1024) {
        alert("L'image ne doit pas dépasser 10 Mo");
        return;
      }

      setIsUploading(true);
      try {
        const result = await uploadToCloudinary(file, folder);
        onChange(result.url);
      } catch (error) {
        console.error("Upload error:", error);
        alert("Erreur lors de l'upload de l'image");
      } finally {
        setIsUploading(false);
      }
    },
    [folder, onChange],
  );

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setDragOver(false);
      const file = e.dataTransfer.files[0];
      if (file) handleUpload(file);
    },
    [handleUpload],
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
  }, [onChange]);

  return (
    <div
      className={cn(
        "relative border-2 border-dashed rounded-lg overflow-hidden transition-colors",
        dragOver
          ? "border-primary-500 bg-primary-50"
          : "border-gray-300 hover:border-gray-400",
        aspectRatioClasses[aspectRatio],
        className,
      )}
      onDragOver={(e) => {
        e.preventDefault();
        setDragOver(true);
      }}
      onDragLeave={() => setDragOver(false)}
      onDrop={handleDrop}
    >
      {value ? (
        <>
          <Image
            src={value}
            alt="Image uploadée"
            fill
            className="object-cover"
          />
          <div className="absolute top-2 right-2 flex gap-2">
            <Button
              type="button"
              size="icon"
              variant="destructive"
              onClick={handleRemove}
              className="h-8 w-8"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </>
      ) : (
        <label className="flex flex-col items-center justify-center h-full cursor-pointer p-4">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
            disabled={isUploading}
          />
          {isUploading ? (
            <>
              <Loader2 className="h-10 w-10 text-gray-400 animate-spin mb-2" />
              <span className="text-sm text-gray-500">Upload en cours...</span>
            </>
          ) : (
            <>
              <div className="p-4 bg-gray-100 rounded-full mb-3">
                <ImageIcon className="h-8 w-8 text-gray-400" />
              </div>
              <span className="text-sm text-gray-500 text-center">
                {placeholder}
              </span>
              <span className="text-xs text-gray-400 mt-1">
                ou glissez-déposez
              </span>
            </>
          )}
        </label>
      )}
    </div>
  );
}

interface MultiImageUploadProps {
  value: string[];
  onChange: (urls: string[]) => void;
  folder?: string;
  maxImages?: number;
  className?: string;
}

export function MultiImageUpload({
  value = [],
  onChange,
  folder = "drnoflu",
  maxImages = 10,
  className,
}: MultiImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);

  const handleUpload = useCallback(
    async (files: FileList) => {
      const remainingSlots = maxImages - value.length;
      const filesToUpload = Array.from(files).slice(0, remainingSlots);

      if (filesToUpload.length === 0) {
        alert(`Vous avez atteint la limite de ${maxImages} images`);
        return;
      }

      setIsUploading(true);
      try {
        const uploadPromises = filesToUpload.map((file) =>
          uploadToCloudinary(file, folder),
        );
        const results = await Promise.all(uploadPromises);
        const newUrls = results.map((r) => r.url);
        onChange([...value, ...newUrls]);
      } catch (error) {
        console.error("Upload error:", error);
        alert("Erreur lors de l'upload des images");
      } finally {
        setIsUploading(false);
      }
    },
    [folder, maxImages, onChange, value],
  );

  const handleRemove = useCallback(
    (index: number) => {
      const newValue = [...value];
      newValue.splice(index, 1);
      onChange(newValue);
    },
    [onChange, value],
  );

  return (
    <div className={cn("space-y-4", className)}>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {value.map((url, index) => (
          <div
            key={index}
            className="relative aspect-square rounded-lg overflow-hidden border"
          >
            <Image
              src={url}
              alt={`Image ${index + 1}`}
              fill
              className="object-cover"
            />
            <Button
              type="button"
              size="icon"
              variant="destructive"
              onClick={() => handleRemove(index)}
              className="absolute top-2 right-2 h-6 w-6"
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        ))}

        {value.length < maxImages && (
          <label className="aspect-square border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-primary-500 hover:bg-primary-50 transition-colors">
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => e.target.files && handleUpload(e.target.files)}
              className="hidden"
              disabled={isUploading}
            />
            {isUploading ? (
              <Loader2 className="h-6 w-6 text-gray-400 animate-spin" />
            ) : (
              <>
                <Upload className="h-6 w-6 text-gray-400 mb-1" />
                <span className="text-xs text-gray-500">Ajouter</span>
              </>
            )}
          </label>
        )}
      </div>
      <p className="text-xs text-gray-500">
        {value.length} / {maxImages} images
      </p>
    </div>
  );
}

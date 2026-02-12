"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import { Plus, X, Youtube, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { extractYouTubeId, getYouTubeThumbnail } from "@/lib/cloudinary";

interface YouTubeInputProps {
  value: string[];
  onChange: (urls: string[]) => void;
  maxVideos?: number;
  className?: string;
}

export function YouTubeInput({
  value = [],
  onChange,
  maxVideos = 5,
  className,
}: YouTubeInputProps) {
  const [inputUrl, setInputUrl] = useState("");
  const [error, setError] = useState("");

  const handleAdd = useCallback(() => {
    if (!inputUrl.trim()) return;

    const videoId = extractYouTubeId(inputUrl);
    if (!videoId) {
      setError("URL YouTube invalide");
      return;
    }

    if (value.includes(inputUrl)) {
      setError("Cette vidéo est déjà ajoutée");
      return;
    }

    if (value.length >= maxVideos) {
      setError(`Maximum ${maxVideos} vidéos autorisées`);
      return;
    }

    onChange([...value, inputUrl]);
    setInputUrl("");
    setError("");
  }, [inputUrl, maxVideos, onChange, value]);

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
      {/* Input for adding new video */}
      <div className="flex gap-2">
        <div className="flex-1">
          <Input
            type="url"
            value={inputUrl}
            onChange={(e) => {
              setInputUrl(e.target.value);
              setError("");
            }}
            placeholder="https://www.youtube.com/watch?v=..."
            className={cn(error && "border-red-500")}
          />
          {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
        </div>
        <Button type="button" onClick={handleAdd} disabled={!inputUrl.trim()}>
          <Plus className="h-4 w-4 mr-1" />
          Ajouter
        </Button>
      </div>

      {/* List of added videos */}
      {value.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {value.map((url, index) => {
            const videoId = extractYouTubeId(url);
            if (!videoId) return null;

            return (
              <div
                key={index}
                className="relative group rounded-lg overflow-hidden border bg-gray-50"
              >
                <div className="aspect-video relative">
                  <Image
                    src={getYouTubeThumbnail(videoId)}
                    alt={`Vidéo ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <a
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 bg-white rounded-full mr-2"
                    >
                      <ExternalLink className="h-5 w-5 text-gray-700" />
                    </a>
                    <Button
                      type="button"
                      size="icon"
                      variant="destructive"
                      onClick={() => handleRemove(index)}
                      className="h-9 w-9"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  {/* YouTube play button overlay */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="bg-red-600 rounded-full p-3 shadow-lg">
                      <Youtube className="h-8 w-8 text-white" />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <p className="text-xs text-gray-500">
        {value.length} / {maxVideos} vidéos
      </p>
    </div>
  );
}

interface YouTubeEmbedProps {
  url: string;
  className?: string;
}

export function YouTubeEmbed({ url, className }: YouTubeEmbedProps) {
  const videoId = extractYouTubeId(url);

  if (!videoId) return null;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "block relative aspect-video rounded-lg overflow-hidden group",
        className,
      )}
    >
      <Image
        src={getYouTubeThumbnail(videoId)}
        alt="Vidéo YouTube"
        fill
        className="object-cover"
      />
      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors flex items-center justify-center">
        <div className="bg-red-600 rounded-full p-4 shadow-lg transform group-hover:scale-110 transition-transform">
          <Youtube className="h-10 w-10 text-white" />
        </div>
      </div>
    </a>
  );
}

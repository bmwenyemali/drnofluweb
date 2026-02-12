/**
 * Cloudinary Configuration and Upload Utilities
 * DRNOFLU - Direction des Recettes Non Fiscales du Lualaba
 */

// Configuration Cloudinary - À définir dans .env.local
export const CLOUDINARY_CONFIG = {
  cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "demo",
  uploadPreset:
    process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "ml_default",
  apiKey: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY || "",
};

/**
 * Upload une image vers Cloudinary
 */
export async function uploadToCloudinary(
  file: File,
  folder: string = "drnoflu",
): Promise<{ url: string; publicId: string }> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", CLOUDINARY_CONFIG.uploadPreset);
  formData.append("folder", folder);

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUDINARY_CONFIG.cloudName}/image/upload`,
    {
      method: "POST",
      body: formData,
    },
  );

  if (!response.ok) {
    throw new Error("Erreur lors de l'upload de l'image");
  }

  const data = await response.json();
  return {
    url: data.secure_url,
    publicId: data.public_id,
  };
}

/**
 * Upload un document (PDF, DOC, etc.) vers Cloudinary
 */
export async function uploadDocumentToCloudinary(
  file: File,
  folder: string = "drnoflu/documents",
): Promise<{ url: string; publicId: string; fileSize: number }> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", CLOUDINARY_CONFIG.uploadPreset);
  formData.append("folder", folder);
  formData.append("resource_type", "raw");

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUDINARY_CONFIG.cloudName}/raw/upload`,
    {
      method: "POST",
      body: formData,
    },
  );

  if (!response.ok) {
    throw new Error("Erreur lors de l'upload du document");
  }

  const data = await response.json();
  return {
    url: data.secure_url,
    publicId: data.public_id,
    fileSize: data.bytes,
  };
}

/**
 * Génère une URL d'image optimisée Cloudinary
 */
export function getOptimizedImageUrl(
  url: string,
  options: {
    width?: number;
    height?: number;
    quality?: number;
    format?: "auto" | "webp" | "jpg" | "png";
  } = {},
): string {
  if (!url || !url.includes("cloudinary.com")) {
    return url;
  }

  const { width, height, quality = "auto", format = "auto" } = options;

  // Parse l'URL Cloudinary
  const parts = url.split("/upload/");
  if (parts.length !== 2) return url;

  const transformations: string[] = [];
  if (width) transformations.push(`w_${width}`);
  if (height) transformations.push(`h_${height}`);
  transformations.push(`q_${quality}`);
  transformations.push(`f_${format}`);

  return `${parts[0]}/upload/${transformations.join(",")}/${parts[1]}`;
}

/**
 * Extrait l'ID de vidéo YouTube d'une URL
 */
export function extractYouTubeId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/v\/([a-zA-Z0-9_-]{11})/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) {
      return match[1];
    }
  }
  return null;
}

/**
 * Génère l'URL de la thumbnail YouTube
 */
export function getYouTubeThumbnail(
  videoId: string,
  quality: "default" | "medium" | "high" | "maxres" = "high",
): string {
  const qualityMap = {
    default: "default",
    medium: "mqdefault",
    high: "hqdefault",
    maxres: "maxresdefault",
  };
  return `https://img.youtube.com/vi/${videoId}/${qualityMap[quality]}.jpg`;
}

/**
 * Génère l'URL d'embed YouTube
 */
export function getYouTubeEmbedUrl(videoId: string): string {
  return `https://www.youtube.com/embed/${videoId}`;
}

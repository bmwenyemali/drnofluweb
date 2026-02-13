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
  folder: string = "website",
): Promise<{ url: string; publicId: string }> {
  // Check configuration
  if (!CLOUDINARY_CONFIG.cloudName || CLOUDINARY_CONFIG.cloudName === "demo") {
    throw new Error(
      "Cloudinary non configuré. Vérifiez NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME dans .env.local",
    );
  }
  if (
    !CLOUDINARY_CONFIG.uploadPreset ||
    CLOUDINARY_CONFIG.uploadPreset === "ml_default"
  ) {
    throw new Error(
      "Upload preset non configuré. Vérifiez NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET dans .env.local",
    );
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", CLOUDINARY_CONFIG.uploadPreset);
  formData.append("folder", folder);

  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CONFIG.cloudName}/image/upload`,
      {
        method: "POST",
        body: formData,
      },
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("Cloudinary error:", data);
      throw new Error(
        data.error?.message || `Erreur Cloudinary: ${response.status}`,
      );
    }

    return {
      url: data.secure_url,
      publicId: data.public_id,
    };
  } catch (error: any) {
    console.error("Upload error:", error);
    throw new Error(error.message || "Erreur lors de l'upload de l'image");
  }
}

/**
 * Upload un document (PDF, DOC, etc.) vers Cloudinary
 */
export async function uploadDocumentToCloudinary(
  file: File,
  folder: string = "website/documents",
): Promise<{ url: string; publicId: string; fileSize: number }> {
  // Check configuration
  if (!CLOUDINARY_CONFIG.cloudName || CLOUDINARY_CONFIG.cloudName === "demo") {
    throw new Error(
      "Cloudinary non configuré. Vérifiez NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME dans .env.local",
    );
  }
  if (
    !CLOUDINARY_CONFIG.uploadPreset ||
    CLOUDINARY_CONFIG.uploadPreset === "ml_default"
  ) {
    throw new Error(
      "Upload preset non configuré. Vérifiez NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET dans .env.local",
    );
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", CLOUDINARY_CONFIG.uploadPreset);
  formData.append("folder", folder);

  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CONFIG.cloudName}/auto/upload`,
      {
        method: "POST",
        body: formData,
      },
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("Cloudinary document error:", data);
      throw new Error(
        data.error?.message || `Erreur Cloudinary: ${response.status}`,
      );
    }

    return {
      url: data.secure_url,
      publicId: data.public_id,
      fileSize: data.bytes || 0,
    };
  } catch (error: any) {
    console.error("Document upload error:", error);
    throw new Error(error.message || "Erreur lors de l'upload du document");
  }
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

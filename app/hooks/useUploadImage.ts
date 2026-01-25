"use client";

import { useState } from "react";
import { getApiUrl, API_ENDPOINTS } from "../config/urls";
import { ImageUploadResponse } from "../types/media";

export const useUploadImage = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const uploadImage = async (imageFile: File): Promise<string | null> => {
    setLoading(true);
    setError(null);

    try {
      // Get token from localStorage
      const token = localStorage.getItem("authToken");
      if (!token) {
        throw new Error("Authentication token not found. Please login first.");
      }

      // Create FormData for file upload
      const formData = new FormData();
      formData.append("image", imageFile);

      const url = getApiUrl(API_ENDPOINTS.IMAGES);

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to upload image");
      }

      const data: ImageUploadResponse = await response.json();
      console.log("Image upload response data:", data);
      if (!response.ok) {
        throw new Error(data.message || "Image upload failed");
      }

      setLoading(false);
      // Return the image URL from the response
      return data.image || null;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to upload image";
      setError(errorMessage);
      setLoading(false);
      return null;
    }
  };

  return { uploadImage, loading, error };
};

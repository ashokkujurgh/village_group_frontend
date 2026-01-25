"use client";

import { useState } from "react";
import { getApiUrl, API_ENDPOINTS } from "../config/urls";
import { MediaParams, MediaResponse, Media } from "../types/media";

export const useMediaOperations = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getToken = (): string => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      throw new Error("Authentication token not found. Please login first.");
    }
    return token;
  };

  // POST: Create new media
  const createMedia = async (mediaData: MediaParams): Promise<Media | null> => {
    setLoading(true);
    setError(null);

    try {
      const token = getToken();
      const url = getApiUrl(API_ENDPOINTS.MEDIA);

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(mediaData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to create media");
      }

      const data: MediaResponse = await response.json();
      
      if (!data.success) {
        throw new Error(data.message || "Media creation failed");
      }

      setLoading(false);
      return data.data || null;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to create media";
      setError(errorMessage);
      setLoading(false);
      return null;
    }
  };

  // PATCH: Update existing media
  const updateMedia = async (mediaId: string, mediaData: Partial<MediaParams>): Promise<Media | null> => {
    setLoading(true);
    setError(null);

    try {
      const token = getToken();
      const url = getApiUrl(`${API_ENDPOINTS.MEDIA}/${mediaId}`);

      const response = await fetch(url, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(mediaData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to update media");
      }

      const data: MediaResponse = await response.json();
      
      if (!data.success) {
        throw new Error(data.message || "Media update failed");
      }

      setLoading(false);
      return data.data || null;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to update media";
      setError(errorMessage);
      setLoading(false);
      return null;
    }
  };



  return { createMedia, updateMedia, loading, error };
};

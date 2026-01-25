"use client";

import { useState } from "react";
import { getApiUrl, API_ENDPOINTS } from "../config/urls";
import { MediaParams, MediaResponse, Media } from "../types/media";

export const useEditMedia = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const editMedia = async (mediaId: string, mediaData: Partial<MediaParams>): Promise<any> => {
    setLoading(true);
    setError(null);

    try {
      // Get token from localStorage
      const token = localStorage.getItem("authToken");
      if (!token) {
        throw new Error("Authentication token not found. Please login first.");
      }

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

   

      setLoading(false);
      return data.message || null;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to update media";
      setError(errorMessage);
      setLoading(false);
      return null;
    }
  };

  return { editMedia, loading, error };
};

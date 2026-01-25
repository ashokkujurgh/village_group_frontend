"use client";

import { useState } from "react";
import { getApiUrl, API_ENDPOINTS } from "../config/urls";

interface DeleteMediaResponse {
  message: string;
  success: boolean;
  [key: string]: any;
}

export const useDeleteMedia = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deleteMedia = async (mediaId: string): Promise<boolean> => {
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
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to delete media");
      }
      

      setLoading(false);
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to delete media";
      setError(errorMessage);
      setLoading(false);
      return false;
    }
  };

  return { deleteMedia, loading, error };
};

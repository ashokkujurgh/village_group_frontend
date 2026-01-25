"use client";

import { useState, useCallback } from "react";
import { getApiUrl, API_ENDPOINTS } from "../config/urls";
import { Media } from "../types/media";

interface FetchMediasResponse {
  message: string;
  success: boolean;
  data?: Media[];
  [key: string]: any;
}

export const useFetchMedias = () => {
  const [media, setMedia] = useState<Media[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMedias = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // Get token from localStorage
      const token = localStorage.getItem("authToken");
      if (!token) {
        throw new Error("Authentication token not found. Please login first.");
      }

      const url = getApiUrl(API_ENDPOINTS.MEDIAS);

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to fetch media");
      }

      const data: FetchMediasResponse = await response.json();


      setMedia(data.data || []);
      setLoading(false);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch media";
      setError(errorMessage);
      setLoading(false);
    }
  }, []);

  return { media, loading, fetchMedias, error };
};

"use client";

import { useState } from "react";
import { getApiUrl, API_ENDPOINTS } from "../config/urls";

export const useDeleteNews = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deleteNews = async (newsId: string): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      // Get token from localStorage
      const token = localStorage.getItem("authToken");
      if (!token) {
        throw new Error("Authentication token not found. Please login first.");
      }

      const url = getApiUrl(API_ENDPOINTS.NEWS);

      const response = await fetch(url+`/${newsId}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to delete news");
      }

      setLoading(false);
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An error occurred while deleting news";
      setError(errorMessage);
      setLoading(false);
      return false;
    }
  };

  return { deleteNews, loading, error };
};
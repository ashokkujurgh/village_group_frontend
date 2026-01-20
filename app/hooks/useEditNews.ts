"use client";

import { useState } from "react";
import { getApiUrl, API_ENDPOINTS } from "../config/urls";

interface EditNewsPayload {
  title: string;
  description: string;
}

interface EditNewsResponse {
  message: string;
  success: boolean;
  data?: any;
  [key: string]: any;
}

export const useEditNews = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const editNews = async (newsId: string, newsData: EditNewsPayload): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      // Get token from localStorage
      const token = localStorage.getItem("authToken");
      if (!token) {
        throw new Error("Authentication token not found. Please login first.");
      }

      const url = getApiUrl(`${API_ENDPOINTS.NEWS}/${newsId}`);

      const response = await fetch(url, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(newsData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to edit news");
      }

      const data: EditNewsResponse = await response.json();
      setLoading(false);
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An error occurred";
      setError(errorMessage);
      setLoading(false);
      return false;
    }
  };

  return { editNews, loading, error };
};

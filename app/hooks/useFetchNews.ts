"use client";

import { useState, useEffect } from "react";
import { getApiUrl, API_ENDPOINTS } from "../config/urls";

interface News {
 
  _id: string;
  title: string;
  description: string;
  created_date: string;
 
}

interface FetchNewsResponse {
  news?: News[];
  data?: News[];
  [key: string]: any;
}

export const useFetchNews = (autoFetch = true) => {
  const [news, setNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchNews = async (): Promise<News[] | null> => {
    setLoading(true);
    setError(null);

    try {
      // Get token from localStorage
      const token = localStorage.getItem("authToken");
      if (!token) {
        throw new Error("Authentication token not found. Please login first.");
      }

      const url = getApiUrl(API_ENDPOINTS.NEWS+"/list");

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });
    setNews([]);
      if (!response.ok) {
       
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to fetch news");
      }

      const data: FetchNewsResponse = await response.json();
      const newsData = data.news || data.data || [];
      setNews(newsData);
      setLoading(false);
      return newsData;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An error occurred";
      setError(errorMessage);
      setLoading(false);
      return null;
    }
  };

  useEffect(() => {
    if (autoFetch) {
      fetchNews();
    }
  }, [autoFetch]);

  return { news, loading, fetchNews, error };
};

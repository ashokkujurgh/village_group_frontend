"use client";

import { useState } from "react";
import { getApiUrl, API_ENDPOINTS } from "../config/urls";

interface LoginCredentials {
  email_id: string;
  password: string;
}

interface LoginResponse {
  token: string;
  [key: string]: any;
}

export const useLogin = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = async (credentials: LoginCredentials): Promise<LoginResponse | null> => {
    setLoading(true);
    setError(null);

    try {
      const url = getApiUrl(API_ENDPOINTS.LOGIN);

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Login failed");
      }

      const data: LoginResponse = await response.json();

      // Save token to localStorage
      if (data.token) {
        localStorage.setItem("authToken", data.token);
        document.cookie = `authToken=${data.token}; path=/`;
      }

      setLoading(false);
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An error occurred during login";
      setError(errorMessage);
      setLoading(false);
      return null;
    }
  };

  return { login, loading, error };
};

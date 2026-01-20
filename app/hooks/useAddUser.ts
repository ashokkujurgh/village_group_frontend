"use client";

import { useState } from "react";
import { getApiUrl, API_ENDPOINTS } from "../config/urls";

interface AddUserData {
  full_name: string;
  email_id: string;
  password: string;
}

interface AddUserResponse {
  id?: string;
  message?: string;
  [key: string]: any;
}

export const useAddUser = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addUser = async (userData: AddUserData): Promise<AddUserResponse | null> => {
    setLoading(true);
    setError(null);

    try {
      // Get token from localStorage
      const token = localStorage.getItem("authToken");
      if (!token) {
        throw new Error("Authentication token not found. Please login first.");
      }

      const url = getApiUrl(API_ENDPOINTS.ADMIN);

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to add user");
      }

      const data: AddUserResponse = await response.json();

      setLoading(false);
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An error occurred while adding user";
      setError(errorMessage);
      setLoading(false);
      return null;
    }
  };

  return { addUser, loading, error };
};

"use client";

import { useState } from "react";
import { getApiUrl, API_ENDPOINTS } from "../config/urls";

interface DeleteUserResponse {
  message: string;
  success: boolean;
  [key: string]: any;
}

export const useDeleteUser = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deleteUser = async (userId: string): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      // Get token from localStorage
      const token = localStorage.getItem("authToken");
      if (!token) {
        throw new Error("Authentication token not found. Please login first.");
      }

      const url = getApiUrl(`${API_ENDPOINTS.ADMIN}/${userId}`);

      const response = await fetch(url, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to delete user");
      }

      const data: DeleteUserResponse = await response.json();
      setLoading(false);
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An error occurred";
      setError(errorMessage);
      setLoading(false);
      return false;
    }
  };

  return { deleteUser, loading, error };
};

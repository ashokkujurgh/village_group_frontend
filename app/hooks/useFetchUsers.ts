"use client";

import { useState, useEffect } from "react";
import { getApiUrl, API_ENDPOINTS } from "../config/urls";

interface User {
  id?: string;
  full_name: string;
  email_id: string;
  role: string;
  [key: string]: any;
}

interface FetchUsersResponse {
  users?: User[];
  data?: User[];
  [key: string]: any;
}

export const useFetchUsers = (autoFetch = true) => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = async (): Promise<User[] | null> => {
    setLoading(true);
    setError(null);

    try {
      // Get token from localStorage
      const token = localStorage.getItem("authToken");
      if (!token) {
        throw new Error("Authentication token not found. Please login first.");
      }

      const url = getApiUrl(API_ENDPOINTS.ALLADMIN);

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to fetch users");
      }

      const data: FetchUsersResponse = await response.json();

      // Handle different response formats
      const usersList = data.users || data.data || [];
      setUsers(usersList);
      setLoading(false);
      return usersList;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An error occurred while fetching users";
      setError(errorMessage);
      setLoading(false);
      return null;
    }
  };

  // Auto fetch on component mount if autoFetch is true
  useEffect(() => {
    if (autoFetch) {
      fetchUsers();
    }
  }, [autoFetch]);

  return { users, fetchUsers, loading, error };
};

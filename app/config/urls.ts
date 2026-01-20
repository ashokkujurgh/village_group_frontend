// Base URL configuration
export const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://159.65.153.154:4014";

// API Endpoints
export const API_ENDPOINTS = {
  LOGIN: "/login",
  NEWS: "/news",
  ADMIN: "/admin",
 ALLADMIN: "/alladmin",

  // Add more endpoints as needed
};

// Helper function to construct full API URL
export const getApiUrl = (endpoint: string): string => {
  return `${BASE_URL}${endpoint}`;
};

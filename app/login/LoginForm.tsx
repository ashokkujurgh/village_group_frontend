"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/admin";
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!userId.trim()) {
      setError("User ID is required");
      return;
    }
    if (!password.trim()) {
      setError("Password is required");
      return;
    }

    // Simple validation (demo only—use proper auth in production)
    if (userId === "admin" && password === "admin123") {
      // Set auth cookie
      document.cookie = "authToken=demo-admin-token; path=/";
      router.push(redirect);
    } else {
      setError("Invalid user ID or password");
    }
  };

  return (
    <div className="w-full max-w-md p-8 bg-white rounded-lg shadow">
      <h1 className="text-2xl font-bold mb-6 text-center">Admin Login</h1>
      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">User ID</label>
          <input
            type="text"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            placeholder="Enter your user ID"
            className="w-full px-4 py-2 border rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-indigo-600"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter admin password"
            className="w-full px-4 py-2 border rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-indigo-600"
          />
        </div>
        {error && <div className="text-sm text-red-600">{error}</div>}
        <button type="submit" className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
          Login
        </button>
      </form>
      <p className="mt-4 text-xs text-gray-500 text-center">
        Demo credentials: <code className="bg-gray-100 px-1">admin</code> / <code className="bg-gray-100 px-1">admin123</code>
      </p>
    </div>
  );
}

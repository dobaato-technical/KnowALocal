"use client";

import { loginAdmin } from "@/api";
import Button from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      // Validate inputs
      if (!email.trim() || !password.trim()) {
        setError("Please enter both email and password");
        setIsLoading(false);
        return;
      }

      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        setError("Please enter a valid email address");
        setIsLoading(false);
        return;
      }

      // Password validation
      if (password.length < 6) {
        setError("Password must be at least 6 characters long");
        setIsLoading(false);
        return;
      }

      // Attempt login via API
      const result = await loginAdmin({ email, password });

      if (!result.success) {
        setError(result.message || "Login failed. Please try again.");
        console.error("Login error:", result.error);
        return;
      }

      // Login successful - redirect to admin panel
      router.push("/admin");
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
      console.error("Login error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Left Side - Image */}
      <div className="hidden w-1/2 lg:flex lg:items-center lg:justify-center lg:overflow-hidden">
        <div className="relative h-full w-full">
          <img
            src="/LandingImages/cape-forchu.jpg"
            alt="Admin Portal"
            className="h-full w-full object-cover"
          />
          {/* Overlay for better text contrast if needed */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent"></div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex w-full flex-col items-center justify-center px-6 py-12 lg:w-1/2 lg:px-12 xl:px-16">
        <div className="w-full max-w-md space-y-8">
          {/* Header */}
          <div className="space-y-2 text-center">
            <h1 className="text-3xl font-bold text-gray-900">Admin Portal</h1>
            <p className="text-gray-600">Sign in to your account to continue</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="rounded-lg bg-red-50 px-4 py-3">
              <p className="text-sm font-medium text-red-800">{error}</p>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-900"
              >
                Email Address
              </label>
              <Input
                id="email"
                type="email"
                placeholder="admin@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 placeholder-gray-400 transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 disabled:bg-gray-100 disabled:text-gray-500"
              />
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-900"
              >
                Password
              </label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isLoading}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 pr-12 text-gray-900 placeholder-gray-400 transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 disabled:bg-gray-100 disabled:text-gray-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 transition-colors hover:text-gray-700 disabled:opacity-50"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Sign In Button */}
            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          {/* Footer Note */}
          <p className="text-center text-xs text-gray-500">
            Protected area. Only authorized personnel may access this portal.
          </p>
        </div>
      </div>
    </div>
  );
}

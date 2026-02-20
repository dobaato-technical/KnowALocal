"use client";

export default function AdminHeader() {
  return (
    <header className="sticky top-0 z-10 w-full border-b border-gray-200 bg-white">
      <div className="flex items-center justify-between px-6 py-4">
        {/* Left Section - Title */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-600">
            Welcome back to the admin panel
          </p>
        </div>

        {/* Right Section - User Profile */}
        <div className="flex items-center space-x-3">
          <div className="hidden sm:block text-right">
            <p className="text-sm font-medium text-gray-900">Admin User</p>
            <p className="text-xs text-gray-600">Administrator</p>
          </div>
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 text-white font-semibold text-sm">
            A
          </div>
        </div>
      </div>
    </header>
  );
}

"use client";

import { logoutAdmin } from "@/api";
import {
  BookOpen,
  Calendar,
  Clock,
  Compass,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

interface SidebarItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

export default function AdminSidebar() {
  const [isOpen, setIsOpen] = useState(true);
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      // Call logout API to end session
      const result = await logoutAdmin();

      if (result.success) {
        // Redirect to admin login page
        router.push("/admin-login");
      } else {
        console.error("Logout failed:", result.message);
      }
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const sidebarItems: SidebarItem[] = [
    {
      label: "Tours",
      href: "/admin/tours",
      icon: <Compass size={20} />,
    },
    {
      label: "Shifts",
      href: "/admin/shifts",
      icon: <Clock size={20} />,
    },
    {
      label: "Bookings",
      href: "/admin/bookings",
      icon: <BookOpen size={20} />,
    },
    {
      label: "Availability",
      href: "/admin/availability",
      icon: <Calendar size={20} />,
    },
  ];

  const isActive = (href: string) => {
    return pathname === href || pathname.startsWith(href + "/");
  };

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed left-4 top-4 z-50 rounded-lg bg-blue-600 p-2 text-white lg:hidden"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 z-40 h-screen w-64 transform bg-gray-900 text-white transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-full flex-col">
          {/* Logo/Header */}
          <div className="flex items-center justify-between border-b border-gray-700 px-6 py-6">
            <div>
              <h1 className="text-xl font-bold">Admin Panel</h1>
              <p className="text-xs text-gray-400">Know A Local</p>
            </div>
          </div>

          {/* User Profile Header */}
          <div className="border-b border-gray-700 px-6 py-4">
            <div className="flex items-center space-x-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600">
                <span className="text-sm font-bold text-white">A</span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-white">Admin User</p>
                <p className="text-xs text-gray-400">Administrator</p>
              </div>
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="flex-1 space-y-2 px-4 py-6">
            {sidebarItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={`flex items-center space-x-3 rounded-lg px-4 py-3 transition-all duration-200 ${
                  isActive(item.href)
                    ? "bg-blue-600 text-white shadow-lg"
                    : "text-gray-300 hover:bg-gray-800"
                }`}
              >
                {item.icon}
                <span className="font-medium">{item.label}</span>
                {isActive(item.href) && (
                  <div className="ml-auto h-2 w-2 rounded-full bg-white"></div>
                )}
              </Link>
            ))}
          </nav>

          {/* Footer - Logout */}
          <div className="border-t border-gray-700 px-4 py-4">
            <button
              onClick={handleLogout}
              className="flex w-full items-center space-x-3 rounded-lg px-4 py-3 text-gray-300 transition-all duration-200 hover:bg-red-900/50 hover:text-red-400"
            >
              <LogOut size={20} />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}

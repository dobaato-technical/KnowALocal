"use client";

import { logoutAdmin } from "@/api";
import { BookOpen, Calendar, Clock, Compass, LogOut } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

interface SidebarItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

export default function AdminSidebar() {
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
      {/* ── Desktop Sidebar (lg and above) ── */}
      <aside className="hidden lg:flex lg:flex-col h-screen w-64 flex-shrink-0 bg-gray-900 text-white">
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="border-b border-gray-700 px-6 py-6">
            <h1 className="text-xl font-bold">Admin Panel</h1>
            <p className="text-xs text-gray-400">Know A Local</p>
          </div>

          {/* User */}
          <div className="border-b border-gray-700 px-6 py-4">
            <div className="flex items-center space-x-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary">
                <span className="text-sm font-bold text-white">A</span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-white">Admin User</p>
                <p className="text-xs text-gray-400">Administrator</p>
              </div>
            </div>
          </div>

          {/* Nav */}
          <nav className="flex-1 space-y-2 px-4 py-6">
            {sidebarItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center space-x-3 rounded-lg px-4 py-3 transition-all duration-200 ${
                  isActive(item.href)
                    ? "bg-primary text-white shadow-lg"
                    : "text-gray-300 hover:bg-gray-800"
                }`}
              >
                {item.icon}
                <span className="font-medium">{item.label}</span>
                {isActive(item.href) && (
                  <div className="ml-auto h-2 w-2 rounded-full bg-white" />
                )}
              </Link>
            ))}
          </nav>

          {/* Logout */}
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

      {/* ── Mobile Bottom Nav (below lg) ── */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 lg:hidden bg-gray-900 border-t border-gray-700/60">
        <div className="flex items-stretch justify-around h-16">
          {sidebarItems.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative flex flex-1 flex-col items-center justify-center gap-0.5 transition-colors duration-200 ${
                  active ? "text-white" : "text-gray-400 hover:text-gray-200"
                }`}
              >
                {/* Accent bar at top of active item */}
                {active && (
                  <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 rounded-full bg-accent" />
                )}
                <span
                  className={`p-1.5 rounded-lg transition-colors ${
                    active ? "bg-white/10" : ""
                  }`}
                >
                  {item.icon}
                </span>
                <span className="text-[10px] font-medium leading-none">
                  {item.label}
                </span>
              </Link>
            );
          })}

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="relative flex flex-1 flex-col items-center justify-center gap-0.5 text-gray-400 hover:text-red-400 transition-colors duration-200"
          >
            <span className="p-1.5 rounded-lg">
              <LogOut size={20} />
            </span>
            <span className="text-[10px] font-medium leading-none">Logout</span>
          </button>
        </div>
      </nav>
    </>
  );
}

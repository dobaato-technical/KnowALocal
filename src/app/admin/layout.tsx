import AdminHeader from "@/Views/Layouts/AdminHeader";
import AdminSidebar from "@/Views/Layouts/AdminSidebar";

export const metadata = {
  title: "Admin Panel | Know A Local",
  description: "Admin panel for Know A Local",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-gray-50">
      <AdminSidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <AdminHeader />
        <main className="flex-1 overflow-auto">
          <div className="p-3 sm:p-6">{children}</div>
        </main>
      </div>
    </div>
  );
}

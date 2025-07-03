import { useState, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { User, UserRole } from "@shared/types";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";

interface DashboardLayoutProps {
  user: User;
  onLogout: () => void;
}

export function DashboardLayout({ user, onLogout }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect based on user role if on root dashboard
    if (location.pathname === "/dashboard") {
      switch (user.role) {
        case "owner":
          navigate("/dashboard/companies");
          break;
        case "admin":
        case "hr":
          navigate("/dashboard/overview");
          break;
        case "employee":
          navigate("/dashboard/profile");
          break;
      }
    }
  }, [user.role, navigate]);

  return (
    <div className="h-screen flex bg-background">
      <Sidebar
        user={user}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <Header
          user={user}
          onMenuClick={() => setSidebarOpen(true)}
          onLogout={onLogout}
        />

        <main className="flex-1 overflow-auto bg-muted/20">
          <div className="container mx-auto p-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

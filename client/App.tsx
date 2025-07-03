import "./global.css";

import { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { User, LoginResponse } from "@shared/types";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Employees from "./pages/Employees";
import Attendance from "./pages/Attendance";
import Salary from "./pages/Salary";
import Leave from "./pages/Leave";
import PlaceholderPage from "./pages/PlaceholderPage";
import NotFound from "./pages/NotFound";
import { DashboardLayout } from "./components/layout/DashboardLayout";

const queryClient = new QueryClient();

const App = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing auth token
    const token = localStorage.getItem("auth_token");
    const userData = localStorage.getItem("user");

    if (token && userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (error) {
        console.error("Error parsing user data:", error);
        localStorage.removeItem("auth_token");
        localStorage.removeItem("user");
      }
    }
    setLoading(false);
  }, []);

  const handleLoginSuccess = (response: LoginResponse) => {
    setUser(response.user);
  };

  const handleLogout = () => {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("user");
    setUser(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {!user ? (
              <>
                <Route
                  path="/login"
                  element={<Login onLoginSuccess={handleLoginSuccess} />}
                />
                <Route path="*" element={<Navigate to="/login" replace />} />
              </>
            ) : (
              <>
                <Route
                  path="/login"
                  element={<Navigate to="/dashboard" replace />}
                />
                <Route
                  path="/dashboard"
                  element={
                    <DashboardLayout user={user} onLogout={handleLogout} />
                  }
                >
                  <Route index element={<Navigate to="overview" replace />} />
                  <Route path="overview" element={<Dashboard />} />
                  <Route
                    path="companies"
                    element={
                      <PlaceholderPage
                        title="Companies"
                        description="Manage multiple companies and their settings"
                        features={[
                          "Create and manage companies",
                          "Assign company administrators",
                          "Configure company settings",
                          "View company analytics",
                        ]}
                      />
                    }
                  />
                  <Route path="employees" element={<Employees />} />
                  <Route path="attendance" element={<Attendance />} />
                  <Route path="salary" element={<Salary />} />
                  <Route path="leave" element={<Leave />} />
                  <Route
                    path="interviews"
                    element={
                      <PlaceholderPage
                        title="Interview Scheduling"
                        description="Schedule and track candidate interviews"
                        features={[
                          "Schedule interviews with candidates",
                          "Set interview date, time, and location",
                          "Track candidate status",
                          "Interview feedback and notes",
                          "Hiring decision workflow",
                        ]}
                      />
                    }
                  />
                  <Route
                    path="profile"
                    element={
                      <PlaceholderPage
                        title="My Profile"
                        description="View and edit your personal information"
                        features={[
                          "Personal information",
                          "Contact details",
                          "Profile picture upload",
                          "Change password",
                          "Emergency contacts",
                        ]}
                      />
                    }
                  />
                  <Route
                    path="my-attendance"
                    element={
                      <PlaceholderPage
                        title="My Attendance"
                        description="View your attendance history and check-in/out"
                        features={[
                          "Daily check-in/check-out",
                          "Attendance history",
                          "Monthly attendance summary",
                          "Late arrival notifications",
                        ]}
                      />
                    }
                  />
                  <Route
                    path="my-salary"
                    element={
                      <PlaceholderPage
                        title="My Salary"
                        description="View your salary details and history"
                        features={[
                          "Monthly salary slips",
                          "Salary history",
                          "Bonus and allowance details",
                          "Tax deductions",
                          "Download salary reports",
                        ]}
                      />
                    }
                  />
                  <Route
                    path="apply-leave"
                    element={
                      <PlaceholderPage
                        title="Apply Leave"
                        description="Submit leave requests for approval"
                        features={[
                          "Leave application form",
                          "Select leave type and dates",
                          "View leave balance",
                          "Track application status",
                          "Leave history",
                        ]}
                      />
                    }
                  />
                  <Route
                    path="settings"
                    element={
                      <PlaceholderPage
                        title="Settings"
                        description="Configure your account and system preferences"
                        features={[
                          "Account settings",
                          "Notification preferences",
                          "Security settings",
                          "Theme customization",
                          "Data export options",
                        ]}
                      />
                    }
                  />
                </Route>
                <Route
                  path="/"
                  element={<Navigate to="/dashboard" replace />}
                />
                <Route path="*" element={<NotFound />} />
              </>
            )}
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

createRoot(document.getElementById("root")!).render(<App />);

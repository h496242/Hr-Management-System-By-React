import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Building2,
  Users,
  Clock,
  DollarSign,
  Calendar,
  UserCheck,
  LayoutDashboard,
  Settings,
  X,
  User as UserIcon,
  Building,
  UserPlus,
} from "lucide-react";
import { User, UserRole } from "@shared/types";

interface SidebarProps {
  user: User;
  isOpen: boolean;
  onClose: () => void;
}

interface NavItem {
  title: string;
  href: string;
  icon: React.ElementType;
  roles: UserRole[];
}

const navigation: NavItem[] = [
  {
    title: "Overview",
    href: "/dashboard/overview",
    icon: LayoutDashboard,
    roles: ["admin", "hr"],
  },
  {
    title: "Companies",
    href: "/dashboard/companies",
    icon: Building,
    roles: ["owner"],
  },
  {
    title: "Employees",
    href: "/dashboard/employees",
    icon: Users,
    roles: ["admin", "hr"],
  },
  {
    title: "Attendance",
    href: "/dashboard/attendance",
    icon: Clock,
    roles: ["admin", "hr"],
  },
  {
    title: "Salary",
    href: "/dashboard/salary",
    icon: DollarSign,
    roles: ["admin", "hr"],
  },
  {
    title: "Leave Requests",
    href: "/dashboard/leave",
    icon: Calendar,
    roles: ["admin", "hr"],
  },
  {
    title: "Interviews",
    href: "/dashboard/interviews",
    icon: UserPlus,
    roles: ["admin", "hr"],
  },
  {
    title: "My Profile",
    href: "/dashboard/profile",
    icon: UserIcon,
    roles: ["employee"],
  },
  {
    title: "My Attendance",
    href: "/dashboard/my-attendance",
    icon: Clock,
    roles: ["employee"],
  },
  {
    title: "My Salary",
    href: "/dashboard/my-salary",
    icon: DollarSign,
    roles: ["employee"],
  },
  {
    title: "Apply Leave",
    href: "/dashboard/apply-leave",
    icon: Calendar,
    roles: ["employee"],
  },
];

export function Sidebar({ user, isOpen, onClose }: SidebarProps) {
  const filteredNavigation = navigation.filter((item) =>
    item.roles.includes(user.role),
  );

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 lg:hidden bg-black/50"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-sidebar border-r border-sidebar-border transform transition-transform duration-200 ease-in-out lg:relative lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex h-16 items-center justify-between px-6 border-b border-sidebar-border">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-sidebar-primary rounded-lg flex items-center justify-center">
                <Building2 className="w-4 h-4 text-sidebar-primary-foreground" />
              </div>
              <span className="font-semibold text-sidebar-foreground">
                HR System
              </span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="lg:hidden text-sidebar-foreground hover:bg-sidebar-accent"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* User info */}
          <div className="px-6 py-4 border-b border-sidebar-border">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-sidebar-accent rounded-full flex items-center justify-center">
                <UserIcon className="w-5 h-5 text-sidebar-accent-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-sidebar-foreground truncate">
                  {user.name}
                </p>
                <p className="text-xs text-sidebar-foreground/70 capitalize">
                  {user.role}
                </p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <ScrollArea className="flex-1 px-4 py-4">
            <nav className="space-y-1">
              {filteredNavigation.map((item) => (
                <NavLink
                  key={item.href}
                  to={item.href}
                  className={({ isActive }) =>
                    cn(
                      "flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                      isActive
                        ? "bg-sidebar-primary text-sidebar-primary-foreground"
                        : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                    )
                  }
                  onClick={() => {
                    if (window.innerWidth < 1024) {
                      onClose();
                    }
                  }}
                >
                  <item.icon className="w-4 h-4" />
                  <span>{item.title}</span>
                </NavLink>
              ))}
            </nav>

            <Separator className="my-4 bg-sidebar-border" />

            <nav className="space-y-1">
              <NavLink
                to="/dashboard/settings"
                className={({ isActive }) =>
                  cn(
                    "flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                    isActive
                      ? "bg-sidebar-primary text-sidebar-primary-foreground"
                      : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                  )
                }
                onClick={() => {
                  if (window.innerWidth < 1024) {
                    onClose();
                  }
                }}
              >
                <Settings className="w-4 h-4" />
                <span>Settings</span>
              </NavLink>
            </nav>
          </ScrollArea>
        </div>
      </div>
    </>
  );
}

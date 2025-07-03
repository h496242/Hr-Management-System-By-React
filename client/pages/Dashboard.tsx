import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  UserCheck,
  UserX,
  Calendar,
  Building2,
  TrendingUp,
  DollarSign,
  Clock,
} from "lucide-react";
import { DashboardStats, ApiResponse } from "@shared/types";

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const response = await fetch("/api/dashboard/stats", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
        },
      });
      const result: ApiResponse<DashboardStats> = await response.json();

      if (result.success && result.data) {
        setStats(result.data);
      }
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Card key={i}>
              <CardHeader className="pb-2">
                <div className="h-4 bg-muted rounded animate-pulse" />
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-muted rounded animate-pulse mb-2" />
                <div className="h-3 bg-muted/50 rounded animate-pulse w-1/2" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  const statCards = [
    {
      title: "Total Employees",
      value: stats?.totalEmployees || 0,
      icon: Users,
      description: "Active employees",
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "Present Today",
      value: stats?.presentToday || 0,
      icon: UserCheck,
      description: "Checked in today",
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: "Absent Today",
      value: stats?.absentToday || 0,
      icon: UserX,
      description: "Not checked in",
      color: "text-red-600",
      bgColor: "bg-red-100",
    },
    {
      title: "Pending Leaves",
      value: stats?.pendingLeaves || 0,
      icon: Calendar,
      description: "Awaiting approval",
      color: "text-orange-600",
      bgColor: "bg-orange-100",
    },
    {
      title: "Departments",
      value: stats?.totalDepartments || 0,
      icon: Building2,
      description: "Active departments",
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
    {
      title: "Attendance Rate",
      value: `${stats?.averageAttendance || 0}%`,
      icon: TrendingUp,
      description: "This month",
      color: "text-indigo-600",
      bgColor: "bg-indigo-100",
    },
    {
      title: "Monthly Payroll",
      value: `$${(stats?.monthlySalary || 0).toLocaleString()}`,
      icon: DollarSign,
      description: "Current month",
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: "Interviews",
      value: stats?.upcomingInterviews || 0,
      icon: Clock,
      description: "This week",
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back! Here's what's happening at your company today.
          </p>
        </div>
        <Badge variant="outline" className="text-sm">
          {new Date().toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </Badge>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <Card key={index} className="hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {card.title}
                </CardTitle>
                <div className={`p-2 rounded-full ${card.bgColor}`}>
                  <Icon className={`h-4 w-4 ${card.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{card.value}</div>
                <p className="text-xs text-muted-foreground">
                  {card.description}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              Latest updates from your HR system
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-4 p-3 rounded-lg bg-muted/50">
                <div className="w-2 h-2 bg-green-500 rounded-full" />
                <div className="flex-1">
                  <p className="text-sm font-medium">
                    John Doe checked in at 9:00 AM
                  </p>
                  <p className="text-xs text-muted-foreground">2 minutes ago</p>
                </div>
              </div>
              <div className="flex items-center space-x-4 p-3 rounded-lg bg-muted/50">
                <div className="w-2 h-2 bg-blue-500 rounded-full" />
                <div className="flex-1">
                  <p className="text-sm font-medium">
                    New leave request from Sarah Wilson
                  </p>
                  <p className="text-xs text-muted-foreground">5 minutes ago</p>
                </div>
              </div>
              <div className="flex items-center space-x-4 p-3 rounded-lg bg-muted/50">
                <div className="w-2 h-2 bg-orange-500 rounded-full" />
                <div className="flex-1">
                  <p className="text-sm font-medium">
                    Salary sheet generated for March
                  </p>
                  <p className="text-xs text-muted-foreground">1 hour ago</p>
                </div>
              </div>
              <div className="flex items-center space-x-4 p-3 rounded-lg bg-muted/50">
                <div className="w-2 h-2 bg-purple-500 rounded-full" />
                <div className="flex-1">
                  <p className="text-sm font-medium">
                    Interview scheduled with Alex Johnson
                  </p>
                  <p className="text-xs text-muted-foreground">2 hours ago</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Frequently used features</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <button className="w-full p-3 text-left rounded-lg border border-border hover:bg-muted/50 transition-colors">
              <div className="font-medium text-sm">Add New Employee</div>
              <div className="text-xs text-muted-foreground">
                Register a new team member
              </div>
            </button>
            <button className="w-full p-3 text-left rounded-lg border border-border hover:bg-muted/50 transition-colors">
              <div className="font-medium text-sm">Mark Attendance</div>
              <div className="text-xs text-muted-foreground">
                Record today's attendance
              </div>
            </button>
            <button className="w-full p-3 text-left rounded-lg border border-border hover:bg-muted/50 transition-colors">
              <div className="font-medium text-sm">Generate Payroll</div>
              <div className="text-xs text-muted-foreground">
                Create monthly salary sheets
              </div>
            </button>
            <button className="w-full p-3 text-left rounded-lg border border-border hover:bg-muted/50 transition-colors">
              <div className="font-medium text-sm">Schedule Interview</div>
              <div className="text-xs text-muted-foreground">
                Book candidate interviews
              </div>
            </button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

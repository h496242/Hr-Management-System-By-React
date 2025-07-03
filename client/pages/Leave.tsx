import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Calendar,
  Check,
  X,
  Clock,
  Filter,
  Search,
  Download,
  MessageSquare,
} from "lucide-react";
import { User, LeaveRequest, Department, ApiResponse } from "@shared/types";

export default function LeavePage() {
  const [employees, setEmployees] = useState<User[]>([]);
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [selectedDepartment, setSelectedDepartment] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [isReviewDialogOpen, setIsReviewDialogOpen] = useState(false);
  const [selectedLeave, setSelectedLeave] = useState<LeaveRequest | null>(null);
  const [reviewComments, setReviewComments] = useState("");

  useEffect(() => {
    fetchEmployees();
    fetchDepartments();
    fetchLeaveRequests();
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await fetch("/api/users", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
        },
      });
      const result: ApiResponse<User[]> = await response.json();
      if (result.success && result.data) {
        setEmployees(result.data);
      }
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  };

  const fetchDepartments = async () => {
    try {
      const response = await fetch("/api/departments", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
        },
      });
      const result: ApiResponse<Department[]> = await response.json();
      if (result.success && result.data) {
        setDepartments(result.data);
      }
    } catch (error) {
      console.error("Error fetching departments:", error);
    }
  };

  const fetchLeaveRequests = async () => {
    try {
      const response = await fetch("/api/leave/company", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
        },
      });
      const result: ApiResponse<LeaveRequest[]> = await response.json();
      if (result.success && result.data) {
        setLeaveRequests(result.data);
      }
    } catch (error) {
      console.error("Error fetching leave requests:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleApproveLeave = async () => {
    if (!selectedLeave) return;

    try {
      const response = await fetch(`/api/leave/${selectedLeave._id}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
        },
        body: JSON.stringify({
          status: "approved",
          comments: reviewComments,
        }),
      });

      const result: ApiResponse = await response.json();
      if (result.success) {
        setLeaveRequests(
          leaveRequests.map((leave) =>
            leave._id === selectedLeave._id
              ? {
                  ...leave,
                  status: "approved",
                  comments: reviewComments,
                  reviewedAt: new Date().toISOString(),
                }
              : leave,
          ),
        );
        setIsReviewDialogOpen(false);
        setSelectedLeave(null);
        setReviewComments("");
      }
    } catch (error) {
      console.error("Error approving leave:", error);
    }
  };

  const handleRejectLeave = async () => {
    if (!selectedLeave) return;

    try {
      const response = await fetch(`/api/leave/${selectedLeave._id}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
        },
        body: JSON.stringify({
          status: "rejected",
          comments: reviewComments,
        }),
      });

      const result: ApiResponse = await response.json();
      if (result.success) {
        setLeaveRequests(
          leaveRequests.map((leave) =>
            leave._id === selectedLeave._id
              ? {
                  ...leave,
                  status: "rejected",
                  comments: reviewComments,
                  reviewedAt: new Date().toISOString(),
                }
              : leave,
          ),
        );
        setIsReviewDialogOpen(false);
        setSelectedLeave(null);
        setReviewComments("");
      }
    } catch (error) {
      console.error("Error rejecting leave:", error);
    }
  };

  const getEmployeeInfo = (employeeId: string) => {
    return employees.find((emp) => emp._id === employeeId);
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const getDepartmentName = (departmentId: string) => {
    const department = departments.find((d) => d._id === departmentId);
    return department?.name || "No Department";
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      case "approved":
        return <Badge className="bg-green-100 text-green-800">Approved</Badge>;
      case "rejected":
        return <Badge className="bg-red-100 text-red-800">Rejected</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getLeaveTypeBadge = (type: string) => {
    const colors = {
      casual: "bg-blue-100 text-blue-800",
      sick: "bg-red-100 text-red-800",
      annual: "bg-green-100 text-green-800",
      maternity: "bg-purple-100 text-purple-800",
      paternity: "bg-indigo-100 text-indigo-800",
      emergency: "bg-orange-100 text-orange-800",
    };
    return (
      <Badge
        variant="secondary"
        className={
          colors[type as keyof typeof colors] || "bg-gray-100 text-gray-800"
        }
      >
        {type.charAt(0).toUpperCase() + type.slice(1)}
      </Badge>
    );
  };

  const filteredLeaveRequests = leaveRequests.filter((leave) => {
    const employee = getEmployeeInfo(leave.employeeId);
    if (!employee) return false;

    const matchesSearch = employee.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesStatus =
      selectedStatus === "all" || leave.status === selectedStatus;
    const matchesDepartment =
      selectedDepartment === "all" ||
      employee.departmentId === selectedDepartment;

    return matchesSearch && matchesStatus && matchesDepartment;
  });

  const pendingCount = leaveRequests.filter(
    (leave) => leave.status === "pending",
  ).length;
  const approvedCount = leaveRequests.filter(
    (leave) => leave.status === "approved",
  ).length;
  const rejectedCount = leaveRequests.filter(
    (leave) => leave.status === "rejected",
  ).length;

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded w-48 mb-2" />
          <div className="h-4 bg-muted/50 rounded w-96" />
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-24 bg-muted rounded animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Leave Requests</h1>
          <p className="text-muted-foreground">
            Manage employee leave applications and approvals
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {pendingCount}
            </div>
            <p className="text-xs text-muted-foreground">Awaiting review</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approved</CardTitle>
            <Check className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {approvedCount}
            </div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rejected</CardTitle>
            <X className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {rejectedCount}
            </div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>
      </div>

      {/* Leave Requests Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Leave Applications</CardTitle>
              <CardDescription>
                {filteredLeaveRequests.length} of {leaveRequests.length}{" "}
                requests
              </CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search employees..."
                  className="pl-10 w-64"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="w-40">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
              <Select
                value={selectedDepartment}
                onValueChange={setSelectedDepartment}
              >
                <SelectTrigger className="w-48">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Departments</SelectItem>
                  {departments.map((dept) => (
                    <SelectItem key={dept._id} value={dept._id}>
                      {dept.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee</TableHead>
                <TableHead>Leave Type</TableHead>
                <TableHead>From Date</TableHead>
                <TableHead>To Date</TableHead>
                <TableHead>Days</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Applied Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLeaveRequests.map((leave) => {
                const employee = getEmployeeInfo(leave.employeeId);
                if (!employee) return null;

                return (
                  <TableRow key={leave._id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={employee.profileImage} />
                          <AvatarFallback>
                            {getInitials(employee.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{employee.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {getDepartmentName(employee.departmentId!)}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{getLeaveTypeBadge(leave.type)}</TableCell>
                    <TableCell>
                      {new Date(leave.fromDate).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      {new Date(leave.toDate).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{leave.totalDays} days</Badge>
                    </TableCell>
                    <TableCell>{getStatusBadge(leave.status)}</TableCell>
                    <TableCell>
                      {new Date(leave.appliedAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <Dialog
                          open={
                            isReviewDialogOpen &&
                            selectedLeave?._id === leave._id
                          }
                          onOpenChange={(open) => {
                            setIsReviewDialogOpen(open);
                            if (open) {
                              setSelectedLeave(leave);
                            } else {
                              setSelectedLeave(null);
                              setReviewComments("");
                            }
                          }}
                        >
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm">
                              <MessageSquare className="h-4 w-4 mr-1" />
                              Review
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Review Leave Request</DialogTitle>
                              <DialogDescription>
                                Review and respond to {employee.name}'s leave
                                application
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div className="grid grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
                                <div>
                                  <Label className="text-sm font-medium">
                                    Employee
                                  </Label>
                                  <p className="text-sm">{employee.name}</p>
                                </div>
                                <div>
                                  <Label className="text-sm font-medium">
                                    Leave Type
                                  </Label>
                                  <p className="text-sm capitalize">
                                    {leave.type}
                                  </p>
                                </div>
                                <div>
                                  <Label className="text-sm font-medium">
                                    Duration
                                  </Label>
                                  <p className="text-sm">
                                    {new Date(
                                      leave.fromDate,
                                    ).toLocaleDateString()}{" "}
                                    to{" "}
                                    {new Date(
                                      leave.toDate,
                                    ).toLocaleDateString()}{" "}
                                    ({leave.totalDays} days)
                                  </p>
                                </div>
                                <div>
                                  <Label className="text-sm font-medium">
                                    Applied Date
                                  </Label>
                                  <p className="text-sm">
                                    {new Date(
                                      leave.appliedAt,
                                    ).toLocaleDateString()}
                                  </p>
                                </div>
                              </div>
                              <div>
                                <Label className="text-sm font-medium">
                                  Reason
                                </Label>
                                <p className="text-sm mt-1 p-3 bg-muted/30 rounded">
                                  {leave.reason}
                                </p>
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="comments">
                                  Review Comments (Optional)
                                </Label>
                                <Textarea
                                  id="comments"
                                  placeholder="Add your comments here..."
                                  value={reviewComments}
                                  onChange={(e) =>
                                    setReviewComments(e.target.value)
                                  }
                                />
                              </div>
                              <div className="flex justify-end space-x-2">
                                <Button
                                  variant="outline"
                                  onClick={() => {
                                    setIsReviewDialogOpen(false);
                                    setSelectedLeave(null);
                                    setReviewComments("");
                                  }}
                                >
                                  Cancel
                                </Button>
                                {leave.status === "pending" && (
                                  <>
                                    <Button
                                      variant="destructive"
                                      onClick={handleRejectLeave}
                                    >
                                      <X className="h-4 w-4 mr-2" />
                                      Reject
                                    </Button>
                                    <Button onClick={handleApproveLeave}>
                                      <Check className="h-4 w-4 mr-2" />
                                      Approve
                                    </Button>
                                  </>
                                )}
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
          {filteredLeaveRequests.length === 0 && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No leave requests found.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

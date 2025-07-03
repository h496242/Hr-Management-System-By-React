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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  DollarSign,
  Plus,
  MoreHorizontal,
  Check,
  Download,
  CreditCard,
  TrendingUp,
  Calculator,
  Search,
  Filter,
} from "lucide-react";
import { User, Salary, Department, ApiResponse } from "@shared/types";

export default function SalaryPage() {
  const [employees, setEmployees] = useState<User[]>([]);
  const [salaries, setSalaries] = useState<Salary[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedDepartment, setSelectedDepartment] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<User | null>(null);
  const [salaryData, setSalaryData] = useState({
    baseSalary: 0,
    allowances: [{ name: "", amount: 0 }],
    bonuses: [{ name: "", amount: 0 }],
    deductions: [{ name: "", amount: 0 }],
  });

  useEffect(() => {
    fetchEmployees();
    fetchDepartments();
    fetchSalaries();
  }, [selectedMonth, selectedYear]);

  const fetchEmployees = async () => {
    try {
      const response = await fetch("/api/users", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
        },
      });
      const result: ApiResponse<User[]> = await response.json();
      if (result.success && result.data) {
        setEmployees(result.data.filter((user) => user.role === "employee"));
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

  const fetchSalaries = async () => {
    try {
      const response = await fetch(
        `/api/salary?month=${selectedMonth}&year=${selectedYear}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
          },
        },
      );
      const result: ApiResponse<Salary[]> = await response.json();
      if (result.success && result.data) {
        setSalaries(result.data);
      }
    } catch (error) {
      console.error("Error fetching salaries:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateSalary = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEmployee) return;

    try {
      const totalAllowances = salaryData.allowances.reduce(
        (sum, item) => sum + item.amount,
        0,
      );
      const totalBonuses = salaryData.bonuses.reduce(
        (sum, item) => sum + item.amount,
        0,
      );
      const totalDeductions = salaryData.deductions.reduce(
        (sum, item) => sum + item.amount,
        0,
      );
      const grossSalary =
        salaryData.baseSalary + totalAllowances + totalBonuses;
      const netSalary = grossSalary - totalDeductions;

      const newSalary = {
        employeeId: selectedEmployee._id,
        month: selectedMonth,
        year: selectedYear,
        baseSalary: salaryData.baseSalary,
        allowances: salaryData.allowances.filter((a) => a.name && a.amount),
        bonuses: salaryData.bonuses.filter((b) => b.name && b.amount),
        deductions: salaryData.deductions.filter((d) => d.name && d.amount),
        totalAllowances,
        totalBonuses,
        totalDeductions,
        grossSalary,
        netSalary,
        status: "pending" as const,
      };

      const response = await fetch("/api/salary/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
        },
        body: JSON.stringify(newSalary),
      });

      const result: ApiResponse<Salary> = await response.json();
      if (result.success && result.data) {
        setSalaries([
          ...salaries.filter((s) => s.employeeId !== selectedEmployee._id),
          result.data,
        ]);
        setIsAddDialogOpen(false);
        resetForm();
      }
    } catch (error) {
      console.error("Error generating salary:", error);
    }
  };

  const handleApproveSalary = async (salaryId: string) => {
    try {
      const response = await fetch(`/api/salary/${salaryId}/approve`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
        },
      });

      const result: ApiResponse = await response.json();
      if (result.success) {
        setSalaries(
          salaries.map((s) =>
            s._id === salaryId ? { ...s, status: "approved" } : s,
          ),
        );
      }
    } catch (error) {
      console.error("Error approving salary:", error);
    }
  };

  const handlePaySalary = async (salaryId: string) => {
    try {
      const response = await fetch(`/api/salary/${salaryId}/pay`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
        },
      });

      const result: ApiResponse = await response.json();
      if (result.success) {
        setSalaries(
          salaries.map((s) =>
            s._id === salaryId
              ? { ...s, status: "paid", paidAt: new Date().toISOString() }
              : s,
          ),
        );
      }
    } catch (error) {
      console.error("Error paying salary:", error);
    }
  };

  const resetForm = () => {
    setSelectedEmployee(null);
    setSalaryData({
      baseSalary: 0,
      allowances: [{ name: "", amount: 0 }],
      bonuses: [{ name: "", amount: 0 }],
      deductions: [{ name: "", amount: 0 }],
    });
  };

  const addAllowance = () => {
    setSalaryData({
      ...salaryData,
      allowances: [...salaryData.allowances, { name: "", amount: 0 }],
    });
  };

  const addBonus = () => {
    setSalaryData({
      ...salaryData,
      bonuses: [...salaryData.bonuses, { name: "", amount: 0 }],
    });
  };

  const addDeduction = () => {
    setSalaryData({
      ...salaryData,
      deductions: [...salaryData.deductions, { name: "", amount: 0 }],
    });
  };

  const getEmployeeSalary = (employeeId: string) => {
    return salaries.find((s) => s.employeeId === employeeId);
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
        return <Badge className="bg-blue-100 text-blue-800">Approved</Badge>;
      case "paid":
        return <Badge className="bg-green-100 text-green-800">Paid</Badge>;
      default:
        return <Badge variant="secondary">Not Generated</Badge>;
    }
  };

  const filteredEmployees = employees.filter((employee) => {
    const matchesSearch = employee.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesDepartment =
      selectedDepartment === "all" ||
      employee.departmentId === selectedDepartment;
    return matchesSearch && matchesDepartment;
  });

  const totalPending = salaries.filter((s) => s.status === "pending").length;
  const totalApproved = salaries.filter((s) => s.status === "approved").length;
  const totalPaid = salaries.filter((s) => s.status === "paid").length;
  const totalAmount = salaries.reduce((sum, s) => sum + s.netSalary, 0);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded w-48 mb-2" />
          <div className="h-4 bg-muted/50 rounded w-96" />
        </div>
        <div className="grid gap-4 md:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
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
          <h1 className="text-3xl font-bold tracking-tight">
            Salary Management
          </h1>
          <p className="text-muted-foreground">
            Manage employee salaries and payroll
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export Payroll
          </Button>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Generate Salary
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Generate Salary Sheet</DialogTitle>
                <DialogDescription>
                  Create a salary sheet for an employee
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleGenerateSalary} className="space-y-6">
                <div className="space-y-2">
                  <Label>Employee</Label>
                  <Select
                    value={selectedEmployee?._id || ""}
                    onValueChange={(value) => {
                      const employee = employees.find((e) => e._id === value);
                      setSelectedEmployee(employee || null);
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select employee" />
                    </SelectTrigger>
                    <SelectContent>
                      {employees.map((employee) => (
                        <SelectItem key={employee._id} value={employee._id}>
                          {employee.name} - {employee.employeeId}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Base Salary</Label>
                  <Input
                    type="number"
                    value={salaryData.baseSalary}
                    onChange={(e) =>
                      setSalaryData({
                        ...salaryData,
                        baseSalary: Number(e.target.value),
                      })
                    }
                    required
                  />
                </div>

                {/* Allowances */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Allowances</Label>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={addAllowance}
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Add
                    </Button>
                  </div>
                  {salaryData.allowances.map((allowance, index) => (
                    <div key={index} className="grid grid-cols-2 gap-2">
                      <Input
                        placeholder="Allowance name"
                        value={allowance.name}
                        onChange={(e) => {
                          const newAllowances = [...salaryData.allowances];
                          newAllowances[index].name = e.target.value;
                          setSalaryData({
                            ...salaryData,
                            allowances: newAllowances,
                          });
                        }}
                      />
                      <Input
                        type="number"
                        placeholder="Amount"
                        value={allowance.amount}
                        onChange={(e) => {
                          const newAllowances = [...salaryData.allowances];
                          newAllowances[index].amount = Number(e.target.value);
                          setSalaryData({
                            ...salaryData,
                            allowances: newAllowances,
                          });
                        }}
                      />
                    </div>
                  ))}
                </div>

                {/* Bonuses */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Bonuses</Label>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={addBonus}
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Add
                    </Button>
                  </div>
                  {salaryData.bonuses.map((bonus, index) => (
                    <div key={index} className="grid grid-cols-2 gap-2">
                      <Input
                        placeholder="Bonus name"
                        value={bonus.name}
                        onChange={(e) => {
                          const newBonuses = [...salaryData.bonuses];
                          newBonuses[index].name = e.target.value;
                          setSalaryData({ ...salaryData, bonuses: newBonuses });
                        }}
                      />
                      <Input
                        type="number"
                        placeholder="Amount"
                        value={bonus.amount}
                        onChange={(e) => {
                          const newBonuses = [...salaryData.bonuses];
                          newBonuses[index].amount = Number(e.target.value);
                          setSalaryData({ ...salaryData, bonuses: newBonuses });
                        }}
                      />
                    </div>
                  ))}
                </div>

                {/* Deductions */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Deductions</Label>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={addDeduction}
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Add
                    </Button>
                  </div>
                  {salaryData.deductions.map((deduction, index) => (
                    <div key={index} className="grid grid-cols-2 gap-2">
                      <Input
                        placeholder="Deduction name"
                        value={deduction.name}
                        onChange={(e) => {
                          const newDeductions = [...salaryData.deductions];
                          newDeductions[index].name = e.target.value;
                          setSalaryData({
                            ...salaryData,
                            deductions: newDeductions,
                          });
                        }}
                      />
                      <Input
                        type="number"
                        placeholder="Amount"
                        value={deduction.amount}
                        onChange={(e) => {
                          const newDeductions = [...salaryData.deductions];
                          newDeductions[index].amount = Number(e.target.value);
                          setSalaryData({
                            ...salaryData,
                            deductions: newDeductions,
                          });
                        }}
                      />
                    </div>
                  ))}
                </div>

                <div className="flex justify-end space-x-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setIsAddDialogOpen(false);
                      resetForm();
                    }}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={!selectedEmployee}>
                    Generate Salary
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Calculator className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {totalPending}
            </div>
            <p className="text-xs text-muted-foreground">Awaiting approval</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approved</CardTitle>
            <Check className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {totalApproved}
            </div>
            <p className="text-xs text-muted-foreground">Ready for payment</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Paid</CardTitle>
            <CreditCard className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{totalPaid}</div>
            <p className="text-xs text-muted-foreground">Completed payments</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Amount</CardTitle>
            <DollarSign className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${totalAmount.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Salary Sheets</CardTitle>
              <CardDescription>
                {new Date(selectedYear, selectedMonth - 1).toLocaleDateString(
                  "en-US",
                  { month: "long", year: "numeric" },
                )}
              </CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <Select
                value={selectedMonth.toString()}
                onValueChange={(value) => setSelectedMonth(Number(value))}
              >
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 12 }, (_, i) => (
                    <SelectItem key={i + 1} value={(i + 1).toString()}>
                      {new Date(0, i).toLocaleDateString("en-US", {
                        month: "long",
                      })}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select
                value={selectedYear.toString()}
                onValueChange={(value) => setSelectedYear(Number(value))}
              >
                <SelectTrigger className="w-24">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 5 }, (_, i) => (
                    <SelectItem key={2020 + i} value={(2020 + i).toString()}>
                      {2020 + i}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search employees..."
                  className="pl-10 w-64"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
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
                <TableHead>Department</TableHead>
                <TableHead>Base Salary</TableHead>
                <TableHead>Gross Salary</TableHead>
                <TableHead>Net Salary</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEmployees.map((employee) => {
                const employeeSalary = getEmployeeSalary(employee._id);
                return (
                  <TableRow key={employee._id}>
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
                            {employee.employeeId}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {getDepartmentName(employee.departmentId!)}
                    </TableCell>
                    <TableCell>
                      {employeeSalary
                        ? `$${employeeSalary.baseSalary.toLocaleString()}`
                        : "-"}
                    </TableCell>
                    <TableCell>
                      {employeeSalary
                        ? `$${employeeSalary.grossSalary.toLocaleString()}`
                        : "-"}
                    </TableCell>
                    <TableCell className="font-medium">
                      {employeeSalary
                        ? `$${employeeSalary.netSalary.toLocaleString()}`
                        : "-"}
                    </TableCell>
                    <TableCell>
                      {employeeSalary
                        ? getStatusBadge(employeeSalary.status)
                        : getStatusBadge("not-generated")}
                    </TableCell>
                    <TableCell className="text-right">
                      {employeeSalary && (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            {employeeSalary.status === "pending" && (
                              <DropdownMenuItem
                                onClick={() =>
                                  handleApproveSalary(employeeSalary._id)
                                }
                              >
                                <Check className="h-4 w-4 mr-2" />
                                Approve
                              </DropdownMenuItem>
                            )}
                            {employeeSalary.status === "approved" && (
                              <DropdownMenuItem
                                onClick={() =>
                                  handlePaySalary(employeeSalary._id)
                                }
                              >
                                <CreditCard className="h-4 w-4 mr-2" />
                                Mark as Paid
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem>
                              <Download className="h-4 w-4 mr-2" />
                              Download Slip
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

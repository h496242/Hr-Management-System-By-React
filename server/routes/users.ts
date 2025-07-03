import { RequestHandler } from "express";
import { User, Department, DashboardStats, ApiResponse } from "@shared/types";

// Mock data for demo purposes
const mockDepartments: Department[] = [
  {
    _id: "1",
    name: "Administration",
    description: "Company administration and management",
    companyId: "1",
    isActive: true,
    createdAt: new Date().toISOString(),
  },
  {
    _id: "2",
    name: "Human Resources",
    description: "HR operations and employee management",
    companyId: "1",
    isActive: true,
    createdAt: new Date().toISOString(),
  },
  {
    _id: "3",
    name: "Engineering",
    description: "Software development and technical operations",
    companyId: "1",
    isActive: true,
    createdAt: new Date().toISOString(),
  },
  {
    _id: "4",
    name: "Marketing",
    description: "Marketing and brand management",
    companyId: "1",
    isActive: true,
    createdAt: new Date().toISOString(),
  },
  {
    _id: "5",
    name: "Sales",
    description: "Sales and business development",
    companyId: "1",
    isActive: true,
    createdAt: new Date().toISOString(),
  },
];

const mockEmployees: User[] = [
  {
    _id: "1",
    name: "Sarah Wilson",
    email: "sarah.wilson@company.com",
    phone: "+1 (555) 123-4567",
    gender: "female",
    dob: "1988-03-15",
    role: "admin",
    isActive: true,
    companyId: "1",
    departmentId: "1",
    employeeId: "EMP001",
    joinDate: "2022-01-15",
    address: "123 Main St, City, State 12345",
    createdAt: "2022-01-15T09:00:00Z",
    updatedAt: "2024-01-15T09:00:00Z",
  },
  {
    _id: "2",
    name: "Michael Chen",
    email: "michael.chen@company.com",
    phone: "+1 (555) 234-5678",
    gender: "male",
    dob: "1985-07-22",
    role: "hr",
    isActive: true,
    companyId: "1",
    departmentId: "2",
    employeeId: "EMP002",
    joinDate: "2022-02-01",
    address: "456 Oak Ave, City, State 12345",
    createdAt: "2022-02-01T09:00:00Z",
    updatedAt: "2024-01-15T09:00:00Z",
  },
  {
    _id: "3",
    name: "Emily Rodriguez",
    email: "emily.rodriguez@company.com",
    phone: "+1 (555) 345-6789",
    gender: "female",
    dob: "1992-11-08",
    role: "employee",
    isActive: true,
    companyId: "1",
    departmentId: "3",
    employeeId: "EMP003",
    joinDate: "2022-03-10",
    address: "789 Pine St, City, State 12345",
    createdAt: "2022-03-10T09:00:00Z",
    updatedAt: "2024-01-15T09:00:00Z",
  },
  {
    _id: "4",
    name: "David Johnson",
    email: "david.johnson@company.com",
    phone: "+1 (555) 456-7890",
    gender: "male",
    dob: "1989-05-14",
    role: "employee",
    isActive: true,
    companyId: "1",
    departmentId: "3",
    employeeId: "EMP004",
    joinDate: "2022-04-05",
    address: "321 Elm Dr, City, State 12345",
    createdAt: "2022-04-05T09:00:00Z",
    updatedAt: "2024-01-15T09:00:00Z",
  },
  {
    _id: "5",
    name: "Lisa Thompson",
    email: "lisa.thompson@company.com",
    phone: "+1 (555) 567-8901",
    gender: "female",
    dob: "1987-12-03",
    role: "employee",
    isActive: true,
    companyId: "1",
    departmentId: "4",
    employeeId: "EMP005",
    joinDate: "2022-05-20",
    address: "654 Maple Ln, City, State 12345",
    createdAt: "2022-05-20T09:00:00Z",
    updatedAt: "2024-01-15T09:00:00Z",
  },
  {
    _id: "6",
    name: "James Martinez",
    email: "james.martinez@company.com",
    phone: "+1 (555) 678-9012",
    gender: "male",
    dob: "1991-09-18",
    role: "employee",
    isActive: true,
    companyId: "1",
    departmentId: "5",
    employeeId: "EMP006",
    joinDate: "2022-06-15",
    address: "987 Cedar Rd, City, State 12345",
    createdAt: "2022-06-15T09:00:00Z",
    updatedAt: "2024-01-15T09:00:00Z",
  },
  {
    _id: "7",
    name: "Rachel Kim",
    email: "rachel.kim@company.com",
    phone: "+1 (555) 789-0123",
    gender: "female",
    dob: "1993-02-25",
    role: "employee",
    isActive: false,
    companyId: "1",
    departmentId: "3",
    employeeId: "EMP007",
    joinDate: "2022-07-01",
    address: "147 Birch Ave, City, State 12345",
    createdAt: "2022-07-01T09:00:00Z",
    updatedAt: "2024-01-15T09:00:00Z",
  },
];

export const handleGetUsers: RequestHandler = (req, res) => {
  try {
    const response: ApiResponse<User[]> = {
      success: true,
      data: mockEmployees,
      message: "Users retrieved successfully",
    };
    res.json(response);
  } catch (error) {
    console.error("Get users error:", error);
    const response: ApiResponse = {
      success: false,
      message: "Failed to retrieve users",
    };
    res.status(500).json(response);
  }
};

export const handleCreateUser: RequestHandler = (req, res) => {
  try {
    const userData = req.body;

    // Generate a new user ID
    const newId = (mockEmployees.length + 1).toString();
    const newEmployeeId = `EMP${String(mockEmployees.length + 1).padStart(3, "0")}`;

    const newUser: User = {
      _id: newId,
      ...userData,
      employeeId: newEmployeeId,
      isActive: true,
      joinDate: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Add to mock data
    mockEmployees.push(newUser);

    const response: ApiResponse<User> = {
      success: true,
      data: newUser,
      message: "User created successfully",
    };
    res.json(response);
  } catch (error) {
    console.error("Create user error:", error);
    const response: ApiResponse = {
      success: false,
      message: "Failed to create user",
    };
    res.status(500).json(response);
  }
};

export const handleGetDepartments: RequestHandler = (req, res) => {
  try {
    const response: ApiResponse<Department[]> = {
      success: true,
      data: mockDepartments,
      message: "Departments retrieved successfully",
    };
    res.json(response);
  } catch (error) {
    console.error("Get departments error:", error);
    const response: ApiResponse = {
      success: false,
      message: "Failed to retrieve departments",
    };
    res.status(500).json(response);
  }
};

export const handleGetDashboardStats: RequestHandler = (req, res) => {
  try {
    const activeEmployees = mockEmployees.filter((emp) => emp.isActive);
    const presentToday = Math.floor(activeEmployees.length * 0.85); // 85% attendance rate
    const absentToday = activeEmployees.length - presentToday;

    const stats: DashboardStats = {
      totalEmployees: activeEmployees.length,
      presentToday,
      absentToday,
      pendingLeaves: 5,
      totalDepartments: mockDepartments.length,
      averageAttendance: 85,
      monthlySalary: 245000,
      upcomingInterviews: 3,
    };

    const response: ApiResponse<DashboardStats> = {
      success: true,
      data: stats,
      message: "Dashboard stats retrieved successfully",
    };
    res.json(response);
  } catch (error) {
    console.error("Get dashboard stats error:", error);
    const response: ApiResponse = {
      success: false,
      message: "Failed to retrieve dashboard stats",
    };
    res.status(500).json(response);
  }
};

import { RequestHandler } from "express";
import { LoginRequest, LoginResponse, User, ApiResponse } from "@shared/types";

// Mock data for demo purposes
const mockUsers: User[] = [
  {
    _id: "1",
    name: "Hasnain",
    email: "h496242@gmail.com",
    role: "owner",
    isActive: true,
    companyId: "1",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: "2",
    name: "Company Admin",
    email: "admin@demo.com",
    role: "admin",
    isActive: true,
    companyId: "1",
    departmentId: "1",
    employeeId: "EMP001",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: "3",
    name: "HR Manager",
    email: "hr@demo.com",
    role: "hr",
    isActive: true,
    companyId: "1",
    departmentId: "2",
    employeeId: "EMP002",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: "4",
    name: "John Employee",
    email: "employee@demo.com",
    role: "employee",
    isActive: true,
    companyId: "1",
    departmentId: "3",
    employeeId: "EMP003",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export const handleLogin: RequestHandler = (req, res) => {
  try {
    const { email, password }: LoginRequest = req.body;

    // Simple validation
    if (!email || !password) {
      const response: ApiResponse = {
        success: false,
        message: "Email and password are required",
      };
      return res.status(400).json(response);
    }

    // Mock authentication - in production, use proper password hashing
    const user = mockUsers.find((u) => u.email === email);

    // Check password based on user
    const validPassword =
      user?.email === "h496242@gmail.com" ? "123456" : "password123";

    if (!user || password !== validPassword) {
      const response: ApiResponse = {
        success: false,
        message: "Invalid email or password",
      };
      return res.status(401).json(response);
    }

    // Generate mock JWT token
    const token = `mock-jwt-token-${user._id}-${Date.now()}`;

    const loginResponse: LoginResponse = {
      user,
      token,
    };

    const response: ApiResponse<LoginResponse> = {
      success: true,
      data: loginResponse,
      message: "Login successful",
    };

    res.json(response);
  } catch (error) {
    console.error("Login error:", error);
    const response: ApiResponse = {
      success: false,
      message: "Internal server error",
    };
    res.status(500).json(response);
  }
};

export const handleInvite: RequestHandler = (req, res) => {
  try {
    // Mock invite functionality
    const response: ApiResponse = {
      success: true,
      message: "Invitation sent successfully",
    };
    res.json(response);
  } catch (error) {
    console.error("Invite error:", error);
    const response: ApiResponse = {
      success: false,
      message: "Failed to send invitation",
    };
    res.status(500).json(response);
  }
};

export const handleRegister: RequestHandler = (req, res) => {
  try {
    // Mock registration functionality
    const response: ApiResponse = {
      success: true,
      message: "Registration successful",
    };
    res.json(response);
  } catch (error) {
    console.error("Registration error:", error);
    const response: ApiResponse = {
      success: false,
      message: "Registration failed",
    };
    res.status(500).json(response);
  }
};

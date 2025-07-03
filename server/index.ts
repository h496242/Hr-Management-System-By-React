import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
import { handleLogin, handleInvite, handleRegister } from "./routes/auth";
import {
  handleGetUsers,
  handleCreateUser,
  handleGetDepartments,
  handleGetDashboardStats,
} from "./routes/users";
import { handleGetAttendance, handleMarkAttendance } from "./routes/attendance";
import {
  handleGetSalaries,
  handleGenerateSalary,
  handleApproveSalary,
  handlePaySalary,
} from "./routes/salary";
import {
  handleGetCompanyLeaves,
  handleCreateLeaveRequest,
  handleUpdateLeaveStatus,
  handleGetEmployeeLeaves,
} from "./routes/leave";

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Example API routes
  app.get("/api/ping", (_req, res) => {
    res.json({ message: "Hello from Express server v2!" });
  });

  app.get("/api/demo", handleDemo);

  // Authentication routes
  app.post("/api/auth/login", handleLogin);
  app.post("/api/auth/invite", handleInvite);
  app.post("/api/auth/register", handleRegister);

  // User management routes
  app.get("/api/users", handleGetUsers);
  app.post("/api/users", handleCreateUser);
  app.get("/api/departments", handleGetDepartments);
  app.get("/api/dashboard/stats", handleGetDashboardStats);

  // Attendance routes
  app.get("/api/attendance", handleGetAttendance);
  app.post("/api/attendance/mark", handleMarkAttendance);

  // Salary routes
  app.get("/api/salary", handleGetSalaries);
  app.post("/api/salary/generate", handleGenerateSalary);
  app.put("/api/salary/:id/approve", handleApproveSalary);
  app.put("/api/salary/:id/pay", handlePaySalary);

  // Leave management routes
  app.get("/api/leave/company", handleGetCompanyLeaves);
  app.post("/api/leave/request", handleCreateLeaveRequest);
  app.put("/api/leave/:id/status", handleUpdateLeaveStatus);
  app.get("/api/leave/employee/:employeeId", handleGetEmployeeLeaves);

  return app;
}

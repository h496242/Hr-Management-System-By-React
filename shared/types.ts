export type UserRole = "owner" | "admin" | "hr" | "employee";

export interface User {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  gender?: "male" | "female" | "other";
  dob?: string;
  address?: string;
  role: UserRole;
  companyId?: string;
  departmentId?: string;
  employeeId?: string;
  reg_code?: string;
  isActive: boolean;
  profileImage?: string;
  joinDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Company {
  _id: string;
  name: string;
  logo?: string;
  address?: string;
  phone?: string;
  email?: string;
  website?: string;
  createdBy: string;
  admins: string[];
  hrUsers: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Department {
  _id: string;
  name: string;
  description?: string;
  companyId: string;
  managerId?: string;
  isActive: boolean;
  createdAt: string;
}

export interface Attendance {
  _id: string;
  employeeId: string;
  companyId: string;
  date: string;
  status: "present" | "absent" | "leave" | "holiday" | "late";
  checkInTime?: string;
  checkOutTime?: string;
  totalHours?: number;
  notes?: string;
  createdAt: string;
}

export interface Salary {
  _id: string;
  employeeId: string;
  companyId: string;
  month: number;
  year: number;
  baseSalary: number;
  allowances: { name: string; amount: number }[];
  bonuses: { name: string; amount: number }[];
  deductions: { name: string; amount: number }[];
  totalAllowances: number;
  totalBonuses: number;
  totalDeductions: number;
  grossSalary: number;
  netSalary: number;
  status: "pending" | "approved" | "paid";
  approvedBy?: string;
  paidAt?: string;
  generatedAt: string;
  createdAt: string;
}

export interface LeaveRequest {
  _id: string;
  employeeId: string;
  companyId: string;
  fromDate: string;
  toDate: string;
  totalDays: number;
  reason: string;
  type: "casual" | "sick" | "annual" | "maternity" | "paternity" | "emergency";
  status: "pending" | "approved" | "rejected";
  reviewedBy?: string;
  reviewedAt?: string;
  comments?: string;
  appliedAt: string;
  createdAt: string;
}

export interface InterviewSchedule {
  _id: string;
  candidateId: string;
  candidateName: string;
  candidateEmail: string;
  position: string;
  companyId: string;
  interviewerId: string;
  date: string;
  time: string;
  location: string;
  type: "phone" | "video" | "in-person";
  status: "scheduled" | "completed" | "cancelled" | "rescheduled";
  notes?: string;
  result?: "hired" | "rejected" | "hold";
  createdAt: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  token: string;
  company?: Company;
}

export interface InviteRequest {
  email: string;
  role: UserRole;
  companyId: string;
  departmentId?: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message: string;
  error?: string;
}

export interface DashboardStats {
  totalEmployees: number;
  presentToday: number;
  absentToday: number;
  pendingLeaves: number;
  totalDepartments: number;
  averageAttendance: number;
  monthlySalary: number;
  upcomingInterviews: number;
}

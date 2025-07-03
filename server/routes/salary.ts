import { RequestHandler } from "express";
import { Salary, ApiResponse } from "@shared/types";

// Mock salary data
let mockSalaries: Salary[] = [
  {
    _id: "sal1",
    employeeId: "3",
    companyId: "1",
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
    baseSalary: 5000,
    allowances: [{ name: "Transport", amount: 300 }],
    bonuses: [{ name: "Performance", amount: 500 }],
    deductions: [{ name: "Tax", amount: 800 }],
    totalAllowances: 300,
    totalBonuses: 500,
    totalDeductions: 800,
    grossSalary: 5800,
    netSalary: 5000,
    status: "approved",
    generatedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
  },
  {
    _id: "sal2",
    employeeId: "4",
    companyId: "1",
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
    baseSalary: 4500,
    allowances: [{ name: "Transport", amount: 300 }],
    bonuses: [],
    deductions: [{ name: "Tax", amount: 720 }],
    totalAllowances: 300,
    totalBonuses: 0,
    totalDeductions: 720,
    grossSalary: 4800,
    netSalary: 4080,
    status: "pending",
    generatedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
  },
];

export const handleGetSalaries: RequestHandler = (req, res) => {
  try {
    const { month, year } = req.query;

    let filteredSalaries = mockSalaries;
    if (month && year) {
      filteredSalaries = mockSalaries.filter(
        (sal) => sal.month === Number(month) && sal.year === Number(year),
      );
    }

    const response: ApiResponse<Salary[]> = {
      success: true,
      data: filteredSalaries,
      message: "Salaries retrieved successfully",
    };
    res.json(response);
  } catch (error) {
    console.error("Get salaries error:", error);
    const response: ApiResponse = {
      success: false,
      message: "Failed to retrieve salaries",
    };
    res.status(500).json(response);
  }
};

export const handleGenerateSalary: RequestHandler = (req, res) => {
  try {
    const salaryData = req.body;

    const newSalary: Salary = {
      _id: `sal${mockSalaries.length + 1}`,
      companyId: "1",
      generatedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      ...salaryData,
    };

    // Remove existing salary for the same employee, month, and year
    mockSalaries = mockSalaries.filter(
      (sal) =>
        !(
          sal.employeeId === salaryData.employeeId &&
          sal.month === salaryData.month &&
          sal.year === salaryData.year
        ),
    );

    // Add new salary
    mockSalaries.push(newSalary);

    const response: ApiResponse<Salary> = {
      success: true,
      data: newSalary,
      message: "Salary generated successfully",
    };
    res.json(response);
  } catch (error) {
    console.error("Generate salary error:", error);
    const response: ApiResponse = {
      success: false,
      message: "Failed to generate salary",
    };
    res.status(500).json(response);
  }
};

export const handleApproveSalary: RequestHandler = (req, res) => {
  try {
    const { id } = req.params;

    const salaryIndex = mockSalaries.findIndex((sal) => sal._id === id);
    if (salaryIndex === -1) {
      const response: ApiResponse = {
        success: false,
        message: "Salary not found",
      };
      return res.status(404).json(response);
    }

    mockSalaries[salaryIndex].status = "approved";

    const response: ApiResponse = {
      success: true,
      message: "Salary approved successfully",
    };
    res.json(response);
  } catch (error) {
    console.error("Approve salary error:", error);
    const response: ApiResponse = {
      success: false,
      message: "Failed to approve salary",
    };
    res.status(500).json(response);
  }
};

export const handlePaySalary: RequestHandler = (req, res) => {
  try {
    const { id } = req.params;

    const salaryIndex = mockSalaries.findIndex((sal) => sal._id === id);
    if (salaryIndex === -1) {
      const response: ApiResponse = {
        success: false,
        message: "Salary not found",
      };
      return res.status(404).json(response);
    }

    mockSalaries[salaryIndex].status = "paid";
    mockSalaries[salaryIndex].paidAt = new Date().toISOString();

    const response: ApiResponse = {
      success: true,
      message: "Salary paid successfully",
    };
    res.json(response);
  } catch (error) {
    console.error("Pay salary error:", error);
    const response: ApiResponse = {
      success: false,
      message: "Failed to pay salary",
    };
    res.status(500).json(response);
  }
};

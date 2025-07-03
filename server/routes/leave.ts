import { RequestHandler } from "express";
import { LeaveRequest, ApiResponse } from "@shared/types";

// Mock leave requests data
let mockLeaveRequests: LeaveRequest[] = [
  {
    _id: "leave1",
    employeeId: "3",
    companyId: "1",
    fromDate: "2024-02-15",
    toDate: "2024-02-17",
    totalDays: 3,
    reason: "Family vacation trip",
    type: "casual",
    status: "pending",
    appliedAt: "2024-02-10T09:00:00Z",
    createdAt: "2024-02-10T09:00:00Z",
  },
  {
    _id: "leave2",
    employeeId: "4",
    companyId: "1",
    fromDate: "2024-02-20",
    toDate: "2024-02-21",
    totalDays: 2,
    reason: "Medical appointment and recovery",
    type: "sick",
    status: "approved",
    reviewedBy: "2",
    reviewedAt: "2024-02-12T10:30:00Z",
    comments: "Approved for medical reasons",
    appliedAt: "2024-02-11T14:20:00Z",
    createdAt: "2024-02-11T14:20:00Z",
  },
  {
    _id: "leave3",
    employeeId: "5",
    companyId: "1",
    fromDate: "2024-01-25",
    toDate: "2024-01-26",
    totalDays: 2,
    reason: "Personal emergency",
    type: "emergency",
    status: "rejected",
    reviewedBy: "2",
    reviewedAt: "2024-01-24T16:45:00Z",
    comments: "Insufficient notice provided",
    appliedAt: "2024-01-24T15:30:00Z",
    createdAt: "2024-01-24T15:30:00Z",
  },
  {
    _id: "leave4",
    employeeId: "6",
    companyId: "1",
    fromDate: "2024-03-01",
    toDate: "2024-03-05",
    totalDays: 5,
    reason: "Annual leave for rest and relaxation",
    type: "annual",
    status: "pending",
    appliedAt: "2024-02-20T11:15:00Z",
    createdAt: "2024-02-20T11:15:00Z",
  },
];

export const handleGetCompanyLeaves: RequestHandler = (req, res) => {
  try {
    // Sort by application date (newest first)
    const sortedLeaves = [...mockLeaveRequests].sort(
      (a, b) =>
        new Date(b.appliedAt).getTime() - new Date(a.appliedAt).getTime(),
    );

    const response: ApiResponse<LeaveRequest[]> = {
      success: true,
      data: sortedLeaves,
      message: "Leave requests retrieved successfully",
    };
    res.json(response);
  } catch (error) {
    console.error("Get leave requests error:", error);
    const response: ApiResponse = {
      success: false,
      message: "Failed to retrieve leave requests",
    };
    res.status(500).json(response);
  }
};

export const handleCreateLeaveRequest: RequestHandler = (req, res) => {
  try {
    const leaveData = req.body;

    // Calculate total days
    const fromDate = new Date(leaveData.fromDate);
    const toDate = new Date(leaveData.toDate);
    const totalDays =
      Math.ceil(
        (toDate.getTime() - fromDate.getTime()) / (1000 * 60 * 60 * 24),
      ) + 1;

    const newLeave: LeaveRequest = {
      _id: `leave${mockLeaveRequests.length + 1}`,
      companyId: "1",
      totalDays,
      status: "pending",
      appliedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      ...leaveData,
    };

    mockLeaveRequests.push(newLeave);

    const response: ApiResponse<LeaveRequest> = {
      success: true,
      data: newLeave,
      message: "Leave request submitted successfully",
    };
    res.json(response);
  } catch (error) {
    console.error("Create leave request error:", error);
    const response: ApiResponse = {
      success: false,
      message: "Failed to submit leave request",
    };
    res.status(500).json(response);
  }
};

export const handleUpdateLeaveStatus: RequestHandler = (req, res) => {
  try {
    const { id } = req.params;
    const { status, comments } = req.body;

    const leaveIndex = mockLeaveRequests.findIndex((leave) => leave._id === id);
    if (leaveIndex === -1) {
      const response: ApiResponse = {
        success: false,
        message: "Leave request not found",
      };
      return res.status(404).json(response);
    }

    mockLeaveRequests[leaveIndex].status = status;
    mockLeaveRequests[leaveIndex].reviewedBy = "2"; // Admin/HR user ID
    mockLeaveRequests[leaveIndex].reviewedAt = new Date().toISOString();
    if (comments) {
      mockLeaveRequests[leaveIndex].comments = comments;
    }

    const response: ApiResponse = {
      success: true,
      message: `Leave request ${status} successfully`,
    };
    res.json(response);
  } catch (error) {
    console.error("Update leave status error:", error);
    const response: ApiResponse = {
      success: false,
      message: "Failed to update leave status",
    };
    res.status(500).json(response);
  }
};

export const handleGetEmployeeLeaves: RequestHandler = (req, res) => {
  try {
    const { employeeId } = req.params;

    const employeeLeaves = mockLeaveRequests
      .filter((leave) => leave.employeeId === employeeId)
      .sort(
        (a, b) =>
          new Date(b.appliedAt).getTime() - new Date(a.appliedAt).getTime(),
      );

    const response: ApiResponse<LeaveRequest[]> = {
      success: true,
      data: employeeLeaves,
      message: "Employee leave requests retrieved successfully",
    };
    res.json(response);
  } catch (error) {
    console.error("Get employee leaves error:", error);
    const response: ApiResponse = {
      success: false,
      message: "Failed to retrieve employee leave requests",
    };
    res.status(500).json(response);
  }
};

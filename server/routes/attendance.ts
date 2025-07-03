import { RequestHandler } from "express";
import { Attendance, ApiResponse } from "@shared/types";

// Mock attendance data
let mockAttendance: Attendance[] = [
  {
    _id: "att1",
    employeeId: "3",
    companyId: "1",
    date: new Date().toISOString().split("T")[0],
    status: "present",
    checkInTime: "09:00",
    checkOutTime: "17:30",
    totalHours: 8.5,
    createdAt: new Date().toISOString(),
  },
  {
    _id: "att2",
    employeeId: "4",
    companyId: "1",
    date: new Date().toISOString().split("T")[0],
    status: "late",
    checkInTime: "09:30",
    checkOutTime: "17:30",
    totalHours: 8,
    createdAt: new Date().toISOString(),
  },
  {
    _id: "att3",
    employeeId: "5",
    companyId: "1",
    date: new Date().toISOString().split("T")[0],
    status: "absent",
    createdAt: new Date().toISOString(),
  },
];

export const handleGetAttendance: RequestHandler = (req, res) => {
  try {
    const { date } = req.query;

    let filteredAttendance = mockAttendance;
    if (date) {
      filteredAttendance = mockAttendance.filter((att) => att.date === date);
    }

    const response: ApiResponse<Attendance[]> = {
      success: true,
      data: filteredAttendance,
      message: "Attendance retrieved successfully",
    };
    res.json(response);
  } catch (error) {
    console.error("Get attendance error:", error);
    const response: ApiResponse = {
      success: false,
      message: "Failed to retrieve attendance",
    };
    res.status(500).json(response);
  }
};

export const handleMarkAttendance: RequestHandler = (req, res) => {
  try {
    const attendanceData = req.body;

    // Calculate total hours if check in and out times are provided
    let totalHours = 0;
    if (attendanceData.checkInTime && attendanceData.checkOutTime) {
      const checkIn = new Date(`2000-01-01 ${attendanceData.checkInTime}`);
      const checkOut = new Date(`2000-01-01 ${attendanceData.checkOutTime}`);
      totalHours = (checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60);
    }

    const newAttendance: Attendance = {
      _id: `att${mockAttendance.length + 1}`,
      companyId: "1",
      totalHours,
      createdAt: new Date().toISOString(),
      ...attendanceData,
    };

    // Remove existing attendance for the same employee and date
    mockAttendance = mockAttendance.filter(
      (att) =>
        !(
          att.employeeId === attendanceData.employeeId &&
          att.date === attendanceData.date
        ),
    );

    // Add new attendance
    mockAttendance.push(newAttendance);

    const response: ApiResponse<Attendance> = {
      success: true,
      data: newAttendance,
      message: "Attendance marked successfully",
    };
    res.json(response);
  } catch (error) {
    console.error("Mark attendance error:", error);
    const response: ApiResponse = {
      success: false,
      message: "Failed to mark attendance",
    };
    res.status(500).json(response);
  }
};

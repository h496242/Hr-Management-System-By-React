# 🏢 HR Management System

A comprehensive, full-stack HR Management System built with React, TypeScript, and Express. This modern web application provides complete HR functionality including employee management, attendance tracking, salary processing, and leave management.

![HR Management System](https://img.shields.io/badge/HR-Management-blue?style=for-the-badge)
![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript)
![Express](https://img.shields.io/badge/Express-4-000000?style=for-the-badge&logo=express)

## ✨ Features

### 🔐 **Authentication & Role Management**

- **Multi-role access control**: Owner, Admin, HR, Employee
- **Secure login system** with JWT authentication
- **Role-based navigation** and feature access
- **User invitation system** with registration codes

### 👥 **Employee Management**

- **Complete employee profiles** with personal information
- **Department assignment** and role management
- **Employee onboarding** with invite-based registration
- **Profile picture upload** and contact management
- **Employee search and filtering** by department/role

### ⏰ **Attendance Management**

- **Daily attendance tracking** (Present/Absent/Late)
- **Check-in/Check-out time recording**
- **Automatic working hours calculation**
- **Attendance reports** with filtering options
- **Calendar view** for attendance history
- **Bulk attendance management** for HR/Admin

### 💰 **Salary Management**

- **Monthly salary sheet generation**
- **Flexible salary components**: Base salary, allowances, bonuses, deductions
- **Automatic gross/net salary calculation**
- **Multi-stage approval workflow**: Pending → Approved → Paid
- **Salary history tracking**
- **Payroll export functionality**
- **Admin controls** for salary approval and payment

### 🏝️ **Leave Management**

- **Employee leave applications** with multiple leave types
- **HR/Admin approval system** with review comments
- **Leave balance tracking** and quota management
- **Leave types**: Casual, Sick, Annual, Maternity, Paternity, Emergency
- **Leave request status tracking**
- **Automated leave deduction** from salary

### 📊 **Dashboard & Analytics**

- **Real-time statistics** and KPI tracking
- **Attendance summaries** and trends
- **Salary reports** and financial overview
- **Leave request monitoring**
- **Quick action shortcuts** for common tasks

### 🎨 **Modern UI/UX**

- **Professional design** optimized for HR operations
- **Responsive layout** for desktop, tablet, and mobile
- **Dark/Light theme support**
- **Intuitive navigation** with role-based menus
- **Interactive components** with real-time updates

## 🛠️ Tech Stack

### **Frontend**

- **React 18** - Modern React with hooks and context
- **TypeScript** - Type-safe development
- **React Router 6** - SPA routing with role-based navigation
- **TailwindCSS 3** - Utility-first styling
- **Radix UI** - Accessible component primitives
- **Lucide React** - Beautiful icon library
- **React Hook Form** - Efficient form handling
- **React Query** - Server state management

### **Backend**

- **Express.js** - Fast, unopinionated web framework
- **Node.js** - JavaScript runtime
- **TypeScript** - Full-stack type safety
- **CORS** - Cross-origin resource sharing
- **Express Middleware** - Request/response processing

### **Development Tools**

- **Vite** - Lightning-fast build tool
- **ESLint & Prettier** - Code quality and formatting
- **Vitest** - Unit testing framework
- **Hot Module Replacement** - Instant development feedback

## 🚀 Getting Started

### **Prerequisites**

- Node.js 18+
- npm or yarn package manager

### **Installation**

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd hr-management-system
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start the development server**

   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:8080`

### **Production Build**

```bash
# Build the application
npm run build

# Start production server
npm start
```

## 🔑 Demo Credentials

### **Owner Account**

- **Email**: `h496242@gmail.com`
- **Password**: `123456`
- **Access**: Full system access, company management

### **Admin Account**

- **Email**: `admin@demo.com`
- **Password**: `password123`
- **Access**: Employee management, HR operations

### **HR Account**

- **Email**: `hr@demo.com`
- **Password**: `password123`
- **Access**: HR operations, attendance, salary, leave management

### **Employee Account**

- **Email**: `employee@demo.com`
- **Password**: `password123`
- **Access**: Personal profile, attendance, salary views, leave applications

## 📂 Project Structure

```
hr-management-system/
├── client/                          # React frontend
│   ├── components/                  # Reusable UI components
│   │   ├── auth/                   # Authentication components
│   │   ├── layout/                 # Layout components (Header, Sidebar)
│   │   └── ui/                     # Base UI components (shadcn/ui)
│   ├── pages/                      # Route components
│   │   ├── Login.tsx              # Login page
│   │   ├── Dashboard.tsx          # Main dashboard
│   │   ├── Employees.tsx          # Employee management
│   │   ├── Attendance.tsx         # Attendance tracking
│   │   ├── Salary.tsx             # Salary management
│   │   └── Leave.tsx              # Leave management
│   ├── lib/                       # Utility functions
│   ├── hooks/                     # Custom React hooks
│   ├── App.tsx                    # Main app component with routing
│   └── global.css                 # Global styles and theme
├── server/                          # Express backend
│   ├── routes/                     # API route handlers
│   │   ├── auth.ts                # Authentication endpoints
│   │   ├── users.ts               # User management
│   │   ├── attendance.ts          # Attendance APIs
│   │   ├── salary.ts              # Salary management
│   │   └── leave.ts               # Leave management
│   └── index.ts                   # Server configuration
├── shared/                          # Shared types and interfaces
│   └── types.ts                   # TypeScript definitions
└── package.json                    # Dependencies and scripts
```

## 🔌 API Endpoints

### **Authentication**

- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/invite` - Send user invitation

### **User Management**

- `GET /api/users` - Get all users
- `POST /api/users` - Create new user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

### **Attendance**

- `GET /api/attendance` - Get attendance records
- `POST /api/attendance/mark` - Mark attendance

### **Salary Management**

- `GET /api/salary` - Get salary records
- `POST /api/salary/generate` - Generate salary sheet
- `PUT /api/salary/:id/approve` - Approve salary
- `PUT /api/salary/:id/pay` - Mark salary as paid

### **Leave Management**

- `GET /api/leave/company` - Get all leave requests
- `POST /api/leave/request` - Submit leave request
- `PUT /api/leave/:id/status` - Approve/Reject leave

### **Dashboard**

- `GET /api/dashboard/stats` - Get dashboard statistics
- `GET /api/departments` - Get departments list

## 📱 Usage Guide

### **For HR/Admin Users**

1. **Login** with admin credentials
2. **Manage Employees**: Add, edit, and organize team members
3. **Track Attendance**: Mark daily attendance and view reports
4. **Process Salaries**: Generate, approve, and pay employee salaries
5. **Handle Leave Requests**: Review and approve/reject leave applications

### **For Employees**

1. **Login** with employee credentials
2. **View Profile**: Check personal information and employment details
3. **Check Attendance**: View attendance history and working hours
4. **Apply for Leave**: Submit leave requests with proper documentation
5. **View Salary**: Access salary slips and payment history

### **For Owners**

1. **Login** with owner credentials
2. **Manage Companies**: Create and configure company settings
3. **Assign Administrators**: Delegate management responsibilities
4. **Monitor Operations**: Overview of all HR activities

## 🛡️ Security Features

- **Role-based access control** (RBAC)
- **JWT token authentication**
- **Input validation and sanitization**
- **CORS protection**
- **Secure password handling**
- **API rate limiting** (recommended for production)

## 🎯 Key Highlights

- **✅ Complete CRUD operations** for all entities
- **✅ Real-time data updates** across the application
- **✅ Mobile-responsive design** for all devices
- **✅ Professional UI/UX** tailored for HR operations
- **✅ Type-safe development** with TypeScript
- **✅ Modern React patterns** with hooks and context
- **✅ Efficient state management** with React Query
- **✅ Component reusability** with shadcn/ui
- **✅ Fast development experience** with Vite

## 🚀 Deployment Options

### **Standard Deployment**

```bash
npm run build
npm start
```

### **Docker Deployment**

```dockerfile
# Dockerfile included for containerization
```

### **Serverless Deployment**

- Compatible with Vercel, Netlify, and AWS Lambda
- Serverless-http adapter included

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [Fusion Starter](https://github.com/BuilderIO/fusion-starter) template
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Icons from [Lucide React](https://lucide.dev/)
- Styling with [TailwindCSS](https://tailwindcss.com/)

## 📞 Support

For support, email hasnain@example.com or create an issue in this repository.

---

**Built with ❤️ for modern HR operations**

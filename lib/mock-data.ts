// Mock data for the HRM system

export const mockEmployees = [
  {
    id: 'EMP-00001',
    firstName: 'John',
    lastName: 'Smith',
    email: 'john.smith@company.com',
    phone: '+1 (555) 123-4567',
    department: 'Engineering',
    designation: 'Senior Software Engineer',
    joiningDate: '2020-03-15',
    salary: 75000,
    bankAccount: '1234567890',
    status: 'Active',
  },
  {
    id: 'EMP-00002',
    firstName: 'Sarah',
    lastName: 'Johnson',
    email: 'sarah.johnson@company.com',
    phone: '+1 (555) 234-5678',
    department: 'HR',
    designation: 'HR Manager',
    joiningDate: '2019-06-20',
    salary: 65000,
    bankAccount: '9876543210',
    status: 'Active',
  },
  {
    id: 'EMP-00003',
    firstName: 'Michael',
    lastName: 'Davis',
    email: 'michael.davis@company.com',
    phone: '+1 (555) 345-6789',
    department: 'Finance',
    designation: 'Finance Manager',
    joiningDate: '2018-01-10',
    salary: 70000,
    bankAccount: '5555555555',
    status: 'Active',
  },
];

export const mockInvoices = [
  {
    id: 'INV-2024-001',
    clientName: 'ABC Corporation',
    amount: 15000,
    status: 'Paid',
    date: '2024-01-15',
    dueDate: '2024-02-15',
  },
  {
    id: 'INV-2024-002',
    clientName: 'XYZ Services',
    amount: 22500,
    status: 'Pending',
    date: '2024-01-20',
    dueDate: '2024-02-20',
  },
  {
    id: 'INV-2024-003',
    clientName: 'Tech Solutions',
    amount: 18750,
    status: 'Overdue',
    date: '2024-01-10',
    dueDate: '2024-01-30',
  },
];

export const mockAttendance = [
  {
    id: 1,
    employeeId: 'EMP-00001',
    employeeName: 'John Smith',
    date: '2024-01-31',
    status: 'Present',
    hoursWorked: 8,
  },
  {
    id: 2,
    employeeId: 'EMP-00002',
    employeeName: 'Sarah Johnson',
    date: '2024-01-31',
    status: 'Present',
    hoursWorked: 8,
  },
  {
    id: 3,
    employeeId: 'EMP-00003',
    employeeName: 'Michael Davis',
    date: '2024-01-31',
    status: 'Absent',
    hoursWorked: 0,
  },
];

export const mockPayroll = [
  {
    employeeId: 'EMP-00001',
    employeeName: 'John Smith',
    grossSalary: 75000,
    pfDeduction: 1875,
    taxDeduction: 8250,
    otherDeductions: 500,
    netSalary: 64375,
    status: 'Processed',
  },
  {
    employeeId: 'EMP-00002',
    employeeName: 'Sarah Johnson',
    grossSalary: 65000,
    pfDeduction: 1625,
    taxDeduction: 7150,
    otherDeductions: 300,
    netSalary: 55925,
    status: 'Processed',
  },
  {
    employeeId: 'EMP-00003',
    employeeName: 'Michael Davis',
    grossSalary: 70000,
    pfDeduction: 1750,
    taxDeduction: 7700,
    otherDeductions: 400,
    netSalary: 60150,
    status: 'Pending',
  },
];

export const mockDepartments = [
  'Engineering',
  'HR',
  'Finance',
  'Sales',
  'Marketing',
  'Operations',
  'Support',
  'Administration',
];

export const mockDesignations = [
  'Manager',
  'Senior Manager',
  'Team Lead',
  'Senior Engineer',
  'Engineer',
  'Junior Engineer',
  'Coordinator',
  'Analyst',
  'Executive',
];

export const mockClients = [
  {
    id: 'CLT-001',
    name: 'ABC Corporation',
    contactPerson: 'John Doe',
    email: 'contact@abccorp.com',
    phone: '+1 (555) 111-1111',
    status: 'Active',
  },
  {
    id: 'CLT-002',
    name: 'XYZ Services',
    contactPerson: 'Jane Smith',
    email: 'contact@xyzservices.com',
    phone: '+1 (555) 222-2222',
    status: 'Active',
  },
  {
    id: 'CLT-003',
    name: 'Tech Solutions',
    contactPerson: 'Bob Johnson',
    email: 'contact@techsolutions.com',
    phone: '+1 (555) 333-3333',
    status: 'Inactive',
  },
];

export const mockCompanyInfo = {
  name: 'AXIS Corporation',
  registrationNumber: 'REG-12345',
  panNumber: 'AAACT1234A',
  gstin: '18AABCT1234A1Z5',
  address: '123 Business Street, Tech City, TC 12345',
  phone: '+1 (555) 999-9999',
  email: 'info@axiscorp.com',
  financialYearStart: '2024-04-01',
  financialYearEnd: '2025-03-31',
};

export const mockLeaveTypes = [
  {
    id: 1,
    name: 'Casual Leave',
    allowedDays: 12,
  },
  {
    id: 2,
    name: 'Earned Leave',
    allowedDays: 20,
  },
  {
    id: 3,
    name: 'Sick Leave',
    allowedDays: 10,
  },
  {
    id: 4,
    name: 'Maternity Leave',
    allowedDays: 180,
  },
  {
    id: 5,
    name: 'Paternity Leave',
    allowedDays: 15,
  },
];

export const mockTaxSlabs = [
  {
    id: 1,
    minAmount: 0,
    maxAmount: 250000,
    taxRate: 0,
  },
  {
    id: 2,
    minAmount: 250001,
    maxAmount: 500000,
    taxRate: 5,
  },
  {
    id: 3,
    minAmount: 500001,
    maxAmount: 1000000,
    taxRate: 20,
  },
  {
    id: 4,
    minAmount: 1000001,
    maxAmount: Infinity,
    taxRate: 30,
  },
];

export const getDashboardStats = () => {
  return {
    totalEmployees: 2445,
    activeEmployees: 2380,
    onLeave: 45,
    pendingApprovals: 23,
    monthlyPayroll: 2400000,
    totalRevenue: 5400000,
    paidInvoices: 3200000,
    pendingInvoices: 1500000,
    attendanceRate: 94.2,
    turnoverRate: 2.1,
  };
};

export const getRecentActivities = () => {
  return [
    {
      id: 1,
      type: 'salary_processed',
      description: 'Monthly payroll processing completed',
      timestamp: '2 hours ago',
      icon: '✓',
    },
    {
      id: 2,
      type: 'invoice_generated',
      description: '11 new invoices generated for Client XYZ',
      timestamp: '4 hours ago',
      icon: '📄',
    },
    {
      id: 3,
      type: 'employee_added',
      description: 'John Smith added to Engineering Department',
      timestamp: '1 day ago',
      icon: '👤',
    },
    {
      id: 4,
      type: 'attendance_alert',
      description: '5 employees marked absent',
      timestamp: '2 days ago',
      icon: '⚠',
    },
  ];
};

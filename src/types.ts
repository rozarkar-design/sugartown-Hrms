export type UserRole = 'SUPER_ADMIN' | 'HR_ADMIN' | 'PAYROLL_ADMIN' | 'MANAGER' | 'EMPLOYEE';

export type AttendanceStatus =
  | 'Present'
  | 'Absent'
  | 'Half Day'
  | 'Paid Leave'
  | 'Unpaid Leave'
  | 'Weekly Off'
  | 'Holiday'
  | 'Work From Home'
  | 'On Duty';

export type LeaveType =
  | 'Casual Leave'
  | 'Sick Leave'
  | 'Earned Leave'
  | 'Paid Leave'
  | 'Unpaid Leave'
  | 'Maternity Leave'
  | 'Paternity Leave'
  | 'Comp Off'
  | 'Bereavement Leave'
  | 'Work From Home';

export type RequestStatus = 'Pending' | 'Approved' | 'Rejected' | 'Cancelled';

export type EmployeeStatus =
  | 'Active'
  | 'Probation'
  | 'Notice Period'
  | 'Resigned'
  | 'Terminated'
  | 'Inactive';

export type EmploymentType = 'Full-Time' | 'Part-Time' | 'Contract' | 'Intern';

export type PayrollStatus = 'Draft' | 'Calculated' | 'Verified' | 'Approved' | 'Processed' | 'Locked';

export interface User {
  id: string;
  employeeId: string;
  email: string;
  mobile?: string;
  name: string;
  role: UserRole;
  avatarUrl: string;
  department: string;
  designation: string;
}

export interface Employee {
  id: string;
  employeeId: string; // e.g. ST-1001
  fullName: string;
  photoUrl: string;
  gender: 'Male' | 'Female' | 'Other';
  dob: string;
  mobile: string;
  personalEmail: string;
  officialEmail: string;
  bloodGroup: string;
  maritalStatus: 'Single' | 'Married' | 'Divorced';
  nationality: string;

  // Address
  currentAddress: string;
  permanentAddress: string;
  city: string;
  state: string;
  pinCode: string;
  country: string;

  // Employment
  department: string;
  designation: string;
  reportingManagerId?: string;
  reportingManagerName?: string;
  employmentType: EmploymentType;
  dateOfJoining: string;
  probationPeriodMonths: number;
  confirmationDate: string;
  workLocation: string;
  shiftId: string;
  status: EmployeeStatus;

  // Bank
  bankName: string;
  accountHolderName: string;
  accountNumber: string;
  ifscCode: string;
  branch: string;

  // Statutory
  panNumber: string;
  aadhaarNumber: string;
  uan: string;
  pfNumber: string;
  esicNumber: string;

  // Compensation
  annualCTC: number; // in INR e.g. 600000
  monthlyCTC: number;
  basicSalary: number;
  hra: number;
  conveyance: number;
  specialAllowance: number;
  medicalAllowance: number;
}

export interface AttendanceRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  department: string;
  date: string; // YYYY-MM-DD
  shift: string;
  checkIn?: string; // HH:mm:ss
  checkOut?: string;
  workingHours: number;
  status: AttendanceStatus;
  lateByMinutes: number;
  earlyExitMinutes: number;
  overtimeHours: number;
  location?: string;
  ipAddress?: string;
  remarks?: string;
  isManual?: boolean;
}

export interface AttendanceRegularizationRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  date: string;
  existingCheckIn?: string;
  existingCheckOut?: string;
  requestedCheckIn: string;
  requestedCheckOut: string;
  reason: string;
  remarks?: string;
  status: RequestStatus;
  approverRemarks?: string;
  createdAt: string;
}

export interface LeaveBalance {
  employeeId: string;
  casualLeave: { total: number; used: number };
  sickLeave: { total: number; used: number };
  earnedLeave: { total: number; used: number };
  compOff: { total: number; used: number };
  workFromHome: { total: number; used: number };
}

export interface LeaveRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  department: string;
  leaveType: LeaveType;
  fromDate: string;
  toDate: string;
  isHalfDay: boolean;
  halfDayType?: 'First Half' | 'Second Half';
  numberOfDays: number;
  reason: string;
  contactDuringLeave: string;
  attachmentName?: string;
  status: RequestStatus;
  appliedDate: string;
  approverComments?: string;
}

export interface Holiday {
  id: string;
  name: string;
  date: string;
  day: string;
  location: string; // 'All' or specific location
  type: 'Mandatory' | 'Optional';
  description: string;
}

export interface Shift {
  id: string;
  name: string;
  startTime: string;
  endTime: string;
  gracePeriodMinutes: number;
  minWorkingHours: number;
  halfDayHours: number;
  weeklyOff: string[];
}

export interface DocumentItem {
  id: string;
  employeeId: string;
  employeeName: string;
  documentType:
    | 'Aadhaar'
    | 'PAN'
    | 'Resume'
    | 'Offer Letter'
    | 'Appointment Letter'
    | 'Employment Agreement'
    | 'Educational Certificate'
    | 'Experience Certificate'
    | 'Bank Proof'
    | 'Address Proof'
    | 'Passport'
    | 'Driving Licence'
    | 'Joining Documents'
    | 'Relieving Letter'
    | 'Other HR Document';
  fileName: string;
  fileSize: string;
  uploadDate: string;
  status: 'Approved' | 'Pending' | 'Rejected' | 'Archived';
  notes?: string;
}

export interface SalaryComponent {
  id: string;
  name: string;
  type: 'EARNING' | 'DEDUCTION';
  isStatutory: boolean;
  calculationType: 'FLAT' | 'PERCENTAGE_OF_BASIC';
  percentageOrAmount: number;
  description: string;
  isEnabled: boolean;
}

export interface PayrollRun {
  id: string;
  month: string; // e.g. "October 2026"
  monthKey: string; // e.g. "2026-10"
  totalEmployees: number;
  payrollCost: number;
  grossSalary: number;
  totalDeductions: number;
  netSalary: number;
  status: PayrollStatus;
  processedDate?: string;
  lockedDate?: string;
  lockedBy?: string;
}

export interface Payslip {
  id: string;
  payslipNumber: string;
  month: string;
  monthKey: string;
  employeeId: string;
  employeeName: string;
  designation: string;
  department: string;
  dateOfJoining: string;
  workLocation: string;
  panNumber: string;
  uan: string;
  bankName: string;
  maskedAccountNumber: string;
  paidDays: number;
  leaveWithoutPay: number;
  absentDays: number;

  earnings: {
    basicSalary: number;
    hra: number;
    conveyance: number;
    specialAllowance: number;
    medicalAllowance: number;
    incentives: number;
    bonus: number;
    overtime: number;
    reimbursements: number;
    totalEarnings: number;
  };

  deductions: {
    employeePf: number;
    esic: number;
    professionalTax: number;
    tds: number;
    loanEmi: number;
    advanceDeduction: number;
    lossOfPay: number;
    totalDeductions: number;
  };

  netPay: number;
  netPayInWords: string;
  generatedDate: string;
  status: 'Generated' | 'Sent' | 'Paid';
}

export interface ReimbursementRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  expenseDate: string;
  category: 'Travel' | 'Food' | 'Fuel' | 'Mobile' | 'Accommodation' | 'Office Expense' | 'Other';
  amount: number;
  description: string;
  receiptName?: string;
  status: RequestStatus;
  submittedDate: string;
  approverRemarks?: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  category: 'Company Update' | 'Holiday' | 'HR Policy' | 'Recognition' | 'Event' | 'Payroll';
  publishedDate: string;
  expiryDate: string;
  targetDepartment: string; // 'All' or specific
  targetLocation: string;
  priority: 'High' | 'Normal' | 'Urgent';
  author: string;
  attachmentName?: string;
}

export interface HRPolicy {
  id: string;
  title: string;
  category: 'Leave Policy' | 'Attendance Policy' | 'Payroll Policy' | 'Code of Conduct' | 'Workplace Policy' | 'Travel Policy' | 'Employee Handbook';
  version: string;
  effectiveDate: string;
  description: string;
  summaryPoints: string[];
  acknowledged?: boolean;
}

export interface ResignationExit {
  id: string;
  employeeId: string;
  employeeName: string;
  department: string;
  resignationDate: string;
  proposedLastWorkingDate: string;
  actualLastWorkingDate: string;
  noticePeriodDays: number;
  reason: string;
  status: 'Submitted' | 'Manager Approved' | 'HR Approved' | 'Clearance In Progress' | 'Settlement Done' | 'Relieved';
  assetReturnStatus: 'Pending' | 'Completed';
  exitInterviewCompleted: boolean;
  fnfSettlementAmount: number;
  relievingLetterIssued: boolean;
}

export interface LoanAdvance {
  id: string;
  employeeId: string;
  employeeName: string;
  type: 'Loan' | 'Salary Advance';
  amount: number;
  emiAmount: number;
  totalInstallments: number;
  paidInstallments: number;
  outstandingBalance: number;
  startMonth: string;
  status: 'Active' | 'Closed';
}

export interface AuditLogItem {
  id: string;
  userName: string;
  userRole: UserRole;
  timestamp: string;
  ipAddress: string;
  action: string;
  module: string;
  previousValue?: string;
  updatedValue: string;
}

export interface Department {
  id: string;
  name: string;
  headName: string;
  employeeCount: number;
  costCentre: string;
  location: string;
}

export interface Designation {
  id: string;
  name: string;
  department: string;
  level: string;
  minExperienceYears: number;
}

export interface Location {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  pinCode: string;
  managerName: string;
  contactNumber: string;
  employeeCount: number;
}

export interface AppNotification {
  id: string;
  userId: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: 'LEAVE' | 'ATTENDANCE' | 'PAYROLL' | 'ANNOUNCEMENT' | 'BIRTHDAY' | 'DOC';
}

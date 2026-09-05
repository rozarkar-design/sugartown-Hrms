import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User,
  UserRole,
  Employee,
  AttendanceRecord,
  AttendanceRegularizationRequest,
  LeaveBalance,
  LeaveRequest,
  Holiday,
  Shift,
  DocumentItem,
  SalaryComponent,
  PayrollRun,
  Payslip,
  ReimbursementRequest,
  Announcement,
  HRPolicy,
  ResignationExit,
  LoanAdvance,
  AuditLogItem,
  Department,
  Designation,
  Location,
  AppNotification,
} from '../types';
import {
  INITIAL_EMPLOYEES,
  DEMO_USERS,
  INITIAL_DEPARTMENTS,
  INITIAL_DESIGNATIONS,
  INITIAL_LOCATIONS,
  INITIAL_SHIFTS,
  INITIAL_HOLIDAYS,
  INITIAL_SALARY_COMPONENTS,
  INITIAL_LEAVE_BALANCES,
  INITIAL_LEAVE_REQUESTS,
  INITIAL_REGULARIZATIONS,
  INITIAL_ATTENDANCE,
  INITIAL_PAYROLL_RUNS,
  INITIAL_PAYSLIPS,
  INITIAL_DOCUMENTS,
  INITIAL_ANNOUNCEMENTS,
  INITIAL_POLICIES,
  INITIAL_REIMBURSEMENTS,
  INITIAL_LOANS,
  INITIAL_RESIGNATIONS,
  INITIAL_AUDIT_LOGS,
  INITIAL_NOTIFICATIONS,
} from '../data/seedData';
import { numberToIndianWords } from '../utils/formatters';

interface Toast {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}

interface HRMSContextType {
  currentUser: User;
  setCurrentUser: (user: User) => void;
  switchRole: (role: UserRole) => void;
  isAuthenticated: boolean;
  login: (emailOrId: string, password: string) => boolean;
  logout: () => void;

  // Employees
  employees: Employee[];
  addEmployee: (empData: Partial<Employee>) => string;
  updateEmployee: (id: string, empData: Partial<Employee>) => void;
  deleteEmployee: (id: string) => void;
  selectedEmployee: Employee | null;
  setSelectedEmployee: (emp: Employee | null) => void;

  // Attendance
  attendanceRecords: AttendanceRecord[];
  todayEmployeeRecord: AttendanceRecord | undefined;
  checkIn: () => void;
  checkOut: () => void;
  recordManualAttendance: (record: Partial<AttendanceRecord>) => void;
  regularizations: AttendanceRegularizationRequest[];
  submitRegularization: (req: Partial<AttendanceRegularizationRequest>) => void;
  updateRegularizationStatus: (id: string, status: 'Approved' | 'Rejected', remarks?: string) => void;

  // Leaves
  leaveRequests: LeaveRequest[];
  leaveBalances: Record<string, LeaveBalance>;
  applyLeave: (req: Partial<LeaveRequest>) => void;
  updateLeaveStatus: (id: string, status: 'Approved' | 'Rejected', comments?: string) => void;

  // Masters
  departments: Department[];
  designations: Designation[];
  locations: Location[];
  shifts: Shift[];
  holidays: Holiday[];
  addHoliday: (h: Partial<Holiday>) => void;

  // Payroll
  payrollRuns: PayrollRun[];
  payslips: Payslip[];
  salaryComponents: SalaryComponent[];
  processPayrollRun: (monthKey: string) => void;
  updatePayrollStatus: (id: string, status: PayrollRun['status']) => void;
  lockPayrollRun: (id: string) => void;

  // Reimbursements
  reimbursements: ReimbursementRequest[];
  submitReimbursement: (req: Partial<ReimbursementRequest>) => void;
  updateReimbursementStatus: (id: string, status: 'Approved' | 'Rejected', remarks?: string) => void;

  // Documents
  documents: DocumentItem[];
  uploadDocument: (doc: Partial<DocumentItem>) => void;
  updateDocumentStatus: (id: string, status: DocumentItem['status'], notes?: string) => void;

  // Announcements & Policies
  announcements: Announcement[];
  addAnnouncement: (anc: Partial<Announcement>) => void;
  policies: HRPolicy[];
  acknowledgePolicy: (id: string) => void;

  // Loans & Exits
  loans: LoanAdvance[];
  resignations: ResignationExit[];
  submitResignation: (res: Partial<ResignationExit>) => void;
  updateResignationStatus: (id: string, status: ResignationExit['status'], fnfAmount?: number) => void;

  // Notifications & Audit
  notifications: AppNotification[];
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  auditLogs: AuditLogItem[];
  addAuditLog: (action: string, module: string, prev?: string, updated?: string) => void;

  // UI state
  toasts: Toast[];
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  isGlobalSearchOpen: boolean;
  setIsGlobalSearchOpen: (open: boolean) => void;
}

const HRMSContext = createContext<HRMSContextType | undefined>(undefined);

export const HRMSProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load from localStorage or defaults
  const [currentUser, setCurrentUserState] = useState<User>(() => {
    const saved = localStorage.getItem('st_hrms_user');
    return saved ? JSON.parse(saved) : DEMO_USERS[0]; // Default to Super Admin for instant exploration
  });

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('st_hrms_auth') !== 'false';
  });

  const [employees, setEmployees] = useState<Employee[]>(() => {
    const saved = localStorage.getItem('st_hrms_employees');
    return saved ? JSON.parse(saved) : INITIAL_EMPLOYEES;
  });

  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>(() => {
    const saved = localStorage.getItem('st_hrms_attendance');
    return saved ? JSON.parse(saved) : INITIAL_ATTENDANCE;
  });

  const [regularizations, setRegularizations] = useState<AttendanceRegularizationRequest[]>(() => {
    const saved = localStorage.getItem('st_hrms_regularizations');
    return saved ? JSON.parse(saved) : INITIAL_REGULARIZATIONS;
  });

  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>(() => {
    const saved = localStorage.getItem('st_hrms_leave_requests');
    return saved ? JSON.parse(saved) : INITIAL_LEAVE_REQUESTS;
  });

  const [leaveBalances, setLeaveBalances] = useState<Record<string, LeaveBalance>>(() => {
    const saved = localStorage.getItem('st_hrms_leave_balances');
    return saved ? JSON.parse(saved) : INITIAL_LEAVE_BALANCES;
  });

  const [payrollRuns, setPayrollRuns] = useState<PayrollRun[]>(() => {
    const saved = localStorage.getItem('st_hrms_payroll_runs');
    return saved ? JSON.parse(saved) : INITIAL_PAYROLL_RUNS;
  });

  const [payslips, setPayslips] = useState<Payslip[]>(() => {
    const saved = localStorage.getItem('st_hrms_payslips');
    return saved ? JSON.parse(saved) : INITIAL_PAYSLIPS;
  });

  const [salaryComponents] = useState<SalaryComponent[]>(INITIAL_SALARY_COMPONENTS);
  const [departments, setDepartments] = useState<Department[]>(INITIAL_DEPARTMENTS);
  const [designations] = useState<Designation[]>(INITIAL_DESIGNATIONS);
  const [locations] = useState<Location[]>(INITIAL_LOCATIONS);
  const [shifts] = useState<Shift[]>(INITIAL_SHIFTS);
  const [holidays, setHolidays] = useState<Holiday[]>(INITIAL_HOLIDAYS);
  const [reimbursements, setReimbursements] = useState<ReimbursementRequest[]>(INITIAL_REIMBURSEMENTS);
  const [documents, setDocuments] = useState<DocumentItem[]>(INITIAL_DOCUMENTS);
  const [announcements, setAnnouncements] = useState<Announcement[]>(INITIAL_ANNOUNCEMENTS);
  const [policies, setPolicies] = useState<HRPolicy[]>(INITIAL_POLICIES);
  const [loans] = useState<LoanAdvance[]>(INITIAL_LOANS);
  const [resignations, setResignations] = useState<ResignationExit[]>(INITIAL_RESIGNATIONS);
  const [auditLogs, setAuditLogs] = useState<AuditLogItem[]>(INITIAL_AUDIT_LOGS);
  const [notifications, setNotifications] = useState<AppNotification[]>(INITIAL_NOTIFICATIONS);

  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [isGlobalSearchOpen, setIsGlobalSearchOpen] = useState<boolean>(false);
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('st_hrms_user', JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('st_hrms_employees', JSON.stringify(employees));
  }, [employees]);

  useEffect(() => {
    localStorage.setItem('st_hrms_attendance', JSON.stringify(attendanceRecords));
  }, [attendanceRecords]);

  useEffect(() => {
    localStorage.setItem('st_hrms_leave_requests', JSON.stringify(leaveRequests));
  }, [leaveRequests]);

  useEffect(() => {
    localStorage.setItem('st_hrms_payroll_runs', JSON.stringify(payrollRuns));
  }, [payrollRuns]);

  useEffect(() => {
    localStorage.setItem('st_hrms_payslips', JSON.stringify(payslips));
  }, [payslips]);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const addAuditLog = (action: string, module: string, prev?: string, updated?: string) => {
    const newLog: AuditLogItem = {
      id: `aud-${Date.now()}`,
      userName: currentUser.name,
      userRole: currentUser.role,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      ipAddress: '103.21.144.92',
      action,
      module,
      previousValue: prev,
      updatedValue: updated || 'Executed',
    };
    setAuditLogs((prev) => [newLog, ...prev]);
  };

  const switchRole = (role: UserRole) => {
    const targetUser = DEMO_USERS.find((u) => u.role === role) || DEMO_USERS[0];
    setCurrentUserState(targetUser);
    setIsAuthenticated(true);
    localStorage.setItem('st_hrms_auth', 'true');
    showToast(`Switched view to ${role.replace('_', ' ')} (${targetUser.name})`, 'info');
    addAuditLog('ROLE_SWITCH', 'AUTHENTICATION', currentUser.role, role);
  };

  const login = (identifier: string, passwordInput: string): boolean => {
    const trimmedInput = identifier.trim();
    const cleanPhone = trimmedInput.replace(/[\s\-\(\)\+]/g, '');
    const isTargetAdminMobile =
      cleanPhone === '9145448010' ||
      cleanPhone === '919145448010' ||
      cleanPhone === '09145448010';

    const isTargetAdminEmailOrId =
      trimmedInput.toLowerCase() === 'admin@sugartown.in' ||
      trimmedInput.toUpperCase() === 'ST-1001';

    // Strictly Super Admin Login Only
    if (isTargetAdminMobile || isTargetAdminEmailOrId) {
      if (passwordInput === 'Chikoo@0205') {
        const adminUser = DEMO_USERS[0]; // Super Admin Vikramaditya Singhania
        setCurrentUserState(adminUser);
        setIsAuthenticated(true);
        localStorage.setItem('st_hrms_auth', 'true');
        showToast(`Welcome back, ${adminUser.name}!`, 'success');
        addAuditLog('ADMIN_LOGIN', 'AUTHENTICATION', undefined, `Super Admin authenticated`);
        return true;
      } else {
        showToast('Invalid credentials. Please verify your password and try again.', 'error');
        return false;
      }
    }

    showToast('Access restricted. Only Super Administrator can log in.', 'error');
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.setItem('st_hrms_auth', 'false');
    showToast('You have been logged out securely.', 'info');
    addAuditLog('USER_LOGOUT', 'AUTHENTICATION', currentUser.role, 'Session terminated');
  };

  // Employees CRUD
  const addEmployee = (empData: Partial<Employee>): string => {
    const nextIdNum = employees.length + 1001;
    const newId = `ST-${nextIdNum}`;
    const newEmp: Employee = {
      id: `emp-${Date.now()}`,
      employeeId: newId,
      fullName: empData.fullName || 'New Employee',
      photoUrl: empData.photoUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      gender: empData.gender || 'Male',
      dob: empData.dob || '1998-01-01',
      mobile: empData.mobile || '+91 98000 00000',
      personalEmail: empData.personalEmail || `${empData.fullName?.toLowerCase().replace(/\s+/g, '')}@gmail.com`,
      officialEmail: empData.officialEmail || `${newId.toLowerCase()}@sugartown.in`,
      bloodGroup: empData.bloodGroup || 'O+',
      maritalStatus: empData.maritalStatus || 'Single',
      nationality: 'Indian',
      currentAddress: empData.currentAddress || 'Mumbai, Maharashtra',
      permanentAddress: empData.permanentAddress || 'Mumbai, Maharashtra',
      city: empData.city || 'Mumbai',
      state: empData.state || 'Maharashtra',
      pinCode: empData.pinCode || '400001',
      country: 'India',
      department: empData.department || 'Retail & Store Operations',
      designation: empData.designation || 'Retail Sales Associate',
      reportingManagerId: empData.reportingManagerId || 'emp-4',
      reportingManagerName: empData.reportingManagerName || 'Amit Verma',
      employmentType: empData.employmentType || 'Full-Time',
      dateOfJoining: empData.dateOfJoining || new Date().toISOString().split('T')[0],
      probationPeriodMonths: empData.probationPeriodMonths || 3,
      confirmationDate: empData.confirmationDate || '2026-12-01',
      workLocation: empData.workLocation || 'Sugartown Flagship Store & HQ',
      shiftId: empData.shiftId || 'shift-1',
      status: 'Active',
      bankName: empData.bankName || 'HDFC Bank Ltd',
      accountHolderName: empData.accountHolderName || empData.fullName || 'Employee',
      accountNumber: empData.accountNumber || '50100987654321',
      ifscCode: empData.ifscCode || 'HDFC0000060',
      branch: empData.branch || 'Mumbai Main',
      panNumber: empData.panNumber || 'ABCDE1234F',
      aadhaarNumber: empData.aadhaarNumber || '123456789012',
      uan: empData.uan || '100481920999',
      pfNumber: empData.pfNumber || `MH/BAN/0049281/000/${newId}`,
      esicNumber: empData.esicNumber || 'Exempt (>21k)',
      annualCTC: empData.annualCTC || 480000,
      monthlyCTC: empData.monthlyCTC || 40000,
      basicSalary: empData.basicSalary || 20000,
      hra: empData.hra || 10000,
      conveyance: empData.conveyance || 1600,
      specialAllowance: empData.specialAllowance || 6900,
      medicalAllowance: empData.medicalAllowance || 1500,
    };

    setEmployees((prev) => [newEmp, ...prev]);
    // update department count
    setDepartments((prev) =>
      prev.map((d) => (d.name === newEmp.department ? { ...d, employeeCount: d.employeeCount + 1 } : d))
    );

    addAuditLog('CREATE_EMPLOYEE', 'EMPLOYEE_MANAGEMENT', undefined, `Added ${newEmp.fullName} (${newEmp.employeeId})`);
    showToast(`Employee ${newEmp.fullName} onboarded successfully! Generated ID: ${newId}`, 'success');
    return newId;
  };

  const updateEmployee = (id: string, empData: Partial<Employee>) => {
    setEmployees((prev) =>
      prev.map((emp) => {
        if (emp.id === id) {
          const updated = { ...emp, ...empData };
          addAuditLog('UPDATE_EMPLOYEE', 'EMPLOYEE_MANAGEMENT', emp.fullName, `Updated fields for ${emp.employeeId}`);
          return updated;
        }
        return emp;
      })
    );
    showToast('Employee profile updated successfully', 'success');
  };

  const deleteEmployee = (id: string) => {
    const target = employees.find((e) => e.id === id);
    if (!target) return;
    setEmployees((prev) => prev.filter((e) => e.id !== id));
    addAuditLog('DELETE_EMPLOYEE', 'EMPLOYEE_MANAGEMENT', target.fullName, `Terminated/Deleted ${target.employeeId}`);
    showToast(`Employee ${target.fullName} deleted`, 'info');
  };

  // Today attendance for active employee
  const todayDate = new Date().toISOString().split('T')[0];
  const todayEmployeeRecord = attendanceRecords.find(
    (a) => a.employeeId === currentUser.employeeId && a.date === todayDate
  );

  const checkIn = () => {
    const now = new Date();
    const timeStr = now.toTimeString().split(' ')[0]; // HH:mm:ss

    if (todayEmployeeRecord) {
      showToast('You are already checked in for today!', 'info');
      return;
    }

    const newRecord: AttendanceRecord = {
      id: `att-${Date.now()}`,
      employeeId: currentUser.employeeId,
      employeeName: currentUser.name,
      department: currentUser.department,
      date: todayDate,
      shift: 'General Shift (09:30 - 18:30)',
      checkIn: timeStr,
      workingHours: 0.1,
      status: 'Present',
      lateByMinutes: 0,
      earlyExitMinutes: 0,
      overtimeHours: 0,
      location: 'Sugartown Store & HQ',
      ipAddress: '103.21.144.92',
      remarks: 'Self check-in via web portal',
    };

    setAttendanceRecords((prev) => [newRecord, ...prev]);
    addAuditLog('CHECK_IN', 'ATTENDANCE', undefined, `${currentUser.name} checked in at ${timeStr}`);
    showToast(`Checked in successfully at ${timeStr}`, 'success');
  };

  const checkOut = () => {
    const now = new Date();
    const timeStr = now.toTimeString().split(' ')[0];

    if (!todayEmployeeRecord) {
      showToast('Please check in first before checking out!', 'error');
      return;
    }

    if (todayEmployeeRecord.checkOut) {
      showToast('You have already checked out for today.', 'info');
      return;
    }

    setAttendanceRecords((prev) =>
      prev.map((rec) => {
        if (rec.id === todayEmployeeRecord.id) {
          return {
            ...rec,
            checkOut: timeStr,
            workingHours: 8.5,
            remarks: 'Day shift completed successfully',
          };
        }
        return rec;
      })
    );

    addAuditLog('CHECK_OUT', 'ATTENDANCE', undefined, `${currentUser.name} checked out at ${timeStr}`);
    showToast(`Checked out successfully at ${timeStr}. Great job today!`, 'success');
  };

  const recordManualAttendance = (recordData: Partial<AttendanceRecord>) => {
    const newRecord: AttendanceRecord = {
      id: `att-${Date.now()}`,
      employeeId: recordData.employeeId || 'ST-1007',
      employeeName: recordData.employeeName || 'Rohit Sen',
      department: recordData.department || 'Retail & Store Operations',
      date: recordData.date || todayDate,
      shift: recordData.shift || 'General Shift',
      checkIn: recordData.checkIn || '09:30:00',
      checkOut: recordData.checkOut || '18:30:00',
      workingHours: recordData.workingHours || 8,
      status: recordData.status || 'Present',
      lateByMinutes: recordData.lateByMinutes || 0,
      earlyExitMinutes: recordData.earlyExitMinutes || 0,
      overtimeHours: recordData.overtimeHours || 0,
      location: recordData.location || 'Manual Entry',
      remarks: recordData.remarks || 'Added by Admin',
      isManual: true,
    };

    setAttendanceRecords((prev) => [
      newRecord,
      ...prev.filter((a) => !(a.employeeId === newRecord.employeeId && a.date === newRecord.date)),
    ]);
    addAuditLog('MANUAL_ATTENDANCE', 'ATTENDANCE', undefined, `Marked ${newRecord.status} for ${newRecord.employeeName}`);
    showToast(`Attendance recorded manually for ${newRecord.employeeName}`, 'success');
  };

  const submitRegularization = (req: Partial<AttendanceRegularizationRequest>) => {
    const newReq: AttendanceRegularizationRequest = {
      id: `reg-${Date.now()}`,
      employeeId: currentUser.employeeId,
      employeeName: currentUser.name,
      date: req.date || todayDate,
      existingCheckIn: req.existingCheckIn,
      existingCheckOut: req.existingCheckOut,
      requestedCheckIn: req.requestedCheckIn || '09:30:00',
      requestedCheckOut: req.requestedCheckOut || '18:30:00',
      reason: req.reason || 'Biometric discrepancy',
      remarks: req.remarks,
      status: 'Pending',
      createdAt: todayDate,
    };

    setRegularizations((prev) => [newReq, ...prev]);
    addAuditLog('REGULARIZATION_SUBMIT', 'ATTENDANCE', undefined, `Submitted by ${currentUser.name} for ${newReq.date}`);
    showToast('Attendance regularization request submitted to Manager/HR', 'success');
  };

  const updateRegularizationStatus = (id: string, status: 'Approved' | 'Rejected', remarks?: string) => {
    setRegularizations((prev) =>
      prev.map((r) => {
        if (r.id === id) {
          // If approved, also correct the attendance record
          if (status === 'Approved') {
            recordManualAttendance({
              employeeId: r.employeeId,
              employeeName: r.employeeName,
              date: r.date,
              checkIn: r.requestedCheckIn,
              checkOut: r.requestedCheckOut,
              workingHours: 8.5,
              status: 'Present',
              remarks: `Regularized: ${r.reason}`,
            });
          }
          return { ...r, status, approverRemarks: remarks };
        }
        return r;
      })
    );

    addAuditLog('REGULARIZATION_STATUS_UPDATE', 'ATTENDANCE', 'Pending', status);
    showToast(`Attendance regularization request marked as ${status}`, 'success');
  };

  // Leaves
  const applyLeave = (reqData: Partial<LeaveRequest>) => {
    const newReq: LeaveRequest = {
      id: `lr-${Date.now()}`,
      employeeId: currentUser.employeeId,
      employeeName: currentUser.name,
      department: currentUser.department,
      leaveType: reqData.leaveType || 'Casual Leave',
      fromDate: reqData.fromDate || todayDate,
      toDate: reqData.toDate || todayDate,
      isHalfDay: reqData.isHalfDay || false,
      halfDayType: reqData.halfDayType,
      numberOfDays: reqData.numberOfDays || 1,
      reason: reqData.reason || 'Personal work',
      contactDuringLeave: reqData.contactDuringLeave || '+91 98000 00000',
      status: 'Pending',
      appliedDate: todayDate,
    };

    setLeaveRequests((prev) => [newReq, ...prev]);
    addAuditLog('LEAVE_APPLY', 'LEAVES', undefined, `Applied ${newReq.leaveType} (${newReq.numberOfDays} days)`);
    showToast('Leave application submitted successfully for Manager approval', 'success');
  };

  const updateLeaveStatus = (id: string, status: 'Approved' | 'Rejected', comments?: string) => {
    const target = leaveRequests.find((l) => l.id === id);
    if (!target) return;

    setLeaveRequests((prev) =>
      prev.map((l) => (l.id === id ? { ...l, status, approverComments: comments } : l))
    );

    // If approved, deduct leave balance
    if (status === 'Approved' && leaveBalances[target.employeeId]) {
      setLeaveBalances((prev) => {
        const userBal = { ...prev[target.employeeId] };
        if (target.leaveType === 'Casual Leave') userBal.casualLeave.used += target.numberOfDays;
        else if (target.leaveType === 'Sick Leave') userBal.sickLeave.used += target.numberOfDays;
        else if (target.leaveType === 'Earned Leave') userBal.earnedLeave.used += target.numberOfDays;
        else if (target.leaveType === 'Comp Off') userBal.compOff.used += target.numberOfDays;
        else if (target.leaveType === 'Work From Home') userBal.workFromHome.used += target.numberOfDays;
        return { ...prev, [target.employeeId]: userBal };
      });
    }

    addAuditLog('LEAVE_DECISION', 'LEAVES', target.status, `${status} for ${target.employeeName}`);
    showToast(`Leave request from ${target.employeeName} marked as ${status}`, 'success');
  };

  // Holidays
  const addHoliday = (h: Partial<Holiday>) => {
    const newHol: Holiday = {
      id: `hol-${Date.now()}`,
      name: h.name || 'New Holiday',
      date: h.date || todayDate,
      day: h.day || 'Monday',
      location: h.location || 'All',
      type: h.type || 'Mandatory',
      description: h.description || '',
    };
    setHolidays((prev) => [...prev, newHol]);
    showToast(`Holiday ${newHol.name} added to company calendar`, 'success');
  };

  // Payroll calculation & processing
  const processPayrollRun = (monthKey: string) => {
    // Generate payslips for all active employees for this month
    const newPayslips: Payslip[] = employees
      .filter((e) => e.status === 'Active' || e.status === 'Probation' || e.status === 'Notice Period')
      .map((emp) => {
        const basic = emp.basicSalary;
        const hra = emp.hra;
        const conv = emp.conveyance;
        const spec = emp.specialAllowance;
        const med = emp.medicalAllowance;
        const incentives = 1000;
        const bonus = 0;
        const grossEarnings = basic + hra + conv + spec + med + incentives + bonus;

        // Indian statutory deductions
        const epf = Math.round(basic * 0.12);
        const esic = grossEarnings <= 21000 ? Math.round(grossEarnings * 0.0075) : 0;
        const pt = 200; // Maharashtra PT standard ₹200
        const tds = grossEarnings > 50000 ? 1000 : 300;
        const loanEmi = 0;
        const advance = 0;
        const totalDeductions = epf + esic + pt + tds + loanEmi + advance;
        const netPay = grossEarnings - totalDeductions;

        return {
          id: `ps-${emp.employeeId}-${monthKey}`,
          payslipNumber: `ST/PAY/${monthKey}/${emp.employeeId.replace('ST-', '')}`,
          month: 'September 2026',
          monthKey,
          employeeId: emp.employeeId,
          employeeName: emp.fullName,
          designation: emp.designation,
          department: emp.department,
          dateOfJoining: emp.dateOfJoining,
          workLocation: emp.workLocation,
          panNumber: emp.panNumber,
          uan: emp.uan,
          bankName: emp.bankName,
          maskedAccountNumber: `•••• •••• ${emp.accountNumber.slice(-4)}`,
          paidDays: 30,
          leaveWithoutPay: 0,
          absentDays: 0,
          earnings: {
            basicSalary: basic,
            hra,
            conveyance: conv,
            specialAllowance: spec,
            medicalAllowance: med,
            incentives,
            bonus,
            overtime: 0,
            reimbursements: 0,
            totalEarnings: grossEarnings,
          },
          deductions: {
            employeePf: epf,
            esic,
            professionalTax: pt,
            tds,
            loanEmi,
            advanceDeduction: advance,
            lossOfPay: 0,
            totalDeductions,
          },
          netPay,
          netPayInWords: numberToIndianWords(netPay),
          generatedDate: todayDate,
          status: 'Generated',
        };
      });

    const totalGross = newPayslips.reduce((acc, p) => acc + p.earnings.totalEarnings, 0);
    const totalDeds = newPayslips.reduce((acc, p) => acc + p.deductions.totalDeductions, 0);
    const totalNet = totalGross - totalDeds;

    const updatedRun: PayrollRun = {
      id: `pr-${monthKey}`,
      month: 'September 2026',
      monthKey,
      totalEmployees: newPayslips.length,
      payrollCost: totalGross,
      grossSalary: totalGross,
      totalDeductions: totalDeds,
      netSalary: totalNet,
      status: 'Processed',
      processedDate: todayDate,
    };

    setPayrollRuns((prev) => [updatedRun, ...prev.filter((p) => p.monthKey !== monthKey)]);
    setPayslips((prev) => [
      ...newPayslips,
      ...prev.filter((ps) => ps.monthKey !== monthKey),
    ]);

    addAuditLog('PROCESS_PAYROLL', 'PAYROLL', 'Draft', `Processed payroll for ${monthKey} (${newPayslips.length} employees)`);
    showToast(`September 2026 payroll successfully calculated and processed!`, 'success');
  };

  const updatePayrollStatus = (id: string, status: PayrollRun['status']) => {
    setPayrollRuns((prev) =>
      prev.map((run) => (run.id === id ? { ...run, status } : run))
    );
    addAuditLog('UPDATE_PAYROLL_STATUS', 'PAYROLL', undefined, `Run ${id} set to ${status}`);
    showToast(`Payroll status updated to ${status}`, 'info');
  };

  const lockPayrollRun = (id: string) => {
    if (currentUser.role !== 'SUPER_ADMIN') {
      showToast('Only Super Admin is authorized to lock/unlock finalized payroll periods.', 'error');
      return;
    }
    setPayrollRuns((prev) =>
      prev.map((run) =>
        run.id === id
          ? {
              ...run,
              status: 'Locked',
              lockedDate: todayDate,
              lockedBy: `${currentUser.name} (Super Admin)`,
            }
          : run
      )
    );
    addAuditLog('LOCK_PAYROLL', 'PAYROLL', 'Processed', `Locked by ${currentUser.name}`);
    showToast(`Payroll period locked successfully with Super Admin authorization`, 'success');
  };

  // Reimbursements
  const submitReimbursement = (reqData: Partial<ReimbursementRequest>) => {
    const newReq: ReimbursementRequest = {
      id: `rem-${Date.now()}`,
      employeeId: currentUser.employeeId,
      employeeName: currentUser.name,
      expenseDate: reqData.expenseDate || todayDate,
      category: reqData.category || 'Travel',
      amount: reqData.amount || 0,
      description: reqData.description || '',
      receiptName: reqData.receiptName || 'Receipt_Doc.pdf',
      status: 'Pending',
      submittedDate: todayDate,
    };
    setReimbursements((prev) => [newReq, ...prev]);
    addAuditLog('SUBMIT_REIMBURSEMENT', 'REIMBURSEMENTS', undefined, `Submitted ₹${newReq.amount} for ${newReq.category}`);
    showToast('Reimbursement claim submitted for Manager/Finance approval', 'success');
  };

  const updateReimbursementStatus = (id: string, status: 'Approved' | 'Rejected', remarks?: string) => {
    setReimbursements((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status, approverRemarks: remarks } : r))
    );
    addAuditLog('REIMBURSEMENT_DECISION', 'REIMBURSEMENTS', 'Pending', status);
    showToast(`Reimbursement claim marked as ${status}`, 'success');
  };

  // Documents
  const uploadDocument = (docData: Partial<DocumentItem>) => {
    const newDoc: DocumentItem = {
      id: `doc-${Date.now()}`,
      employeeId: docData.employeeId || currentUser.employeeId,
      employeeName: docData.employeeName || currentUser.name,
      documentType: docData.documentType || 'Other HR Document',
      fileName: docData.fileName || 'Uploaded_Document.pdf',
      fileSize: docData.fileSize || '1.2 MB',
      uploadDate: todayDate,
      status: 'Pending',
      notes: docData.notes || 'Uploaded via portal',
    };
    setDocuments((prev) => [newDoc, ...prev]);
    addAuditLog('UPLOAD_DOCUMENT', 'DOCUMENTS', undefined, `Uploaded ${newDoc.fileName} for ${newDoc.employeeName}`);
    showToast(`Document "${newDoc.fileName}" uploaded successfully`, 'success');
  };

  const updateDocumentStatus = (id: string, status: DocumentItem['status'], notes?: string) => {
    setDocuments((prev) =>
      prev.map((d) => (d.id === id ? { ...d, status, notes: notes || d.notes } : d))
    );
    addAuditLog('DOCUMENT_STATUS_UPDATE', 'DOCUMENTS', undefined, `Doc ${id} set to ${status}`);
    showToast(`Document status changed to ${status}`, 'success');
  };

  // Announcements
  const addAnnouncement = (ancData: Partial<Announcement>) => {
    const newAnc: Announcement = {
      id: `anc-${Date.now()}`,
      title: ancData.title || 'New Announcement',
      content: ancData.content || '',
      category: ancData.category || 'Company Update',
      publishedDate: todayDate,
      expiryDate: ancData.expiryDate || '2026-12-31',
      targetDepartment: ancData.targetDepartment || 'All',
      targetLocation: ancData.targetLocation || 'All',
      priority: ancData.priority || 'Normal',
      author: `${currentUser.name} (${currentUser.role.replace('_', ' ')})`,
    };
    setAnnouncements((prev) => [newAnc, ...prev]);
    addAuditLog('CREATE_ANNOUNCEMENT', 'ANNOUNCEMENTS', undefined, newAnc.title);
    showToast('Company announcement published successfully', 'success');
  };

  // Policies
  const acknowledgePolicy = (id: string) => {
    setPolicies((prev) =>
      prev.map((p) => (p.id === id ? { ...p, acknowledged: true } : p))
    );
    showToast('Policy acknowledged and registered in compliance log', 'success');
  };

  // Exits
  const submitResignation = (resData: Partial<ResignationExit>) => {
    const newRes: ResignationExit = {
      id: `res-${Date.now()}`,
      employeeId: currentUser.employeeId,
      employeeName: currentUser.name,
      department: currentUser.department,
      resignationDate: todayDate,
      proposedLastWorkingDate: resData.proposedLastWorkingDate || '2026-10-04',
      actualLastWorkingDate: resData.actualLastWorkingDate || '2026-10-04',
      noticePeriodDays: 30,
      reason: resData.reason || 'Personal reasons',
      status: 'Submitted',
      assetReturnStatus: 'Pending',
      exitInterviewCompleted: false,
      fnfSettlementAmount: 0,
      relievingLetterIssued: false,
    };
    setResignations((prev) => [newRes, ...prev]);
    addAuditLog('RESIGNATION_SUBMIT', 'EXIT_MANAGEMENT', undefined, `Resignation by ${currentUser.name}`);
    showToast('Resignation letter submitted for Manager and HR clearance', 'info');
  };

  const updateResignationStatus = (id: string, status: ResignationExit['status'], fnfAmount?: number) => {
    setResignations((prev) =>
      prev.map((r) =>
        r.id === id
          ? {
              ...r,
              status,
              fnfSettlementAmount: fnfAmount !== undefined ? fnfAmount : r.fnfSettlementAmount,
              relievingLetterIssued: status === 'Relieved' ? true : r.relievingLetterIssued,
            }
          : r
      )
    );
    addAuditLog('RESIGNATION_STATUS', 'EXIT_MANAGEMENT', undefined, `Status: ${status}`);
    showToast(`Exit workflow updated to: ${status}`, 'success');
  };

  // Notifications
  const markNotificationRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    showToast('All notifications marked as read', 'info');
  };

  return (
    <HRMSContext.Provider
      value={{
        currentUser,
        setCurrentUser: setCurrentUserState,
        switchRole,
        isAuthenticated,
        login,
        logout,
        employees,
        addEmployee,
        updateEmployee,
        deleteEmployee,
        selectedEmployee,
        setSelectedEmployee,
        attendanceRecords,
        todayEmployeeRecord,
        checkIn,
        checkOut,
        recordManualAttendance,
        regularizations,
        submitRegularization,
        updateRegularizationStatus,
        leaveRequests,
        leaveBalances,
        applyLeave,
        updateLeaveStatus,
        departments,
        designations,
        locations,
        shifts,
        holidays,
        addHoliday,
        payrollRuns,
        payslips,
        salaryComponents,
        processPayrollRun,
        updatePayrollStatus,
        lockPayrollRun,
        reimbursements,
        submitReimbursement,
        updateReimbursementStatus,
        documents,
        uploadDocument,
        updateDocumentStatus,
        announcements,
        addAnnouncement,
        policies,
        acknowledgePolicy,
        loans,
        resignations,
        submitResignation,
        updateResignationStatus,
        notifications,
        markNotificationRead,
        markAllNotificationsRead,
        auditLogs,
        addAuditLog,
        toasts,
        showToast,
        isGlobalSearchOpen,
        setIsGlobalSearchOpen,
      }}
    >
      {children}
    </HRMSContext.Provider>
  );
};

export const useHRMS = () => {
  const context = useContext(HRMSContext);
  if (!context) {
    throw new Error('useHRMS must be used within an HRMSProvider');
  }
  return context;
};

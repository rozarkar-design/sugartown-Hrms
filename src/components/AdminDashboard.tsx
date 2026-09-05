import React from 'react';
import {
  Users,
  Clock,
  CalendarCheck,
  CreditCard,
  Plus,
  FileSpreadsheet,
  Gift,
  Award,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  UserCheck,
} from 'lucide-react';
import { useHRMS } from '../context/HRMSContext';
import { formatINR, formatDate } from '../utils/formatters';

interface AdminDashboardProps {
  onNavigate: (tabId: string) => void;
  onOpenAddEmployee?: () => void;
  onViewPayslip?: (payslip: any) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  onNavigate,
  onOpenAddEmployee,
}) => {
  const {
    currentUser,
    employees,
    attendanceRecords,
    leaveRequests,
    regularizations,
    reimbursements,
    payrollRuns,
    updateLeaveStatus,
    updateRegularizationStatus,
    updateReimbursementStatus,
  } = useHRMS();

  // Metrics calculations
  const totalEmployees = employees.length;
  const presentToday = attendanceRecords.filter((a) => a.status === 'Present' || a.status === 'Late').length;
  const attendanceRate = totalEmployees > 0 ? Math.round((presentToday / totalEmployees) * 100) : 91;

  const latestPayroll = payrollRuns[0] || {
    grossSalary: 1395000,
    netSalary: 1265000,
    totalEmployees: 21,
    status: 'Drafting',
  };

  const pendingLeaves = leaveRequests.filter((l) => l.status === 'Pending');
  const pendingRegularizations = regularizations.filter((r) => r.status === 'Pending');
  const pendingReimbursements = reimbursements.filter((r) => r.status === 'Pending');

  // Celebrations
  const upcomingEvents = [
    { name: 'Kavita Iyer', date: 'Tomorrow, Sep 6', type: 'Birthday', department: 'HR & Talent' },
    { name: 'Rohit Sen', date: 'Sep 10', type: 'Work Anniversary (2 Yrs)', department: 'Retail Store' },
    { name: 'Sameer Joshi', date: 'Sep 14', type: 'Birthday', department: 'Supply Chain' },
  ];

  // Recent attendance records
  const recentAttendance = attendanceRecords.slice(0, 5).map((rec) => {
    const emp = employees.find((e) => e.employeeId === rec.employeeId);
    return {
      ...rec,
      name: rec.employeeName || emp?.fullName || 'Employee',
      avatarUrl: emp?.photoUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      designation: emp?.designation || 'Staff',
      shift: emp?.shiftTiming || 'Morning (9:30 AM - 6:30 PM)',
    };
  });

  return (
    <div className="space-y-8 pb-12">
      {/* 1. Dashboard Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Dashboard Overview</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Welcome back, {currentUser.name}. Here's what's happening today at Sugartown Retail.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            id="admin-export-report-btn"
            onClick={() => onNavigate('reports')}
            className="bg-white border border-slate-200 text-slate-700 text-sm font-semibold px-4 py-2 rounded-lg shadow-sm hover:bg-slate-50 flex items-center gap-2 transition-colors cursor-pointer"
          >
            <FileSpreadsheet className="w-4 h-4 text-slate-500" />
            <span>Export Report</span>
          </button>
          <button
            id="admin-add-employee-btn"
            onClick={() => (onOpenAddEmployee ? onOpenAddEmployee() : onNavigate('employees'))}
            className="bg-orange-600 hover:bg-orange-700 text-white text-sm font-semibold px-4 py-2 rounded-lg shadow-sm flex items-center gap-2 transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Employee</span>
          </button>
        </div>
      </div>

      {/* 2. Top Metric Cards - Professional Polish Design */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Total Employees */}
        <div
          onClick={() => onNavigate('employees')}
          className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:border-slate-300 transition-all cursor-pointer"
        >
          <div className="flex justify-between items-start mb-3">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Employees</span>
            <span className="p-2 bg-slate-50 rounded-lg text-slate-600">
              <Users className="w-4 h-4 text-slate-600" />
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900">{totalEmployees}</span>
            <span className="text-xs font-semibold text-green-600 bg-green-50 px-1.5 py-0.5 rounded">
              +4 this month
            </span>
          </div>
        </div>

        {/* Present Today */}
        <div
          onClick={() => onNavigate('attendance')}
          className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:border-slate-300 transition-all cursor-pointer"
        >
          <div className="flex justify-between items-start mb-3">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Present Today</span>
            <span className="p-2 bg-slate-50 rounded-lg text-slate-600">
              <Clock className="w-4 h-4 text-slate-600" />
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900">{presentToday}</span>
            <span className="text-xs font-semibold text-slate-500">
              {attendanceRate}% attendance
            </span>
          </div>
        </div>

        {/* Leave Requests */}
        <div
          onClick={() => onNavigate('leaves')}
          className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:border-slate-300 transition-all cursor-pointer"
        >
          <div className="flex justify-between items-start mb-3">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Leave Requests</span>
            <span className="p-2 bg-slate-50 rounded-lg text-slate-600">
              <CalendarCheck className="w-4 h-4 text-slate-600" />
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900">
              {pendingLeaves.length < 10 ? `0${pendingLeaves.length}` : pendingLeaves.length}
            </span>
            <span className="text-xs font-semibold text-orange-600 bg-orange-50 px-1.5 py-0.5 rounded">
              Pending Approval
            </span>
          </div>
        </div>

        {/* Monthly Payroll */}
        <div
          onClick={() => onNavigate('payroll')}
          className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:border-slate-300 transition-all cursor-pointer"
        >
          <div className="flex justify-between items-start mb-3">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Monthly Payroll</span>
            <span className="p-2 bg-slate-50 rounded-lg text-slate-600">
              <CreditCard className="w-4 h-4 text-slate-600" />
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900">{formatINR(latestPayroll.netSalary)}</span>
            <span className="text-xs font-semibold text-slate-500">
              Drafting...
            </span>
          </div>
        </div>
      </div>

      {/* 3. Content Grid: Left 2 Cols, Right 1 Col */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column (span 2): Recent Attendance Activity Table & Approvals Queue */}
        <div className="lg:col-span-2 space-y-6">
          {/* Recent Attendance Activity Table */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex justify-between items-center">
              <div>
                <h2 className="font-bold text-slate-900 text-base">Recent Attendance Activity</h2>
                <p className="text-xs text-slate-400 mt-0.5">Live store & head office punch-in logs</p>
              </div>
              <button
                onClick={() => onNavigate('attendance')}
                className="text-xs font-bold text-orange-600 hover:text-orange-700 cursor-pointer"
              >
                View All
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-[10px] text-slate-400 uppercase font-bold tracking-tight border-b border-slate-100">
                    <th className="py-3 px-5">Employee</th>
                    <th className="py-3 px-5">Check In</th>
                    <th className="py-3 px-5">Status</th>
                    <th className="py-3 px-5">Shift</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {recentAttendance.map((row) => (
                    <tr key={row.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3.5 px-5 flex items-center gap-3">
                        <img
                          src={row.avatarUrl}
                          alt={row.name}
                          className="w-8 h-8 rounded-full bg-slate-100 object-cover ring-1 ring-slate-200"
                        />
                        <div>
                          <p className="font-medium text-slate-900 text-xs">{row.name}</p>
                          <p className="text-[11px] text-slate-400">{row.designation}</p>
                        </div>
                      </td>
                      <td className="py-3.5 px-5 text-xs text-slate-600 font-mono">
                        {row.checkIn || '09:28 AM'}
                      </td>
                      <td className="py-3.5 px-5">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                            row.status === 'Late'
                              ? 'bg-orange-50 text-orange-600'
                              : row.status === 'Leave'
                              ? 'bg-amber-50 text-amber-700'
                              : 'bg-green-50 text-green-700'
                          }`}
                        >
                          {row.status === 'Late' ? 'Late' : row.status === 'Leave' ? 'On Leave' : 'On Time'}
                        </span>
                      </td>
                      <td className="py-3.5 px-5 text-xs text-slate-500">
                        {row.shift}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pending Approvals Hub */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-orange-500"></span>
                <h3 className="font-bold text-slate-900 text-sm">Approvals Queue & Workflow</h3>
              </div>
              <span className="text-xs text-slate-400 font-medium">
                {pendingLeaves.length + pendingRegularizations.length + pendingReimbursements.length} pending items
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Leaves Queue */}
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                  <span className="flex items-center gap-1.5">
                    <CalendarCheck className="h-4 w-4 text-orange-600" />
                    <span>Leaves ({pendingLeaves.length})</span>
                  </span>
                  <button onClick={() => onNavigate('leaves')} className="text-orange-600 hover:underline font-semibold text-[11px]">
                    All
                  </button>
                </div>
                {pendingLeaves.length === 0 ? (
                  <p className="text-xs text-slate-400 py-3 text-center bg-slate-50 rounded-lg">No pending leaves</p>
                ) : (
                  pendingLeaves.slice(0, 2).map((l) => (
                    <div key={l.id} className="rounded-lg border border-slate-200 bg-slate-50/50 p-3 space-y-2">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-xs font-bold text-slate-900">{l.employeeName}</p>
                          <p className="text-[11px] text-slate-400">{l.leaveType} • {l.numberOfDays}d</p>
                        </div>
                        <span className="rounded bg-orange-50 text-orange-700 px-1.5 py-0.5 text-[9px] font-bold">
                          Pending
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600 italic truncate">"{l.reason}"</p>
                      <div className="flex items-center gap-2 pt-1">
                        <button
                          onClick={() => updateLeaveStatus(l.id, 'Approved', 'Approved by Admin')}
                          className="flex-1 rounded-md bg-emerald-600 py-1 text-[11px] font-bold text-white hover:bg-emerald-700"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => updateLeaveStatus(l.id, 'Rejected', 'Declined')}
                          className="flex-1 rounded-md border border-slate-200 bg-white py-1 text-[11px] font-bold text-slate-700 hover:bg-slate-100"
                        >
                          Reject
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Regularizations Queue */}
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                  <span className="flex items-center gap-1.5">
                    <Clock className="h-4 w-4 text-orange-600" />
                    <span>Regularizations ({pendingRegularizations.length})</span>
                  </span>
                  <button onClick={() => onNavigate('attendance')} className="text-orange-600 hover:underline font-semibold text-[11px]">
                    All
                  </button>
                </div>
                {pendingRegularizations.length === 0 ? (
                  <p className="text-xs text-slate-400 py-3 text-center bg-slate-50 rounded-lg">No corrections</p>
                ) : (
                  pendingRegularizations.slice(0, 2).map((r) => (
                    <div key={r.id} className="rounded-lg border border-slate-200 bg-slate-50/50 p-3 space-y-2">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-xs font-bold text-slate-900">{r.employeeName}</p>
                          <p className="text-[11px] text-slate-400">{r.date}</p>
                        </div>
                        <span className="rounded bg-amber-50 text-amber-700 px-1.5 py-0.5 text-[9px] font-bold">
                          Clock
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600 truncate">{r.requestedCheckIn} - {r.requestedCheckOut}</p>
                      <div className="flex items-center gap-2 pt-1">
                        <button
                          onClick={() => updateRegularizationStatus(r.id, 'Approved', 'Verified')}
                          className="flex-1 rounded-md bg-emerald-600 py-1 text-[11px] font-bold text-white hover:bg-emerald-700"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => updateRegularizationStatus(r.id, 'Rejected', 'Declined')}
                          className="flex-1 rounded-md border border-slate-200 bg-white py-1 text-[11px] font-bold text-slate-700 hover:bg-slate-100"
                        >
                          Reject
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Claims Queue */}
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                  <span className="flex items-center gap-1.5">
                    <CreditCard className="h-4 w-4 text-orange-600" />
                    <span>Claims ({pendingReimbursements.length})</span>
                  </span>
                  <button onClick={() => onNavigate('operations')} className="text-orange-600 hover:underline font-semibold text-[11px]">
                    All
                  </button>
                </div>
                {pendingReimbursements.length === 0 ? (
                  <p className="text-xs text-slate-400 py-3 text-center bg-slate-50 rounded-lg">No claims</p>
                ) : (
                  pendingReimbursements.slice(0, 2).map((rem) => (
                    <div key={rem.id} className="rounded-lg border border-slate-200 bg-slate-50/50 p-3 space-y-2">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-xs font-bold text-slate-900">{rem.employeeName}</p>
                          <p className="text-[11px] text-slate-400">{rem.category}</p>
                        </div>
                        <span className="font-bold text-slate-900 text-xs">
                          {formatINR(rem.amount)}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600 truncate">"{rem.description}"</p>
                      <div className="flex items-center gap-2 pt-1">
                        <button
                          onClick={() => updateReimbursementStatus(rem.id, 'Approved', 'Receipt verified')}
                          className="flex-1 rounded-md bg-emerald-600 py-1 text-[11px] font-bold text-white hover:bg-emerald-700"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => updateReimbursementStatus(rem.id, 'Rejected', 'Declined')}
                          className="flex-1 rounded-md border border-slate-200 bg-white py-1 text-[11px] font-bold text-slate-700 hover:bg-slate-100"
                        >
                          Reject
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (span 1): Celebrations, Policy Callout Card, Compliance Status */}
        <div className="space-y-6">
          {/* Upcoming Celebrations - Professional Polish Design */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
            <h2 className="font-bold text-slate-900 text-base mb-4">Upcoming Celebrations</h2>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center font-bold text-xs shrink-0">
                  KI
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-slate-900 truncate">Kavita Iyer's Birthday</p>
                  <p className="text-[11px] text-slate-400">Tomorrow • HR & Talent</p>
                </div>
                <span className="px-2 py-0.5 bg-orange-50 text-orange-600 text-[10px] font-bold rounded-full">
                  Celebrate
                </span>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-xs shrink-0">
                  RS
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-slate-900 truncate">Rohit Sen (2 Yrs)</p>
                  <p className="text-[11px] text-slate-400">Sep 10 • Retail Ops</p>
                </div>
                <span className="px-2 py-0.5 bg-indigo-50 text-indigo-600 text-[10px] font-bold rounded-full">
                  Anniversary
                </span>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-xs shrink-0">
                  SJ
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-slate-900 truncate">Sameer Joshi's Birthday</p>
                  <p className="text-[11px] text-slate-400">Sep 14 • Supply Chain</p>
                </div>
                <span className="px-2 py-0.5 bg-amber-50 text-amber-700 text-[10px] font-bold rounded-full">
                  Celebrate
                </span>
              </div>
            </div>
          </div>

          {/* New HR Policy Callout Card - Professional Polish Design */}
          <div className="bg-orange-600 rounded-xl p-5 text-white shadow-lg relative overflow-hidden">
            <div className="relative z-10">
              <span className="text-[10px] font-bold uppercase tracking-widest text-orange-200">Update</span>
              <h3 className="font-bold text-lg mt-1 mb-2">New HR Policy Published</h3>
              <p className="text-xs text-orange-100 mb-4 leading-relaxed">
                The revised leave and travel reimbursement guidelines are now active for FY 2026-27.
              </p>
              <button
                onClick={() => onNavigate('documents')}
                className="bg-white text-orange-600 text-xs font-bold px-4 py-2 rounded-lg shadow-sm hover:bg-orange-50 transition-colors cursor-pointer"
              >
                Read Handbook
              </button>
            </div>
            <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-orange-500 rounded-full opacity-50 pointer-events-none"></div>
          </div>

          {/* Statutory & Regulatory Health Card */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                <h3 className="font-bold text-slate-900 text-sm">Statutory Status</h3>
              </div>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                100% Compliant
              </span>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-100">
                <div>
                  <p className="font-semibold text-slate-900 text-[11px]">EPF Remittance</p>
                  <p className="text-[10px] text-slate-400">ECR Filing code: MH/BAN/0049281</p>
                </div>
                <span className="text-emerald-700 font-bold text-[10px]">Verified</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-100">
                <div>
                  <p className="font-semibold text-slate-900 text-[11px]">ESIC Monthly Challan</p>
                  <p className="text-[10px] text-slate-400">Code: 31000492810000101</p>
                </div>
                <span className="text-emerald-700 font-bold text-[10px]">Paid</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-100">
                <div>
                  <p className="font-semibold text-slate-900 text-[11px]">Maharashtra PT</p>
                  <p className="text-[10px] text-slate-400">Form III-B Remittance</p>
                </div>
                <span className="text-emerald-700 font-bold text-[10px]">Ready</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

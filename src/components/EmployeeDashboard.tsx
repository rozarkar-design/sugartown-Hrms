import React from 'react';
import {
  Clock,
  CalendarCheck,
  MapPin,
  ChevronRight,
  ArrowRight,
  Plus,
  Download,
  FileText,
  Sparkles,
} from 'lucide-react';
import { useHRMS } from '../context/HRMSContext';
import { formatINR, formatDate } from '../utils/formatters';
import { Payslip } from '../types';

interface EmployeeDashboardProps {
  onNavigate?: (view: string) => void;
  onApplyLeave?: () => void;
  onOpenRegularization?: () => void;
  onViewPayslip?: (ps: Payslip) => void;
  onOpenProfile?: () => void;
}

export const EmployeeDashboard: React.FC<EmployeeDashboardProps> = ({
  onNavigate,
  onApplyLeave,
  onOpenRegularization,
  onViewPayslip,
  onOpenProfile,
}) => {
  const {
    currentUser,
    employees,
    todayEmployeeRecord,
    checkIn,
    checkOut,
    leaveBalances,
    leaveRequests,
    payslips,
    holidays,
    announcements,
  } = useHRMS();

  // Find detailed employee profile
  const employeeData = employees.find((e) => e.employeeId === currentUser.employeeId) || employees[6]; // fallback Rohit Sen

  const userLeaveBalance = leaveBalances[currentUser.employeeId] || {
    casualLeave: { total: 12, used: 3 },
    sickLeave: { total: 10, used: 2 },
    earnedLeave: { total: 15, used: 4 },
    compOff: { total: 3, used: 1 },
    workFromHome: { total: 24, used: 8 },
  };

  const userPayslips = payslips.filter((p) => p.employeeId === currentUser.employeeId);
  const userLeaves = leaveRequests.filter((l) => l.employeeId === currentUser.employeeId);

  // Next upcoming holiday
  const upcomingHoliday = holidays[6] || holidays[0];

  // Dynamic greeting based on time of day
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good Morning' : hour < 17 ? 'Good Afternoon' : 'Good Evening';

  const isCheckedIn = !!todayEmployeeRecord?.checkIn;
  const isCheckedOut = !!todayEmployeeRecord?.checkOut;

  const handleProfileClick = () => {
    if (onOpenProfile) onOpenProfile();
    else if (onNavigate) onNavigate('employees');
  };

  const handleLeaveClick = () => {
    if (onApplyLeave) onApplyLeave();
    else if (onNavigate) onNavigate('leaves');
  };

  const handleRegularizeClick = () => {
    if (onOpenRegularization) onOpenRegularization();
    else if (onNavigate) onNavigate('attendance');
  };

  return (
    <div className="space-y-8 pb-12">
      {/* 1. Welcome Section - Professional Polish */}
      <div className="relative overflow-hidden rounded-xl border border-slate-200 bg-white p-6 sm:p-7 shadow-sm">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-4 sm:gap-5">
            <div className="relative">
              <img
                src={employeeData.photoUrl}
                alt={employeeData.fullName}
                className="h-16 w-16 sm:h-18 sm:w-18 rounded-xl object-cover ring-2 ring-slate-100 shadow-xs"
              />
              <span
                className={`absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full border-2 border-white ${
                  isCheckedIn ? 'bg-emerald-500' : 'bg-slate-300'
                }`}
                title={isCheckedIn ? 'Checked in' : 'Not checked in'}
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                  {greeting}, {employeeData.fullName.split(' ')[0]}
                </h1>
                <span className="hidden sm:inline-flex items-center rounded-full bg-orange-50 px-2.5 py-0.5 text-xs font-semibold text-orange-700 border border-orange-200">
                  {employeeData.employeeId}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 font-medium mt-1">
                {employeeData.designation} • {employeeData.department}
              </p>
              <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-slate-400">
                <span className="flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5 text-orange-500" />
                  {employeeData.workLocation}
                </span>
                <span>•</span>
                <span className="font-medium text-slate-600">Shift: General (09:30 - 18:30)</span>
              </div>
            </div>
          </div>

          {/* Quick Profile Pill / View Profile */}
          <button
            id="emp-view-full-profile-btn"
            onClick={handleProfileClick}
            className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 hover:border-slate-300 transition-colors cursor-pointer"
          >
            <span>View Full Profile</span>
            <ChevronRight className="h-4 w-4 text-slate-400" />
          </button>
        </div>
      </div>

      {/* 2. Top Metric Cards: Attendance Live Card + Leave Summary + Salary + Next Holiday */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Attendance Card with Check-In / Check-Out */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Today's Attendance
              </span>
              <span
                className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                  isCheckedIn
                    ? 'bg-green-50 text-green-700 border border-green-200'
                    : 'bg-slate-100 text-slate-600'
                }`}
              >
                {isCheckedOut ? 'Completed' : isCheckedIn ? 'Active Shift' : 'Not Punched'}
              </span>
            </div>

            <div className="mt-4 flex items-baseline justify-between">
              <div>
                <p className="text-2xl font-bold text-slate-900 tracking-tight">
                  {isCheckedIn ? todayEmployeeRecord?.checkIn : '--:--:--'}
                </p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  {isCheckedOut
                    ? `Out at ${todayEmployeeRecord?.checkOut}`
                    : isCheckedIn
                    ? 'Punched via biometric'
                    : 'Shift starts 09:30 AM'}
                </p>
              </div>
              <div className="text-right">
                <span className="text-xs font-bold text-green-600">96.8%</span>
                <p className="text-[10px] text-slate-400">Monthly rate</p>
              </div>
            </div>
          </div>

          <div className="mt-5 pt-3 border-t border-slate-100 flex items-center gap-2">
            {!isCheckedIn ? (
              <button
                id="dashboard-check-in-btn"
                onClick={checkIn}
                className="flex-1 rounded-lg bg-emerald-600 py-2 text-xs font-bold text-white shadow-xs hover:bg-emerald-700 active:scale-95 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Clock className="h-3.5 w-3.5" />
                <span>Check In</span>
              </button>
            ) : !isCheckedOut ? (
              <button
                id="dashboard-check-out-btn"
                onClick={checkOut}
                className="flex-1 rounded-lg bg-orange-600 py-2 text-xs font-bold text-white shadow-xs hover:bg-orange-700 active:scale-95 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Clock className="h-3.5 w-3.5" />
                <span>Check Out</span>
              </button>
            ) : (
              <div className="w-full text-center py-1.5 text-xs font-semibold text-green-700 bg-green-50 rounded-lg">
                Shift Logged: {todayEmployeeRecord?.workingHours}h
              </div>
            )}
            <button
              onClick={handleRegularizeClick}
              className="rounded-lg border border-slate-200 bg-slate-50 p-2 text-slate-600 hover:bg-slate-100 text-xs font-medium cursor-pointer"
              title="Attendance Regularization Request"
            >
              Regularize
            </button>
          </div>
        </div>

        {/* Leave Balances Card */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Leave Balances
              </span>
              <span className="text-xs font-semibold text-slate-700">
                {userLeaveBalance.casualLeave.total - userLeaveBalance.casualLeave.used +
                  (userLeaveBalance.earnedLeave.total - userLeaveBalance.earnedLeave.used)}{' '}
                Days Left
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 mt-3">
              <div className="rounded-lg bg-slate-50 p-2 border border-slate-100">
                <p className="text-[10px] text-slate-500 font-medium">Casual Leave</p>
                <p className="text-sm font-bold text-slate-900 mt-0.5">
                  {userLeaveBalance.casualLeave.total - userLeaveBalance.casualLeave.used}
                  <span className="text-[10px] font-normal text-slate-400">/{userLeaveBalance.casualLeave.total}</span>
                </p>
              </div>
              <div className="rounded-lg bg-slate-50 p-2 border border-slate-100">
                <p className="text-[10px] text-slate-500 font-medium">Sick Leave</p>
                <p className="text-sm font-bold text-slate-900 mt-0.5">
                  {userLeaveBalance.sickLeave.total - userLeaveBalance.sickLeave.used}
                  <span className="text-[10px] font-normal text-slate-400">/{userLeaveBalance.sickLeave.total}</span>
                </p>
              </div>
              <div className="rounded-lg bg-slate-50 p-2 border border-slate-100">
                <p className="text-[10px] text-slate-500 font-medium">Earned Leave</p>
                <p className="text-sm font-bold text-slate-900 mt-0.5">
                  {userLeaveBalance.earnedLeave.total - userLeaveBalance.earnedLeave.used}
                  <span className="text-[10px] font-normal text-slate-400">/{userLeaveBalance.earnedLeave.total}</span>
                </p>
              </div>
              <div className="rounded-lg bg-slate-50 p-2 border border-slate-100">
                <p className="text-[10px] text-slate-500 font-medium">Work From Home</p>
                <p className="text-sm font-bold text-slate-900 mt-0.5">
                  {userLeaveBalance.workFromHome.total - userLeaveBalance.workFromHome.used}
                  <span className="text-[10px] font-normal text-slate-400">/{userLeaveBalance.workFromHome.total}</span>
                </p>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100">
            <button
              id="emp-apply-leave-btn"
              onClick={handleLeaveClick}
              className="w-full rounded-lg bg-slate-900 py-2 text-xs font-bold text-white hover:bg-slate-800 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Apply for Leave</span>
            </button>
          </div>
        </div>

        {/* Current Month Net Pay Card */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Salary & Payslip
              </span>
              <span className="rounded bg-green-50 text-green-700 font-semibold text-[10px] px-2 py-0.5 border border-green-200">
                Disbursed
              </span>
            </div>

            <div className="mt-4">
              <p className="text-2xl font-bold text-slate-900 tracking-tight">
                {formatINR(userPayslips[0]?.netPay || 44610)}
              </p>
              <p className="text-xs text-slate-500 mt-0.5">August 2026 Net Take-Home</p>
              <div className="mt-3 flex items-center justify-between text-xs text-slate-600 bg-slate-50 p-2 rounded-lg border border-slate-100">
                <span>Gross Earnings:</span>
                <span className="font-semibold">{formatINR(userPayslips[0]?.earnings.totalEarnings || 47950)}</span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100">
            <button
              id="emp-download-latest-payslip-btn"
              onClick={() => userPayslips[0] && onViewPayslip && onViewPayslip(userPayslips[0])}
              className="w-full rounded-lg border border-slate-200 bg-white py-2 text-xs font-bold text-slate-800 hover:bg-slate-50 hover:border-slate-300 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Download className="h-3.5 w-3.5 text-slate-500" />
              <span>View & Download Payslip</span>
            </button>
          </div>
        </div>

        {/* Next Company Holiday Card */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Upcoming Holiday
              </span>
              <span className="rounded bg-amber-50 text-amber-800 text-[10px] font-semibold px-2 py-0.5 border border-amber-200">
                {upcomingHoliday.type}
              </span>
            </div>

            <div className="mt-4">
              <p className="text-base font-bold text-slate-900">{upcomingHoliday.name}</p>
              <p className="text-xs text-orange-600 font-semibold mt-0.5">
                {formatDate(upcomingHoliday.date)} • {upcomingHoliday.day}
              </p>
              <p className="text-xs text-slate-500 mt-2 line-clamp-2 leading-relaxed">
                {upcomingHoliday.description} ({upcomingHoliday.location} branches)
              </p>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Annual Calendar</span>
            <span className="font-semibold text-slate-700">{holidays.length} Company Holidays</span>
          </div>
        </div>
      </div>

      {/* 3. Middle Section: Recent Payslips & Leave Applications + Policy Callout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Payslips (2 Columns) */}
        <div className="lg:col-span-2 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Recent Payslips & Earnings</h3>
              <p className="text-xs text-slate-400">Monthly bank credited payslips & PF/PT breakdowns</p>
            </div>
          </div>

          <div className="divide-y divide-slate-100">
            {userPayslips.map((ps) => (
              <div key={ps.id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-50 text-green-700 font-bold text-xs">
                    <FileText className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-xs font-bold text-slate-900">{ps.month}</p>
                      <span className="rounded bg-green-50 px-1.5 py-0.5 text-[10px] font-semibold text-green-700">
                        {ps.status}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      {ps.payslipNumber} • Paid Days: {ps.paidDays} • Bank: {ps.bankName}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-4">
                  <div className="text-right">
                    <p className="text-xs font-bold text-slate-900">{formatINR(ps.netPay)}</p>
                    <p className="text-[10px] text-slate-400">Deductions: {formatINR(ps.deductions.totalDeductions)}</p>
                  </div>
                  <button
                    onClick={() => onViewPayslip && onViewPayslip(ps)}
                    className="flex items-center gap-1 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                  >
                    <span>View</span>
                    <ArrowRight className="h-3 w-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Leave Requests & Policy Callout (1 Column) */}
        <div className="space-y-6">
          {/* Leave History */}
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900">My Leave History</h3>
                <p className="text-xs text-slate-400">Recent applications</p>
              </div>
              <button
                onClick={handleLeaveClick}
                className="text-xs font-semibold text-orange-600 hover:underline cursor-pointer"
              >
                + Apply
              </button>
            </div>

            <div className="space-y-3">
              {userLeaves.length === 0 ? (
                <p className="text-xs text-slate-400 py-6 text-center">No leave applications yet.</p>
              ) : (
                userLeaves.slice(0, 3).map((l) => (
                  <div
                    key={l.id}
                    className="rounded-lg border border-slate-200 bg-slate-50/50 p-3 space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900">{l.leaveType}</span>
                      <span
                        className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                          l.status === 'Approved'
                            ? 'bg-green-50 text-green-700'
                            : l.status === 'Rejected'
                            ? 'bg-red-50 text-red-700'
                            : 'bg-amber-50 text-amber-700'
                        }`}
                      >
                        {l.status}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 font-medium">
                      {formatDate(l.fromDate)} {l.fromDate !== l.toDate && `to ${formatDate(l.toDate)}`} ({l.numberOfDays}d)
                    </p>
                    <p className="text-[11px] text-slate-500 italic truncate">"{l.reason}"</p>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* New HR Policy Callout Card - Professional Polish Design */}
          <div className="bg-orange-600 rounded-xl p-5 text-white shadow-lg relative overflow-hidden">
            <div className="relative z-10">
              <span className="text-[10px] font-bold uppercase tracking-widest text-orange-200">Handbook</span>
              <h3 className="font-bold text-lg mt-1 mb-2">Company Policies Active</h3>
              <p className="text-xs text-orange-100 mb-4 leading-relaxed">
                Check our updated POSH policy, IT security protocols, and uniform standards.
              </p>
              <button
                onClick={() => onNavigate && onNavigate('documents')}
                className="bg-white text-orange-600 text-xs font-bold px-4 py-2 rounded-lg shadow-sm hover:bg-orange-50 transition-colors cursor-pointer"
              >
                View Documents
              </button>
            </div>
            <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-orange-500 rounded-full opacity-50 pointer-events-none"></div>
          </div>
        </div>
      </div>

      {/* 4. Announcements Noticeboard */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <div className="p-1.5 rounded-lg bg-orange-50 text-orange-600">
            <Sparkles className="h-4 w-4" />
          </div>
          <h3 className="text-sm font-bold text-slate-900">Sugartown Retail Company Notices</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {announcements.slice(0, 2).map((anc) => (
            <div
              key={anc.id}
              className="rounded-lg border border-slate-200 bg-slate-50/50 p-4 space-y-2 hover:bg-slate-50 transition-colors"
            >
              <div className="flex items-center justify-between">
                <span className="rounded-md bg-orange-100 text-orange-800 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider">
                  {anc.category}
                </span>
                <span className="text-[11px] text-slate-400">{formatDate(anc.publishedDate)}</span>
              </div>
              <h4 className="text-xs font-bold text-slate-900">{anc.title}</h4>
              <p className="text-xs text-slate-600 leading-relaxed">{anc.content}</p>
              <p className="text-[10px] text-slate-400 pt-1">Published by: {anc.author}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

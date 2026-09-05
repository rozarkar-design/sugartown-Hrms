import React, { useState } from 'react';
import {
  CalendarCheck,
  Calendar,
  Clock,
  Plus,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Users,
  Search,
  Check,
  X,
  BookOpen,
} from 'lucide-react';
import { useHRMS } from '../context/HRMSContext';
import { LeaveRequest, Holiday } from '../types';
import { formatDate } from '../utils/formatters';

export const LeaveManagement: React.FC = () => {
  const {
    leaveRequests,
    leaveBalances,
    holidays,
    addHoliday,
    applyLeave,
    updateLeaveStatus,
    currentUser,
    showToast,
  } = useHRMS();

  const [activeTab, setActiveTab] = useState<'approvals' | 'history' | 'holidays' | 'policy'>('approvals');
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [isHolidayModalOpen, setIsHolidayModalOpen] = useState(false);

  // Apply Leave Form
  const [leaveForm, setLeaveForm] = useState<Partial<LeaveRequest>>({
    leaveType: 'Casual Leave',
    fromDate: new Date().toISOString().split('T')[0],
    toDate: new Date().toISOString().split('T')[0],
    isHalfDay: false,
    halfDayType: 'First Half',
    numberOfDays: 1,
    reason: '',
    contactDuringLeave: '+91 98200 12345',
  });

  // Add Holiday Form
  const [holidayForm, setHolidayForm] = useState<Partial<Holiday>>({
    name: '',
    date: new Date().toISOString().split('T')[0],
    day: 'Monday',
    location: 'All',
    type: 'Mandatory',
    description: '',
  });

  const pendingLeaves = leaveRequests.filter((l) => l.status === 'Pending');

  const handleDateChange = (from: string, to: string, isHalf: boolean) => {
    if (isHalf) {
      setLeaveForm((prev) => ({ ...prev, fromDate: from, toDate: from, numberOfDays: 0.5, isHalfDay: true }));
      return;
    }
    const d1 = new Date(from);
    const d2 = new Date(to);
    const diffTime = Math.max(0, d2.getTime() - d1.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    setLeaveForm((prev) => ({ ...prev, fromDate: from, toDate: to, numberOfDays: diffDays }));
  };

  const handleApplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!leaveForm.reason) {
      showToast('Please provide a reason for the leave request', 'error');
      return;
    }
    applyLeave(leaveForm);
    setIsApplyModalOpen(false);
    setLeaveForm({ ...leaveForm, reason: '' });
  };

  const handleHolidaySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!holidayForm.name) return;
    addHoliday(holidayForm);
    setIsHolidayModalOpen(false);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Leave Management & Holiday Calendar
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium">
            Sugartown Retail Private Limited • Leave quotas, approvals & statutory holidays
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setIsHolidayModalOpen(true)}
            className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-colors cursor-pointer shadow-xs"
          >
            <Calendar className="h-4 w-4 text-slate-500" />
            <span>+ Add Holiday</span>
          </button>
          <button
            onClick={() => setIsApplyModalOpen(true)}
            className="flex items-center gap-1.5 rounded-lg bg-orange-600 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-orange-700 transition-colors cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            <span>Apply for Leave</span>
          </button>
        </div>
      </div>

      {/* 2. Top Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('approvals')}
          className={`flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'approvals'
              ? 'bg-orange-50 text-orange-700 border border-orange-200'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <CalendarCheck className="h-4 w-4" />
          <span>Pending Approvals</span>
          {pendingLeaves.length > 0 && (
            <span className="flex h-5 items-center justify-center rounded-full bg-orange-600 px-1.5 text-[10px] font-bold text-white">
              {pendingLeaves.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('history')}
          className={`flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'history'
              ? 'bg-orange-50 text-orange-700 border border-orange-200'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Clock className="h-4 w-4" />
          <span>All Leave Records ({leaveRequests.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('holidays')}
          className={`flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'holidays'
              ? 'bg-orange-50 text-orange-700 border border-orange-200'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Calendar className="h-4 w-4" />
          <span>Holidays List ({holidays.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('policy')}
          className={`flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'policy'
              ? 'bg-orange-50 text-orange-700 border border-orange-200'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <BookOpen className="h-4 w-4" />
          <span>Company Leave Policy</span>
        </button>
      </div>

      {/* TAB 1: PENDING APPROVALS */}
      {activeTab === 'approvals' && (
        <div className="space-y-4">
          <div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-xs">
            <div className="p-4 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">Leave Applications Requiring Review</h3>
              <p className="text-xs text-slate-500">
                Managers and HR Admins can verify leave entitlement and approve or reject with comments
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="border-b border-slate-200 bg-slate-50/80 text-[11px] font-bold text-slate-500 uppercase">
                  <tr>
                    <th className="py-3 pl-4 pr-2">Employee</th>
                    <th className="py-3 px-3">Department</th>
                    <th className="py-3 px-3">Leave Type</th>
                    <th className="py-3 px-3">Duration</th>
                    <th className="py-3 px-3">Days</th>
                    <th className="py-3 px-3">Reason</th>
                    <th className="py-3 px-3">Applied On</th>
                    <th className="py-3 pr-4 pl-2 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {pendingLeaves.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-8 text-center text-slate-400">
                        No pending leave applications. All clear!
                      </td>
                    </tr>
                  ) : (
                    pendingLeaves.map((l) => (
                      <tr key={l.id} className="hover:bg-slate-50 transition-colors">
                        <td className="py-3 pl-4 pr-2">
                          <p className="font-bold text-slate-900">{l.employeeName}</p>
                          <span className="font-mono text-[10px] text-slate-400">{l.employeeId}</span>
                        </td>
                        <td className="py-3 px-3 text-slate-600">{l.department}</td>
                        <td className="py-3 px-3 whitespace-nowrap">
                          <span className="rounded-md bg-orange-50 text-orange-800 px-2 py-0.5 text-[10px] font-bold border border-orange-200">
                            {l.leaveType}
                          </span>
                        </td>
                        <td className="py-3 px-3 whitespace-nowrap">
                          {formatDate(l.fromDate)} {l.fromDate !== l.toDate && `to ${formatDate(l.toDate)}`}
                        </td>
                        <td className="py-3 px-3 font-bold text-slate-900">{l.numberOfDays}d</td>
                        <td className="py-3 px-3 text-slate-700 max-w-[200px] truncate" title={l.reason}>
                          "{l.reason}"
                        </td>
                        <td className="py-3 px-3 text-slate-400 whitespace-nowrap">{l.appliedDate}</td>
                        <td className="py-3 pr-4 pl-2 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => updateLeaveStatus(l.id, 'Approved', 'Approved by Manager')}
                              className="rounded-lg bg-green-600 px-2.5 py-1 text-xs font-bold text-white hover:bg-green-700 cursor-pointer shadow-xs"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => updateLeaveStatus(l.id, 'Rejected', 'High store footfall expected')}
                              className="rounded-lg border border-slate-300 bg-white px-2.5 py-1 text-xs font-bold text-slate-700 hover:bg-slate-100 cursor-pointer"
                            >
                              Reject
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: HISTORY */}
      {activeTab === 'history' && (
        <div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="border-b border-slate-200 bg-slate-50/80 text-[11px] font-bold text-slate-500 uppercase">
                <tr>
                  <th className="py-3 pl-4 pr-2">Employee</th>
                  <th className="py-3 px-3">Type</th>
                  <th className="py-3 px-3">Dates</th>
                  <th className="py-3 px-3">Days</th>
                  <th className="py-3 px-3">Reason</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 pr-4 pl-2">Remarks</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {leaveRequests.map((l) => (
                  <tr key={l.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 pl-4 pr-2">
                      <p className="font-bold text-slate-900">{l.employeeName}</p>
                      <span className="font-mono text-[10px] text-slate-400">{l.employeeId}</span>
                    </td>
                    <td className="py-3 px-3">{l.leaveType}</td>
                    <td className="py-3 px-3 whitespace-nowrap">
                      {formatDate(l.fromDate)} {l.fromDate !== l.toDate && `to ${formatDate(l.toDate)}`}
                    </td>
                    <td className="py-3 px-3 font-semibold">{l.numberOfDays}</td>
                    <td className="py-3 px-3 text-slate-600 max-w-[200px] truncate">{l.reason}</td>
                    <td className="py-3 px-3 whitespace-nowrap">
                      <span
                        className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                          l.status === 'Approved'
                            ? 'bg-green-50 text-green-700 border border-green-200'
                            : l.status === 'Rejected'
                            ? 'bg-red-50 text-red-700 border border-red-200'
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}
                      >
                        {l.status}
                      </span>
                    </td>
                    <td className="py-3 pr-4 pl-2 text-slate-400 text-[11px]">{l.approverComments || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: HOLIDAYS */}
      {activeTab === 'holidays' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {holidays.map((h) => (
            <div key={h.id} className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <span className="rounded-md bg-orange-50 text-orange-700 text-[10px] font-bold px-2 py-0.5 border border-orange-200">
                    {h.type}
                  </span>
                  <h4 className="text-sm font-bold text-slate-900 mt-2">{h.name}</h4>
                </div>
                <div className="text-right">
                  <p className="text-xs font-bold text-slate-900">{formatDate(h.date)}</p>
                  <p className="text-[11px] text-slate-400">{h.day}</p>
                </div>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">{h.description}</p>
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                <span>Applicable Stores:</span>
                <span className="font-semibold text-slate-800">{h.location} Branches</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 4: LEAVE POLICY */}
      {activeTab === 'policy' && (
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs space-y-6 text-xs text-slate-700 leading-relaxed">
          <div className="border-b border-slate-100 pb-4">
            <h3 className="text-base font-bold text-slate-900">Sugartown Annual Leave & Absence Policy</h3>
            <p className="text-xs text-slate-500">Guidelines governing paid time off, encashment, and carry forwards</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <h4 className="font-bold text-slate-900">1. Casual Leave (CL) — 12 Days</h4>
              <p>Credited at 1.0 day per calendar month. Maximum of 3 consecutive CLs allowed. Cannot be combined with Sick Leave.</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <h4 className="font-bold text-slate-900">2. Sick Leave (SL) — 10 Days</h4>
              <p>For medical recovery. Medical certificate from a registered practitioner is required for absences exceeding 2 days.</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <h4 className="font-bold text-slate-900">3. Earned / Privilege Leave (EL) — 15 Days</h4>
              <p>Accrued on completion of probation. Up to 30 days can be carried forward to next calendar year. Encashable upon separation.</p>
            </div>
          </div>
        </div>
      )}

      {/* Apply Leave Modal */}
      {isApplyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-6 shadow-2xl animate-in fade-in duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <h3 className="text-sm font-bold text-slate-900">Submit Leave Application</h3>
              <button onClick={() => setIsApplyModalOpen(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleApplySubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Leave Category</label>
                <select
                  value={leaveForm.leaveType}
                  onChange={(e) => setLeaveForm({ ...leaveForm, leaveType: e.target.value as any })}
                  className="w-full rounded-lg border border-slate-200 p-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500 cursor-pointer"
                >
                  <option value="Casual Leave">Casual Leave (CL)</option>
                  <option value="Sick Leave">Sick Leave (SL)</option>
                  <option value="Earned Leave">Earned Leave (EL)</option>
                  <option value="Comp Off">Comp Off</option>
                  <option value="Work From Home">Work From Home (WFH)</option>
                </select>
              </div>

              <div className="flex items-center gap-2 py-1">
                <input
                  type="checkbox"
                  id="half-day-check"
                  checked={leaveForm.isHalfDay}
                  onChange={(e) => handleDateChange(leaveForm.fromDate!, leaveForm.toDate!, e.target.checked)}
                  className="rounded border-slate-300 text-orange-600 focus:ring-orange-500"
                />
                <label htmlFor="half-day-check" className="font-medium text-slate-700 cursor-pointer">
                  Is this a Half Day Leave?
                </label>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">From Date</label>
                  <input
                    type="date"
                    required
                    value={leaveForm.fromDate}
                    onChange={(e) => handleDateChange(e.target.value, leaveForm.toDate!, !!leaveForm.isHalfDay)}
                    className="w-full rounded-lg border border-slate-200 p-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">To Date</label>
                  <input
                    type="date"
                    required
                    disabled={leaveForm.isHalfDay}
                    value={leaveForm.toDate}
                    onChange={(e) => handleDateChange(leaveForm.fromDate!, e.target.value, false)}
                    className="w-full rounded-lg border border-slate-200 p-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:bg-slate-100"
                  />
                </div>
              </div>

              <div className="p-2.5 bg-orange-50 rounded-lg flex items-center justify-between text-xs text-orange-900 font-semibold border border-orange-200">
                <span>Calculated Leave Duration:</span>
                <span>{leaveForm.numberOfDays} Day(s)</span>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Reason for Leave *</label>
                <textarea
                  rows={2}
                  required
                  placeholder="e.g. Attending sister's wedding ceremony in Pune"
                  value={leaveForm.reason}
                  onChange={(e) => setLeaveForm({ ...leaveForm, reason: e.target.value })}
                  className="w-full rounded-lg border border-slate-200 p-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Emergency Contact Number</label>
                <input
                  type="text"
                  value={leaveForm.contactDuringLeave}
                  onChange={(e) => setLeaveForm({ ...leaveForm, contactDuringLeave: e.target.value })}
                  className="w-full rounded-lg border border-slate-200 p-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsApplyModalOpen(false)}
                  className="rounded-lg px-4 py-2 text-slate-600 hover:bg-slate-100 font-medium cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-orange-600 px-5 py-2 font-bold text-white hover:bg-orange-700 cursor-pointer shadow-xs"
                >
                  Submit Application
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Holiday Modal */}
      {isHolidayModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-6 shadow-2xl animate-in fade-in duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <h3 className="text-sm font-bold text-slate-900">Add Holiday to Company Calendar</h3>
              <button onClick={() => setIsHolidayModalOpen(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleHolidaySubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Holiday Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Maharashtra Day"
                  value={holidayForm.name}
                  onChange={(e) => setHolidayForm({ ...holidayForm, name: e.target.value })}
                  className="w-full rounded-lg border border-slate-200 p-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Date</label>
                  <input
                    type="date"
                    required
                    value={holidayForm.date}
                    onChange={(e) => setHolidayForm({ ...holidayForm, date: e.target.value })}
                    className="w-full rounded-lg border border-slate-200 p-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Type</label>
                  <select
                    value={holidayForm.type}
                    onChange={(e) => setHolidayForm({ ...holidayForm, type: e.target.value as any })}
                    className="w-full rounded-lg border border-slate-200 p-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500 cursor-pointer"
                  >
                    <option value="Mandatory">Mandatory</option>
                    <option value="Optional">Optional</option>
                    <option value="Regional">Regional</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={holidayForm.description}
                  onChange={(e) => setHolidayForm({ ...holidayForm, description: e.target.value })}
                  className="w-full rounded-lg border border-slate-200 p-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsHolidayModalOpen(false)}
                  className="rounded-lg px-4 py-2 text-slate-600 hover:bg-slate-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-orange-600 px-5 py-2 font-bold text-white hover:bg-orange-700 cursor-pointer shadow-xs"
                >
                  Save Holiday
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

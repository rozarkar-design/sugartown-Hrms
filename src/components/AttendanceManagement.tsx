import React, { useState } from 'react';
import {
  Clock,
  Calendar,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Plus,
  Download,
  Users,
  Building2,
  MapPin,
  Check,
  X,
  FileCheck,
} from 'lucide-react';
import { useHRMS } from '../context/HRMSContext';
import { AttendanceRecord, AttendanceRegularizationRequest } from '../types';
import { formatDate } from '../utils/formatters';

export const AttendanceManagement: React.FC = () => {
  const {
    attendanceRecords,
    regularizations,
    shifts,
    departments,
    locations,
    recordManualAttendance,
    updateRegularizationStatus,
    showToast,
  } = useHRMS();

  const [activeTab, setActiveTab] = useState<'roster' | 'regularization' | 'shifts'>('roster');
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [selectedDept, setSelectedDept] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Manual Attendance Entry Modal
  const [isManualModalOpen, setIsManualModalOpen] = useState(false);
  const [manualForm, setManualForm] = useState<Partial<AttendanceRecord>>({
    employeeId: 'ST-1007',
    employeeName: 'Rohit Sen',
    department: 'Retail & Store Operations',
    date: new Date().toISOString().split('T')[0],
    checkIn: '09:30:00',
    checkOut: '18:30:00',
    workingHours: 9,
    status: 'Present',
    remarks: 'Manual entry verified with security log',
  });

  const filteredAttendance = attendanceRecords.filter((rec) => {
    const matchesDate = !selectedDate || rec.date === selectedDate;
    const matchesDept = selectedDept === 'All' || rec.department === selectedDept;
    const matchesStatus = selectedStatus === 'All' || rec.status === selectedStatus;
    const matchesSearch =
      rec.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rec.employeeId.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesDate && matchesDept && matchesStatus && matchesSearch;
  });

  const pendingRegularizations = regularizations.filter((r) => r.status === 'Pending');

  const handleSaveManual = (e: React.FormEvent) => {
    e.preventDefault();
    recordManualAttendance(manualForm);
    setIsManualModalOpen(false);
  };

  const handleExportAttendance = () => {
    const header = 'Date,Employee ID,Employee Name,Department,Status,Check In,Check Out,Working Hours,Late By (Min),Location,Remarks\n';
    const rows = filteredAttendance
      .map(
        (a) =>
          `"${a.date}","${a.employeeId}","${a.employeeName}","${a.department}","${a.status}","${a.checkIn || ''}","${a.checkOut || ''}","${a.workingHours}","${a.lateByMinutes || 0}","${a.location || ''}","${a.remarks || ''}"`
      )
      .join('\n');
    const blob = new Blob([header + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Sugartown_Attendance_${selectedDate}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Attendance report exported to CSV', 'success');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* 1. Top Title & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Attendance & Shift Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium">
            Biometric syncing, shift rostering, and regularization approvals
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={handleExportAttendance}
            className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-colors cursor-pointer shadow-xs"
          >
            <Download className="h-4 w-4 text-slate-500" />
            <span>Export Roster</span>
          </button>
          <button
            onClick={() => setIsManualModalOpen(true)}
            className="flex items-center gap-1.5 rounded-lg bg-orange-600 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-orange-700 transition-colors cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            <span>Record Manual Attendance</span>
          </button>
        </div>
      </div>

      {/* 2. Primary Tabs: Daily Roster / Regularization Queue / Shifts */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('roster')}
          className={`flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'roster'
              ? 'bg-orange-50 text-orange-700 border border-orange-200'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Clock className="h-4 w-4" />
          <span>Daily Roster ({filteredAttendance.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('regularization')}
          className={`flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'regularization'
              ? 'bg-orange-50 text-orange-700 border border-orange-200'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <FileCheck className="h-4 w-4" />
          <span>Regularization Requests</span>
          {pendingRegularizations.length > 0 && (
            <span className="flex h-5 items-center justify-center rounded-full bg-orange-600 px-1.5 text-[10px] font-bold text-white">
              {pendingRegularizations.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('shifts')}
          className={`flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'shifts'
              ? 'bg-orange-50 text-orange-700 border border-orange-200'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Calendar className="h-4 w-4" />
          <span>Shifts & Timings ({shifts.length})</span>
        </button>
      </div>

      {/* TAB 1: DAILY ROSTER */}
      {activeTab === 'roster' && (
        <div className="space-y-4">
          {/* Filters Bar */}
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Date</label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 bg-slate-50/50 p-2 text-xs text-slate-900 focus:outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Department</label>
                <select
                  value={selectedDept}
                  onChange={(e) => setSelectedDept(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 bg-slate-50/50 p-2 text-xs text-slate-900 focus:outline-none cursor-pointer"
                >
                  <option value="All">All Departments</option>
                  {departments.map((d) => (
                    <option key={d.id} value={d.name}>
                      {d.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Status</label>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 bg-slate-50/50 p-2 text-xs text-slate-900 focus:outline-none cursor-pointer"
                >
                  <option value="All">All Statuses</option>
                  <option value="Present">Present</option>
                  <option value="Late">Late Arrival</option>
                  <option value="Absent">Absent</option>
                  <option value="Leave">On Leave</option>
                  <option value="Half Day">Half Day</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Search Employee</label>
                <input
                  type="text"
                  placeholder="Employee name or ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 bg-slate-50/50 p-2 text-xs text-slate-900 focus:outline-none focus:border-orange-500"
                />
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="border-b border-slate-200 bg-slate-50/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <tr>
                    <th className="py-3 pl-4 pr-2">Employee</th>
                    <th className="py-3 px-3">Department</th>
                    <th className="py-3 px-3">Date</th>
                    <th className="py-3 px-3">Status</th>
                    <th className="py-3 px-3">Check In</th>
                    <th className="py-3 px-3">Check Out</th>
                    <th className="py-3 px-3">Hours</th>
                    <th className="py-3 px-3">Late (Mins)</th>
                    <th className="py-3 pr-4 pl-2">Location & Notes</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredAttendance.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="py-8 text-center text-slate-400">
                        No attendance records match your criteria.
                      </td>
                    </tr>
                  ) : (
                    filteredAttendance.map((rec) => (
                      <tr key={rec.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-3 pl-4 pr-2">
                          <div>
                            <p className="font-bold text-slate-900">{rec.employeeName}</p>
                            <span className="font-mono text-[10px] text-slate-400">{rec.employeeId}</span>
                          </div>
                        </td>
                        <td className="py-3 px-3 text-slate-600">{rec.department}</td>
                        <td className="py-3 px-3 text-slate-700 whitespace-nowrap">{rec.date}</td>
                        <td className="py-3 px-3 whitespace-nowrap">
                          <span
                            className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                              rec.status === 'Present'
                                ? 'bg-green-50 text-green-700 border border-green-200'
                                : rec.status === 'Late'
                                ? 'bg-amber-50 text-amber-700 border border-amber-200'
                                : rec.status === 'Leave'
                                ? 'bg-blue-50 text-blue-700 border border-blue-200'
                                : 'bg-red-50 text-red-700 border border-red-200'
                            }`}
                          >
                            {rec.status}
                          </span>
                        </td>
                        <td className="py-3 px-3 font-mono font-semibold text-slate-900">{rec.checkIn || '-'}</td>
                        <td className="py-3 px-3 font-mono text-slate-600">{rec.checkOut || '-'}</td>
                        <td className="py-3 px-3 font-bold text-slate-900">{rec.workingHours ? `${rec.workingHours}h` : '-'}</td>
                        <td className="py-3 px-3 text-slate-600">
                          {rec.lateByMinutes && rec.lateByMinutes > 0 ? (
                            <span className="font-bold text-amber-600">+{rec.lateByMinutes}m</span>
                          ) : (
                            '0'
                          )}
                        </td>
                        <td className="py-3 pr-4 pl-2 text-slate-500">
                          <p className="truncate max-w-[180px]">{rec.location}</p>
                          {rec.remarks && <p className="text-[10px] text-slate-400 italic truncate max-w-[180px]">{rec.remarks}</p>}
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

      {/* TAB 2: REGULARIZATION REQUESTS */}
      {activeTab === 'regularization' && (
        <div className="space-y-4">
          <div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-xs">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Attendance Regularization Requests</h3>
                <p className="text-xs text-slate-500">Employee punch corrections and discrepancy adjustments</p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="border-b border-slate-200 bg-slate-50/80 text-[11px] font-bold text-slate-500 uppercase">
                  <tr>
                    <th className="py-3 pl-4 pr-2">Employee</th>
                    <th className="py-3 px-3">Date</th>
                    <th className="py-3 px-3">Original Punch</th>
                    <th className="py-3 px-3">Requested Punch</th>
                    <th className="py-3 px-3">Reason</th>
                    <th className="py-3 px-3">Status</th>
                    <th className="py-3 pr-4 pl-2 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {regularizations.map((r) => (
                    <tr key={r.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 pl-4 pr-2">
                        <p className="font-bold text-slate-900">{r.employeeName}</p>
                        <span className="font-mono text-[10px] text-slate-400">{r.employeeId}</span>
                      </td>
                      <td className="py-3 px-3 whitespace-nowrap">{r.date}</td>
                      <td className="py-3 px-3 text-slate-500">
                        {r.existingCheckIn || 'Missed'} - {r.existingCheckOut || 'Missed'}
                      </td>
                      <td className="py-3 px-3 font-mono font-semibold text-green-700">
                        {r.requestedCheckIn} - {r.requestedCheckOut}
                      </td>
                      <td className="py-3 px-3 max-w-[200px]">
                        <p className="text-slate-800 font-medium truncate">{r.reason}</p>
                        {r.approverRemarks && (
                          <p className="text-[10px] text-slate-400">Note: {r.approverRemarks}</p>
                        )}
                      </td>
                      <td className="py-3 px-3 whitespace-nowrap">
                        <span
                          className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                            r.status === 'Approved'
                              ? 'bg-green-50 text-green-700 border border-green-200'
                              : r.status === 'Rejected'
                              ? 'bg-red-50 text-red-700 border border-red-200'
                              : 'bg-amber-50 text-amber-700 border border-amber-200'
                          }`}
                        >
                          {r.status}
                        </span>
                      </td>
                      <td className="py-3 pr-4 pl-2 text-right whitespace-nowrap">
                        {r.status === 'Pending' ? (
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => updateRegularizationStatus(r.id, 'Approved', 'Verified with manager')}
                              className="rounded-lg bg-green-600 p-1.5 text-white hover:bg-green-700 cursor-pointer shadow-xs"
                              title="Approve"
                            >
                              <Check className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => updateRegularizationStatus(r.id, 'Rejected', 'Unverified punch')}
                              className="rounded-lg border border-slate-300 p-1.5 text-slate-600 hover:bg-slate-100 cursor-pointer"
                              title="Reject"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        ) : (
                          <span className="text-[11px] text-slate-400">Resolved</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: SHIFTS */}
      {activeTab === 'shifts' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {shifts.map((s) => (
            <div key={s.id} className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-slate-900">{s.name}</h4>
                <span className="rounded-md bg-orange-50 text-orange-700 text-[10px] font-bold px-2 py-0.5 border border-orange-200">
                  {s.workingHours} Hours
                </span>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg space-y-1 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">Timings:</span>
                  <span className="font-bold text-slate-900">
                    {s.startTime} - {s.endTime}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Grace Period:</span>
                  <span className="font-medium text-slate-800">{s.gracePeriodMinutes} Minutes</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Weekly Off:</span>
                  <span className="font-medium text-slate-800">{s.weeklyOff.join(', ')}</span>
                </div>
              </div>
              <p className="text-[11px] text-slate-500">Active roster shift for store associates and corporate personnel.</p>
            </div>
          ))}
        </div>
      )}

      {/* Manual Attendance Modal */}
      {isManualModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-6 shadow-2xl animate-in fade-in duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <h3 className="text-sm font-bold text-slate-900">Record Manual Attendance Entry</h3>
              <button
                onClick={() => setIsManualModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveManual} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Employee ID</label>
                <input
                  type="text"
                  required
                  value={manualForm.employeeId}
                  onChange={(e) => setManualForm({ ...manualForm, employeeId: e.target.value })}
                  className="w-full rounded-lg border border-slate-200 p-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Employee Name</label>
                <input
                  type="text"
                  required
                  value={manualForm.employeeName}
                  onChange={(e) => setManualForm({ ...manualForm, employeeName: e.target.value })}
                  className="w-full rounded-lg border border-slate-200 p-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Date</label>
                <input
                  type="date"
                  required
                  value={manualForm.date}
                  onChange={(e) => setManualForm({ ...manualForm, date: e.target.value })}
                  className="w-full rounded-lg border border-slate-200 p-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Check In Time</label>
                  <input
                    type="time"
                    step="1"
                    value={manualForm.checkIn}
                    onChange={(e) => setManualForm({ ...manualForm, checkIn: e.target.value })}
                    className="w-full rounded-lg border border-slate-200 p-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Check Out Time</label>
                  <input
                    type="time"
                    step="1"
                    value={manualForm.checkOut}
                    onChange={(e) => setManualForm({ ...manualForm, checkOut: e.target.value })}
                    className="w-full rounded-lg border border-slate-200 p-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Status</label>
                <select
                  value={manualForm.status}
                  onChange={(e) => setManualForm({ ...manualForm, status: e.target.value as any })}
                  className="w-full rounded-lg border border-slate-200 p-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500 cursor-pointer"
                >
                  <option value="Present">Present</option>
                  <option value="Late">Late</option>
                  <option value="Half Day">Half Day</option>
                  <option value="Leave">Leave</option>
                  <option value="Absent">Absent</option>
                </select>
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Audit Reason / Remarks</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Biometric scanner offline at Bandra store"
                  value={manualForm.remarks}
                  onChange={(e) => setManualForm({ ...manualForm, remarks: e.target.value })}
                  className="w-full rounded-lg border border-slate-200 p-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsManualModalOpen(false)}
                  className="rounded-lg px-4 py-2 font-medium text-slate-600 hover:bg-slate-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-orange-600 px-5 py-2 font-bold text-white hover:bg-orange-700 cursor-pointer shadow-xs"
                >
                  Save Attendance Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

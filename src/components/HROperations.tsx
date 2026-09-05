import React, { useState } from 'react';
import {
  LifeBuoy,
  LogOut,
  Megaphone,
  AlertTriangle,
  Plus,
  CheckCircle2,
  Clock,
  Check,
  X,
  UserCheck,
  Building2,
  Calendar,
  Send,
} from 'lucide-react';
import { useHRMS } from '../context/HRMSContext';
import { formatDate } from '../utils/formatters';

export const HROperations: React.FC = () => {
  const {
    helpdeskTickets,
    resignations,
    createTicket,
    resolveTicket,
    initiateResignation,
    currentUser,
    showToast,
  } = useHRMS();

  const [activeTab, setActiveTab] = useState<'helpdesk' | 'offboarding' | 'circulars'>('helpdesk');

  // Ticket creation modal
  const [isTicketModalOpen, setIsTicketModalOpen] = useState(false);
  const [ticketForm, setTicketForm] = useState({
    subject: '',
    category: 'Payroll Discrepancy' as const,
    priority: 'Medium' as const,
    description: '',
  });

  // Resignation submission modal
  const [isResignModalOpen, setIsResignModalOpen] = useState(false);
  const [resignForm, setResignForm] = useState({
    reason: '',
    noticePeriodDays: 30,
  });

  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketForm.subject) return;
    createTicket(ticketForm);
    setIsTicketModalOpen(false);
    setTicketForm({ subject: '', category: 'Payroll Discrepancy', priority: 'Medium', description: '' });
  };

  const handleCreateResignation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resignForm.reason) return;
    initiateResignation(resignForm.reason, resignForm.noticePeriodDays);
    setIsResignModalOpen(false);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            HR Operations & Helpdesk
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium">
            Sugartown Retail Private Limited • Employee grievances, offboarding & official circulars
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setIsResignModalOpen(true)}
            className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer shadow-xs"
          >
            <LogOut className="h-4 w-4 text-slate-500" />
            <span>Submit Resignation</span>
          </button>
          <button
            onClick={() => setIsTicketModalOpen(true)}
            className="flex items-center gap-1.5 rounded-lg bg-orange-600 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-orange-700 cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            <span>New Helpdesk Ticket</span>
          </button>
        </div>
      </div>

      {/* 2. Top Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('helpdesk')}
          className={`flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'helpdesk'
              ? 'bg-orange-50 text-orange-700 border border-orange-200'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <LifeBuoy className="h-4 w-4" />
          <span>Helpdesk & Grievance Tickets ({helpdeskTickets.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('offboarding')}
          className={`flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'offboarding'
              ? 'bg-orange-50 text-orange-700 border border-orange-200'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <LogOut className="h-4 w-4" />
          <span>Offboarding & F&F Settlements ({resignations.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('circulars')}
          className={`flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'circulars'
              ? 'bg-orange-50 text-orange-700 border border-orange-200'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Megaphone className="h-4 w-4" />
          <span>Company Circulars & Broadcasts</span>
        </button>
      </div>

      {/* TAB 1: HELPDESK TICKETS */}
      {activeTab === 'helpdesk' && (
        <div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="border-b border-slate-200 bg-slate-50/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <tr>
                  <th className="py-3 pl-4 pr-2">Ticket #</th>
                  <th className="py-3 px-3">Employee</th>
                  <th className="py-3 px-3">Subject & Category</th>
                  <th className="py-3 px-3">Priority</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3">Created</th>
                  <th className="py-3 pr-4 pl-2 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {helpdeskTickets.map((t) => (
                  <tr key={t.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 pl-4 pr-2 font-mono font-bold text-slate-900">{t.ticketNumber}</td>
                    <td className="py-3 px-3">
                      <p className="font-bold text-slate-900">{t.employeeName}</p>
                      <span className="font-mono text-[10px] text-slate-400">{t.employeeId}</span>
                    </td>
                    <td className="py-3 px-3 max-w-[240px]">
                      <p className="font-semibold text-slate-900 truncate">{t.subject}</p>
                      <span className="text-[10px] text-slate-400">{t.category}</span>
                    </td>
                    <td className="py-3 px-3">
                      <span
                        className={`rounded-md px-2 py-0.5 text-[10px] font-bold ${
                          t.priority === 'High'
                            ? 'bg-rose-50 text-rose-700 border border-rose-200'
                            : t.priority === 'Medium'
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : 'bg-slate-100 text-slate-600 border border-slate-200'
                        }`}
                      >
                        {t.priority}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                          t.status === 'Resolved'
                            ? 'bg-green-50 text-green-700 border border-green-200'
                            : t.status === 'In Progress'
                            ? 'bg-blue-50 text-blue-700 border border-blue-200'
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}
                      >
                        {t.status}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-slate-400 whitespace-nowrap">{t.createdAt}</td>
                    <td className="py-3 pr-4 pl-2 text-right whitespace-nowrap">
                      {t.status !== 'Resolved' ? (
                        <button
                          onClick={() => resolveTicket(t.id, 'Resolved and verified with payroll ledger')}
                          className="rounded-lg bg-green-600 px-3 py-1 text-xs font-bold text-white hover:bg-green-700 cursor-pointer shadow-xs"
                        >
                          Resolve Ticket
                        </button>
                      ) : (
                        <span className="text-green-700 font-bold flex items-center justify-end gap-1">
                          <CheckCircle2 className="h-3.5 w-3.5" /> Resolved
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: OFFBOARDING */}
      {activeTab === 'offboarding' && (
        <div className="space-y-4">
          <div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-xs">
            <div className="p-4 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">Active Separation & Offboarding Pipeline</h3>
              <p className="text-xs text-slate-500">Notice period serving, department asset sign-offs, and F&F calculation</p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="border-b border-slate-200 bg-slate-50/80 text-[11px] font-bold text-slate-500 uppercase">
                  <tr>
                    <th className="py-3 pl-4 pr-2">Employee</th>
                    <th className="py-3 px-3">Resigned On</th>
                    <th className="py-3 px-3">Notice Period</th>
                    <th className="py-3 px-3">Last Working Day</th>
                    <th className="py-3 px-3">Clearance Checklist</th>
                    <th className="py-3 px-3">Status</th>
                    <th className="py-3 pr-4 pl-2 text-right">F&F Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {resignations.map((r) => (
                    <tr key={r.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 pl-4 pr-2">
                        <p className="font-bold text-slate-900">{r.employeeName}</p>
                        <span className="font-mono text-[10px] text-slate-400">{r.employeeId}</span>
                      </td>
                      <td className="py-3 px-3">{r.resignationDate}</td>
                      <td className="py-3 px-3 font-semibold text-slate-800">{r.noticePeriodDays} Days</td>
                      <td className="py-3 px-3 font-bold text-orange-600">{r.lastWorkingDay}</td>
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-1.5 text-[10px]">
                          <span
                            className={`px-1.5 py-0.5 rounded font-bold ${
                              r.itClearance ? 'bg-green-100 text-green-800' : 'bg-slate-100 text-slate-500'
                            }`}
                          >
                            IT: {r.itClearance ? 'Cleared' : 'Pending'}
                          </span>
                          <span
                            className={`px-1.5 py-0.5 rounded font-bold ${
                              r.financeClearance
                                ? 'bg-green-100 text-green-800'
                                : 'bg-slate-100 text-slate-500'
                            }`}
                          >
                            Finance: {r.financeClearance ? 'Cleared' : 'Pending'}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-3 whitespace-nowrap">
                        <span className="rounded-full bg-amber-50 text-amber-800 px-2.5 py-0.5 text-[10px] font-bold border border-amber-200">
                          {r.status}
                        </span>
                      </td>
                      <td className="py-3 pr-4 pl-2 text-right whitespace-nowrap">
                        <button
                          onClick={() => showToast(`F&F Settlement computed for ${r.employeeName}`, 'success')}
                          className="rounded-lg bg-slate-900 px-3 py-1 text-xs font-bold text-white hover:bg-slate-800 cursor-pointer shadow-xs"
                        >
                          Generate F&F
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: CIRCULARS */}
      {activeTab === 'circulars' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="rounded bg-orange-50 text-orange-700 text-[10px] font-bold px-2 py-0.5 border border-orange-200">
                  Corporate Announcement
                </span>
                <span className="text-xs text-slate-400">Sep 01, 2026</span>
              </div>
              <h3 className="text-sm font-bold text-slate-900">
                Annual Festive Allowance & Bonus Disbursal Schedule
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Sugartown Management is delighted to announce statutory festive bonus payout under the Payment of
                Bonus Act along with September salary cycle for all retail store crew and corporate employees.
              </p>
              <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-400">
                Issued by: Office of the Managing Director
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="rounded bg-orange-50 text-orange-700 text-[10px] font-bold px-2 py-0.5 border border-orange-200">
                  Retail Operations Circular
                </span>
                <span className="text-xs text-slate-400">Aug 20, 2026</span>
              </div>
              <h3 className="text-sm font-bold text-slate-900">
                Updated Biometric Punching Grace Period (15 Minutes)
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                In consideration of Mumbai local train monsoon track maintenance, store morning shift grace time has
                been extended to 15 minutes before half-day deduction triggers.
              </p>
              <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-400">
                Issued by: Human Resources Operations Team
              </div>
            </div>
          </div>
        </div>
      )}

      {/* New Ticket Modal */}
      {isTicketModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900">Raise HR / Payroll Helpdesk Ticket</h3>
              <button onClick={() => setIsTicketModalOpen(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateTicket} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Issue Subject</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Discrepancy in August HRA deduction"
                  value={ticketForm.subject}
                  onChange={(e) => setTicketForm({ ...ticketForm, subject: e.target.value })}
                  className="w-full rounded-lg border border-slate-200 p-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Category</label>
                  <select
                    value={ticketForm.category}
                    onChange={(e) => setTicketForm({ ...ticketForm, category: e.target.value as any })}
                    className="w-full rounded-lg border border-slate-200 p-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="Payroll Discrepancy">Payroll Discrepancy</option>
                    <option value="Leave Correction">Leave Correction</option>
                    <option value="Tax Query">Tax Query / Form 16</option>
                    <option value="IT Hardware">IT Hardware / Laptop</option>
                    <option value="Workplace Grievance">Workplace Grievance</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Priority</label>
                  <select
                    value={ticketForm.priority}
                    onChange={(e) => setTicketForm({ ...ticketForm, priority: e.target.value as any })}
                    className="w-full rounded-lg border border-slate-200 p-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Detailed Description</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Describe your issue with relevant dates or transaction amounts..."
                  value={ticketForm.description}
                  onChange={(e) => setTicketForm({ ...ticketForm, description: e.target.value })}
                  className="w-full rounded-lg border border-slate-200 p-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsTicketModalOpen(false)}
                  className="rounded-lg px-4 py-2 text-slate-600 hover:bg-slate-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-orange-600 px-4 py-2 font-bold text-white hover:bg-orange-700 cursor-pointer shadow-xs"
                >
                  Submit Ticket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Resignation Modal */}
      {isResignModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900">Initiate Formal Resignation</h3>
              <button onClick={() => setIsResignModalOpen(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateResignation} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Notice Period (Days)</label>
                <select
                  value={resignForm.noticePeriodDays}
                  onChange={(e) => setResignForm({ ...resignForm, noticePeriodDays: Number(e.target.value) })}
                  className="w-full rounded-lg border border-slate-200 p-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value={30}>30 Days (Standard Staff)</option>
                  <option value={60}>60 Days (Managerial / Operations Head)</option>
                  <option value={15}>15 Days (Probationary Notice)</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Reason for Separation</label>
                <textarea
                  rows={3}
                  required
                  placeholder="e.g. Relocating to Bangalore for family reasons"
                  value={resignForm.reason}
                  onChange={(e) => setResignForm({ ...resignForm, reason: e.target.value })}
                  className="w-full rounded-lg border border-slate-200 p-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsResignModalOpen(false)}
                  className="rounded-lg px-4 py-2 text-slate-600 hover:bg-slate-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-slate-900 px-4 py-2 font-bold text-white hover:bg-slate-800 cursor-pointer shadow-xs"
                >
                  Submit Formal Resignation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

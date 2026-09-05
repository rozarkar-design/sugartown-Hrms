import React, { useState, useEffect } from 'react';
import { Search, X, FileText, CalendarCheck, FolderLock, ArrowRight } from 'lucide-react';
import { useHRMS } from '../context/HRMSContext';
import { Employee } from '../types';

interface GlobalSearchModalProps {
  onSelectEmployee: (emp: Employee) => void;
  onNavigate: (tabId: string) => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({ onSelectEmployee, onNavigate }) => {
  const { isGlobalSearchOpen, setIsGlobalSearchOpen, employees, payslips, leaveRequests, documents } = useHRMS();
  const [query, setQuery] = useState('');

  // Keyboard shortcut Cmd+K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsGlobalSearchOpen(!isGlobalSearchOpen);
      }
      if (e.key === 'Escape') {
        setIsGlobalSearchOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isGlobalSearchOpen, setIsGlobalSearchOpen]);

  if (!isGlobalSearchOpen) return null;

  const q = query.toLowerCase().trim();

  const matchedEmployees = q
    ? employees.filter(
        (e) =>
          e.fullName.toLowerCase().includes(q) ||
          e.employeeId.toLowerCase().includes(q) ||
          e.department.toLowerCase().includes(q) ||
          e.officialEmail.toLowerCase().includes(q)
      )
    : [];

  const matchedPayslips = q
    ? payslips.filter(
        (p) =>
          p.employeeName.toLowerCase().includes(q) ||
          p.employeeId.toLowerCase().includes(q) ||
          p.month.toLowerCase().includes(q)
      )
    : [];

  const matchedLeaves = q
    ? leaveRequests.filter(
        (l) =>
          l.employeeName.toLowerCase().includes(q) ||
          l.leaveType.toLowerCase().includes(q) ||
          l.reason.toLowerCase().includes(q)
      )
    : [];

  const matchedDocuments = q
    ? documents.filter(
        (d) =>
          d.fileName.toLowerCase().includes(q) ||
          d.documentType.toLowerCase().includes(q) ||
          d.employeeName.toLowerCase().includes(q)
      )
    : [];

  const hasResults =
    matchedEmployees.length > 0 ||
    matchedPayslips.length > 0 ||
    matchedLeaves.length > 0 ||
    matchedDocuments.length > 0;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-slate-900/40 p-4 pt-20 backdrop-blur-xs">
      <div
        className="w-full max-w-2xl rounded-xl border border-slate-200 bg-white shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar - Professional Polish */}
        <div className="flex items-center border-b border-slate-200 px-4 py-3.5 gap-3 bg-white">
          <Search className="h-5 w-5 text-slate-400" />
          <input
            id="global-search-input"
            type="text"
            autoFocus
            placeholder="Search employees, department, payslips, leaves, documents..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-slate-400 hover:text-slate-600 text-xs font-medium cursor-pointer"
            >
              Clear
            </button>
          )}
          <button
            onClick={() => setIsGlobalSearchOpen(false)}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Results Area */}
        <div className="max-h-96 overflow-y-auto p-4 space-y-4 bg-white">
          {!q ? (
            <div className="py-8 text-center text-xs text-slate-400">
              <p className="font-semibold text-slate-700 text-sm">Quick Directory Search</p>
              <p className="mt-1 max-w-md mx-auto">
                Type an employee name (e.g. "Rohit", "Priya"), employee ID ("ST-1007"), department, or document name.
              </p>
            </div>
          ) : !hasResults ? (
            <div className="py-8 text-center text-xs text-slate-400">
              No results found for "<span className="font-semibold text-slate-700">{query}</span>"
            </div>
          ) : (
            <>
              {/* Matched Employees */}
              {matchedEmployees.length > 0 && (
                <div>
                  <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                    Employees ({matchedEmployees.length})
                  </h4>
                  <div className="space-y-1">
                    {matchedEmployees.map((emp) => (
                      <div
                        key={emp.id}
                        onClick={() => {
                          onSelectEmployee(emp);
                          setIsGlobalSearchOpen(false);
                        }}
                        className="flex items-center justify-between p-2.5 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors group border border-transparent hover:border-slate-100"
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={emp.photoUrl}
                            alt={emp.fullName}
                            className="h-8 w-8 rounded-lg object-cover ring-1 ring-slate-200"
                          />
                          <div>
                            <p className="text-xs font-semibold text-slate-900 group-hover:text-orange-600 transition-colors">
                              {emp.fullName}{' '}
                              <span className="font-normal text-slate-400 text-[11px]">({emp.employeeId})</span>
                            </p>
                            <p className="text-[11px] text-slate-400">
                              {emp.designation} • {emp.department}
                            </p>
                          </div>
                        </div>
                        <ArrowRight className="h-4 w-4 text-slate-300 group-hover:text-orange-600 group-hover:translate-x-0.5 transition-all" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Matched Payslips */}
              {matchedPayslips.length > 0 && (
                <div>
                  <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                    Payslips ({matchedPayslips.length})
                  </h4>
                  <div className="space-y-1">
                    {matchedPayslips.map((ps) => (
                      <div
                        key={ps.id}
                        onClick={() => {
                          onNavigate('payroll');
                          setIsGlobalSearchOpen(false);
                        }}
                        className="flex items-center justify-between p-2.5 rounded-lg hover:bg-slate-50 cursor-pointer group border border-transparent hover:border-slate-100"
                      >
                        <div className="flex items-center gap-3">
                          <div className="p-1.5 rounded-lg bg-green-50 text-green-700">
                            <FileText className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="text-xs font-semibold text-slate-900">
                              {ps.month} — {ps.employeeName}
                            </p>
                            <p className="text-[11px] text-slate-400">
                              Net Pay: ₹{ps.netPay.toLocaleString('en-IN')} • {ps.payslipNumber}
                            </p>
                          </div>
                        </div>
                        <span className="text-[10px] font-semibold bg-green-50 text-green-700 rounded px-2 py-0.5 border border-green-200">
                          {ps.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Matched Leaves */}
              {matchedLeaves.length > 0 && (
                <div>
                  <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                    Leave Requests ({matchedLeaves.length})
                  </h4>
                  <div className="space-y-1">
                    {matchedLeaves.map((l) => (
                      <div
                        key={l.id}
                        onClick={() => {
                          onNavigate('leaves');
                          setIsGlobalSearchOpen(false);
                        }}
                        className="flex items-center justify-between p-2.5 rounded-lg hover:bg-slate-50 cursor-pointer group border border-transparent hover:border-slate-100"
                      >
                        <div className="flex items-center gap-3">
                          <div className="p-1.5 rounded-lg bg-orange-50 text-orange-600">
                            <CalendarCheck className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="text-xs font-semibold text-slate-900">
                              {l.employeeName} — {l.leaveType} ({l.numberOfDays}d)
                            </p>
                            <p className="text-[11px] text-slate-400">
                              {l.fromDate} to {l.toDate} • "{l.reason}"
                            </p>
                          </div>
                        </div>
                        <span className="text-[10px] font-semibold bg-orange-50 text-orange-700 rounded px-2 py-0.5 border border-orange-200">
                          {l.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Matched Documents */}
              {matchedDocuments.length > 0 && (
                <div>
                  <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                    Documents ({matchedDocuments.length})
                  </h4>
                  <div className="space-y-1">
                    {matchedDocuments.map((doc) => (
                      <div
                        key={doc.id}
                        onClick={() => {
                          onNavigate('documents');
                          setIsGlobalSearchOpen(false);
                        }}
                        className="flex items-center justify-between p-2.5 rounded-lg hover:bg-slate-50 cursor-pointer group border border-transparent hover:border-slate-100"
                      >
                        <div className="flex items-center gap-3">
                          <div className="p-1.5 rounded-lg bg-slate-100 text-slate-600">
                            <FolderLock className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="text-xs font-semibold text-slate-900">{doc.fileName}</p>
                            <p className="text-[11px] text-slate-400">
                              {doc.documentType} • {doc.employeeName} ({doc.fileSize})
                            </p>
                          </div>
                        </div>
                        <span className="text-[10px] font-medium bg-slate-100 text-slate-700 rounded px-2 py-0.5">
                          {doc.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Modal Footer */}
        <div className="border-t border-slate-100 bg-slate-50 px-4 py-2.5 flex items-center justify-between text-[11px] text-slate-500">
          <div className="flex items-center gap-3">
            <span>
              Press <kbd className="rounded bg-white border border-slate-200 px-1 font-mono text-slate-600">ESC</kbd> to close
            </span>
          </div>
          <span className="font-semibold text-slate-700">Sugartown Retail Directory</span>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import {
  CreditCard,
  CheckCircle2,
  Lock,
  Unlock,
  Download,
  FileSpreadsheet,
  FileText,
  AlertTriangle,
  Play,
  ArrowRight,
  Shield,
  HelpCircle,
  Eye,
} from 'lucide-react';
import { useHRMS } from '../context/HRMSContext';
import { formatINR, formatDate } from '../utils/formatters';
import { Payslip } from '../types';

interface PayrollManagementProps {
  onViewPayslip: (ps: Payslip) => void;
}

export const PayrollManagement: React.FC<PayrollManagementProps> = ({ onViewPayslip }) => {
  const {
    payrollRuns,
    payslips,
    salaryComponents,
    processPayrollRun,
    updatePayrollStatus,
    lockPayrollRun,
    currentUser,
    showToast,
  } = useHRMS();

  const [selectedMonthKey, setSelectedMonthKey] = useState<string>('2026-09');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  // Current active payroll run
  const activeRun = payrollRuns.find((p) => p.monthKey === selectedMonthKey) || payrollRuns[0];
  const monthPayslips = payslips.filter((p) => p.monthKey === selectedMonthKey);

  const handleRunPayroll = () => {
    setIsProcessing(true);
    setTimeout(() => {
      processPayrollRun(selectedMonthKey);
      setIsProcessing(false);
    }, 600);
  };

  const handleExportBankTransferFile = () => {
    const header = 'Beneficiary Name,Beneficiary Account Number,IFSC Code,Bank Name,Amount (INR),Transaction Type,Remarks\n';
    const rows = monthPayslips
      .map(
        (p) =>
          `"${p.employeeName}","${p.maskedAccountNumber}","HDFC0000060","${p.bankName}","${p.netPay}","NEFT","SALARY_${selectedMonthKey}"`
      )
      .join('\n');
    const blob = new Blob([header + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Sugartown_NEFT_Bank_Salary_Transfer_${selectedMonthKey}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('NEFT Bank Disbursal Batch File exported successfully', 'success');
  };

  const handleExportEPFECR = () => {
    // ECR Text File format: UAN#MEMBER_NAME#GROSS#EPF_WAGES#EPS_WAGES#EDLI_WAGES#EE_SHARE#ER_SHARE#EPS_SHARE
    const ecrLines = monthPayslips.map((p) => {
      const epfWage = Math.min(15000, p.earnings.basicSalary);
      const eeShare = Math.round(p.earnings.basicSalary * 0.12);
      const epsShare = Math.round(epfWage * 0.0833);
      const erShare = eeShare - epsShare;
      return `${p.uan || '100481920999'}#~#${p.employeeName}#~#${p.earnings.totalEarnings}#~#${p.earnings.basicSalary}#~#${epfWage}#~#${epfWage}#~#${eeShare}#~#${erShare}#~#${epsShare}#~#0#~#0`;
    });
    const content = ecrLines.join('\n');
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Sugartown_EPF_ECR_${selectedMonthKey}.txt`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('EPFO Unified Portal ECR Electronic Challan Text File generated', 'success');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* 1. Header with Period Selector & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Payroll Engine & Indian Statutory Compliance
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium">
            Sugartown Retail Private Limited • EPF, ESIC, PT, TDS & Direct Bank Remittance
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <select
            value={selectedMonthKey}
            onChange={(e) => setSelectedMonthKey(e.target.value)}
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500 cursor-pointer shadow-xs"
          >
            <option value="2026-09">September 2026 (Active)</option>
            <option value="2026-08">August 2026 (Locked)</option>
            <option value="2026-07">July 2026 (Archived)</option>
          </select>

          <button
            onClick={handleExportBankTransferFile}
            className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-colors cursor-pointer shadow-xs"
          >
            <Download className="h-4 w-4 text-slate-500" />
            <span>NEFT Bank Transfer CSV</span>
          </button>

          <button
            onClick={handleExportEPFECR}
            className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-colors cursor-pointer shadow-xs"
          >
            <FileText className="h-4 w-4 text-slate-500" />
            <span>EPF ECR Text File</span>
          </button>

          {activeRun.status !== 'Locked' ? (
            <button
              id="run-payroll-engine-btn"
              onClick={handleRunPayroll}
              disabled={isProcessing}
              className="flex items-center gap-1.5 rounded-lg bg-orange-600 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-orange-700 transition-colors disabled:opacity-50 cursor-pointer"
            >
              <Play className="h-3.5 w-3.5 fill-current" />
              <span>{isProcessing ? 'Calculating Deductions...' : 'Recalculate & Run Payroll'}</span>
            </button>
          ) : (
            <span className="flex items-center gap-1.5 rounded-lg bg-slate-100 px-3.5 py-2 text-xs font-bold text-slate-600">
              <Lock className="h-3.5 w-3.5" />
              <span>Period Locked by Super Admin</span>
            </span>
          )}
        </div>
      </div>

      {/* 2. Payroll Workflow Status Ribbon */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Payroll Lifecycle Stage</h3>
              <span
                className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${
                  activeRun.status === 'Locked'
                    ? 'bg-slate-100 text-slate-800'
                    : activeRun.status === 'Processed'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-amber-100 text-amber-800'
                }`}
              >
                {activeRun.status}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Current cycle status for {activeRun.month}. {activeRun.lockedBy && `Locked by: ${activeRun.lockedBy}`}
            </p>
          </div>

          {/* Stepper Pipeline */}
          <div className="flex items-center gap-1.5 overflow-x-auto text-xs">
            {['Draft', 'Calculated', 'Verified', 'Approved', 'Processed', 'Locked'].map((step, idx) => {
              const stepIdx = ['Draft', 'Calculated', 'Verified', 'Approved', 'Processed', 'Locked'].indexOf(activeRun.status);
              const isPast = idx <= stepIdx;
              const isCurrent = step === activeRun.status;
              return (
                <div key={step} className="flex items-center gap-1.5">
                  <div
                    onClick={() => {
                      if (step !== 'Locked') updatePayrollStatus(activeRun.id, step as any);
                    }}
                    className={`px-3 py-1 rounded-lg font-bold cursor-pointer transition-all ${
                      isCurrent
                        ? 'bg-orange-600 text-white shadow-xs'
                        : isPast
                        ? 'bg-green-50 text-green-800 border border-green-200'
                        : 'bg-slate-100 text-slate-400'
                    }`}
                  >
                    {step}
                  </div>
                  {idx < 5 && <ArrowRight className="h-3 w-3 text-slate-300" />}
                </div>
              );
            })}
          </div>

          {/* Super Admin Lock Button */}
          {activeRun.status !== 'Locked' && currentUser.role === 'SUPER_ADMIN' && (
            <button
              onClick={() => lockPayrollRun(activeRun.id)}
              className="flex items-center gap-1.5 rounded-lg border border-slate-300 bg-slate-900 px-4 py-1.5 text-xs font-bold text-white hover:bg-slate-800 cursor-pointer shadow-xs"
            >
              <Lock className="h-3.5 w-3.5" />
              <span>Lock Period</span>
            </button>
          )}
        </div>
      </div>

      {/* 3. Financial Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Headcount</span>
          <p className="text-2xl font-black text-slate-900 mt-2">{activeRun.totalEmployees} Employees</p>
          <p className="text-[11px] text-slate-500 mt-1">Paid on 30-day roster basis</p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Gross Payroll</span>
          <p className="text-2xl font-black text-slate-900 mt-2">{formatINR(activeRun.grossSalary)}</p>
          <p className="text-[11px] text-slate-500 mt-1">Basic + HRA + Allowances</p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Statutory Deductions</span>
          <p className="text-2xl font-black text-orange-600 mt-2">{formatINR(activeRun.totalDeductions)}</p>
          <p className="text-[11px] text-slate-500 mt-1">EPF (12%), ESIC (0.75%), PT, TDS</p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Net Salary Disbursal</span>
          <p className="text-2xl font-black text-green-600 mt-2">{formatINR(activeRun.netSalary)}</p>
          <p className="text-[11px] text-slate-500 mt-1">Direct NEFT to Bank Accounts</p>
        </div>
      </div>

      {/* 4. Statutory Breakdown Matrix */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Statutory Deductions & Contributions</h3>
            <p className="text-xs text-slate-500">
              Indian regulatory rates enforced by the Sugartown Payroll Engine
            </p>
          </div>
          <span className="text-xs font-bold text-green-700 bg-green-50 px-2.5 py-1 rounded-md border border-green-200">
            Automated Statutory Slabs
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
          <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200/80 space-y-1">
            <p className="font-bold text-slate-900">EPF (Employee 12%)</p>
            <p className="text-slate-500 text-[11px]">Calculated on Basic salary (Capped at ₹15,000 for statutory)</p>
            <p className="text-sm font-bold text-slate-900 pt-1">
              {formatINR(monthPayslips.reduce((acc, p) => acc + p.deductions.employeePf, 0))}
            </p>
          </div>

          <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200/80 space-y-1">
            <p className="font-bold text-slate-900">ESIC (Employee 0.75%)</p>
            <p className="text-slate-500 text-[11px]">Applicable on gross wages up to ₹21,000 per month</p>
            <p className="text-sm font-bold text-slate-900 pt-1">
              {formatINR(monthPayslips.reduce((acc, p) => acc + p.deductions.esic, 0))}
            </p>
          </div>

          <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200/80 space-y-1">
            <p className="font-bold text-slate-900">Maharashtra PT (₹200/mo)</p>
            <p className="text-slate-500 text-[11px]">Professional Tax slab for monthly salary &gt; ₹10,000</p>
            <p className="text-sm font-bold text-slate-900 pt-1">
              {formatINR(monthPayslips.reduce((acc, p) => acc + p.deductions.professionalTax, 0))}
            </p>
          </div>

          <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200/80 space-y-1">
            <p className="font-bold text-slate-900">TDS / Income Tax</p>
            <p className="text-slate-500 text-[11px]">Computed under Section 192 as per regime declaration</p>
            <p className="text-sm font-bold text-slate-900 pt-1">
              {formatINR(monthPayslips.reduce((acc, p) => acc + p.deductions.tds, 0))}
            </p>
          </div>
        </div>
      </div>

      {/* 5. Employee Payroll Register Table */}
      <div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-xs">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900">Employee Payroll Register ({monthPayslips.length})</h3>
          <span className="text-xs text-slate-500">Click any row to open the formal printable payslip</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="border-b border-slate-200 bg-slate-50/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              <tr>
                <th className="py-3 pl-4 pr-2">Employee</th>
                <th className="py-3 px-3">Designation</th>
                <th className="py-3 px-3">Paid Days</th>
                <th className="py-3 px-3">Basic (₹)</th>
                <th className="py-3 px-3">HRA (₹)</th>
                <th className="py-3 px-3">Gross Earnings</th>
                <th className="py-3 px-3">EPF (₹)</th>
                <th className="py-3 px-3">PT (₹)</th>
                <th className="py-3 px-3">Net Take-Home</th>
                <th className="py-3 pr-4 pl-2 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {monthPayslips.map((ps) => (
                <tr
                  key={ps.id}
                  className="hover:bg-slate-50 transition-colors cursor-pointer group"
                  onClick={() => onViewPayslip(ps)}
                >
                  <td className="py-3 pl-4 pr-2">
                    <p className="font-bold text-slate-900 group-hover:text-orange-600 transition-colors">
                      {ps.employeeName}
                    </p>
                    <span className="font-mono text-[10px] text-slate-400">{ps.employeeId}</span>
                  </td>
                  <td className="py-3 px-3 text-slate-600">{ps.designation}</td>
                  <td className="py-3 px-3 font-semibold text-slate-900">{ps.paidDays}d</td>
                  <td className="py-3 px-3">{formatINR(ps.earnings.basicSalary)}</td>
                  <td className="py-3 px-3">{formatINR(ps.earnings.hra)}</td>
                  <td className="py-3 px-3 font-bold text-slate-900">
                    {formatINR(ps.earnings.totalEarnings)}
                  </td>
                  <td className="py-3 px-3 text-orange-600">{formatINR(ps.deductions.employeePf)}</td>
                  <td className="py-3 px-3 text-slate-600">₹{ps.deductions.professionalTax}</td>
                  <td className="py-3 px-3 font-black text-green-700 whitespace-nowrap">
                    {formatINR(ps.netPay)}
                  </td>
                  <td className="py-3 pr-4 pl-2 text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => onViewPayslip(ps)}
                      className="inline-flex items-center gap-1 rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-200 cursor-pointer transition-colors"
                    >
                      <Eye className="h-3.5 w-3.5" />
                      <span>Payslip</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

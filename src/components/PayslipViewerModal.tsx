import React from 'react';
import { X, Printer } from 'lucide-react';
import { Payslip } from '../types';
import { formatINR, formatDate, maskPAN } from '../utils/formatters';

interface PayslipViewerModalProps {
  payslip: Payslip | null;
  onClose: () => void;
}

export const PayslipViewerModal: React.FC<PayslipViewerModalProps> = ({ payslip, onClose }) => {
  if (!payslip) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-2 sm:p-4 backdrop-blur-xs overflow-y-auto print:p-0 print:bg-white print:static">
      {/* Container - Professional Polish */}
      <div className="w-full max-w-3xl rounded-2xl border border-slate-200 bg-white shadow-xl overflow-hidden flex flex-col my-auto print:border-none print:shadow-none print:max-w-none">
        {/* Modal Top Control Bar (Hidden on print) */}
        <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-6 py-3.5 print:hidden">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-800">Payslip Preview</span>
            <span className="rounded bg-orange-50 px-2 py-0.5 text-[10px] font-bold text-orange-700 border border-orange-200">
              {payslip.payslipNumber}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 rounded-lg bg-orange-600 px-3.5 py-1.5 text-xs font-bold text-white hover:bg-orange-700 transition-colors cursor-pointer shadow-sm"
            >
              <Printer className="h-3.5 w-3.5" />
              <span>Print / Save as PDF</span>
            </button>
            <button
              onClick={onClose}
              className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-200 hover:text-slate-700 cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Printable Formal Payslip Document Content */}
        <div className="p-6 sm:p-8 space-y-6 text-slate-800 text-xs bg-white" id="printable-payslip">
          {/* Company Header */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between border-b-2 border-slate-900 pb-5 gap-4">
            <div>
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-500 text-white font-bold text-base shadow-sm">
                  S
                </div>
                <div>
                  <h1 className="text-lg font-bold text-slate-900 tracking-tight">
                    SUGARTOWN RETAIL PRIVATE LIMITED
                  </h1>
                  <p className="text-[11px] text-slate-500 font-medium">CIN: U52100MH2020PTC345678</p>
                </div>
              </div>
              <p className="text-[11px] text-slate-600 mt-2 max-w-md">
                Registered Office: Heritage Arcade, Kala Ghoda, Fort, Mumbai 400001, Maharashtra, India
              </p>
            </div>

            <div className="sm:text-right">
              <span className="inline-block rounded-md bg-slate-100 px-3 py-1 text-xs font-bold text-slate-900 tracking-wide uppercase">
                SALARY PAYSLIP
              </span>
              <p className="text-sm font-bold text-slate-900 mt-1">{payslip.month}</p>
              <p className="text-[11px] text-slate-500 font-mono">Ref: {payslip.payslipNumber}</p>
            </div>
          </div>

          {/* Employee & Bank Summary Grid */}
          <div className="rounded-xl border border-slate-200 p-4 bg-slate-50/50">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-y-3 gap-x-4">
              <div>
                <span className="text-[10px] uppercase font-semibold text-slate-400">Employee ID</span>
                <p className="font-bold text-slate-900 font-mono">{payslip.employeeId}</p>
              </div>
              <div>
                <span className="text-[10px] uppercase font-semibold text-slate-400">Employee Name</span>
                <p className="font-bold text-slate-900">{payslip.employeeName}</p>
              </div>
              <div>
                <span className="text-[10px] uppercase font-semibold text-slate-400">Designation</span>
                <p className="font-semibold text-slate-800">{payslip.designation}</p>
              </div>
              <div>
                <span className="text-[10px] uppercase font-semibold text-slate-400">Department</span>
                <p className="font-semibold text-slate-800">{payslip.department}</p>
              </div>

              <div>
                <span className="text-[10px] uppercase font-semibold text-slate-400">Date of Joining</span>
                <p className="font-medium text-slate-800">{formatDate(payslip.dateOfJoining)}</p>
              </div>
              <div>
                <span className="text-[10px] uppercase font-semibold text-slate-400">Work Location</span>
                <p className="font-medium text-slate-800">{payslip.workLocation}</p>
              </div>
              <div>
                <span className="text-[10px] uppercase font-semibold text-slate-400">Bank Name</span>
                <p className="font-medium text-slate-800">{payslip.bankName}</p>
              </div>
              <div>
                <span className="text-[10px] uppercase font-semibold text-slate-400">Bank Account</span>
                <p className="font-mono font-medium text-slate-800">{payslip.maskedAccountNumber}</p>
              </div>

              <div>
                <span className="text-[10px] uppercase font-semibold text-slate-400">Income Tax PAN</span>
                <p className="font-mono font-medium text-slate-800">{maskPAN(payslip.panNumber)}</p>
              </div>
              <div>
                <span className="text-[10px] uppercase font-semibold text-slate-400">EPFO UAN</span>
                <p className="font-mono font-medium text-slate-800">{payslip.uan || '100481920999'}</p>
              </div>
              <div>
                <span className="text-[10px] uppercase font-semibold text-slate-400">Paid Working Days</span>
                <p className="font-bold text-slate-900">{payslip.paidDays} Days</p>
              </div>
              <div>
                <span className="text-[10px] uppercase font-semibold text-slate-400">LOP / Absent Days</span>
                <p className="font-bold text-slate-900">{payslip.leaveWithoutPay || 0} Days</p>
              </div>
            </div>
          </div>

          {/* Earnings vs. Deductions 2-Column Table */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Left: Earnings */}
            <div className="rounded-xl border border-slate-200 overflow-hidden">
              <div className="bg-slate-100 px-4 py-2.5 font-bold text-slate-900 flex justify-between">
                <span>EARNINGS</span>
                <span>AMOUNT (₹)</span>
              </div>
              <div className="divide-y divide-slate-100 p-2 space-y-1">
                <div className="flex justify-between py-1.5 px-2">
                  <span className="text-slate-700">Basic Salary</span>
                  <span className="font-semibold">{formatINR(payslip.earnings.basicSalary)}</span>
                </div>
                <div className="flex justify-between py-1.5 px-2">
                  <span className="text-slate-700">House Rent Allowance (HRA)</span>
                  <span className="font-semibold">{formatINR(payslip.earnings.hra)}</span>
                </div>
                <div className="flex justify-between py-1.5 px-2">
                  <span className="text-slate-700">Conveyance Allowance</span>
                  <span className="font-semibold">{formatINR(payslip.earnings.conveyance)}</span>
                </div>
                <div className="flex justify-between py-1.5 px-2">
                  <span className="text-slate-700">Medical Allowance</span>
                  <span className="font-semibold">{formatINR(payslip.earnings.medicalAllowance)}</span>
                </div>
                <div className="flex justify-between py-1.5 px-2">
                  <span className="text-slate-700">Special Allowance</span>
                  <span className="font-semibold">{formatINR(payslip.earnings.specialAllowance)}</span>
                </div>
                {payslip.earnings.incentives > 0 && (
                  <div className="flex justify-between py-1.5 px-2">
                    <span className="text-slate-700">Performance Incentive</span>
                    <span className="font-semibold">{formatINR(payslip.earnings.incentives)}</span>
                  </div>
                )}
              </div>
              <div className="bg-slate-50 px-4 py-2.5 font-bold text-slate-900 flex justify-between border-t border-slate-200">
                <span>TOTAL GROSS EARNINGS (A)</span>
                <span className="text-slate-900">{formatINR(payslip.earnings.totalEarnings)}</span>
              </div>
            </div>

            {/* Right: Deductions */}
            <div className="rounded-xl border border-slate-200 overflow-hidden">
              <div className="bg-slate-100 px-4 py-2.5 font-bold text-slate-900 flex justify-between">
                <span>DEDUCTIONS</span>
                <span>AMOUNT (₹)</span>
              </div>
              <div className="divide-y divide-slate-100 p-2 space-y-1">
                <div className="flex justify-between py-1.5 px-2">
                  <span className="text-slate-700">Employee Provident Fund (EPF 12%)</span>
                  <span className="font-semibold text-rose-600">{formatINR(payslip.deductions.employeePf)}</span>
                </div>
                <div className="flex justify-between py-1.5 px-2">
                  <span className="text-slate-700">Employee State Insurance (ESIC)</span>
                  <span className="font-semibold text-rose-600">
                    {payslip.deductions.esic > 0 ? formatINR(payslip.deductions.esic) : '₹0 (Exempt)'}
                  </span>
                </div>
                <div className="flex justify-between py-1.5 px-2">
                  <span className="text-slate-700">Maharashtra Professional Tax (PT)</span>
                  <span className="font-semibold text-rose-600">₹{payslip.deductions.professionalTax}</span>
                </div>
                <div className="flex justify-between py-1.5 px-2">
                  <span className="text-slate-700">Tax Deducted at Source (TDS)</span>
                  <span className="font-semibold text-rose-600">{formatINR(payslip.deductions.tds)}</span>
                </div>
                {payslip.deductions.loanEmi > 0 && (
                  <div className="flex justify-between py-1.5 px-2">
                    <span className="text-slate-700">Company Loan EMI</span>
                    <span className="font-semibold text-rose-600">{formatINR(payslip.deductions.loanEmi)}</span>
                  </div>
                )}
              </div>
              <div className="bg-slate-50 px-4 py-2.5 font-bold text-slate-900 flex justify-between border-t border-slate-200">
                <span>TOTAL DEDUCTIONS (B)</span>
                <span className="text-rose-600">{formatINR(payslip.deductions.totalDeductions)}</span>
              </div>
            </div>
          </div>

          {/* Net Salary Highlight Box */}
          <div className="rounded-xl bg-slate-900 text-white p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-slate-400 text-xs uppercase tracking-wider font-semibold">
                NET TAKE-HOME PAY (A - B)
              </span>
              <p className="text-xs text-slate-300 mt-0.5">
                In Words: <strong className="text-white">{payslip.netPayInWords}</strong>
              </p>
            </div>
            <div className="sm:text-right">
              <span className="text-2xl sm:text-3xl font-bold text-green-400 tracking-tight">
                {formatINR(payslip.netPay)}
              </span>
            </div>
          </div>

          {/* Footer & Digital Verification */}
          <div className="border-t border-slate-200 pt-6 flex flex-col sm:flex-row justify-between items-end gap-6 text-[11px] text-slate-500">
            <div>
              <p className="font-semibold text-slate-700">Important Note:</p>
              <p>This is a computer-generated document and requires no physical signature.</p>
              <p className="mt-0.5">Disbursed via corporate NEFT batch transfer to registered bank account.</p>
            </div>

            <div className="text-left sm:text-right">
              <div className="border-b border-slate-400 pb-1 mb-1 font-bold text-slate-900">
                For Sugartown Retail Private Limited
              </div>
              <p className="text-[10px] text-slate-400">Authorized Human Resources & Payroll Signatory</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import {
  ShieldCheck,
  FileText,
  Download,
  Building2,
  Calculator,
  Percent,
  Landmark,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
} from 'lucide-react';
import { useHRMS } from '../context/HRMSContext';
import { formatINR } from '../utils/formatters';

export const StatutoryCompliance: React.FC = () => {
  const { payslips, employees, showToast } = useHRMS();
  const [activeTab, setActiveTab] = useState<'epf' | 'esic' | 'pt' | 'tds' | 'gratuity'>('epf');

  // Interactive Gratuity Calculator State
  const [gratuityBasic, setGratuityBasic] = useState<number>(35000);
  const [gratuityYears, setGratuityYears] = useState<number>(5.5);

  const calculatedGratuity = Math.round((15 * gratuityBasic * gratuityYears) / 26);

  // Total Statutory calculations for current payslips
  const totalEPF = payslips.reduce((acc, p) => acc + p.deductions.employeePf, 0);
  const totalESIC = payslips.reduce((acc, p) => acc + p.deductions.esic, 0);
  const totalPT = payslips.reduce((acc, p) => acc + p.deductions.professionalTax, 0);
  const totalTDS = payslips.reduce((acc, p) => acc + p.deductions.tds, 0);

  const handleDownloadForm = (formName: string) => {
    showToast(`${formName} generated and ready for filing portal`, 'success');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Indian Statutory Compliance & Returns Hub
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium">
            Sugartown Retail Private Limited • EPFO, ESIC, Maharashtra PT & Section 192 TDS
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="rounded-md bg-green-50 px-3 py-1 text-xs font-bold text-green-700 border border-green-200">
            FY 2026-27 Compliant
          </span>
        </div>
      </div>

      {/* 2. Top Level Compliance Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">EPFO Contribution</span>
          <p className="text-2xl font-black text-slate-900 mt-2">{formatINR(totalEPF * 2)}</p>
          <p className="text-[11px] text-slate-500 mt-1">
            Employee ({formatINR(totalEPF)}) + Employer ({formatINR(totalEPF)})
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">ESIC Fund</span>
          <p className="text-2xl font-black text-slate-900 mt-2">{formatINR(Math.round(totalESIC * 5.33))}</p>
          <p className="text-[11px] text-slate-500 mt-1">For wages &le; ₹21,000 / month</p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Maharashtra PT</span>
          <p className="text-2xl font-black text-slate-900 mt-2">{formatINR(totalPT)}</p>
          <p className="text-[11px] text-slate-500 mt-1">Form III-B Monthly Return</p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">TDS under Sec 192</span>
          <p className="text-2xl font-black text-orange-600 mt-2">{formatINR(totalTDS)}</p>
          <p className="text-[11px] text-slate-500 mt-1">Challan 281 & Form 24Q</p>
        </div>
      </div>

      {/* 3. Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('epf')}
          className={`flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'epf'
              ? 'bg-orange-50 text-orange-700 border border-orange-200'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Landmark className="h-4 w-4" />
          <span>EPF (12% + 12%)</span>
        </button>

        <button
          onClick={() => setActiveTab('esic')}
          className={`flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'esic'
              ? 'bg-orange-50 text-orange-700 border border-orange-200'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <ShieldCheck className="h-4 w-4" />
          <span>ESIC (0.75% + 3.25%)</span>
        </button>

        <button
          onClick={() => setActiveTab('pt')}
          className={`flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'pt'
              ? 'bg-orange-50 text-orange-700 border border-orange-200'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Percent className="h-4 w-4" />
          <span>Maharashtra PT</span>
        </button>

        <button
          onClick={() => setActiveTab('tds')}
          className={`flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'tds'
              ? 'bg-orange-50 text-orange-700 border border-orange-200'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <FileText className="h-4 w-4" />
          <span>Income Tax TDS & Regimes</span>
        </button>

        <button
          onClick={() => setActiveTab('gratuity')}
          className={`flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'gratuity'
              ? 'bg-orange-50 text-orange-700 border border-orange-200'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Calculator className="h-4 w-4" />
          <span>Gratuity Act Calculator</span>
        </button>
      </div>

      {/* TAB CONTENT 1: EPF */}
      {activeTab === 'epf' && (
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">Employees' Provident Fund (EPF & MP Act, 1952)</h3>
              <p className="text-xs text-slate-500">
                Sugartown EPFO Establishment Code: MH/BAN/0049281/000
              </p>
            </div>
            <button
              onClick={() => handleDownloadForm('EPF Electronic Challan Cum Return (ECR)')}
              className="flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-xs font-bold text-white hover:bg-slate-800 cursor-pointer shadow-xs"
            >
              <Download className="h-4 w-4" />
              <span>Download ECR Format</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
            <div className="space-y-3">
              <h4 className="font-bold text-slate-900">Contribution Breakdown per Employee</h4>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2.5">
                <div className="flex justify-between">
                  <span className="text-slate-600">Employee Share (EPF)</span>
                  <span className="font-bold text-slate-900">12.00% of Basic Wages</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Employer Share (EPS - Pension Fund)</span>
                  <span className="font-bold text-slate-900">8.33% (Capped at ₹1,250)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Employer Share (EPF Difference)</span>
                  <span className="font-bold text-slate-900">3.67%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">EDLI (Deposit Linked Insurance)</span>
                  <span className="font-bold text-slate-900">0.50%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">EPF Administrative Charges</span>
                  <span className="font-bold text-slate-900">0.50%</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-bold text-slate-900">Filing Calendar & Deadlines</h4>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-slate-600">
                <p>
                  <strong className="text-slate-900">Monthly Deposit Deadline:</strong> 15th of following calendar month via Unified EPFO Portal.
                </p>
                <p>
                  <strong className="text-slate-900">Form 5 & 10:</strong> Return of employees qualifying for membership and leaving service.
                </p>
                <p>
                  <strong className="text-slate-900">Form 3A & 6A:</strong> Annual contribution statement for audited submission.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT 2: ESIC */}
      {activeTab === 'esic' && (
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">Employee State Insurance (ESI Act, 1948)</h3>
              <p className="text-xs text-slate-500">
                Coverage for retail store associates with gross monthly wages up to ₹21,000
              </p>
            </div>
            <button
              onClick={() => handleDownloadForm('ESIC Monthly Contribution Return')}
              className="flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-xs font-bold text-white hover:bg-slate-800 cursor-pointer shadow-xs"
            >
              <Download className="h-4 w-4" />
              <span>Download Monthly Return</span>
            </button>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-2 max-w-xl">
            <div className="flex justify-between">
              <span className="text-slate-600">Employee Share:</span>
              <strong className="text-slate-900">0.75% of Gross Wages</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Employer Share:</span>
              <strong className="text-slate-900">3.25% of Gross Wages</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Total Contribution:</span>
              <strong className="text-orange-600">4.00% of Gross Wages</strong>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT 3: PROFESSIONAL TAX */}
      {activeTab === 'pt' && (
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">Maharashtra Professional Tax (PT Act, 1975)</h3>
              <p className="text-xs text-slate-500">
                PTRC Number: 27948204910P • Government of Maharashtra
              </p>
            </div>
            <button
              onClick={() => handleDownloadForm('Maharashtra PT Form III-B Return')}
              className="flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-xs font-bold text-white hover:bg-slate-800 cursor-pointer shadow-xs"
            >
              <Download className="h-4 w-4" />
              <span>Download Form III-B</span>
            </button>
          </div>

          <div className="rounded-xl border border-slate-200 overflow-hidden text-xs">
            <table className="w-full text-left">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold">
                <tr>
                  <th className="p-3">Monthly Gross Salary Slab</th>
                  <th className="p-3">Monthly PT Deduction (Apr - Jan)</th>
                  <th className="p-3">February PT Deduction</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                <tr>
                  <td className="p-3">Up to ₹7,500 (Men) / Up to ₹25,000 (Women)</td>
                  <td className="p-3">Nil</td>
                  <td className="p-3">Nil</td>
                </tr>
                <tr>
                  <td className="p-3">₹7,501 to ₹10,000</td>
                  <td className="p-3">₹175 / month</td>
                  <td className="p-3">₹175</td>
                </tr>
                <tr className="bg-orange-50/50 font-bold text-slate-900">
                  <td className="p-3">Above ₹10,000 (Standard)</td>
                  <td className="p-3">₹200 / month</td>
                  <td className="p-3">₹300 in February</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB CONTENT 4: INCOME TAX TDS */}
      {activeTab === 'tds' && (
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h3 className="text-base font-bold text-slate-900">Income Tax TDS under Section 192</h3>
            <p className="text-xs text-slate-500">
              Tax Deduction Account Number (TAN): MUMS19284F • Form 24Q Quarterly Reporting
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
              <h4 className="font-bold text-slate-900">New Tax Regime (Section 115BAC) — Default</h4>
              <p className="text-slate-600">
                Standard deduction of ₹75,000. Rebate under Section 87A for taxable income up to ₹7,00,000. Zero tax for CTC up to ₹7.75 Lakhs.
              </p>
              <span className="inline-block rounded-md bg-green-100 text-green-800 px-2 py-0.5 font-bold">
                Adopted by 84% of Sugartown workforce
              </span>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
              <h4 className="font-bold text-slate-900">Old Tax Regime (With Exemptions)</h4>
              <p className="text-slate-600">
                Allows Section 80C (up to ₹1.5L), Section 80D (Health Insurance), HRA rent receipts exemption, and standard deduction of ₹50,000.
              </p>
              <span className="inline-block rounded-md bg-slate-200 text-slate-800 px-2 py-0.5 font-bold">
                16% active declarations
              </span>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT 5: GRATUITY CALCULATOR */}
      {activeTab === 'gratuity' && (
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h3 className="text-base font-bold text-slate-900">Payment of Gratuity Act, 1972 Interactive Simulator</h3>
            <p className="text-xs text-slate-500">
              Statutory retirement and separation benefit for employees completing 5 or more continuous years
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            <div className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Last Drawn Basic Salary + Dearness Allowance (₹)
                </label>
                <input
                  type="number"
                  value={gratuityBasic}
                  onChange={(e) => setGratuityBasic(Number(e.target.value))}
                  className="w-full rounded-lg border border-slate-200 p-2.5 text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Total Completed Years of Service (Rounding to half-year)
                </label>
                <input
                  type="number"
                  step="0.5"
                  value={gratuityYears}
                  onChange={(e) => setGratuityYears(Number(e.target.value))}
                  className="w-full rounded-lg border border-slate-200 p-2.5 text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div className="p-3 bg-slate-50 rounded-xl text-slate-600 border border-slate-200/80">
                <p>
                  <strong className="text-slate-900">Formula:</strong> (15 &times; Last Drawn Basic &times; Years of Service) / 26
                </p>
                <p className="text-[11px] text-slate-400 mt-1">
                  Capped at maximum statutory tax-free limit of ₹20,00,000.
                </p>
              </div>
            </div>

            <div className="rounded-xl bg-slate-900 p-6 text-white text-center space-y-2 shadow-xs">
              <span className="text-xs text-slate-400 uppercase font-bold tracking-wider">
                Calculated Gratuity Payable
              </span>
              <p className="text-3xl sm:text-4xl font-black text-orange-400">{formatINR(calculatedGratuity)}</p>
              <p className="text-xs text-slate-300">
                Full lump-sum disbursement upon separation or superannuation
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

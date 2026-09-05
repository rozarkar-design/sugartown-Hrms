import React, { useState } from 'react';
import {
  TrendingUp,
  Users,
  CreditCard,
  Calendar,
  Download,
  Building2,
  FileSpreadsheet,
  PieChart,
  BarChart3,
  CheckCircle2,
} from 'lucide-react';
import { useHRMS } from '../context/HRMSContext';
import { formatINR } from '../utils/formatters';

export const AnalyticsReports: React.FC = () => {
  const { employees, payrollRuns, payslips, departments, locations, attendanceRecords, showToast } = useHRMS();
  const [selectedReportPeriod, setSelectedReportPeriod] = useState<string>('2026-09');

  // Headcount distribution by department
  const deptCounts = departments.map((d) => ({
    name: d.name,
    code: d.code,
    count: employees.filter((e) => e.department === d.name).length,
  }));

  // Headcount by location
  const locCounts = locations.map((l) => ({
    name: l.name,
    code: l.code,
    count: employees.filter((e) => e.workLocation === l.name).length,
  }));

  const handleGenerateReport = (title: string, format: string) => {
    showToast(`Generating ${title} for ${selectedReportPeriod} (${format})...`, 'success');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Workforce Analytics & Compliance Reports
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium">
            Sugartown Retail Private Limited • Headcount, payroll expenditures & statutory registers
          </p>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={selectedReportPeriod}
            onChange={(e) => setSelectedReportPeriod(e.target.value)}
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500 shadow-xs cursor-pointer"
          >
            <option value="2026-09">September 2026</option>
            <option value="2026-08">August 2026</option>
            <option value="2026-07">July 2026</option>
          </select>
        </div>
      </div>

      {/* 2. Top-Level Summary KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Active Headcount</span>
          <p className="text-2xl font-black text-slate-900 mt-2">{employees.length} Employees</p>
          <p className="text-[11px] text-green-600 font-medium mt-1">+12.5% YoY workforce growth</p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Monthly Payroll</span>
          <p className="text-2xl font-black text-slate-900 mt-2">
            {formatINR(payrollRuns[0]?.grossSalary || 450000)}
          </p>
          <p className="text-[11px] text-slate-500 mt-1">Average ₹56,250 per employee</p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Average Attendance</span>
          <p className="text-2xl font-black text-green-600 mt-2">96.4%</p>
          <p className="text-[11px] text-slate-500 mt-1">Store operations: 98.1%</p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Quarterly Attrition</span>
          <p className="text-2xl font-black text-orange-600 mt-2">2.1%</p>
          <p className="text-[11px] text-slate-500 mt-1">Industry benchmark: 5.4%</p>
        </div>
      </div>

      {/* 3. Visual Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Headcount Distribution by Department */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Headcount by Department</h3>
              <p className="text-xs text-slate-500">Distribution across corporate and retail units</p>
            </div>
            <Users className="h-4 w-4 text-slate-400" />
          </div>

          <div className="space-y-3 pt-2">
            {deptCounts.map((dept) => {
              const pct = Math.round((dept.count / employees.length) * 100) || 0;
              return (
                <div key={dept.name} className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-slate-800">{dept.name}</span>
                    <span className="text-slate-500 font-mono">
                      {dept.count} ({pct}%)
                    </span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-orange-600 rounded-full transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Headcount Distribution by Store Branch */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Staffing by Retail Location</h3>
              <p className="text-xs text-slate-500">Store personnel deployed across Mumbai & Pune</p>
            </div>
            <Building2 className="h-4 w-4 text-slate-400" />
          </div>

          <div className="space-y-3 pt-2">
            {locCounts.map((loc) => {
              const pct = Math.round((loc.count / employees.length) * 100) || 0;
              return (
                <div key={loc.name} className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-slate-800">{loc.name}</span>
                    <span className="text-slate-500 font-mono">
                      {loc.count} ({pct}%)
                    </span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-slate-800 rounded-full transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 4. One-Click Compliance & Statutory Report Generator Table */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-base font-bold text-slate-900">One-Click Compliance & Audit Reports</h3>
            <p className="text-xs text-slate-500">Standardized formats formatted for Indian statutory authorities</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
          {[
            {
              name: 'Monthly Master Payroll Register',
              desc: 'Consolidated basic, allowances, EPF, ESIC, PT, TDS breakdown for accounting.',
              format: 'Excel / CSV',
            },
            {
              name: 'Bank Direct NEFT Salary Advice',
              desc: 'Ready batch file for upload to corporate banking portal.',
              format: 'CSV Format',
            },
            {
              name: 'EPFO Electronic Challan Return (ECR)',
              desc: 'Official #~# delimited text format for the EPFO Unified Member Portal.',
              format: 'Text (.txt)',
            },
            {
              name: 'ESIC Form 5 Monthly Statement',
              desc: 'Employee State Insurance monthly contribution register.',
              format: 'Excel / PDF',
            },
            {
              name: 'Maharashtra PT Form III-B Return',
              desc: 'Professional tax monthly deductee statement for Maharashtra Sales Tax Dept.',
              format: 'PDF / CSV',
            },
            {
              name: 'Section 192 TDS Form 24Q Quarterly Return',
              desc: 'Income tax salary deductee details with PAN verification status.',
              format: 'FVU Format',
            },
          ].map((rep, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-col justify-between space-y-3"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900">{rep.name}</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">{rep.desc}</p>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-200/60">
                <span className="text-[10px] font-mono text-slate-400">{rep.format}</span>
                <button
                  onClick={() => handleGenerateReport(rep.name, rep.format)}
                  className="flex items-center gap-1 text-xs font-bold text-orange-600 hover:text-orange-700 cursor-pointer"
                >
                  <Download className="h-3.5 w-3.5" />
                  <span>Download</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

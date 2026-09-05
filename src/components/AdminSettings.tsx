import React, { useState } from 'react';
import {
  Settings,
  Building2,
  Shield,
  MapPin,
  FileSpreadsheet,
  CheckCircle2,
  Lock,
  Download,
  Plus,
  Users,
} from 'lucide-react';
import { useHRMS } from '../context/HRMSContext';
import { formatDate } from '../utils/formatters';

export const AdminSettings: React.FC = () => {
  const { departments, locations, auditLogs, showToast } = useHRMS();
  const [activeTab, setActiveTab] = useState<'company' | 'roles' | 'locations' | 'audit'>('company');

  const [companyDetails, setCompanyDetails] = useState({
    name: 'Sugartown Retail Private Limited',
    cin: 'U52100MH2020PTC345678',
    gstin: '27AABCS1234F1Z5',
    pan: 'AABCS1234F',
    tan: 'MUMS19284F',
    epfCode: 'MH/BAN/0049281/000',
    esicCode: '31000492810000101',
    ptrc: '27948204910P',
    registeredOffice: 'Heritage Arcade, Kala Ghoda, Fort, Mumbai 400001, Maharashtra',
    officialEmail: 'compliance@sugartown.in',
    phone: '+91 (022) 4920-8800',
  });

  const rolesMatrix = [
    { role: 'SUPER_ADMIN', name: 'Super Admin', emp: 'Full Access', att: 'Full Access', leave: 'Full Access', pay: 'Lock/Process', stat: 'Filing/Export', admin: 'Full Control' },
    { role: 'HR_ADMIN', name: 'HR Admin', emp: 'CRUD / Onboard', att: 'Roster / Manual', leave: 'Approve', pay: 'Calculate', stat: 'Reports', admin: 'User Roles' },
    { role: 'PAYROLL_ADMIN', name: 'Payroll Admin', emp: 'Read / Salary', att: 'Read Hours', leave: 'Read Quotas', pay: 'Process / Runs', stat: 'ECR / Return', admin: 'Read Only' },
    { role: 'STORE_MANAGER', name: 'Store Manager', emp: 'Store Team', att: 'Shift Roster', leave: 'Approve Store', pay: 'No Access', stat: 'No Access', admin: 'No Access' },
    { role: 'EMPLOYEE', name: 'Employee (Self)', emp: 'Own Profile', att: 'Web Clock-in', leave: 'Apply Leave', pay: 'View Payslips', stat: 'Tax Regime', admin: 'No Access' },
    { role: 'AUDITOR', name: 'Statutory Auditor', emp: 'Read Only', att: 'Audit Logs', leave: 'Read Only', pay: 'Audit Ledgers', stat: 'Challan Review', admin: 'Audit Trail' },
  ];

  const handleExportAudit = () => {
    const header = 'Timestamp,User Name,Role,Action,Entity,IP Address,Details\n';
    const rows = auditLogs
      .map((l) => `"${l.timestamp}","${l.userName}","${l.role}","${l.action}","${l.entity}","${l.ipAddress}","${l.details}"`)
      .join('\n');
    const blob = new Blob([header + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Sugartown_Audit_Log_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Immutable Security Audit Trail exported to CSV', 'success');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            System Administration & Master Settings
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium">
            Sugartown Retail Private Limited • Company legal registrations, RBAC matrix & audit trail
          </p>
        </div>

        <button
          onClick={handleExportAudit}
          className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer shadow-xs"
        >
          <Download className="h-4 w-4 text-slate-500" />
          <span>Export Audit Log CSV</span>
        </button>
      </div>

      {/* 2. Primary Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('company')}
          className={`flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'company'
              ? 'bg-orange-50 text-orange-700 border border-orange-200'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Building2 className="h-4 w-4" />
          <span>Company & Statutory Master</span>
        </button>

        <button
          onClick={() => setActiveTab('roles')}
          className={`flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'roles'
              ? 'bg-orange-50 text-orange-700 border border-orange-200'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Shield className="h-4 w-4" />
          <span>Roles & RBAC Matrix</span>
        </button>

        <button
          onClick={() => setActiveTab('locations')}
          className={`flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'locations'
              ? 'bg-orange-50 text-orange-700 border border-orange-200'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <MapPin className="h-4 w-4" />
          <span>Store Branches & Departments</span>
        </button>

        <button
          onClick={() => setActiveTab('audit')}
          className={`flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'audit'
              ? 'bg-orange-50 text-orange-700 border border-orange-200'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Lock className="h-4 w-4" />
          <span>Security Audit Trail ({auditLogs.length})</span>
        </button>
      </div>

      {/* TAB 1: COMPANY MASTER */}
      {activeTab === 'company' && (
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h3 className="text-base font-bold text-slate-900">Legal Entity & Registration Identifiers</h3>
            <p className="text-xs text-slate-500">
              Printed on payslips, appointment contracts, tax challans, and ECR reports
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-600 mb-1">Company Legal Name</label>
              <input
                type="text"
                value={companyDetails.name}
                onChange={(e) => setCompanyDetails({ ...companyDetails, name: e.target.value })}
                className="w-full rounded-lg border border-slate-200 p-2 text-slate-900 font-bold focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-600 mb-1">Corporate Identity Number (CIN)</label>
              <input
                type="text"
                value={companyDetails.cin}
                onChange={(e) => setCompanyDetails({ ...companyDetails, cin: e.target.value })}
                className="w-full rounded-lg border border-slate-200 p-2 text-slate-900 font-mono font-bold focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-600 mb-1">GSTIN Identification</label>
              <input
                type="text"
                value={companyDetails.gstin}
                onChange={(e) => setCompanyDetails({ ...companyDetails, gstin: e.target.value })}
                className="w-full rounded-lg border border-slate-200 p-2 text-slate-900 font-mono font-bold focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-600 mb-1">Permanent Account Number (PAN)</label>
              <input
                type="text"
                value={companyDetails.pan}
                onChange={(e) => setCompanyDetails({ ...companyDetails, pan: e.target.value })}
                className="w-full rounded-lg border border-slate-200 p-2 text-slate-900 font-mono font-bold focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-600 mb-1">Tax Deduction Account (TAN)</label>
              <input
                type="text"
                value={companyDetails.tan}
                onChange={(e) => setCompanyDetails({ ...companyDetails, tan: e.target.value })}
                className="w-full rounded-lg border border-slate-200 p-2 text-slate-900 font-mono font-bold focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-600 mb-1">EPFO Establishment Code</label>
              <input
                type="text"
                value={companyDetails.epfCode}
                onChange={(e) => setCompanyDetails({ ...companyDetails, epfCode: e.target.value })}
                className="w-full rounded-lg border border-slate-200 p-2 text-slate-900 font-mono font-bold focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-600 mb-1">ESIC Insurance Code</label>
              <input
                type="text"
                value={companyDetails.esicCode}
                onChange={(e) => setCompanyDetails({ ...companyDetails, esicCode: e.target.value })}
                className="w-full rounded-lg border border-slate-200 p-2 text-slate-900 font-mono font-bold focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-600 mb-1">Maharashtra PTRC Number</label>
              <input
                type="text"
                value={companyDetails.ptrc}
                onChange={(e) => setCompanyDetails({ ...companyDetails, ptrc: e.target.value })}
                className="w-full rounded-lg border border-slate-200 p-2 text-slate-900 font-mono font-bold focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-600 mb-1">Compliance Officer Email</label>
              <input
                type="text"
                value={companyDetails.officialEmail}
                onChange={(e) => setCompanyDetails({ ...companyDetails, officialEmail: e.target.value })}
                className="w-full rounded-lg border border-slate-200 p-2 text-slate-900 font-mono focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Corporate Registered Office</label>
            <input
              type="text"
              value={companyDetails.registeredOffice}
              onChange={(e) => setCompanyDetails({ ...companyDetails, registeredOffice: e.target.value })}
              className="w-full rounded-lg border border-slate-200 p-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <div className="flex justify-end">
            <button
              onClick={() => showToast('Company profile updated successfully', 'success')}
              className="rounded-lg bg-slate-900 px-5 py-2 text-xs font-bold text-white hover:bg-slate-800 cursor-pointer shadow-xs"
            >
              Save Company Configurations
            </button>
          </div>
        </div>
      )}

      {/* TAB 2: ROLES MATRIX */}
      {activeTab === 'roles' && (
        <div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-xs">
          <div className="p-4 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-900">Role-Based Access Control (RBAC) Governance</h3>
            <p className="text-xs text-slate-500">Fine-grained operational permissions enforced by Sugartown HRMS</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="border-b border-slate-200 bg-slate-50/80 text-[11px] font-bold text-slate-500 uppercase">
                <tr>
                  <th className="py-3 pl-4 pr-2">System Role</th>
                  <th className="py-3 px-3">Employee Directory</th>
                  <th className="py-3 px-3">Attendance</th>
                  <th className="py-3 px-3">Leaves</th>
                  <th className="py-3 px-3">Payroll Engine</th>
                  <th className="py-3 px-3">Statutory Slabs</th>
                  <th className="py-3 pr-4 pl-2">System Settings</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {rolesMatrix.map((rm) => (
                  <tr key={rm.role} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 pl-4 pr-2 font-bold text-slate-900">{rm.name}</td>
                    <td className="py-3 px-3">{rm.emp}</td>
                    <td className="py-3 px-3">{rm.att}</td>
                    <td className="py-3 px-3">{rm.leave}</td>
                    <td className="py-3 px-3 font-semibold text-orange-600">{rm.pay}</td>
                    <td className="py-3 px-3">{rm.stat}</td>
                    <td className="py-3 pr-4 pl-2 font-medium text-slate-500">{rm.admin}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: LOCATIONS & DEPARTMENTS */}
      {activeTab === 'locations' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900">Retail Stores & Facilities ({locations.length})</h3>
              <span className="text-xs text-orange-600 font-bold">Maharashtra & Pune Region</span>
            </div>
            <div className="divide-y divide-slate-100 text-xs">
              {locations.map((loc) => (
                <div key={loc.id} className="py-3 flex items-center justify-between">
                  <div>
                    <p className="font-bold text-slate-900">{loc.name}</p>
                    <p className="text-[11px] text-slate-500">{loc.address}</p>
                  </div>
                  <span className="rounded-md bg-slate-100 px-2 py-0.5 font-mono text-[10px] text-slate-600">
                    {loc.code}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900">Departments & Cost Centers ({departments.length})</h3>
            </div>
            <div className="divide-y divide-slate-100 text-xs">
              {departments.map((dept) => (
                <div key={dept.id} className="py-3 flex items-center justify-between">
                  <div>
                    <p className="font-bold text-slate-900">{dept.name}</p>
                    <p className="text-[11px] text-slate-500">Head of Dept: {dept.headOfDepartment}</p>
                  </div>
                  <span className="rounded-md bg-orange-50 px-2 py-0.5 text-[10px] font-bold text-orange-700 border border-orange-200">
                    {dept.code}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: AUDIT TRAIL */}
      {activeTab === 'audit' && (
        <div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-xs">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Immutable Security & Compliance Audit Log</h3>
              <p className="text-xs text-slate-500">Captures all login events, salary edits, and approval triggers</p>
            </div>
            <span className="text-xs font-mono font-bold text-green-700 bg-green-50 px-2 py-1 rounded border border-green-200">
              Encrypted Audit Stream
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="border-b border-slate-200 bg-slate-50/80 text-[11px] font-bold text-slate-500 uppercase">
                <tr>
                  <th className="py-3 pl-4 pr-2">Timestamp</th>
                  <th className="py-3 px-3">User & Role</th>
                  <th className="py-3 px-3">Action</th>
                  <th className="py-3 px-3">Entity</th>
                  <th className="py-3 px-3">IP Address</th>
                  <th className="py-3 pr-4 pl-2">Event Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
                {auditLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 pl-4 pr-2 text-slate-500 whitespace-nowrap">{log.timestamp}</td>
                    <td className="py-3 px-3 whitespace-nowrap">
                      <span className="font-bold text-slate-900">{log.userName}</span>{' '}
                      <span className="text-[10px] text-slate-400">({log.role})</span>
                    </td>
                    <td className="py-3 px-3">
                      <span className="rounded bg-slate-100 px-2 py-0.5 text-slate-800 font-bold">
                        {log.action}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-slate-700">{log.entity}</td>
                    <td className="py-3 px-3 text-slate-500">{log.ipAddress}</td>
                    <td className="py-3 pr-4 pl-2 text-slate-600 font-sans text-xs">{log.details}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

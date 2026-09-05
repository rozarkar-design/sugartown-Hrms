import React, { useState } from 'react';
import {
  Folder,
  FileText,
  Upload,
  Download,
  Search,
  Plus,
  Shield,
  Building2,
  CheckCircle2,
  FileCheck,
  Eye,
  X,
  Printer,
} from 'lucide-react';
import { useHRMS } from '../context/HRMSContext';
import { formatDate } from '../utils/formatters';

interface LetterTemplateModalProps {
  type: string;
  onClose: () => void;
}

const LetterTemplateModal: React.FC<LetterTemplateModalProps> = ({ type, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-xs">
      <div className="w-full max-w-2xl rounded-xl border border-slate-200 bg-white p-6 shadow-2xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="text-sm font-bold text-slate-900">{type} Template Preview</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 cursor-pointer">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-6 space-y-4 text-xs text-slate-800 leading-relaxed">
          <div className="border-b border-slate-200 pb-3">
            <h2 className="text-sm font-black text-orange-600">SUGARTOWN RETAIL PRIVATE LIMITED</h2>
            <p className="text-[10px] text-slate-500">Corporate HR Operations • Fort, Mumbai</p>
          </div>

          <p className="font-bold">Date: September 05, 2026</p>
          <p>
            To,
            <br />
            <strong>Candidate / Employee Name</strong>
            <br />
            Employee ID: ST-1000 Series
          </p>

          <p className="font-bold text-slate-900 uppercase">SUBJECT: {type.toUpperCase()}</p>

          <p>
            Dear Associate,
            <br />
            Sugartown Retail Private Limited is pleased to issue this official <strong>{type}</strong>. We commend
            your dedicated service and professional commitment to our retail store chain and corporate team.
          </p>

          <p>
            All terms and statutory covenants outlined in your primary employment agreement remain fully binding in
            conjunction with this document.
          </p>

          <div className="pt-6 border-t border-slate-200 flex justify-between items-end text-[11px]">
            <div>
              <p className="font-bold text-slate-900">Sugartown Retail Private Limited</p>
              <p className="text-slate-400">Authorized Signatory</p>
            </div>
            <div className="rounded-md bg-slate-200 px-3 py-1 font-mono text-[10px] text-slate-600">
              DIGITALLY_SEALED_ST_HR
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <button
            onClick={() => window.print()}
            className="flex items-center gap-1 rounded-lg bg-slate-900 px-4 py-2 text-xs font-bold text-white hover:bg-slate-800 cursor-pointer shadow-xs"
          >
            <Printer className="h-3.5 w-3.5" />
            <span>Print Document</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export const DocumentRepository: React.FC = () => {
  const { employees, showToast } = useHRMS();
  const [activeTab, setActiveTab] = useState<'policies' | 'letters' | 'employee_kyc'>('policies');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLetterType, setSelectedLetterType] = useState<string | null>(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  const companyPolicies = [
    {
      id: 'pol-1',
      title: 'POSH Policy (Prevention of Sexual Harassment)',
      category: 'Statutory Compliance',
      updatedAt: '2026-01-15',
      version: 'v3.2',
      size: '1.4 MB',
      description: 'Zero-tolerance policy and Internal Complaints Committee (ICC) redressal process.',
    },
    {
      id: 'pol-2',
      title: 'Retail Store Code of Conduct & Grooming Standards',
      category: 'Operations',
      updatedAt: '2026-03-01',
      version: 'v2.1',
      size: '2.8 MB',
      description: 'Store associate uniform guidelines, customer etiquette, and cash register protocols.',
    },
    {
      id: 'pol-3',
      title: 'Information Security & Data Protection Policy',
      category: 'IT & Infrastructure',
      updatedAt: '2026-02-10',
      version: 'v1.5',
      size: '980 KB',
      description: 'Employee workstation rules, password protection, and confidential customer data security.',
    },
    {
      id: 'pol-4',
      title: 'Annual Leave & Absence Entitlement Policy',
      category: 'Human Resources',
      updatedAt: '2026-01-01',
      version: 'v4.0',
      size: '850 KB',
      description: 'Comprehensive guidelines on CL, SL, EL, maternity, and comp-off benefits.',
    },
    {
      id: 'pol-5',
      title: 'Domestic Travel & Expense Reimbursement Policy',
      category: 'Finance',
      updatedAt: '2026-04-12',
      version: 'v2.0',
      size: '1.1 MB',
      description: 'Per diem allowances, metro travel reimbursement slabs, and hotel booking guidelines.',
    },
  ];

  const letterTemplates = [
    { name: 'Official Employment Offer Letter', code: 'ST-TEMPL-01', forWhom: 'New Hires' },
    { name: 'Probation Confirmation Letter', code: 'ST-TEMPL-02', forWhom: 'Confirmed Staff' },
    { name: 'Annual Salary Increment & Appraisal Letter', code: 'ST-TEMPL-03', forWhom: 'Appraisal Cycle' },
    { name: 'Experience & Service Certificate', code: 'ST-TEMPL-04', forWhom: 'Relieved Staff' },
    { name: 'Formal Relieving Letter', code: 'ST-TEMPL-05', forWhom: 'Exiting Employees' },
    { name: 'Bonafide Employee Verification Letter', code: 'ST-TEMPL-06', forWhom: 'Visa / Bank Loans' },
  ];

  const handleDownload = (name: string) => {
    showToast(`Downloading: ${name}`, 'success');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Document Repository & Letters
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium">
            Company policies, verified KYC records, and official employment letter generators
          </p>
        </div>

        <button
          onClick={() => setIsUploadModalOpen(true)}
          className="flex items-center gap-1.5 rounded-lg bg-orange-600 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-orange-700 transition-colors cursor-pointer"
        >
          <Upload className="h-4 w-4" />
          <span>Upload Document</span>
        </button>
      </div>

      {/* 2. Primary Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('policies')}
          className={`flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'policies'
              ? 'bg-orange-50 text-orange-700 border border-orange-200'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Folder className="h-4 w-4" />
          <span>Company Policies ({companyPolicies.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('letters')}
          className={`flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'letters'
              ? 'bg-orange-50 text-orange-700 border border-orange-200'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <FileText className="h-4 w-4" />
          <span>Letter Generator & Templates</span>
        </button>

        <button
          onClick={() => setActiveTab('employee_kyc')}
          className={`flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'employee_kyc'
              ? 'bg-orange-50 text-orange-700 border border-orange-200'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <FileCheck className="h-4 w-4" />
          <span>Employee KYC Repository</span>
        </button>
      </div>

      {/* TAB 1: COMPANY POLICIES */}
      {activeTab === 'policies' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {companyPolicies.map((p) => (
            <div
              key={p.id}
              className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs flex flex-col justify-between space-y-4"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="rounded bg-orange-50 text-orange-700 text-[10px] font-bold px-2 py-0.5 border border-orange-200">
                    {p.category}
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">{p.version}</span>
                </div>
                <h3 className="text-sm font-bold text-slate-900">{p.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{p.description}</p>
              </div>

              <div className="border-t border-slate-100 pt-3 flex items-center justify-between text-[11px] text-slate-400">
                <span>
                  {p.size} • Updated {p.updatedAt}
                </span>
                <button
                  onClick={() => handleDownload(p.title)}
                  className="flex items-center gap-1 font-bold text-orange-600 hover:text-orange-700 cursor-pointer"
                >
                  <Download className="h-3.5 w-3.5" />
                  <span>Download</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 2: LETTER TEMPLATES */}
      {activeTab === 'letters' && (
        <div className="space-y-4">
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900 mb-1">Company Letterhead Generators</h3>
            <p className="text-xs text-slate-500 mb-4">
              Click any letter template to preview, customize, and generate print-ready documents with official Sugartown credentials
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {letterTemplates.map((t) => (
                <div
                  key={t.code}
                  onClick={() => setSelectedLetterType(t.name)}
                  className="rounded-xl border border-slate-200 p-4 bg-slate-50/50 hover:bg-slate-50 hover:border-orange-300 transition-all cursor-pointer space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] text-slate-400">{t.code}</span>
                    <span className="text-[10px] font-semibold text-orange-700 bg-orange-50 px-2 py-0.5 rounded border border-orange-200">
                      {t.forWhom}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-900">{t.name}</h4>
                  <p className="text-[11px] text-slate-500">Official template with standardized legal clauses.</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: EMPLOYEE KYC REPOSITORY */}
      {activeTab === 'employee_kyc' && (
        <div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-xs">
          <div className="p-4 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-900">Verified KYC Documents by Employee</h3>
            <p className="text-xs text-slate-500">Aadhaar, PAN, and Bank Records verified for Indian statutory audits</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="border-b border-slate-200 bg-slate-50/80 text-[11px] font-bold text-slate-500 uppercase">
                <tr>
                  <th className="py-3 pl-4 pr-2">Employee</th>
                  <th className="py-3 px-3">Aadhaar Document</th>
                  <th className="py-3 px-3">PAN Card Copy</th>
                  <th className="py-3 px-3">Bank Proof</th>
                  <th className="py-3 px-3">Degree Certificate</th>
                  <th className="py-3 pr-4 pl-2 text-right">Audit Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {employees.map((emp) => (
                  <tr key={emp.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 pl-4 pr-2">
                      <p className="font-bold text-slate-900">{emp.fullName}</p>
                      <span className="font-mono text-[10px] text-slate-400">{emp.employeeId}</span>
                    </td>
                    <td className="py-3 px-3">
                      <span className="inline-flex items-center gap-1 text-green-700 font-medium">
                        <CheckCircle2 className="h-3.5 w-3.5" /> Verified
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <span className="inline-flex items-center gap-1 text-green-700 font-medium">
                        <CheckCircle2 className="h-3.5 w-3.5" /> Verified
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <span className="inline-flex items-center gap-1 text-green-700 font-medium">
                        <CheckCircle2 className="h-3.5 w-3.5" /> Verified
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <span className="inline-flex items-center gap-1 text-green-700 font-medium">
                        <CheckCircle2 className="h-3.5 w-3.5" /> Verified
                      </span>
                    </td>
                    <td className="py-3 pr-4 pl-2 text-right">
                      <span className="rounded-full bg-green-100 text-green-800 px-2.5 py-0.5 text-[10px] font-bold border border-green-200">
                        100% Compliant
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Letter Template Preview Modal */}
      {selectedLetterType && (
        <LetterTemplateModal type={selectedLetterType} onClose={() => setSelectedLetterType(null)} />
      )}

      {/* Upload Modal */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900">Upload to Document Repository</h3>
              <button onClick={() => setIsUploadModalOpen(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Document Category</label>
                <select className="w-full rounded-lg border border-slate-200 p-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500">
                  <option>Company Policy</option>
                  <option>KYC Record</option>
                  <option>Statutory Filing</option>
                  <option>Legal Contract</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Document Title</label>
                <input
                  type="text"
                  placeholder="e.g. Employee Handbook 2026"
                  className="w-full rounded-lg border border-slate-200 p-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div className="border-2 border-dashed border-slate-300 rounded-xl p-6 text-center text-slate-500 hover:border-orange-400 cursor-pointer">
                <Upload className="h-8 w-8 mx-auto text-slate-400 mb-2" />
                <p className="font-bold text-slate-700">Click to browse or drag file here</p>
                <p className="text-[10px] text-slate-400 mt-1">Supports PDF, DOCX up to 15MB</p>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  onClick={() => setIsUploadModalOpen(false)}
                  className="rounded-lg px-4 py-2 text-slate-600 hover:bg-slate-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    showToast('Document uploaded successfully to repository', 'success');
                    setIsUploadModalOpen(false);
                  }}
                  className="rounded-lg bg-orange-600 px-4 py-2 font-bold text-white hover:bg-orange-700 cursor-pointer shadow-xs"
                >
                  Upload File
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

import React, { useState } from 'react';
import {
  X,
  MapPin,
  Mail,
  Phone,
  FileText,
} from 'lucide-react';
import { Employee, Payslip } from '../types';
import { formatINR, formatDate, maskAadhaar, maskPAN, maskBankAcc } from '../utils/formatters';
import { useHRMS } from '../context/HRMSContext';

interface EmployeeProfileModalProps {
  employee: Employee | null;
  onClose: () => void;
  onViewPayslip?: (ps: Payslip) => void;
}

export const EmployeeProfileModal: React.FC<EmployeeProfileModalProps> = ({
  employee,
  onClose,
  onViewPayslip,
}) => {
  const { attendanceRecords, leaveBalances } = useHRMS();
  const [activeTab, setActiveTab] = useState<
    'overview' | 'personal' | 'job' | 'statutory' | 'salary' | 'attendance' | 'documents'
  >('overview');

  if (!employee) return null;

  const empAttendance = attendanceRecords.filter((a) => a.employeeId === employee.employeeId);
  const empBalance = leaveBalances[employee.employeeId];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-xs">
      <div className="w-full max-w-4xl rounded-2xl border border-slate-200 bg-white shadow-xl overflow-hidden max-h-[92vh] flex flex-col animate-in fade-in zoom-in-95 duration-150">
        {/* Header with Photo & Basic Bio - Professional Polish */}
        <div className="relative border-b border-slate-200 bg-slate-50/70 p-6">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 rounded-lg p-1.5 text-slate-400 hover:bg-slate-200 hover:text-slate-700 cursor-pointer transition-colors"
          >
            <X className="h-5 w-5" />
          </button>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            <img
              src={employee.photoUrl}
              alt={employee.fullName}
              className="h-20 w-20 rounded-xl object-cover ring-2 ring-white shadow-sm"
            />
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2.5">
                <h2 className="text-xl font-bold text-slate-900">{employee.fullName}</h2>
                <span className="rounded-md bg-slate-200 px-2 py-0.5 text-xs font-mono font-bold text-slate-700">
                  {employee.employeeId}
                </span>
                <span
                  className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold ${
                    employee.status === 'Active'
                      ? 'bg-green-50 text-green-700'
                      : employee.status === 'Probation'
                      ? 'bg-amber-50 text-amber-700'
                      : 'bg-red-50 text-red-700'
                  }`}
                >
                  {employee.status}
                </span>
              </div>
              <p className="text-xs sm:text-sm font-semibold text-orange-600 mt-1">
                {employee.designation} • {employee.department}
              </p>
              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 mt-2">
                <span className="flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5 text-slate-400" />
                  {employee.workLocation}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Mail className="h-3.5 w-3.5 text-slate-400" />
                  {employee.officialEmail}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Phone className="h-3.5 w-3.5 text-slate-400" />
                  {employee.mobile}
                </span>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-1 border-t border-slate-200 mt-6 pt-3 overflow-x-auto">
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'personal', label: 'Personal Info' },
              { id: 'job', label: 'Job & Hierarchy' },
              { id: 'statutory', label: 'Bank & Statutory' },
              { id: 'salary', label: 'Salary Structure' },
              { id: 'attendance', label: 'Attendance & Leaves' },
              { id: 'documents', label: 'Documents' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`rounded-lg px-3 py-1.5 text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                  activeTab === tab.id
                    ? 'bg-white text-orange-600 shadow-xs border border-slate-200 font-bold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-xs text-slate-700 bg-white">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Quick 4 Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-slate-400">Tenure at Sugartown</span>
                  <p className="text-sm font-bold text-slate-900 mt-1">Since {formatDate(employee.dateOfJoining)}</p>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-slate-400">Monthly Compensation</span>
                  <p className="text-sm font-bold text-slate-900 mt-1">{formatINR(employee.monthlyCTC)} / mo</p>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-slate-400">Reporting Manager</span>
                  <p className="text-sm font-bold text-slate-900 mt-1">{employee.reportingManagerName}</p>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-slate-400">Attendance Rate</span>
                  <p className="text-sm font-bold text-green-600 mt-1">96.8% Compliant</p>
                </div>
              </div>

              {/* Leave Balances */}
              {empBalance && (
                <div className="rounded-xl border border-slate-200 p-4 space-y-2">
                  <h4 className="font-bold text-slate-900 text-xs">Current Leave Quota & Utilisation (2026)</h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
                    <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                      <p className="text-[11px] text-slate-500">Casual Leave</p>
                      <p className="text-sm font-bold text-slate-900">
                        {empBalance.casualLeave.total - empBalance.casualLeave.used} remaining{' '}
                        <span className="text-[10px] text-slate-400">({empBalance.casualLeave.used} used)</span>
                      </p>
                    </div>
                    <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                      <p className="text-[11px] text-slate-500">Sick Leave</p>
                      <p className="text-sm font-bold text-slate-900">
                        {empBalance.sickLeave.total - empBalance.sickLeave.used} remaining{' '}
                        <span className="text-[10px] text-slate-400">({empBalance.sickLeave.used} used)</span>
                      </p>
                    </div>
                    <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                      <p className="text-[11px] text-slate-500">Earned Leave</p>
                      <p className="text-sm font-bold text-slate-900">
                        {empBalance.earnedLeave.total - empBalance.earnedLeave.used} remaining{' '}
                        <span className="text-[10px] text-slate-400">({empBalance.earnedLeave.used} used)</span>
                      </p>
                    </div>
                    <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                      <p className="text-[11px] text-slate-500">Work From Home</p>
                      <p className="text-sm font-bold text-slate-900">
                        {empBalance.workFromHome.total - empBalance.workFromHome.used} days{' '}
                        <span className="text-[10px] text-slate-400">({empBalance.workFromHome.used} used)</span>
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Personal Info Tab */}
          {activeTab === 'personal' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl border border-slate-200 space-y-3">
                <h4 className="font-bold text-slate-900">Personal Demographics</h4>
                <div>
                  <span className="text-slate-400">Date of Birth:</span>
                  <p className="font-semibold text-slate-800">{formatDate(employee.dob)}</p>
                </div>
                <div>
                  <span className="text-slate-400">Gender:</span>
                  <p className="font-semibold text-slate-800">{employee.gender}</p>
                </div>
                <div>
                  <span className="text-slate-400">Blood Group:</span>
                  <p className="font-semibold text-slate-800">{employee.bloodGroup}</p>
                </div>
                <div>
                  <span className="text-slate-400">Marital Status:</span>
                  <p className="font-semibold text-slate-800">{employee.maritalStatus}</p>
                </div>
                <div>
                  <span className="text-slate-400">Nationality:</span>
                  <p className="font-semibold text-slate-800">{employee.nationality}</p>
                </div>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 space-y-3">
                <h4 className="font-bold text-slate-900">Address & Contact Details</h4>
                <div>
                  <span className="text-slate-400">Current Address:</span>
                  <p className="font-semibold text-slate-800">
                    {employee.currentAddress}, {employee.city}, {employee.state} - {employee.pinCode}
                  </p>
                </div>
                <div>
                  <span className="text-slate-400">Permanent Address:</span>
                  <p className="font-semibold text-slate-800">
                    {employee.permanentAddress}, {employee.city}, {employee.state} - {employee.pinCode}
                  </p>
                </div>
                <div>
                  <span className="text-slate-400">Personal Email:</span>
                  <p className="font-semibold text-slate-800">{employee.personalEmail}</p>
                </div>
                <div>
                  <span className="text-slate-400">Emergency Mobile:</span>
                  <p className="font-semibold text-slate-800">{employee.mobile}</p>
                </div>
              </div>
            </div>
          )}

          {/* Job & Hierarchy Tab */}
          {activeTab === 'job' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl border border-slate-200 space-y-3">
                <h4 className="font-bold text-slate-900">Employment Details</h4>
                <div>
                  <span className="text-slate-400">Department:</span>
                  <p className="font-semibold text-slate-800">{employee.department}</p>
                </div>
                <div>
                  <span className="text-slate-400">Designation:</span>
                  <p className="font-semibold text-slate-800">{employee.designation}</p>
                </div>
                <div>
                  <span className="text-slate-400">Employment Type:</span>
                  <p className="font-semibold text-slate-800">{employee.employmentType}</p>
                </div>
                <div>
                  <span className="text-slate-400">Date of Joining:</span>
                  <p className="font-semibold text-slate-800">{formatDate(employee.dateOfJoining)}</p>
                </div>
                <div>
                  <span className="text-slate-400">Confirmation Date:</span>
                  <p className="font-semibold text-slate-800">{formatDate(employee.confirmationDate)}</p>
                </div>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 space-y-3">
                <h4 className="font-bold text-slate-900">Reporting & Work Location</h4>
                <div>
                  <span className="text-slate-400">Work Location:</span>
                  <p className="font-semibold text-slate-800">{employee.workLocation}</p>
                </div>
                <div>
                  <span className="text-slate-400">Reporting Manager:</span>
                  <p className="font-semibold text-slate-800">{employee.reportingManagerName}</p>
                </div>
                <div>
                  <span className="text-slate-400">Assigned Shift:</span>
                  <p className="font-semibold text-slate-800">{employee.shiftTiming || 'General Shift (09:30 - 18:30)'}</p>
                </div>
                <div>
                  <span className="text-slate-400">Official Email:</span>
                  <p className="font-semibold text-slate-800 font-mono">{employee.officialEmail}</p>
                </div>
              </div>
            </div>
          )}

          {/* Bank & Statutory Tab */}
          {activeTab === 'statutory' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl border border-slate-200 space-y-3">
                <h4 className="font-bold text-slate-900">Bank Account Details</h4>
                <div>
                  <span className="text-slate-400">Bank Name:</span>
                  <p className="font-semibold text-slate-800">{employee.bankName}</p>
                </div>
                <div>
                  <span className="text-slate-400">Account Holder Name:</span>
                  <p className="font-semibold text-slate-800">{employee.accountHolderName}</p>
                </div>
                <div>
                  <span className="text-slate-400">Account Number:</span>
                  <p className="font-mono font-semibold text-slate-800">{maskBankAcc(employee.accountNumber)}</p>
                </div>
                <div>
                  <span className="text-slate-400">IFSC Code:</span>
                  <p className="font-mono font-semibold text-slate-800">{employee.ifscCode}</p>
                </div>
                <div>
                  <span className="text-slate-400">Branch:</span>
                  <p className="font-semibold text-slate-800">{employee.branch}</p>
                </div>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 space-y-3">
                <h4 className="font-bold text-slate-900">Statutory & Tax Identity</h4>
                <div>
                  <span className="text-slate-400">Income Tax PAN:</span>
                  <p className="font-mono font-semibold text-slate-800">{maskPAN(employee.panNumber)}</p>
                </div>
                <div>
                  <span className="text-slate-400">Aadhaar Identity:</span>
                  <p className="font-mono font-semibold text-slate-800">{maskAadhaar(employee.aadhaarNumber)}</p>
                </div>
                <div>
                  <span className="text-slate-400">EPFO Universal Account Number (UAN):</span>
                  <p className="font-mono font-semibold text-slate-800">{employee.uan}</p>
                </div>
                <div>
                  <span className="text-slate-400">Provident Fund Member ID:</span>
                  <p className="font-mono font-semibold text-slate-800">{employee.pfNumber}</p>
                </div>
                <div>
                  <span className="text-slate-400">ESIC Insurance Number:</span>
                  <p className="font-mono font-semibold text-slate-800">{employee.esicNumber}</p>
                </div>
              </div>
            </div>
          )}

          {/* Salary Structure Tab */}
          {activeTab === 'salary' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-200">
                <div>
                  <span className="text-slate-500">Annual CTC</span>
                  <p className="text-xl font-bold text-slate-900">{formatINR(employee.annualCTC)}</p>
                </div>
                <div className="text-right">
                  <span className="text-slate-500">Monthly Gross</span>
                  <p className="text-xl font-bold text-orange-600">{formatINR(employee.monthlyCTC)}</p>
                </div>
              </div>

              <div className="rounded-xl border border-slate-200 overflow-hidden">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase">
                    <tr>
                      <th className="p-3">Salary Component</th>
                      <th className="p-3">Calculation Type</th>
                      <th className="p-3 text-right">Monthly (₹)</th>
                      <th className="p-3 text-right">Annual (₹)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    <tr>
                      <td className="p-3 font-semibold text-slate-900">Basic Salary</td>
                      <td className="p-3 text-slate-500">50% of Monthly CTC</td>
                      <td className="p-3 text-right font-bold">{formatINR(employee.basicSalary)}</td>
                      <td className="p-3 text-right">{formatINR(employee.basicSalary * 12)}</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold text-slate-900">House Rent Allowance (HRA)</td>
                      <td className="p-3 text-slate-500">50% of Basic (Metro)</td>
                      <td className="p-3 text-right font-bold">{formatINR(employee.hra)}</td>
                      <td className="p-3 text-right">{formatINR(employee.hra * 12)}</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold text-slate-900">Conveyance Allowance</td>
                      <td className="p-3 text-slate-500">Standard Allowance</td>
                      <td className="p-3 text-right font-bold">{formatINR(employee.conveyance)}</td>
                      <td className="p-3 text-right">{formatINR(employee.conveyance * 12)}</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold text-slate-900">Medical Allowance</td>
                      <td className="p-3 text-slate-500">Standard Reimbursement</td>
                      <td className="p-3 text-right font-bold">{formatINR(employee.medicalAllowance)}</td>
                      <td className="p-3 text-right">{formatINR(employee.medicalAllowance * 12)}</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold text-slate-900">Special Allowance</td>
                      <td className="p-3 text-slate-500">Balancing Component</td>
                      <td className="p-3 text-right font-bold">{formatINR(employee.specialAllowance)}</td>
                      <td className="p-3 text-right">{formatINR(employee.specialAllowance * 12)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Attendance & Leaves Tab */}
          {activeTab === 'attendance' && (
            <div className="space-y-6">
              <div>
                <h4 className="font-bold text-slate-900 mb-2">Recent Attendance Log</h4>
                <div className="rounded-xl border border-slate-200 overflow-hidden">
                  <table className="w-full text-left">
                    <thead className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase">
                      <tr>
                        <th className="p-2.5">Date</th>
                        <th className="p-2.5">Status</th>
                        <th className="p-2.5">Check In</th>
                        <th className="p-2.5">Check Out</th>
                        <th className="p-2.5">Hours</th>
                        <th className="p-2.5">Location</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {empAttendance.map((rec) => (
                        <tr key={rec.id}>
                          <td className="p-2.5 font-medium text-slate-900">{rec.date}</td>
                          <td className="p-2.5">
                            <span
                              className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                                rec.status === 'Present'
                                  ? 'bg-green-50 text-green-700'
                                  : rec.status === 'Late'
                                  ? 'bg-amber-50 text-amber-700'
                                  : 'bg-red-50 text-red-700'
                              }`}
                            >
                              {rec.status}
                            </span>
                          </td>
                          <td className="p-2.5 font-mono">{rec.checkIn || '-'}</td>
                          <td className="p-2.5 font-mono">{rec.checkOut || '-'}</td>
                          <td className="p-2.5 font-semibold">{rec.workingHours}h</td>
                          <td className="p-2.5 text-slate-500">{rec.location}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Documents Tab */}
          {activeTab === 'documents' && (
            <div className="space-y-3">
              <h4 className="font-bold text-slate-900">Uploaded Compliance Documents</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { name: 'Signed Offer Letter', file: 'Sugartown_Offer_Letter.pdf', size: '1.4 MB', date: '2024-06-12' },
                  { name: 'Aadhaar Card Copy', file: 'Aadhaar_Document_Verified.pdf', size: '820 KB', date: '2024-06-15' },
                  { name: 'PAN Card Copy', file: 'PAN_Copy_NSDL.pdf', size: '640 KB', date: '2024-06-15' },
                  { name: 'Bachelor Degree Certificate', file: 'Degree_Transcript.pdf', size: '2.1 MB', date: '2024-06-15' },
                ].map((doc, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-slate-50/50">
                    <div className="flex items-center gap-2.5">
                      <FileText className="h-5 w-5 text-slate-400" />
                      <div>
                        <p className="font-semibold text-slate-900">{doc.name}</p>
                        <p className="text-[10px] text-slate-400">
                          {doc.file} • {doc.size}
                        </p>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold text-green-700 bg-green-50 px-2 py-0.5 rounded border border-green-200">
                      Verified
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="border-t border-slate-200 bg-slate-50 px-6 py-3 flex items-center justify-between">
          <span className="text-slate-500 text-xs">
            Sugartown Retail Private Limited • Confidential HR Record
          </span>
          <button
            onClick={onClose}
            className="rounded-lg bg-slate-900 px-4 py-2 text-xs font-bold text-white hover:bg-slate-800 cursor-pointer transition-colors"
          >
            Close Window
          </button>
        </div>
      </div>
    </div>
  );
};

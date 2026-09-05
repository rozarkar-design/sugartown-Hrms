import React, { useState } from 'react';
import {
  Users,
  Search,
  Filter,
  Plus,
  Download,
  Eye,
  Edit2,
  Trash2,
  CheckCircle2,
  AlertCircle,
  MapPin,
  Building2,
  Briefcase,
  Phone,
  Mail,
  Calendar,
  CreditCard,
  FileText,
  X,
  ChevronRight,
  Shield,
  Upload,
} from 'lucide-react';
import { useHRMS } from '../context/HRMSContext';
import { Employee } from '../types';
import { formatINR, formatDate, maskAadhaar, maskPAN } from '../utils/formatters';

interface EmployeeManagementProps {
  onSelectEmployee: (emp: Employee) => void;
}

export const EmployeeManagement: React.FC<EmployeeManagementProps> = ({ onSelectEmployee }) => {
  const {
    employees,
    addEmployee,
    updateEmployee,
    deleteEmployee,
    departments,
    designations,
    locations,
    shifts,
    showToast,
  } = useHRMS();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('All');
  const [selectedLocation, setSelectedLocation] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');

  // Onboarding Wizard Modal State
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [wizardStep, setWizardStep] = useState(1);

  // New Employee Form State
  const [formData, setFormData] = useState<Partial<Employee>>({
    fullName: '',
    photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    gender: 'Male',
    dob: '1998-05-15',
    mobile: '+91 98',
    personalEmail: '',
    officialEmail: '',
    bloodGroup: 'O+',
    maritalStatus: 'Single',
    currentAddress: 'Heritage View, Colaba',
    permanentAddress: 'Heritage View, Colaba',
    city: 'Mumbai',
    state: 'Maharashtra',
    pinCode: '400005',
    department: 'Retail & Store Operations',
    designation: 'Retail Sales Associate',
    reportingManagerName: 'Amit Verma',
    reportingManagerId: 'emp-4',
    workLocation: 'Sugartown Flagship Store & HQ',
    shiftId: 'shift-1',
    employmentType: 'Full-Time',
    dateOfJoining: new Date().toISOString().split('T')[0],
    probationPeriodMonths: 3,
    bankName: 'HDFC Bank Ltd',
    accountHolderName: '',
    accountNumber: '',
    ifscCode: 'HDFC0000060',
    branch: 'Mumbai Fort',
    panNumber: 'ABCDE1234F',
    aadhaarNumber: '123456789012',
    uan: '100987654321',
    annualCTC: 480000,
    monthlyCTC: 40000,
    basicSalary: 20000,
    hra: 10000,
    conveyance: 1600,
    specialAllowance: 6900,
    medicalAllowance: 1500,
  });

  // Calculate CTC components automatically when annual CTC changes
  const handleCtcChange = (ctc: number) => {
    const monthly = Math.round(ctc / 12);
    const basic = Math.round(monthly * 0.5); // 50% Basic
    const hra = Math.round(basic * 0.5); // 50% of Basic for Mumbai (Metro)
    const conv = 1600;
    const med = 1500;
    const special = Math.max(0, monthly - (basic + hra + conv + med));

    setFormData((prev) => ({
      ...prev,
      annualCTC: ctc,
      monthlyCTC: monthly,
      basicSalary: basic,
      hra,
      conveyance: conv,
      medicalAllowance: med,
      specialAllowance: special,
    }));
  };

  // Filtered employees list
  const filteredEmployees = employees.filter((emp) => {
    const matchesSearch =
      emp.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.officialEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.mobile.includes(searchTerm);

    const matchesDept = selectedDepartment === 'All' || emp.department === selectedDepartment;
    const matchesLoc = selectedLocation === 'All' || emp.workLocation === selectedLocation;
    const matchesStatus = selectedStatus === 'All' || emp.status === selectedStatus;

    return matchesSearch && matchesDept && matchesLoc && matchesStatus;
  });

  const handleFinishOnboarding = () => {
    if (!formData.fullName) {
      showToast('Please enter employee full name', 'error');
      return;
    }
    const generatedId = addEmployee({
      ...formData,
      accountHolderName: formData.accountHolderName || formData.fullName,
      officialEmail: formData.officialEmail || `${formData.fullName.toLowerCase().replace(/\s+/g, '')}@sugartown.in`,
    });
    setIsWizardOpen(false);
    setWizardStep(1);
    showToast(`Successfully registered employee with ID ${generatedId}`, 'success');
  };

  const handleExportCSV = () => {
    const headers = 'Employee ID,Name,Department,Designation,Location,Joining Date,Status,Mobile,Email,Annual CTC\n';
    const rows = filteredEmployees
      .map(
        (e) =>
          `"${e.employeeId}","${e.fullName}","${e.department}","${e.designation}","${e.workLocation}","${e.dateOfJoining}","${e.status}","${e.mobile}","${e.officialEmail}","${e.annualCTC}"`
      )
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Sugartown_Employees_Export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Employee roster exported to CSV successfully', 'success');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* 1. Header with Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Employee Directory & Staff Records
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium">
            Sugartown Retail Private Limited • {employees.length} Total Workforce Profiles
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-colors cursor-pointer shadow-xs"
          >
            <Download className="h-4 w-4 text-slate-500" />
            <span>Export CSV</span>
          </button>
          <button
            id="open-onboarding-wizard-btn"
            onClick={() => {
              setIsWizardOpen(true);
              setWizardStep(1);
            }}
            className="flex items-center gap-1.5 rounded-lg bg-orange-600 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-orange-700 transition-colors cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            <span>Onboard New Employee</span>
          </button>
        </div>
      </div>

      {/* 2. Filters & Search Bar */}
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* Search Input */}
          <div className="lg:col-span-2 relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name, ID, mobile, or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-slate-50/50 py-2 pl-9 pr-3 text-xs text-slate-900 placeholder:text-slate-400 focus:border-orange-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-orange-500"
            />
          </div>

          {/* Department Filter */}
          <div>
            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-slate-50/50 py-2 px-3 text-xs text-slate-800 focus:border-orange-500 focus:bg-white focus:outline-none cursor-pointer"
            >
              <option value="All">All Departments</option>
              {departments.map((d) => (
                <option key={d.id} value={d.name}>
                  {d.name}
                </option>
              ))}
            </select>
          </div>

          {/* Location Filter */}
          <div>
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-slate-50/50 py-2 px-3 text-xs text-slate-800 focus:border-orange-500 focus:bg-white focus:outline-none cursor-pointer"
            >
              <option value="All">All Locations & Stores</option>
              {locations.map((loc) => (
                <option key={loc.id} value={loc.name}>
                  {loc.name}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-slate-50/50 py-2 px-3 text-xs text-slate-800 focus:border-orange-500 focus:bg-white focus:outline-none cursor-pointer"
            >
              <option value="All">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Probation">Probation</option>
              <option value="Notice Period">Notice Period</option>
              <option value="Terminated">Terminated</option>
            </select>
          </div>
        </div>

        {/* Results summary */}
        <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>
            Showing <strong className="text-slate-900">{filteredEmployees.length}</strong> of{' '}
            {employees.length} employees
          </span>
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-slate-400">View:</span>
            <button
              onClick={() => setViewMode('table')}
              className={`px-2.5 py-1 rounded-md text-xs font-semibold cursor-pointer transition-colors ${
                viewMode === 'table' ? 'bg-orange-50 text-orange-700 font-bold border border-orange-200' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              Table
            </button>
            <button
              onClick={() => setViewMode('cards')}
              className={`px-2.5 py-1 rounded-md text-xs font-semibold cursor-pointer transition-colors ${
                viewMode === 'cards' ? 'bg-orange-50 text-orange-700 font-bold border border-orange-200' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              Cards
            </button>
          </div>
        </div>
      </div>

      {/* 3. Employees Table View */}
      {viewMode === 'table' ? (
        <div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="border-b border-slate-200 bg-slate-50/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 pl-4 pr-2">Employee ID & Name</th>
                  <th className="py-3.5 px-3">Role & Department</th>
                  <th className="py-3.5 px-3">Store Location</th>
                  <th className="py-3.5 px-3">Joining Date</th>
                  <th className="py-3.5 px-3">Contact</th>
                  <th className="py-3.5 px-3">Annual CTC</th>
                  <th className="py-3.5 px-3">Status</th>
                  <th className="py-3.5 pr-4 pl-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredEmployees.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-8 text-center text-slate-400">
                      No employees match your search criteria.
                    </td>
                  </tr>
                ) : (
                  filteredEmployees.map((emp) => (
                    <tr
                      key={emp.id}
                      className="hover:bg-slate-50/70 transition-colors group cursor-pointer"
                      onClick={() => onSelectEmployee(emp)}
                    >
                      <td className="py-3 pl-4 pr-2">
                        <div className="flex items-center gap-3">
                          <img
                            src={emp.photoUrl}
                            alt={emp.fullName}
                            className="h-9 w-9 rounded-lg object-cover ring-1 ring-slate-200"
                          />
                          <div>
                            <p className="font-bold text-slate-900 group-hover:text-orange-600 transition-colors">
                              {emp.fullName}
                            </p>
                            <span className="font-mono text-[11px] text-slate-400">{emp.employeeId}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-3">
                        <p className="font-semibold text-slate-900">{emp.designation}</p>
                        <p className="text-[11px] text-slate-500">{emp.department}</p>
                      </td>
                      <td className="py-3 px-3">
                        <span className="text-slate-700 font-medium truncate max-w-[150px] block">
                          {emp.workLocation}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-slate-600 whitespace-nowrap">
                        {formatDate(emp.dateOfJoining)}
                      </td>
                      <td className="py-3 px-3">
                        <p className="text-slate-800">{emp.mobile}</p>
                        <p className="text-[11px] text-slate-400">{emp.officialEmail}</p>
                      </td>
                      <td className="py-3 px-3 font-semibold text-slate-900 whitespace-nowrap">
                        {formatINR(emp.annualCTC)}
                      </td>
                      <td className="py-3 px-3 whitespace-nowrap">
                        <span
                          className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                            emp.status === 'Active'
                              ? 'bg-green-50 text-green-700 border border-green-200'
                              : emp.status === 'Probation'
                              ? 'bg-amber-50 text-amber-700 border border-amber-200'
                              : 'bg-red-50 text-red-700 border border-red-200'
                          }`}
                        >
                          {emp.status}
                        </span>
                      </td>
                      <td className="py-3 pr-4 pl-2 text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => onSelectEmployee(emp)}
                            className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-900 cursor-pointer"
                            title="View Full Profile"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => {
                              onSelectEmployee(emp);
                            }}
                            className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-900 cursor-pointer"
                            title="Edit Profile"
                          >
                            <Edit2 className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`Are you sure you want to remove employee ${emp.fullName}?`)) {
                                deleteEmployee(emp.id);
                              }
                            }}
                            className="rounded-lg p-1.5 text-red-500 hover:bg-red-50 cursor-pointer"
                            title="Delete / Terminate Record"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Cards View */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredEmployees.map((emp) => (
            <div
              key={emp.id}
              onClick={() => onSelectEmployee(emp)}
              className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs hover:border-slate-300 hover:shadow-sm transition-all cursor-pointer space-y-4"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={emp.photoUrl}
                    alt={emp.fullName}
                    className="h-12 w-12 rounded-lg object-cover ring-1 ring-slate-200"
                  />
                  <div>
                    <h3 className="text-xs font-bold text-slate-900">{emp.fullName}</h3>
                    <p className="text-[11px] text-slate-500">{emp.designation}</p>
                    <span className="text-[10px] font-mono text-slate-400">{emp.employeeId}</span>
                  </div>
                </div>
                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                    emp.status === 'Active'
                      ? 'bg-green-50 text-green-700'
                      : emp.status === 'Probation'
                      ? 'bg-amber-50 text-amber-700'
                      : 'bg-red-50 text-red-700'
                  }`}
                >
                  {emp.status}
                </span>
              </div>

              <div className="space-y-1.5 text-xs text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Department:</span>
                  <span className="font-semibold text-slate-900">{emp.department}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Location:</span>
                  <span className="font-medium text-slate-900 truncate max-w-[160px]">{emp.workLocation}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">CTC:</span>
                  <span className="font-bold text-slate-900">{formatINR(emp.annualCTC)} / yr</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-xs">
                <span className="text-[11px] text-slate-400">Joined: {formatDate(emp.dateOfJoining)}</span>
                <span className="font-semibold text-orange-600 hover:underline flex items-center gap-1">
                  View Profile <ChevronRight className="h-3 w-3" />
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 4. 8-Step Onboarding Wizard Modal */}
      {isWizardOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-xs">
          <div className="w-full max-w-3xl rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xl overflow-hidden max-h-[90vh] flex flex-col animate-in fade-in zoom-in-95 duration-150">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  New Employee Onboarding Wizard
                </h3>
                <p className="text-xs text-slate-500">
                  Step {wizardStep} of 8: {
                    [
                      'Personal Information',
                      'Contact & Address',
                      'Job & Organization',
                      'Salary & Compensation',
                      'Bank Account Details',
                      'Statutory & Tax Details',
                      'Document Verification',
                      'Review & Submit',
                    ][wizardStep - 1]
                  }
                </p>
              </div>
              <button
                onClick={() => setIsWizardOpen(false)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Stepper Progress Indicator */}
            <div className="flex items-center gap-1 py-3 border-b border-slate-100 overflow-x-auto">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                <div
                  key={s}
                  onClick={() => setWizardStep(s)}
                  className={`h-1.5 flex-1 rounded-full cursor-pointer transition-all ${
                    s === wizardStep
                      ? 'bg-orange-600'
                      : s < wizardStep
                      ? 'bg-green-500'
                      : 'bg-slate-200'
                  }`}
                />
              ))}
            </div>

            {/* Step Body Content */}
            <div className="flex-1 overflow-y-auto py-4 space-y-4 text-xs">
              {/* Step 1: Personal Info */}
              {wizardStep === 1 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Full Legal Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Ananya Deshmukh"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      className="w-full rounded-lg border border-slate-200 p-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Gender *</label>
                    <select
                      value={formData.gender}
                      onChange={(e) => setFormData({ ...formData, gender: e.target.value as any })}
                      className="w-full rounded-lg border border-slate-200 p-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Date of Birth *</label>
                    <input
                      type="date"
                      value={formData.dob}
                      onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                      className="w-full rounded-lg border border-slate-200 p-2.5 text-slate-900 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Blood Group</label>
                    <select
                      value={formData.bloodGroup}
                      onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
                      className="w-full rounded-lg border border-slate-200 p-2.5 text-slate-900 focus:outline-none"
                    >
                      {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((bg) => (
                        <option key={bg} value={bg}>
                          {bg}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Marital Status</label>
                    <select
                      value={formData.maritalStatus}
                      onChange={(e) => setFormData({ ...formData, maritalStatus: e.target.value as any })}
                      className="w-full rounded-lg border border-slate-200 p-2.5 text-slate-900 focus:outline-none"
                    >
                      <option value="Single">Single</option>
                      <option value="Married">Married</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Profile Photo URL</label>
                    <input
                      type="text"
                      value={formData.photoUrl}
                      onChange={(e) => setFormData({ ...formData, photoUrl: e.target.value })}
                      className="w-full rounded-lg border border-slate-200 p-2.5 text-slate-900 focus:outline-none"
                    />
                  </div>
                </div>
              )}

              {/* Step 2: Contact & Address */}
              {wizardStep === 2 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Mobile Number *</label>
                    <input
                      type="text"
                      placeholder="+91 98200 12345"
                      value={formData.mobile}
                      onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                      className="w-full rounded-lg border border-slate-200 p-2.5 text-slate-900 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Personal Email</label>
                    <input
                      type="email"
                      placeholder="ananya@gmail.com"
                      value={formData.personalEmail}
                      onChange={(e) => setFormData({ ...formData, personalEmail: e.target.value })}
                      className="w-full rounded-lg border border-slate-200 p-2.5 text-slate-900 focus:outline-none"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block font-semibold text-slate-700 mb-1">Current Residential Address</label>
                    <input
                      type="text"
                      value={formData.currentAddress}
                      onChange={(e) => setFormData({ ...formData, currentAddress: e.target.value })}
                      className="w-full rounded-lg border border-slate-200 p-2.5 text-slate-900 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">City</label>
                    <input
                      type="text"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="w-full rounded-lg border border-slate-200 p-2.5 text-slate-900 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">PIN Code</label>
                    <input
                      type="text"
                      value={formData.pinCode}
                      onChange={(e) => setFormData({ ...formData, pinCode: e.target.value })}
                      className="w-full rounded-lg border border-slate-200 p-2.5 text-slate-900 focus:outline-none"
                    />
                  </div>
                </div>
              )}

              {/* Step 3: Job & Organization */}
              {wizardStep === 3 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Department *</label>
                    <select
                      value={formData.department}
                      onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                      className="w-full rounded-lg border border-slate-200 p-2.5 text-slate-900 focus:outline-none cursor-pointer"
                    >
                      {departments.map((d) => (
                        <option key={d.id} value={d.name}>
                          {d.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Designation *</label>
                    <select
                      value={formData.designation}
                      onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                      className="w-full rounded-lg border border-slate-200 p-2.5 text-slate-900 focus:outline-none cursor-pointer"
                    >
                      {designations.map((des) => (
                        <option key={des.id} value={des.name}>
                          {des.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Work Location *</label>
                    <select
                      value={formData.workLocation}
                      onChange={(e) => setFormData({ ...formData, workLocation: e.target.value })}
                      className="w-full rounded-lg border border-slate-200 p-2.5 text-slate-900 focus:outline-none cursor-pointer"
                    >
                      {locations.map((loc) => (
                        <option key={loc.id} value={loc.name}>
                          {loc.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Shift</label>
                    <select
                      value={formData.shiftId}
                      onChange={(e) => setFormData({ ...formData, shiftId: e.target.value })}
                      className="w-full rounded-lg border border-slate-200 p-2.5 text-slate-900 focus:outline-none cursor-pointer"
                    >
                      {shifts.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.name} ({s.startTime} - {s.endTime})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Date of Joining</label>
                    <input
                      type="date"
                      value={formData.dateOfJoining}
                      onChange={(e) => setFormData({ ...formData, dateOfJoining: e.target.value })}
                      className="w-full rounded-lg border border-slate-200 p-2.5 text-slate-900 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Employment Type</label>
                    <select
                      value={formData.employmentType}
                      onChange={(e) => setFormData({ ...formData, employmentType: e.target.value as any })}
                      className="w-full rounded-lg border border-slate-200 p-2.5 text-slate-900 focus:outline-none cursor-pointer"
                    >
                      <option value="Full-Time">Full-Time</option>
                      <option value="Part-Time">Part-Time</option>
                      <option value="Contract">Contract</option>
                      <option value="Intern">Intern</option>
                    </select>
                  </div>
                </div>
              )}

              {/* Step 4: Compensation & CTC Structure */}
              {wizardStep === 4 && (
                <div className="space-y-4">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Annual CTC (₹ INR) *</label>
                    <input
                      type="number"
                      step={10000}
                      value={formData.annualCTC}
                      onChange={(e) => handleCtcChange(Number(e.target.value))}
                      className="w-full rounded-lg border border-slate-200 p-2.5 text-base font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>

                  <div className="rounded-xl bg-slate-50 p-4 border border-slate-200 space-y-2.5">
                    <p className="font-bold text-slate-800 text-xs">Automated Monthly Salary Component Breakdown</p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                      <div className="p-2 bg-white rounded-lg border border-slate-200">
                        <span className="text-slate-500">Basic Pay (50%)</span>
                        <p className="font-bold text-slate-900 mt-0.5">{formatINR(formData.basicSalary || 0)}</p>
                      </div>
                      <div className="p-2 bg-white rounded-lg border border-slate-200">
                        <span className="text-slate-500">HRA (Metro 50%)</span>
                        <p className="font-bold text-slate-900 mt-0.5">{formatINR(formData.hra || 0)}</p>
                      </div>
                      <div className="p-2 bg-white rounded-lg border border-slate-200">
                        <span className="text-slate-500">Conveyance Allowance</span>
                        <p className="font-bold text-slate-900 mt-0.5">{formatINR(formData.conveyance || 0)}</p>
                      </div>
                      <div className="p-2 bg-white rounded-lg border border-slate-200">
                        <span className="text-slate-500">Medical Allowance</span>
                        <p className="font-bold text-slate-900 mt-0.5">{formatINR(formData.medicalAllowance || 0)}</p>
                      </div>
                      <div className="p-2 bg-white rounded-lg border border-slate-200">
                        <span className="text-slate-500">Special Allowance</span>
                        <p className="font-bold text-slate-900 mt-0.5">{formatINR(formData.specialAllowance || 0)}</p>
                      </div>
                      <div className="p-2 bg-orange-50 rounded-lg border border-orange-200">
                        <span className="text-orange-700 font-semibold">Monthly Gross</span>
                        <p className="font-bold text-orange-900 mt-0.5">{formatINR(formData.monthlyCTC || 0)}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 5: Bank Details */}
              {wizardStep === 5 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Bank Name *</label>
                    <input
                      type="text"
                      value={formData.bankName}
                      onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
                      className="w-full rounded-lg border border-slate-200 p-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Bank Account Number *</label>
                    <input
                      type="text"
                      placeholder="e.g. 50100987654321"
                      value={formData.accountNumber}
                      onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
                      className="w-full rounded-lg border border-slate-200 p-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">IFSC Code *</label>
                    <input
                      type="text"
                      placeholder="HDFC0000060"
                      value={formData.ifscCode}
                      onChange={(e) => setFormData({ ...formData, ifscCode: e.target.value.toUpperCase() })}
                      className="w-full rounded-lg border border-slate-200 p-2.5 font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Branch Name</label>
                    <input
                      type="text"
                      value={formData.branch}
                      onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
                      className="w-full rounded-lg border border-slate-200 p-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                </div>
              )}

              {/* Step 6: Statutory & Tax Details */}
              {wizardStep === 6 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">PAN Card Number *</label>
                    <input
                      type="text"
                      maxLength={10}
                      placeholder="ABCDE1234F"
                      value={formData.panNumber}
                      onChange={(e) => setFormData({ ...formData, panNumber: e.target.value.toUpperCase() })}
                      className="w-full rounded-lg border border-slate-200 p-2.5 font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Aadhaar Card (12-Digit) *</label>
                    <input
                      type="text"
                      maxLength={12}
                      placeholder="123456789012"
                      value={formData.aadhaarNumber}
                      onChange={(e) => setFormData({ ...formData, aadhaarNumber: e.target.value })}
                      className="w-full rounded-lg border border-slate-200 p-2.5 font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">EPF Universal Account No (UAN)</label>
                    <input
                      type="text"
                      placeholder="100481920999"
                      value={formData.uan}
                      onChange={(e) => setFormData({ ...formData, uan: e.target.value })}
                      className="w-full rounded-lg border border-slate-200 p-2.5 font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">ESIC Insurance IP Number</label>
                    <input
                      type="text"
                      placeholder="Exempt or 3100049281..."
                      value={formData.esicNumber || 'Exempt (>21k)'}
                      onChange={(e) => setFormData({ ...formData, esicNumber: e.target.value })}
                      className="w-full rounded-lg border border-slate-200 p-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                </div>
              )}

              {/* Step 7: Documents */}
              {wizardStep === 7 && (
                <div className="space-y-3">
                  <p className="text-xs text-slate-500">
                    Upload mandatory onboarding documents for background verification and statutory filing:
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {['Government ID (Aadhaar / PAN)', 'Signed Offer Letter', 'Educational Degree', 'Previous Relieving Letter'].map(
                      (docName) => (
                        <div key={docName} className="p-3 border border-dashed border-slate-300 rounded-lg text-center bg-slate-50/50">
                          <Upload className="h-5 w-5 text-slate-400 mx-auto mb-1" />
                          <p className="font-semibold text-slate-800">{docName}</p>
                          <span className="text-[10px] text-orange-600 font-medium cursor-pointer hover:underline">
                            Browse / Drop File (PDF, Max 5MB)
                          </span>
                        </div>
                      )
                    )}
                  </div>
                </div>
              )}

              {/* Step 8: Review & Submit */}
              {wizardStep === 8 && (
                <div className="space-y-4">
                  <div className="rounded-xl bg-orange-50/80 p-4 border border-orange-200">
                    <h4 className="font-bold text-orange-900 text-sm">Review & Final Confirmation</h4>
                    <p className="text-xs text-orange-700 mt-0.5">
                      Confirming will generate the employee profile, auto-allocate employee ID ST-{employees.length + 1001}, and send login welcome email.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                    <div>
                      <span className="text-slate-400">Employee Name:</span>
                      <p className="font-bold text-slate-900">{formData.fullName || 'Not specified'}</p>
                    </div>
                    <div>
                      <span className="text-slate-400">Department:</span>
                      <p className="font-bold text-slate-900">{formData.department}</p>
                    </div>
                    <div>
                      <span className="text-slate-400">Designation:</span>
                      <p className="font-bold text-slate-900">{formData.designation}</p>
                    </div>
                    <div>
                      <span className="text-slate-400">Work Location:</span>
                      <p className="font-bold text-slate-900">{formData.workLocation}</p>
                    </div>
                    <div>
                      <span className="text-slate-400">Annual CTC:</span>
                      <p className="font-bold text-green-700">{formatINR(formData.annualCTC || 0)}</p>
                    </div>
                    <div>
                      <span className="text-slate-400">Joining Date:</span>
                      <p className="font-bold text-slate-900">{formData.dateOfJoining}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Footer Navigation Controls */}
            <div className="flex items-center justify-between border-t border-slate-100 pt-4">
              <button
                type="button"
                disabled={wizardStep === 1}
                onClick={() => setWizardStep((s) => Math.max(1, s - 1))}
                className="rounded-lg border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-40 cursor-pointer"
              >
                Previous
              </button>

              {wizardStep < 8 ? (
                <button
                  type="button"
                  onClick={() => setWizardStep((s) => Math.min(8, s + 1))}
                  className="rounded-lg bg-slate-900 px-5 py-2 text-xs font-bold text-white hover:bg-slate-800 cursor-pointer shadow-xs"
                >
                  Next Step
                </button>
              ) : (
                <button
                  type="button"
                  id="wizard-submit-btn"
                  onClick={handleFinishOnboarding}
                  className="rounded-lg bg-orange-600 px-6 py-2 text-xs font-bold text-white shadow-xs hover:bg-orange-700 cursor-pointer"
                >
                  Confirm & Onboard
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

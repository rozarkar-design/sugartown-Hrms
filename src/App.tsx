import React, { useState, useEffect } from 'react';
import { HRMSProvider, useHRMS } from './context/HRMSContext';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { AdminDashboard } from './components/AdminDashboard';
import { EmployeeDashboard } from './components/EmployeeDashboard';
import { EmployeeManagement } from './components/EmployeeManagement';
import { EmployeeProfileModal } from './components/EmployeeProfileModal';
import { AttendanceManagement } from './components/AttendanceManagement';
import { LeaveManagement } from './components/LeaveManagement';
import { PayrollManagement } from './components/PayrollManagement';
import { PayslipViewerModal } from './components/PayslipViewerModal';
import { StatutoryCompliance } from './components/StatutoryCompliance';
import { DocumentRepository } from './components/DocumentRepository';
import { HROperations } from './components/HROperations';
import { AnalyticsReports } from './components/AnalyticsReports';
import { AdminSettings } from './components/AdminSettings';
import { GlobalSearchModal } from './components/GlobalSearchModal';
import { LoginView } from './components/LoginView';
import { Employee, Payslip } from './types';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useHRMS();

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 pointer-events-none max-w-sm w-full">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`pointer-events-auto flex items-center justify-between gap-3 rounded-xl border p-3.5 shadow-lg backdrop-blur-md transition-all animate-in fade-in slide-in-from-bottom-3 duration-200 ${
            toast.type === 'success'
              ? 'bg-emerald-50/95 border-emerald-200 text-emerald-900'
              : toast.type === 'error'
              ? 'bg-orange-50/95 border-orange-200 text-orange-900'
              : 'bg-slate-900/95 border-slate-800 text-white'
          }`}
        >
          <div className="flex items-center gap-2.5 text-xs font-semibold">
            {toast.type === 'success' && <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />}
            {toast.type === 'error' && <AlertCircle className="h-4 w-4 text-orange-600 shrink-0" />}
            {toast.type === 'info' && <Info className="h-4 w-4 text-orange-400 shrink-0" />}
            <span>{toast.message}</span>
          </div>
          <button
            onClick={() => removeToast(toast.id)}
            className="rounded-lg p-1 text-slate-400 hover:text-slate-700 transition-colors"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
};

const HRMSAppContent: React.FC = () => {
  const { currentUser, employees, payslips, isAuthenticated, logout } = useHRMS();

  // Primary active navigation view
  const [currentView, setCurrentView] = useState<string>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);

  // Modals state
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [selectedProfileEmployee, setSelectedProfileEmployee] = useState<Employee | null>(null);
  const [selectedPayslip, setSelectedPayslip] = useState<Payslip | null>(null);

  // Keyboard shortcut for Cmd+K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSelectSearchItem = (type: string, id: string) => {
    if (type === 'employee') {
      const emp = employees.find((e) => e.id === id || e.employeeId === id);
      if (emp) setSelectedProfileEmployee(emp);
    } else if (type === 'payslip') {
      const ps = payslips.find((p) => p.id === id);
      if (ps) setSelectedPayslip(ps);
    } else if (type === 'navigation') {
      setCurrentView(id);
    }
  };

  if (!isAuthenticated) {
    return <LoginView />;
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans text-slate-900 flex flex-col antialiased">
      {/* 1. Master Application Header */}
      <Header
        onOpenSearch={() => setIsSearchOpen(true)}
        onNavigate={setCurrentView}
        onLogout={logout}
        onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)}
      />

      {/* 2. Body with Sidebar & Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Responsive Sidebar */}
        <Sidebar
          currentView={currentView}
          onNavigate={setCurrentView}
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />

        {/* Main Content Area */}
        <main className="flex-1 flex flex-col overflow-y-auto min-h-0">
          <div className="flex-1 px-4 py-6 sm:px-8 sm:py-8">
            <div className="mx-auto max-w-7xl">
              {/* VIEW ROUTING */}
              {currentView === 'dashboard' && (
                <>
                  {currentUser.role === 'EMPLOYEE' ? (
                    <EmployeeDashboard
                      onNavigate={setCurrentView}
                      onViewPayslip={setSelectedPayslip}
                    />
                  ) : (
                    <AdminDashboard
                      onNavigate={setCurrentView}
                      onViewPayslip={setSelectedPayslip}
                    />
                  )}
                </>
              )}

              {currentView === 'employees' && (
                <EmployeeManagement onViewProfile={setSelectedProfileEmployee} />
              )}

              {currentView === 'attendance' && <AttendanceManagement />}

              {currentView === 'leaves' && <LeaveManagement />}

              {currentView === 'payroll' && (
                <PayrollManagement onViewPayslip={setSelectedPayslip} />
              )}

              {currentView === 'statutory' && <StatutoryCompliance />}

              {currentView === 'documents' && <DocumentRepository />}

              {currentView === 'operations' && <HROperations />}

              {currentView === 'reports' && <AnalyticsReports />}

              {currentView === 'settings' && <AdminSettings />}
            </div>
          </div>

          {/* Professional Polish Standardized Footer */}
          <footer className="mt-auto p-4 flex flex-col sm:flex-row justify-between items-center text-[10px] text-slate-400 border-t border-slate-100 bg-white">
            <p>© 2026 Sugartown Retail Private Limited. All rights reserved.</p>
            <div className="flex gap-4 mt-2 sm:mt-0">
              <a href="#" className="hover:text-slate-600 transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-slate-600 transition-colors">Support</a>
              <span className="text-slate-300">v2.4.1-stable</span>
            </div>
          </footer>
        </main>
      </div>

      {/* Global Modals */}
      <GlobalSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectItem={handleSelectSearchItem}
      />

      <EmployeeProfileModal
        employee={selectedProfileEmployee}
        onClose={() => setSelectedProfileEmployee(null)}
        onViewPayslip={setSelectedPayslip}
      />

      <PayslipViewerModal
        payslip={selectedPayslip}
        onClose={() => setSelectedPayslip(null)}
      />

      {/* Toast Feedback */}
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <HRMSProvider>
      <HRMSAppContent />
    </HRMSProvider>
  );
}

import React from 'react';
import {
  LayoutDashboard,
  Users,
  Clock,
  CalendarCheck,
  CreditCard,
  FileText,
  Receipt,
  FolderLock,
  BarChart3,
  Megaphone,
  BookOpen,
  Settings,
  X,
  FileCheck2,
  Headphones,
} from 'lucide-react';
import { useHRMS } from '../context/HRMSContext';

interface SidebarProps {
  currentView?: string;
  onNavigate?: (view: string) => void;
  currentTab?: string;
  setCurrentTab?: (tab: string) => void;
  isOpen?: boolean;
  onClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView = 'dashboard',
  onNavigate,
  currentTab,
  setCurrentTab,
  isOpen = false,
  onClose = () => {},
}) => {
  const { currentUser, leaveRequests, regularizations, reimbursements } = useHRMS();

  const isEmployeeOnly = currentUser.role === 'EMPLOYEE';

  // Pending approval counts for notification badges
  const pendingLeaves = leaveRequests.filter((l) => l.status === 'Pending').length;
  const pendingRegularizations = regularizations.filter((r) => r.status === 'Pending').length;
  const pendingReimbursements = reimbursements.filter((r) => r.status === 'Pending').length;

  const activeId = currentTab || currentView;

  const handleItemClick = (targetView: string) => {
    if (setCurrentTab) setCurrentTab(targetView);
    if (onNavigate) onNavigate(targetView);
    onClose();
  };

  interface NavItem {
    id: string;
    label: string;
    icon: React.ElementType;
    badge?: number;
  }

  interface NavGroup {
    title?: string;
    items: NavItem[];
  }

  const employeeNavGroups: NavGroup[] = [
    {
      items: [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'attendance', label: 'Attendance & Clock', icon: Clock },
        { id: 'leaves', label: 'Leave Management', icon: CalendarCheck, badge: pendingLeaves > 0 ? pendingLeaves : undefined },
        { id: 'payroll', label: 'Payslips & Salary', icon: CreditCard },
        { id: 'documents', label: 'My Documents', icon: FolderLock },
        { id: 'operations', label: 'Helpdesk & Claims', icon: Receipt, badge: pendingReimbursements > 0 ? pendingReimbursements : undefined },
      ],
    },
  ];

  const adminNavGroups: NavGroup[] = [
    {
      items: [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'employees', label: 'Employees', icon: Users },
        {
          id: 'attendance',
          label: 'Attendance',
          icon: Clock,
          badge: pendingRegularizations > 0 ? pendingRegularizations : undefined,
        },
        {
          id: 'leaves',
          label: 'Leave Management',
          icon: CalendarCheck,
          badge: pendingLeaves > 0 ? pendingLeaves : undefined,
        },
        { id: 'payroll', label: 'Payroll', icon: CreditCard },
        { id: 'statutory', label: 'Statutory Slabs', icon: FileCheck2 },
        { id: 'documents', label: 'Documents', icon: FolderLock },
        {
          id: 'operations',
          label: 'HR Operations',
          icon: Headphones,
          badge: pendingReimbursements > 0 ? pendingReimbursements : undefined,
        },
        { id: 'reports', label: 'Reports', icon: BarChart3 },
        { id: 'settings', label: 'Settings', icon: Settings },
      ],
    },
  ];

  const navGroups = isEmployeeOnly ? employeeNavGroups : adminNavGroups;

  return (
    <>
      {/* Mobile backdrop overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-xs lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar container - Professional Polish style */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-slate-200 bg-white transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="p-6 flex items-center justify-between border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-sm">
              S
            </div>
            <span className="font-bold text-lg tracking-tight text-slate-900">
              Sugartown <span className="text-orange-500">HRMS</span>
            </span>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation links */}
        <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
          {navGroups.map((group, groupIdx) => (
            <div key={groupIdx} className="space-y-1">
              {group.title && (
                <h4 className="px-3 pt-2 pb-1 text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                  {group.title}
                </h4>
              )}
              {group.items.map((item) => {
                const Icon = item.icon;
                const isSelected =
                  activeId === item.id ||
                  (item.id === 'dashboard' && (activeId === 'admin-dashboard' || activeId === 'emp-dashboard')) ||
                  (item.id === 'employees' && (activeId === 'admin-employees' || activeId === 'emp-profile')) ||
                  (item.id === 'attendance' && (activeId === 'admin-attendance' || activeId === 'emp-attendance')) ||
                  (item.id === 'leaves' && (activeId === 'admin-leave' || activeId === 'emp-leave')) ||
                  (item.id === 'payroll' && (activeId === 'admin-payroll' || activeId === 'admin-payslips' || activeId === 'emp-payslips')) ||
                  (item.id === 'documents' && (activeId === 'admin-documents' || activeId === 'emp-documents' || activeId === 'emp-policies' || activeId === 'admin-policies')) ||
                  (item.id === 'operations' && (activeId === 'admin-operations' || activeId === 'admin-reimbursements' || activeId === 'emp-reimbursements' || activeId === 'emp-announcements' || activeId === 'admin-announcements')) ||
                  (item.id === 'reports' && activeId === 'admin-reports') ||
                  (item.id === 'settings' && (activeId === 'admin-settings' || activeId === 'admin-audit'));

                return (
                  <button
                    key={item.id}
                    id={`sidebar-nav-${item.id}`}
                    onClick={() => handleItemClick(item.id)}
                    className={`flex w-full items-center justify-between gap-3 px-3 py-2 rounded-md font-medium text-sm transition-colors ${
                      isSelected
                        ? 'bg-orange-50 text-orange-600 font-semibold'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={`w-5 h-5 ${isSelected ? 'text-orange-600' : 'text-slate-500'}`} />
                      <span>{item.label}</span>
                    </div>
                    {item.badge && item.badge > 0 ? (
                      <span className="flex h-5 items-center justify-center rounded-full bg-orange-500 px-1.5 text-[10px] font-bold text-white">
                        {item.badge}
                      </span>
                    ) : null}
                  </button>
                );
              })}
            </div>
          ))}
        </nav>

        {/* User Card Profile Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50">
          <div className="flex items-center gap-3">
            <img
              src={currentUser.avatarUrl}
              alt={currentUser.name}
              className="w-10 h-10 rounded-full bg-slate-200 object-cover ring-2 ring-white shadow-xs"
            />
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-slate-900 truncate">{currentUser.name}</p>
              <p className="text-[10px] text-slate-500 truncate">{currentUser.role.replace('_', ' ')}</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

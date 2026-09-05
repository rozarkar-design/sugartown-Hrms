import React, { useState } from 'react';
import {
  Search,
  Bell,
  LogOut,
  User as UserIcon,
  Shield,
  ChevronDown,
  Menu,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';
import { useHRMS } from '../context/HRMSContext';
import { UserRole } from '../types';

interface HeaderProps {
  onToggleSidebar?: () => void;
  onOpenProfile?: () => void;
  onOpenSearch?: () => void;
  onNavigate?: (view: string) => void;
  onLogout?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onToggleSidebar,
  onOpenProfile,
  onOpenSearch,
  onNavigate,
  onLogout,
}) => {
  const {
    currentUser,
    switchRole,
    logout,
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
    setIsGlobalSearchOpen,
  } = useHRMS();

  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const rolesList: { role: UserRole; label: string; desc: string }[] = [
    { role: 'SUPER_ADMIN', label: 'Super Admin', desc: 'Full system & locked payroll authorization' },
    { role: 'HR_ADMIN', label: 'HR Admin', desc: 'Employee onboarding, attendance & leave policies' },
    { role: 'PAYROLL_ADMIN', label: 'Payroll Admin', desc: 'Payroll processing, statutory & payslips' },
    { role: 'MANAGER', label: 'Manager', desc: 'Team view & leave/regularization approvals' },
    { role: 'EMPLOYEE', label: 'Employee', desc: 'Self-service portal, check-in, leave & payslips' },
  ];

  const handleSearchClick = () => {
    if (onOpenSearch) onOpenSearch();
    else setIsGlobalSearchOpen(true);
  };

  const handleLogout = () => {
    setIsUserMenuOpen(false);
    if (onLogout) onLogout();
    logout();
  };

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-4 sm:px-8 flex items-center justify-between z-30 sticky top-0">
      {/* Left: Mobile Menu Toggle & Search Bar */}
      <div className="flex items-center gap-3">
        <button
          id="mobile-menu-toggle-btn"
          onClick={onToggleSidebar}
          className="lg:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg focus:outline-none"
          title="Toggle Navigation"
        >
          <Menu className="h-5 w-5" />
        </button>

        {/* Global Search Bar - Professional Polish */}
        <div className="relative w-64 sm:w-80 md:w-96">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 pointer-events-none">
            <Search className="w-4 h-4" />
          </span>
          <input
            id="header-global-search-input"
            type="text"
            placeholder="Search records, employees..."
            onClick={handleSearchClick}
            readOnly
            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm bg-slate-50/50 hover:bg-white focus:bg-white focus:outline-none focus:border-orange-500 cursor-pointer transition-colors"
          />
          <kbd className="hidden md:inline-flex absolute right-2.5 top-1/2 -translate-y-1/2 items-center gap-0.5 rounded border border-slate-200 bg-white px-1.5 py-0.5 text-[10px] font-semibold text-slate-400">
            ⌘K
          </kbd>
        </div>
      </div>

      {/* Right Controls: Role Switcher, Notification Bell, Divider, Company Tag, User Avatar */}
      <div className="flex items-center gap-3 sm:gap-6">
        {/* Role Switcher Pill */}
        <div className="relative">
          <button
            id="role-switcher-btn"
            onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
            className="flex items-center gap-1.5 sm:gap-2 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 hover:border-slate-300 transition-colors"
            title="Switch User Role to test access control"
          >
            <Shield className="h-3.5 w-3.5 text-orange-600" />
            <span className="hidden sm:inline text-slate-500">Role:</span>
            <span className="text-orange-600 font-bold">{currentUser.role.replace('_', ' ')}</span>
            <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
          </button>

          {isRoleDropdownOpen && (
            <div className="absolute right-0 mt-2 w-72 rounded-xl border border-slate-200 bg-white p-2 shadow-xl z-50 animate-in fade-in zoom-in-95 duration-100">
              <div className="px-3 py-2 border-b border-slate-100">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                  <Sparkles className="h-3.5 w-3.5 text-orange-600" />
                  <span>Test Role-Based Access</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5">Switch perspective instantly</p>
              </div>
              <div className="space-y-1 mt-1">
                {rolesList.map((r) => (
                  <button
                    key={r.role}
                    id={`role-opt-${r.role.toLowerCase()}`}
                    onClick={() => {
                      switchRole(r.role);
                      setIsRoleDropdownOpen(false);
                    }}
                    className={`flex w-full flex-col items-start rounded-lg px-3 py-2 text-left text-xs transition-colors ${
                      currentUser.role === r.role
                        ? 'bg-orange-50 text-orange-900 font-semibold'
                        : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex w-full items-center justify-between">
                      <span className="font-semibold">{r.label}</span>
                      {currentUser.role === r.role && (
                        <CheckCircle2 className="h-3.5 w-3.5 text-orange-600" />
                      )}
                    </div>
                    <span className="text-[11px] font-normal text-slate-500 mt-0.5">{r.desc}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Notifications Icon Button */}
        <div className="relative">
          <button
            id="notifications-btn"
            onClick={() => setIsNotificationOpen(!isNotificationOpen)}
            className="relative text-slate-500 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-50 transition-colors focus:outline-none"
            title="Notifications"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 block h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-white"></span>
            )}
          </button>

          {isNotificationOpen && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-xl border border-slate-200 bg-white p-3 shadow-xl z-50 animate-in fade-in duration-100">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2 px-1">
                <div>
                  <h3 className="text-xs font-bold text-slate-900">Notifications</h3>
                  <p className="text-[11px] text-slate-500">{unreadCount} unread updates</p>
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllNotificationsRead}
                    className="text-[11px] font-medium text-orange-600 hover:text-orange-700 hover:underline"
                  >
                    Mark all as read
                  </button>
                )}
              </div>

              <div className="max-h-72 overflow-y-auto divide-y divide-slate-100 mt-2">
                {notifications.length === 0 ? (
                  <div className="p-4 text-center text-xs text-slate-400">No notifications</div>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={n.id}
                      onClick={() => markNotificationRead(n.id)}
                      className={`p-2.5 rounded-lg transition-colors cursor-pointer ${
                        !n.read ? 'bg-orange-50/50 hover:bg-orange-50' : 'hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-slate-900">{n.title}</span>
                        <span className="text-[10px] text-slate-400">{n.timestamp}</span>
                      </div>
                      <p className="text-xs text-slate-600 mt-1 leading-relaxed">{n.message}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Vertical Divider */}
        <div className="h-8 w-[1px] bg-slate-200 hidden sm:block"></div>

        {/* Company Title */}
        <span className="text-sm text-slate-600 font-medium hidden md:block">
          Sugartown Retail PVT LTD
        </span>

        {/* User Avatar & Dropdown */}
        <div className="relative">
          <button
            id="user-profile-menu-btn"
            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
            className="flex items-center gap-2 p-1 rounded-lg hover:bg-slate-50 transition-colors focus:outline-none"
          >
            <img
              src={currentUser.avatarUrl}
              alt={currentUser.name}
              className="w-8 h-8 rounded-full bg-slate-200 object-cover ring-2 ring-slate-100"
            />
            <ChevronDown className="h-3.5 w-3.5 text-slate-400 hidden sm:block" />
          </button>

          {isUserMenuOpen && (
            <div className="absolute right-0 mt-2 w-60 rounded-xl border border-slate-200 bg-white p-2 shadow-xl z-50 animate-in fade-in duration-100">
              <div className="border-b border-slate-100 px-3 py-2.5">
                <p className="text-xs font-bold text-slate-900">{currentUser.name}</p>
                <p className="text-[11px] text-slate-500 truncate">{currentUser.email}</p>
                <div className="mt-1 flex items-center gap-1.5">
                  <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-medium text-slate-600">
                    ID: {currentUser.employeeId}
                  </span>
                  <span className="rounded bg-orange-50 px-1.5 py-0.5 text-[10px] font-semibold text-orange-700">
                    {currentUser.role.replace('_', ' ')}
                  </span>
                </div>
              </div>

              <div className="py-1 space-y-0.5 text-xs">
                <button
                  id="view-my-profile-btn"
                  onClick={() => {
                    setIsUserMenuOpen(false);
                    if (onOpenProfile) onOpenProfile();
                    else if (onNavigate) onNavigate('employees');
                  }}
                  className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  <UserIcon className="h-4 w-4 text-slate-500" />
                  <span>View Full Profile</span>
                </button>
                <button
                  id="header-logout-btn"
                  onClick={handleLogout}
                  className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-red-600 hover:bg-red-50 transition-colors"
                >
                  <LogOut className="h-4 w-4 text-red-500" />
                  <span>Logout Securely</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

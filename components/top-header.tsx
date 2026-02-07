'use client';

import {
  Bell, Settings, LogOut, User, ArrowLeft, Users,
  LayoutDashboard, FileText, DollarSign,
  Calendar, PieChart, Shield, Briefcase
} from 'lucide-react';
import { useState } from 'react';
import { useAuth } from './providers/auth-context';

interface TopHeaderProps {
  onNavigate?: (id: string) => void;
  activeItem?: string;
}

export function TopHeader({ onNavigate, activeItem }: TopHeaderProps) {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const { user, role, logout } = useAuth();

  const menuItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { id: 'employees', icon: Users, label: 'Employees' },
    { id: 'client-master', icon: Briefcase, label: 'Clients' },
    { id: 'generate-invoice', icon: FileText, label: 'Billing' },
    { id: 'salary-process', icon: DollarSign, label: 'Payroll' },
    { id: 'monthly-attendance', icon: Calendar, label: 'Attendance' },
    { id: 'report-employee', icon: PieChart, label: 'Reports' },
    { id: 'users', icon: Shield, label: 'Access' },
  ];

  if (!user) return null;

  return (
    <div className="fixed top-0 left-0 right-0 h-16 bg-background/95 border-b border-primary/20 backdrop-blur-lg flex items-center justify-between px-6 shadow-lg shadow-primary/5 z-50">

      {/* Left side - Branding */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg shadow-primary/20">
          <span className="font-bold text-white text-lg">A</span>
        </div>
        <div className="hidden md:block">
          <h1 className="font-bold text-lg tracking-tight text-white">AXIS <span className="text-primary">NOVA</span></h1>
        </div>
      </div>

      {/* Middle - Navigation */}
      <nav className="hidden md:flex items-center gap-1 overflow-x-auto no-scrollbar mx-4">
        {onNavigate && menuItems.map((item) => {
          const isActive = activeItem === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all duration-200 text-sm font-medium
                ${isActive
                  ? 'bg-primary/10 text-primary border border-primary/20 shadow-[0_0_10px_rgba(139,92,246,0.1)]'
                  : 'text-muted-foreground hover:bg-white/5 hover:text-foreground'
                }
              `}
            >
              <item.icon className={`w-4 h-4 ${isActive ? 'text-primary' : ''}`} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Right side - Notifications and Profile */}
      <div className="flex items-center gap-4">
        {/* Notifications */}
        <button className="relative p-2 text-muted-foreground hover:text-accent transition-all hover:bg-white/5 rounded-lg">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-destructive rounded-full" />
        </button>

        {/* Profile Menu */}
        <div className="relative">
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-2 pl-2 pr-1 py-1 hover:bg-white/5 rounded-full transition-all border border-transparent hover:border-white/10"
          >
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center shadow-md">
              <User className="w-4 h-4 text-white" />
            </div>
          </button>

          {/* Dropdown Menu */}
          {showProfileMenu && (
            <div className="absolute top-full right-0 mt-2 w-48 bg-card border border-primary/20 rounded-xl shadow-2xl animate-slide-down backdrop-blur-md overflow-hidden">
              <div className="p-3 border-b border-primary/10 bg-primary/5">
                <p className="text-sm font-semibold text-foreground">{user.name}</p>
                <p className="text-xs text-accent">{role?.name}</p>
              </div>
              <div className="p-1">
                <button
                  onClick={logout}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

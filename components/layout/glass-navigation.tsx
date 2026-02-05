'use client';

import { useState } from 'react';
import {
    LayoutDashboard, Users, FileText, Settings,
    LogOut, Menu, ChevronRight, DollarSign,
    Calendar, Briefcase, PieChart, Shield
} from 'lucide-react';
import { useAuth } from '../providers/auth-context';

interface GlassNavigationProps {
    onNavigate: (id: string) => void;
    activeItem: string;
}

export function GlassNavigation({ onNavigate, activeItem }: GlassNavigationProps) {
    const [isExpanded, setIsExpanded] = useState(false);
    const { logout, user } = useAuth();

    const menuItems = [
        { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard', group: 'main' },
        { id: 'client-master', icon: Briefcase, label: 'Clients', group: 'billing' },
        { id: 'generate-invoice', icon: FileText, label: 'Waitlist', group: 'billing' }, // Changed label for demo "Waitlist" usually means Pending? sticking to invoice for now but label "Billing"
        { id: 'salary-process', icon: DollarSign, label: 'Payroll', group: 'hr' },
        { id: 'monthly-attendance', icon: Calendar, label: 'Attendance', group: 'hr' },
        { id: 'report-employee', icon: PieChart, label: 'Reports', group: 'admin' },
        { id: 'users', icon: Shield, label: 'Access Control', group: 'admin' },
    ];

    return (
        <div
            className={`fixed left-4 top-4 bottom-4 z-50 transition-all duration-300 ease-spring ${isExpanded ? 'w-64' : 'w-20'}`}
            onMouseEnter={() => setIsExpanded(true)}
            onMouseLeave={() => setIsExpanded(false)}
        >
            <div className="h-full glass rounded-3xl flex flex-col justify-between p-4 shadow-2xl border-l border-t border-white/10 bg-black/40">

                {/* Branding */}
                <div className="flex items-center gap-3 mb-8 px-2">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg shadow-primary/20">
                        <span className="font-bold text-white text-xl">A</span>
                    </div>
                    <div className={`transition-opacity duration-200 ${isExpanded ? 'opacity-100' : 'opacity-0 hidden'}`}>
                        <h1 className="font-bold text-lg tracking-tight text-white">AXIS <span className="text-primary">NOVA</span></h1>
                    </div>
                </div>

                {/* Navigation Items */}
                <div className="flex-1 space-y-2 overflow-y-auto no-scrollbar">
                    {menuItems.map((item) => {
                        const isActive = activeItem === item.id;
                        return (
                            <button
                                key={item.id}
                                onClick={() => onNavigate(item.id)}
                                className={`w-full flex items-center gap-4 p-3 rounded-2xl transition-all duration-200 group relative
                            ${isActive
                                        ? 'bg-primary/20 text-primary shadow-[0_0_20px_rgba(139,92,246,0.3)] border border-primary/20'
                                        : 'text-gray-400 hover:bg-white/5 hover:text-white'
                                    }
                        `}
                            >
                                <item.icon className={`w-6 h-6 transition-transform group-hover:scale-110 ${isActive ? 'text-primary' : ''}`} />

                                <span className={`font-medium whitespace-nowrap transition-all duration-300 ${isExpanded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4 absolute left-14'}`}>
                                    {item.label}
                                </span>

                                {isActive && !isExpanded && (
                                    <div className="absolute right-2 w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_8px_currentColor]" />
                                )}
                            </button>
                        )
                    })}
                </div>

                {/* User / Footer */}
                <div className="mt-4 pt-4 border-t border-white/10">
                    <button
                        onClick={logout}
                        className="w-full flex items-center gap-4 p-3 rounded-2xl text-red-400 hover:bg-red-500/10 transition-colors"
                    >
                        <LogOut className="w-6 h-6" />
                        <span className={`font-medium whitespace-nowrap transition-all ${isExpanded ? 'opacity-100' : 'opacity-0 hidden'}`}>
                            Logout
                        </span>
                    </button>
                </div>

            </div>
        </div>
    );
}

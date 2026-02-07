'use client';

import {
    TrendingUp, Users, Clock, AlertTriangle,
    ArrowRight, DollarSign, Briefcase, Zap
} from 'lucide-react';
import { useEmployee } from '../providers/employee-context';

interface BentoDashboardProps {
    onNavigate: (id: string) => void;
}

export function BentoDashboard({ onNavigate }: BentoDashboardProps) {
    const { employees } = useEmployee();
    const activeCount = employees.filter(e => e.status === 'Active').length;

    return (
        <div className="flex-1 px-8 pb-8 pt-8 overflow-auto animate-fade-in"> {/* pt-8 added relative to main container padding */}

            {/* Header Section */}
            <div className="mb-8 flex justify-between items-end">
                <div>
                    <h1 className="text-4xl font-bold text-white mb-2">Good Morning, Admin</h1>
                    <p className="text-gray-400">Here's what's happening at <span className="text-primary font-bold">Axis Nova</span> today.</p>
                </div>
                <div className="flex gap-3">
                    <button className="glass px-4 py-2 rounded-xl text-sm font-medium hover:bg-white/10 transition-colors">
                        Customize View
                    </button>
                    <button className="bg-primary text-white px-6 py-2 rounded-xl text-sm font-bold shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all transform hover:-translate-y-1">
                        + Quick Action
                    </button>
                </div>
            </div>

            {/* Bento Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 auto-rows-[180px]">

                {/* 1. Hero Card (Large - 2x2) */}
                <div className="md:col-span-2 md:row-span-2 glass-card rounded-3xl p-8 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-3xl -mr-16 -mt-16 transition-all group-hover:bg-primary/30"></div>
                    <div className="relative z-10 flex flex-col h-full justify-between">
                        <div>
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-primary mb-4">
                                <Zap className="w-3 h-3 fill-current" />
                                <span>System Status: Optimal</span>
                            </div>
                            <h2 className="text-3xl font-bold text-white mb-2">Payroll Period Ending</h2>
                            <p className="text-gray-400 max-w-sm">
                                January payroll is 95% processed. Only 3 attendance approvals pending.
                            </p>
                        </div>
                        <button
                            onClick={() => onNavigate('salary-process')}
                            className="w-fit flex items-center gap-2 text-white font-semibold hover:gap-4 transition-all"
                        >
                            Review Now <ArrowRight className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* 2. Live Employee Count (1x1) */}
                <div className="glass-card rounded-3xl p-6 flex flex-col justify-between">
                    <div className="flex justify-between items-start">
                        <div className="p-3 rounded-2xl bg-blue-500/10 text-blue-400">
                            <Users className="w-6 h-6" />
                        </div>
                        <span className="flex h-3 w-3 relative">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                        </span>
                    </div>
                    <div>
                        <h3 className="text-4xl font-bold text-white">{activeCount}</h3>
                        <p className="text-sm text-gray-400">Active Employees</p>
                    </div>
                </div>

                {/* 3. Quick Actions List (1x2) */}
                <div className="md:row-span-2 glass-card rounded-3xl p-6 flex flex-col">
                    <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                        <Briefcase className="w-5 h-5 text-accent" />
                        Quick Access
                    </h3>
                    <div className="flex-1 space-y-3">
                        {[
                            { label: 'New Employee', icon: Users, id: 'new-employee' },
                            { label: 'Create Invoice', icon: TrendingUp, id: 'generate-invoice' },
                            { label: 'Mark Attendance', icon: Clock, id: 'monthly-attendance' },
                            { label: 'View Reports', icon: TrendingUp, id: 'report-employee' },
                        ].map((action, i) => (
                            <button
                                key={i}
                                onClick={() => onNavigate(action.id)}
                                className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors group text-left"
                            >
                                <div className="p-2 rounded-lg bg-gray-800 group-hover:bg-primary/20 group-hover:text-primary transition-colors">
                                    <action.icon className="w-4 h-4" />
                                </div>
                                <span className="text-sm font-medium text-gray-300 group-hover:text-white">{action.label}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* 4. Financial Pulse (1x1) */}
                <div className="glass-card rounded-3xl p-6 flex flex-col justify-between relative overflow-hidden">
                    <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-emerald-500/20 to-transparent"></div>
                    <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-400 w-fit">
                        <DollarSign className="w-6 h-6" />
                    </div>
                    <div>
                        <div className="flex items-baseline gap-2">
                            <h3 className="text-2xl font-bold text-white">₹12.4L</h3>
                            <span className="text-xs text-emerald-400">+12%</span>
                        </div>
                        <p className="text-xs text-gray-400">Monthly Billing</p>
                    </div>
                </div>

                {/* 5. Alerts (2x1) */}
                <div className="md:col-span-2 glass-card rounded-3xl p-6 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="p-4 rounded-full bg-yellow-500/10 text-yellow-500">
                            <AlertTriangle className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="font-bold text-white">System Alerts</h3>
                            <p className="text-sm text-gray-400">3 Pending validations for new client onboarding.</p>
                        </div>
                    </div>
                    <button className="px-4 py-2 rounded-lg border border-white/10 hover:bg-white/5 text-sm transition-colors">
                        View Details
                    </button>
                </div>

            </div>
        </div>
    );
}

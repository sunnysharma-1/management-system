'use client';

import React from "react"

import { useState } from 'react';
import { Activity, Users, FileText, TrendingUp, Clock, AlertCircle, CheckCircle } from 'lucide-react';

export function DashboardContent() {
  return (
    <div className="flex-1 overflow-auto">
      {/* Top Header */}
      <div className="bg-gradient-to-r from-primary/10 via-accent/5 to-background text-foreground px-8 py-8 border-b border-primary/20">
        <div className="max-w-7xl">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back to <span className="text-accent font-semibold">AXIS</span> HRM System</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-8 max-w-7xl">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <KPICard
            icon={<Users className="w-6 h-6" />}
            title="Total Employees"
            value="2,445"
            change="+12%"
            color="blue"
          />
          <KPICard
            icon={<FileText className="w-6 h-6" />}
            title="Pending Approvals"
            value="23"
            change="-5%"
            color="emerald"
          />
          <KPICard
            icon={<TrendingUp className="w-6 h-6" />}
            title="Monthly Payroll"
            value="$2.4M"
            change="+8%"
            color="slate"
          />
          <KPICard
            icon={<Activity className="w-6 h-6" />}
            title="Attendance Rate"
            value="94.2%"
            change="+2.1%"
            color="emerald"
          />
        </div>

        {/* Recent Activities Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Actions */}
          <div className="lg:col-span-2">
            <div className="bg-card rounded-lg border border-border shadow-sm p-6">
              <h2 className="text-xl font-bold text-foreground mb-4">Recent Activities</h2>
              <div className="space-y-4">
                <ActivityItem
                  icon={<CheckCircle className="w-5 h-5 text-accent" />}
                  title="Salary Process Completed"
                  description="Monthly payroll processing for January completed"
                  time="2 hours ago"
                />
                <ActivityItem
                  icon={<FileText className="w-5 h-5 text-primary" />}
                  title="Invoice Generated"
                  description="11 new invoices generated for Client XYZ"
                  time="4 hours ago"
                />
                <ActivityItem
                  icon={<Users className="w-5 h-5 text-primary" />}
                  title="New Employee Added"
                  description="John Smith added to Engineering Department"
                  time="1 day ago"
                />
                <ActivityItem
                  icon={<AlertCircle className="w-5 h-5 text-yellow-500" />}
                  title="Attendance Alert"
                  description="5 employees marked absent today"
                  time="2 days ago"
                />
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="lg:col-span-1">
            <div className="bg-card rounded-lg border border-border shadow-sm p-6 h-full">
              <h2 className="text-xl font-bold text-foreground mb-4">Quick Actions</h2>
              <div className="space-y-3">
                <QuickActionButton
                  label="Create New Employee"
                  icon="👤"
                  color="primary"
                />
                <QuickActionButton
                  label="Process Payroll"
                  icon="💰"
                  color="primary"
                />
                <QuickActionButton
                  label="Generate Invoice"
                  icon="📄"
                  color="primary"
                />
                <QuickActionButton
                  label="View Reports"
                  icon="📊"
                  color="primary"
                />
                <QuickActionButton
                  label="Manage Attendance"
                  icon="✓"
                  color="accent"
                />
              </div>
            </div>
          </div>
        </div>

        {/* System Modules */}
        <div className="mt-8">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-4">System Modules</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <ModuleCard title="Employee Management" count="2,445" icon="👥" />
            <ModuleCard title="Payroll" count="12" icon="💳" />
            <ModuleCard title="Billing" count="1,250" icon="📜" />
            <ModuleCard title="Master Data" count="89" icon="⚙️" />
            <ModuleCard title="Attendance" count="94.2%" icon="📋" />
            <ModuleCard title="Reports" count="47" icon="📊" />
            <ModuleCard title="Compliance" count="8" icon="✓" />
            <ModuleCard title="Utilities" count="15" icon="🔧" />
          </div>
        </div>
      </div>
    </div>
  );
}

interface KPICardProps {
  icon: React.ReactNode;
  title: string;
  value: string;
  change: string;
  color: 'blue' | 'emerald' | 'slate';
}

function KPICard({ icon, title, value, change, color }: KPICardProps) {
  const colorClasses = {
    blue: 'bg-gradient-to-br from-primary/10 to-primary/5 text-primary border-primary/30 shadow-lg shadow-primary/10',
    emerald: 'bg-gradient-to-br from-accent/10 to-accent/5 text-accent border-accent/30 shadow-lg shadow-accent/10',
    slate: 'bg-gradient-to-br from-muted/20 to-muted/10 text-muted-foreground border-muted/30 shadow-lg shadow-muted/5',
  };

  return (
    <div className={`${colorClasses[color]} rounded-xl border p-6 hover:shadow-2xl hover:shadow-primary/20 transition-all duration-300 backdrop-blur-sm hover:scale-105 transform`}>
      <div className="flex items-start justify-between mb-3">
        <div className="text-2xl">{icon}</div>
        <span className="text-xs font-semibold text-accent bg-accent/10 px-2 py-1 rounded">
          {change}
        </span>
      </div>
      <h3 className="text-sm text-muted-foreground mb-1">{title}</h3>
      <p className="text-2xl font-bold text-foreground">{value}</p>
    </div>
  );
}

interface ActivityItemProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  time: string;
}

function ActivityItem({ icon, title, description, time }: ActivityItemProps) {
  return (
    <div className="flex gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors">
      <div className="flex-shrink-0 mt-1">{icon}</div>
      <div className="flex-1 min-w-0">
        <p className="font-medium text-foreground">{title}</p>
        <p className="text-sm text-muted-foreground">{description}</p>
        <p className="text-xs text-muted-foreground mt-1">{time}</p>
      </div>
    </div>
  );
}

function QuickActionButton({ label, icon, color }: { label: string; icon: string; color: string }) {
  const colorClasses = {
    primary: 'bg-gradient-to-r from-primary to-primary/70 hover:from-primary/90 hover:to-primary/60 text-white shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/50',
    accent: 'bg-gradient-to-r from-accent to-accent/70 hover:from-accent/90 hover:to-accent/60 text-background shadow-lg shadow-accent/30 hover:shadow-xl hover:shadow-accent/50',
  };

  return (
    <button
      className={`w-full ${colorClasses[color as keyof typeof colorClasses]} px-4 py-2 rounded-lg font-semibold transition-all duration-300 flex items-center gap-2 animate-fade-in border border-white/20 hover:border-white/40 backdrop-blur-sm hover:scale-105 transform`}
    >
      <span>{icon}</span>
      <span>{label}</span>
    </button>
  );
}

function ModuleCard({ title, count, icon }: { title: string; count: string; icon: string }) {
  return (
    <div className="bg-gradient-to-br from-card to-card/50 rounded-xl border border-primary/20 p-6 hover:border-accent/50 hover:shadow-2xl hover:shadow-primary/20 transition-all duration-300 cursor-pointer group backdrop-blur-sm hover:scale-105 transform">
      <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">{icon}</div>
      <h3 className="font-semibold text-foreground mb-1">{title}</h3>
      <p className="text-sm text-accent font-bold">{count}</p>
    </div>
  );
}

'use client';

import { CheckCircle, AlertCircle, Clock, FileText, Plus } from 'lucide-react';

export function RequirementsSection() {
  const requirements = [
    {
      id: 1,
      title: 'Employee PF Documentation',
      status: 'Completed',
      dueDate: '2024-01-31',
      progress: 100,
      department: 'HR',
      priority: 'High',
    },
    {
      id: 2,
      title: 'Monthly Payroll Reconciliation',
      status: 'In Progress',
      dueDate: '2024-02-05',
      progress: 65,
      department: 'Finance',
      priority: 'High',
    },
    {
      id: 3,
      title: 'Tax Compliance Filing',
      status: 'Pending',
      dueDate: '2024-02-15',
      progress: 0,
      department: 'Finance',
      priority: 'Critical',
    },
    {
      id: 4,
      title: 'Employee Training Records Update',
      status: 'In Progress',
      dueDate: '2024-02-20',
      progress: 45,
      department: 'HR',
      priority: 'Medium',
    },
    {
      id: 5,
      title: 'Contract Review and Renewal',
      status: 'Completed',
      dueDate: '2024-01-28',
      progress: 100,
      department: 'Admin',
      priority: 'High',
    },
    {
      id: 6,
      title: 'Compliance Audit Preparation',
      status: 'Pending',
      dueDate: '2024-03-01',
      progress: 10,
      department: 'Admin',
      priority: 'Critical',
    },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Completed':
        return <CheckCircle className="w-5 h-5 text-accent" />;
      case 'In Progress':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case 'Pending':
        return <AlertCircle className="w-5 h-5 text-destructive" />;
      default:
        return <FileText className="w-5 h-5 text-primary" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'bg-accent/10 text-accent';
      case 'In Progress':
        return 'bg-yellow-100 text-yellow-700';
      case 'Pending':
        return 'bg-destructive/10 text-destructive';
      default:
        return 'bg-muted text-foreground';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Critical':
        return 'bg-destructive/10 text-destructive';
      case 'High':
        return 'bg-orange-100 text-orange-700';
      case 'Medium':
        return 'bg-blue-100 text-blue-700';
      default:
        return 'bg-muted text-foreground';
    }
  };

  const completedCount = requirements.filter((r) => r.status === 'Completed').length;
  const inProgressCount = requirements.filter((r) => r.status === 'In Progress').length;
  const pendingCount = requirements.filter((r) => r.status === 'Pending').length;

  return (
    <div className="flex-1 overflow-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary/95 to-primary/80 text-primary-foreground px-8 py-6 border-b border-primary/20">
        <h1 className="text-3xl font-bold">Requirements & Compliance</h1>
        <p className="text-primary-foreground/90 mt-2">Track and manage organizational requirements and compliance tasks</p>
      </div>

      {/* Content */}
      <div className="p-8 max-w-7xl">
        {/* Status Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <StatusCard
            title="Total Requirements"
            count={requirements.length}
            color="primary"
            icon="📋"
          />
          <StatusCard
            title="Completed"
            count={completedCount}
            color="accent"
            icon="✓"
          />
          <StatusCard
            title="In Progress"
            count={inProgressCount}
            color="yellow"
            icon="⏳"
          />
          <StatusCard
            title="Pending"
            count={pendingCount}
            color="destructive"
            icon="⚠"
          />
        </div>

        {/* Action Bar */}
        <div className="bg-card rounded-lg border border-border p-4 mb-6 shadow-sm">
          <button className="bg-accent hover:bg-accent/90 text-accent-foreground px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Add New Requirement
          </button>
        </div>

        {/* Requirements List */}
        <div className="space-y-4">
          {requirements.map((req, index) => (
            <div
              key={req.id}
              className="bg-card rounded-lg border border-border p-6 shadow-sm hover:shadow-md transition-all duration-300 animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-start gap-4">
                {/* Icon */}
                <div className="flex-shrink-0 mt-1">{getStatusIcon(req.status)}</div>

                {/* Content */}
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-semibold text-foreground text-lg">{req.title}</h3>
                      <div className="flex gap-2 mt-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(req.status)}`}>
                          {req.status}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getPriorityColor(req.priority)}`}>
                          {req.priority} Priority
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">Due: {req.dueDate}</p>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mt-4">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs text-muted-foreground">Progress</span>
                      <span className="text-xs font-semibold text-foreground">{req.progress}%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-primary h-full transition-all duration-500"
                        style={{ width: `${req.progress}%` }}
                      />
                    </div>
                  </div>

                  {/* Metadata */}
                  <div className="flex gap-4 mt-3 pt-3 border-t border-border">
                    <span className="text-xs text-muted-foreground">Department: {req.department}</span>
                    <span className="text-xs text-muted-foreground">ID: REQ-{String(req.id).padStart(4, '0')}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 flex-shrink-0">
                  <button className="px-3 py-1 text-primary hover:bg-primary/10 rounded transition-colors text-sm">
                    Edit
                  </button>
                  <button className="px-3 py-1 text-primary hover:bg-primary/10 rounded transition-colors text-sm">
                    View
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Info Box */}
        <div className="mt-8 p-6 bg-primary/5 border border-primary/20 rounded-lg">
          <h3 className="font-semibold text-foreground mb-2">📌 Compliance Notes</h3>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• All critical tasks must be completed before the deadline</li>
            <li>• Ensure proper documentation for audit compliance</li>
            <li>• Regular reviews help maintain organizational standards</li>
            <li>• Track all changes and updates for compliance records</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

function StatusCard({ title, count, color, icon }: { title: string; count: number; color: string; icon: string }) {
  const colorClasses = {
    primary: 'bg-blue-50 border-blue-200',
    accent: 'bg-emerald-50 border-emerald-200',
    yellow: 'bg-yellow-50 border-yellow-200',
    destructive: 'bg-red-50 border-red-200',
  };

  return (
    <div className={`${colorClasses[color as keyof typeof colorClasses]} rounded-lg border p-4 shadow-sm`}>
      <div className="text-2xl mb-2">{icon}</div>
      <p className="text-xs text-muted-foreground mb-1">{title}</p>
      <p className="text-2xl font-bold text-foreground">{count}</p>
    </div>
  );
}

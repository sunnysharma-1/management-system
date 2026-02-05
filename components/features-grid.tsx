'use client';

import { Users, DollarSign, FileText, Settings, BarChart3, Lock } from 'lucide-react';

export function FeaturesGrid() {
  const features = [
    {
      icon: <Users className="w-8 h-8" />,
      title: 'Employee Management',
      description: 'Complete employee lifecycle management with personal, employment, and bank details tracking.',
      color: 'primary',
    },
    {
      icon: <DollarSign className="w-8 h-8" />,
      title: 'Payroll Processing',
      description: 'Automated salary processing, deductions, tax calculations, and bank transfers.',
      color: 'accent',
    },
    {
      icon: <FileText className="w-8 h-8" />,
      title: 'Billing & Invoicing',
      description: 'Generate professional invoices, track payments, and manage client billing records.',
      color: 'primary',
    },
    {
      icon: <Settings className="w-8 h-8" />,
      title: 'Master Configuration',
      description: 'Manage company settings, compliance codes, tax structures, and organizational master data.',
      color: 'accent',
    },
    {
      icon: <BarChart3 className="w-8 h-8" />,
      title: 'Advanced Reports',
      description: 'Comprehensive reporting suite with tax, compliance, and financial analytics.',
      color: 'primary',
    },
    {
      icon: <Lock className="w-8 h-8" />,
      title: 'Compliance & Security',
      description: 'Role-based access control, audit trails, and regulatory compliance management.',
      color: 'accent',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {features.map((feature, index) => (
        <div
          key={index}
          className="bg-card rounded-lg border border-border p-6 hover:shadow-lg hover:border-primary/50 transition-all duration-300 group animate-fade-in"
          style={{ animationDelay: `${index * 0.1}s` }}
        >
          <div
            className={`inline-flex p-3 rounded-lg mb-4 ${
              feature.color === 'primary' ? 'bg-primary/10 text-primary' : 'bg-accent/10 text-accent'
            } group-hover:scale-110 transition-transform`}
          >
            {feature.icon}
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">{feature.title}</h3>
          <p className="text-sm text-muted-foreground">{feature.description}</p>
        </div>
      ))}
    </div>
  );
}

'use client';

import React, { useState } from "react"
import { DollarSign, CheckCircle, AlertCircle, TrendingUp, Printer, Eye } from 'lucide-react';
import { useEmployee, SalarySlip } from './providers/employee-context';
import { useMasterData } from './providers/master-data-context';
import { PayslipTemplate } from './payslip-template';

export function PayrollSection() {
  const { employees, salarySlips, generatePayroll, getSlipsForMonth } = useEmployee();
  const { data: masterData } = useMasterData();

  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7)); // YYYY-MM
  const [viewSlip, setViewSlip] = useState<SalarySlip | null>(null);

  const currentSlips = getSlipsForMonth(selectedMonth);
  const isProcessed = currentSlips.length > 0;

  const handleProcessPayroll = () => {
    generatePayroll(selectedMonth);
  };

  // Stats
  const totalEmployees = employees.filter(e => e.status === 'Active').length;
  const totalGross = currentSlips.reduce((sum, s) => sum + s.gross, 0);
  const totalDeductions = currentSlips.reduce((sum, s) => sum + s.totalDeductions, 0);
  const netPayable = currentSlips.reduce((sum, s) => sum + s.netPay, 0);

  // Print Logic
  if (viewSlip) {
    const employee = employees.find(e => e.id === viewSlip.employeeId);
    if (!employee) return null;

    return (
      <div className="fixed inset-0 bg-black/80 z-50 flex flex-col items-center justify-center p-4 overflow-auto">
        <div className="bg-white text-black w-full max-w-[210mm] min-h-[297mm] shadow-2xl rounded-sm overflow-hidden mb-4 scale-75 md:scale-100 origin-top">
          <PayslipTemplate slip={viewSlip} employee={employee} company={masterData.companyKYC} />
        </div>
        <div className="fixed bottom-8 flex gap-4">
          <button
            onClick={() => setViewSlip(null)}
            className="bg-gray-800 text-white px-6 py-3 rounded-full shadow-xl hover:bg-gray-700 transition-all font-bold"
          >
            Close Preview
          </button>
          <button
            onClick={() => window.print()}
            className="bg-primary text-white px-6 py-3 rounded-full shadow-xl hover:bg-primary/90 transition-all font-bold flex items-center gap-2"
          >
            <Printer className="w-5 h-5" />
            Print / Save PDF
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-auto animate-fade-in">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary/95 to-primary/80 text-primary-foreground px-8 py-6 border-b border-primary/20">
        <h1 className="text-3xl font-bold">Payroll Processing</h1>
        <p className="text-primary-foreground/90 mt-2">Manage and process employee salaries ({selectedMonth})</p>
      </div>

      {/* Content */}
      <div className="p-8 max-w-7xl">
        {/* Month Selection and Actions */}
        <div className="bg-card rounded-lg border border-border p-6 mb-6 shadow-sm">
          <div className="flex flex-col md:flex-row gap-4 items-end">
            <div className="flex-1">
              <label className="block text-sm font-medium text-foreground mb-2">Select Month</label>
              <input
                type="month"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary [color-scheme:dark]"
              />
            </div>
            <button
              onClick={handleProcessPayroll}
              disabled={isProcessed && employees.length === currentSlips.length}
              className={`px-6 py-2 rounded-lg font-medium transition-all duration-300 flex items-center gap-2 ${isProcessed && employees.length === currentSlips.length
                  ? 'bg-accent/50 text-accent-foreground cursor-not-allowed'
                  : 'bg-primary hover:bg-primary/90 text-primary-foreground'
                }`}
            >
              <DollarSign className="w-4 h-4" />
              {isProcessed ? 'Re-Process / Update' : 'Process Payroll'}
            </button>
          </div>
        </div>

        {/* Payroll Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <SummaryCard
            title="Total Active Employees"
            value={totalEmployees.toLocaleString()}
            icon={<DollarSign className="w-6 h-6" />}
            color="blue"
          />
          <SummaryCard
            title="Total Gross Salary"
            value={`₹${(totalGross / 1000).toFixed(1)}k`}
            icon={<TrendingUp className="w-6 h-6" />}
            color="emerald"
          />
          <SummaryCard
            title="Total Deductions"
            value={`₹${(totalDeductions / 1000).toFixed(1)}k`}
            icon={<AlertCircle className="w-6 h-6" />}
            color="yellow"
          />
          <SummaryCard
            title="Net Payable"
            value={`₹${(netPayable / 1000).toFixed(1)}k`}
            icon={<CheckCircle className="w-6 h-6" />}
            color="emerald"
          />
        </div>

        {/* Payroll Details Table */}
        <div className="bg-card rounded-lg border border-border overflow-hidden shadow-sm">
          <div className="px-6 py-4 border-b border-border">
            <h2 className="text-lg font-bold text-foreground">
              Payroll Details {isProcessed ? `(${currentSlips.length} processed)` : '(No Data)'}
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-muted border-b border-border">
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Employee</th>
                  <th className="px-6 py-3 text-right text-sm font-semibold text-foreground">Gross</th>
                  <th className="px-6 py-3 text-right text-sm font-semibold text-foreground">Basic</th>
                  <th className="px-6 py-3 text-right text-sm font-semibold text-foreground">Deductions</th>
                  <th className="px-6 py-3 text-right text-sm font-semibold text-foreground">Net Pay</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Status</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentSlips.length === 0 ? (
                  <tr><td colSpan={7} className="text-center py-8 text-muted-foreground">Payroll not processed for this month.</td></tr>
                ) : (
                  currentSlips.map((slip, i) => {
                    const emp = employees.find(e => e.id === slip.employeeId);
                    return (
                      <tr
                        key={slip.id}
                        className="border-b border-border hover:bg-muted/50 transition-colors"
                      >
                        <td className="px-6 py-4 text-sm text-foreground font-medium">
                          <div>{emp?.firstName} {emp?.lastName}</div>
                          <div className="text-xs text-muted-foreground">{emp?.designation}</div>
                        </td>
                        <td className="px-6 py-4 text-sm text-foreground text-right font-medium">₹{slip.gross.toLocaleString()}</td>
                        <td className="px-6 py-4 text-sm text-muted-foreground text-right">₹{slip.basic.toLocaleString()}</td>
                        <td className="px-6 py-4 text-sm text-destructive text-right">₹{slip.totalDeductions.toLocaleString()}</td>
                        <td className="px-6 py-4 text-sm text-accent text-right font-bold">₹{slip.netPay.toLocaleString()}</td>
                        <td className="px-6 py-4 text-sm">
                          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-accent/10 text-accent">
                            Processed
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm space-x-2">
                          <button
                            onClick={() => setViewSlip(slip)}
                            className="text-primary hover:bg-primary/10 p-2 rounded transition-colors inline-block"
                            title="View/Print Payslip"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

interface SummaryCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  color: 'blue' | 'emerald' | 'yellow';
}

function SummaryCard({ title, value, icon, color }: SummaryCardProps) {
  const colorClasses = {
    blue: 'bg-blue-500/10 border-blue-500/20 text-blue-400',
    emerald: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400',
    yellow: 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400',
  };

  return (
    <div className={`${colorClasses[color]} rounded-lg border p-6 shadow-sm`}>
      <div className="flex items-start justify-between mb-3">
        <div className="text-primary">{icon}</div>
      </div>
      <h3 className="text-sm opacity-80 mb-1">{title}</h3>
      <p className="text-2xl font-bold text-white">{value}</p>
    </div>
  );
}

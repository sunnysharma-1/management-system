'use client';

import { useState } from 'react';
import { useBilling } from './providers/billing-context';
import { FileText, Plus, Download, Send, Eye } from 'lucide-react';
import { InvoiceGenerator } from './invoice-generator';

export function BillingSection() {
  const { invoices, clients } = useBilling();
  const [selectedClient, setSelectedClient] = useState('all');
  const [showGenerator, setShowGenerator] = useState(false);

  // If user clicks "New Invoice", show generator
  // In a real router, this would be a page navigation
  if (showGenerator) {
    return (
      <div className="relative">
        <button
          onClick={() => setShowGenerator(false)}
          className="absolute top-6 right-6 z-10 text-muted-foreground hover:text-foreground"
        >
          Back to Dashboard
        </button>
        <InvoiceGenerator />
      </div>
    );
  }

  const filteredInvoices = selectedClient === 'all'
    ? invoices
    : invoices.filter(inv => inv.clientId === selectedClient);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Paid': return 'bg-accent/10 text-accent';
      case 'Pending': return 'bg-yellow-100 text-yellow-700';
      case 'Overdue': return 'bg-destructive/10 text-destructive';
      default: return 'bg-muted text-foreground';
    }
  };

  const totalRevenue = invoices.reduce((sum, inv) => sum + inv.grandTotal, 0);
  const paidAmount = invoices
    .filter((inv) => inv.status === 'Paid')
    .reduce((sum, inv) => sum + inv.grandTotal, 0);
  const pendingAmount = invoices
    .filter((inv) => inv.status === 'Pending' || inv.status === 'Overdue')
    .reduce((sum, inv) => sum + inv.grandTotal, 0);

  return (
    <div className="flex-1 overflow-auto animate-fade-in">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary/95 to-primary/80 text-primary-foreground px-8 py-6 border-b border-primary/20">
        <h1 className="text-3xl font-bold">Billing & Invoicing</h1>
        <p className="text-primary-foreground/90 mt-2">Manage client invoices and billing records</p>
      </div>

      {/* Content */}
      <div className="p-8 max-w-7xl">
        {/* Revenue Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <SummaryBox
            title="Total Revenue"
            amount={`₹${totalRevenue.toLocaleString()}`}
            color="primary"
          />
          <SummaryBox
            title="Paid Invoices"
            amount={`₹${paidAmount.toLocaleString()}`}
            color="accent"
          />
          <SummaryBox
            title="Pending/Overdue"
            amount={`₹${pendingAmount.toLocaleString()}`}
            color="yellow"
          />
        </div>

        {/* Action Bar */}
        <div className="bg-card rounded-lg border border-border p-6 mb-6 shadow-sm">
          <div className="flex flex-col md:flex-row gap-4 items-end">
            <div className="flex-1">
              <label className="block text-sm font-medium text-foreground mb-2">Filter by Client</label>
              <select
                value={selectedClient}
                onChange={(e) => setSelectedClient(e.target.value)}
                className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="all">All Clients</option>
                {clients.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
            <button className="bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center gap-2">
              <Download className="w-4 h-4" />
              Export
            </button>
            <button
              onClick={() => setShowGenerator(true)}
              className="bg-accent hover:bg-accent/90 text-accent-foreground px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              New Invoice
            </button>
          </div>
        </div>

        {/* Invoices Table */}
        <div className="bg-card rounded-lg border border-border overflow-hidden shadow-sm">
          <div className="px-6 py-4 border-b border-border flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-bold text-foreground">Recent Invoices</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-muted border-b border-border">
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Invoice ID</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Client</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Date</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Due Date</th>
                  <th className="px-6 py-3 text-right text-sm font-semibold text-foreground">Amount</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Status</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredInvoices.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-8 text-muted-foreground">No invoices found.</td>
                  </tr>
                ) : (
                  filteredInvoices.map((invoice, index) => (
                    <tr
                      key={invoice.id}
                      className="border-b border-border hover:bg-muted/50 transition-colors"
                    >
                      <td className="px-6 py-4 text-sm text-primary font-bold">{invoice.invoiceNo}</td>
                      <td className="px-6 py-4 text-sm text-foreground">{invoice.clientName}</td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">{invoice.date}</td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">{invoice.dueDate}</td>
                      <td className="px-6 py-4 text-sm font-semibold text-foreground text-right">
                        ₹{invoice.grandTotal.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(invoice.status)}`}>
                          {invoice.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm space-x-2">
                        <button className="text-primary hover:bg-primary/10 px-2 py-1 rounded transition-colors inline-block" title="View details">
                          <Eye className="w-4 h-4 inline" />
                        </button>
                        <button className="text-primary hover:bg-primary/10 px-2 py-1 rounded transition-colors inline-block" title="Download PDF">
                          <Download className="w-4 h-4 inline" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Billing Notes */}
        <div className="mt-6 p-6 bg-primary/5 border border-primary/20 rounded-lg">
          <h3 className="font-semibold text-foreground mb-2">💡 Billing Tips</h3>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• Regular invoicing ensures timely payments and maintains cash flow</li>
            <li>• Track overdue invoices and follow up with clients</li>
            <li>• Generate detailed billing reports for accounting and tax purposes</li>
            <li>• Maintain accurate client information for better billing</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

function SummaryBox({ title, amount, color }: { title: string; amount: string; color: string }) {
  const colorClasses = {
    primary: 'bg-blue-500/10 border-blue-500/20 text-blue-400',
    accent: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400',
    yellow: 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400',
  };

  return (
    <div className={`${colorClasses[color as keyof typeof colorClasses]} rounded-lg border p-6 shadow-sm`}>
      <p className="text-sm opacity-80 mb-2">{title}</p>
      <p className="text-3xl font-bold">{amount}</p>
    </div>
  );
}

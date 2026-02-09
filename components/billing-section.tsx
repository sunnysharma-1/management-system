'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { InvoiceGenerator } from './invoice-generator';
import {
  Search, Loader2, Building2, Edit,
  FileText, Plus, Calculator, Receipt, User, Calendar
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';

export function BillingSection() {
  const router = useRouter(); // For navigating to edit pages if needed
  const [activeTab, setActiveTab] = useState<'invoices' | 'estimations'>('invoices');
  const [showGenerator, setShowGenerator] = useState(false);

  // -- Data States --
  const [invoices, setInvoices] = useState<any[]>([]);
  const [billRates, setBillRates] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const [search, setSearch] = useState('');

  // Fetch Content based on Tab
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        if (activeTab === 'invoices') {
          const res = await api.getInvoices();
          setInvoices(res);
        } else {
          const res = await api.getBillRates({});
          setBillRates(res);
        }
      } catch (error) {
        console.error("Error loading billing data:", error);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [activeTab, showGenerator]); // Reload when interaction changes

  if (showGenerator) {
    return (
      <div className="relative animate-fade-in">
        <button
          onClick={() => setShowGenerator(false)}
          className="absolute top-6 right-6 z-50 text-slate-500 hover:text-slate-800 font-medium bg-white/50 backdrop-blur px-4 py-2 rounded-full border shadow-sm"
        >
          &larr; Back to Dashboard
        </button>
        <InvoiceGenerator />
      </div>
    );
  }

  // Helper: Filter
  const filteredInvoices = invoices.filter(inv =>
    (inv.invoiceNo?.toLowerCase() || '').includes(search.toLowerCase()) ||
    (inv.clientName?.toLowerCase() || '').includes(search.toLowerCase())
  );

  const filteredRates = billRates.filter(rate =>
    (rate.service?.toLowerCase() || '').includes(search.toLowerCase()) ||
    (rate.clientId?.companyName?.toLowerCase() || '').includes(search.toLowerCase()) ||
    (rate.unitId?.unitName?.toLowerCase() || '').includes(search.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'paid': return 'text-emerald-600 bg-emerald-50 border-emerald-200';
      case 'pending': return 'text-amber-600 bg-amber-50 border-amber-200';
      case 'overdue': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-slate-600 bg-slate-50 border-slate-200';
    }
  };

  return (
    <div className="flex-1 overflow-auto animate-fade-in bg-slate-50/50 min-h-screen">
      {/* Header with Glassmorphism feel */}
      <div className="bg-gradient-to-r from-indigo-600 to-violet-600 text-white px-8 py-8 shadow-lg relative overflow-hidden">
        <div className="absolute inset-0 bg-white/5 backdrop-blur-[1px]" />
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-4xl font-bold tracking-tight">Billing Hub</h1>
            <p className="text-indigo-100 mt-1 opacity-80">Central command for Invoices & Quotations</p>
          </div>
        </div>
      </div>

      <div className="p-8 max-w-7xl mx-auto -mt-8 relative z-20">
        {/* Navigation Tabs (Glassy) */}
        <div className="flex items-center gap-2 mb-6">
          <button
            onClick={() => setActiveTab('invoices')}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl transition-all shadow-sm ${activeTab === 'invoices'
                ? 'bg-white text-indigo-600 shadow-md font-bold ring-1 ring-indigo-100'
                : 'bg-white/40 text-slate-600 hover:bg-white hover:text-indigo-600'
              }`}
          >
            <Receipt className="w-5 h-5" />
            Invoices
          </button>
          <button
            onClick={() => setActiveTab('estimations')}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl transition-all shadow-sm ${activeTab === 'estimations'
                ? 'bg-white text-emerald-600 shadow-md font-bold ring-1 ring-emerald-100'
                : 'bg-white/40 text-slate-600 hover:bg-white hover:text-emerald-600'
              }`}
          >
            <Calculator className="w-5 h-5" />
            Estimations / Rates
          </button>
        </div>

        {/* Sub-Header / Controls */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 mb-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder={activeTab === 'invoices' ? "Search Invoice # or Client..." : "Search Service or Unit..."}
              className="bg-slate-50 border border-slate-200 outline-none rounded-xl text-sm pl-9 pr-4 py-2 w-full focus:ring-2 focus:ring-indigo-100 transition-all"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <div>
            {activeTab === 'invoices' ? (
              <button
                onClick={() => setShowGenerator(true)}
                className="flex items-center gap-2 px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium shadow-lg shadow-indigo-500/20 transition-all"
              >
                <Plus className="w-4 h-4" /> New Invoice
              </button>
            ) : (
              <button
                onClick={() => window.location.href = '/clients/rates/select'}
                className="flex items-center gap-2 px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-medium shadow-lg shadow-emerald-500/20 transition-all"
              >
                <Plus className="w-4 h-4" /> New Estimation
              </button>
            )}
          </div>
        </div>

        {/* CONTENT AREA */}
        {loading ? (
          <div className="flex justify-center py-20"><Loader2 className="w-10 h-10 animate-spin text-indigo-400" /></div>
        ) : (
          <div className="min-h-[400px]">
            <AnimatePresence mode="wait">
              {/* --- INVOICES VIEW --- */}
              {activeTab === 'invoices' && (
                <motion.div
                  key="invoices"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-4"
                >
                  {filteredInvoices.length > 0 ? filteredInvoices.map((inv) => (
                    <div key={inv._id} className="bg-white border border-slate-100 rounded-2xl p-5 hover:shadow-md transition-all group flex flex-col md:flex-row items-center justify-between gap-4">
                      <div className="flex items-center gap-5">
                        <div className="p-4 bg-indigo-50 rounded-2xl text-indigo-500 group-hover:bg-indigo-100 transition-colors">
                          <FileText className="w-6 h-6" />
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-slate-800">{inv.invoiceNo}</h3>
                          <div className="flex items-center gap-3 text-sm text-slate-500 mt-1">
                            <span className="flex items-center gap-1"><User className="w-3 h-3" /> {inv.clientName || 'Unknown'}</span>
                            <span className="w-1 h-1 bg-slate-300 rounded-full" />
                            <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {new Date(inv.date).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-8 w-full md:w-auto justify-between md:justify-end">
                        <div className="text-right">
                          <div className="text-xl font-bold text-slate-800 font-mono">₹{inv.grandTotal?.toLocaleString()}</div>
                          <div className={`text-xs px-2.5 py-0.5 rounded-full border inline-block mt-1 font-semibold uppercase tracking-wide ${getStatusColor(inv.status)}`}>
                            {inv.status}
                          </div>
                        </div>
                        <button className="p-2 hover:bg-slate-50 rounded-lg text-indigo-600 transition-colors">
                          <Edit className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  )) : (
                    <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-200">
                      <FileText className="w-16 h-16 mx-auto mb-4 text-slate-200" />
                      <p className="text-slate-500">No invoices found.</p>
                    </div>
                  )}
                </motion.div>
              )}

              {/* --- ESTIMATIONS VIEW --- */}
              {activeTab === 'estimations' && (
                <motion.div
                  key="estimations"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                  {filteredRates.length > 0 ? filteredRates.map((rate) => (
                    <div key={rate._id} className="bg-white border border-slate-100 rounded-3xl p-6 hover:shadow-xl transition-all group relative overflow-hidden">
                      <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Calculator className="w-24 h-24 text-emerald-500" />
                      </div>

                      <div className="relative z-10">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <span className="px-2 py-1 rounded bg-blue-50 text-blue-600 text-[10px] font-bold uppercase tracking-wider mb-2 inline-block border border-blue-100">
                              {rate.clientId?.companyName || 'Unknown Client'}
                            </span>
                            <h3 className="text-lg font-bold text-slate-800 leading-tight pr-4">{rate.service}</h3>
                          </div>
                        </div>

                        <div className="space-y-3 mb-6 bg-slate-50 rounded-2xl p-4 border border-slate-100">
                          <div className="flex items-center gap-2 text-sm text-slate-600 font-medium">
                            <Building2 className="w-4 h-4 text-slate-400" />
                            <span className="truncate">{rate.unitId?.unitName}</span>
                          </div>
                          <div className="flex justify-between text-sm pt-2 border-t border-slate-200/50">
                            <span className="text-slate-500">Rate/Head</span>
                            <span className="text-emerald-600 font-bold font-mono">₹{rate.totals?.totalPerHead?.toLocaleString()}</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between gap-3">
                          <div>
                            <p className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">Total Estimate</p>
                            <p className="text-xl font-bold text-slate-800">₹{rate.totals?.grandTotal?.toLocaleString()}</p>
                          </div>
                          <button
                            onClick={() => window.location.href = `/clients/${rate.clientId?._id || rate.clientId}/bill-rates/${rate._id}/edit`}
                            className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-medium hover:bg-slate-800 transition-colors shadow-lg shadow-slate-200"
                          >
                            Edit / View
                          </button>
                        </div>
                      </div>
                    </div>
                  )) : (
                    <div className="col-span-full text-center py-20 bg-white rounded-3xl border border-dashed border-slate-200">
                      <Calculator className="w-16 h-16 mx-auto mb-4 text-slate-200" />
                      <p className="text-slate-500">No estimations found.</p>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}

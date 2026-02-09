'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import {
    FileText, Loader2, Plus, Calendar, User, CreditCard,
    CheckCircle2, AlertCircle, Clock
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function InvoiceList() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [invoices, setInvoices] = useState<any[]>([]);

    useEffect(() => {
        fetchInvoices();
    }, []);

    const fetchInvoices = async () => {
        try {
            const res = await api.getInvoices();
            setInvoices(res);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status?.toLowerCase()) {
            case 'paid': return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
            case 'pending': return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
            case 'overdue': return 'text-red-400 bg-red-500/10 border-red-500/20';
            default: return 'text-gray-400 bg-white/5 border-white/10';
        }
    };

    if (loading) return <div className="flex justify-center p-12"><Loader2 className="w-8 h-8 animate-spin text-white/50" /></div>;

    return (
        <div className="space-y-6">
            {/* Stats Request (Future) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-card/30 border border-white/10 p-4 rounded-2xl">
                    <div className="text-muted-foreground text-xs uppercase tracking-wider mb-1">Total Billed</div>
                    <div className="text-2xl font-bold text-white">₹{invoices.reduce((acc, curr) => acc + (curr.grandTotal || 0), 0).toLocaleString()}</div>
                </div>
                <div className="bg-card/30 border border-white/10 p-4 rounded-2xl">
                    <div className="text-muted-foreground text-xs uppercase tracking-wider mb-1">Outstanding</div>
                    <div className="text-2xl font-bold text-amber-400">₹{invoices.filter(i => i.status !== 'Paid').reduce((acc, curr) => acc + (curr.grandTotal || 0), 0).toLocaleString()}</div>
                </div>
                <button
                    onClick={() => router.push('/invoices/new')}
                    className="bg-indigo-500 hover:bg-indigo-600 text-white rounded-2xl p-4 flex flex-col items-center justify-center transition-colors"
                >
                    <Plus className="w-6 h-6 mb-1" />
                    <span className="font-bold">Create Invoice</span>
                </button>
            </div>

            <div className="space-y-3">
                <AnimatePresence>
                    {invoices.length > 0 ? (
                        invoices.map((inv) => (
                            <motion.div
                                key={inv._id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-white/5 border border-white/10 rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-white/10 transition-colors group cursor-pointer"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-indigo-500/20 rounded-lg text-indigo-400">
                                        <FileText className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-white text-lg">{inv.invoiceNo}</h3>
                                        <div className="flex items-center gap-3 text-sm text-muted-foreground">
                                            <span className="flex items-center gap-1"><User className="w-3 h-3" /> {inv.clientName || 'Unknown Client'}</span>
                                            <span className="w-1 h-1 bg-white/20 rounded-full" />
                                            <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {new Date(inv.date).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-6">
                                    <div className="text-right">
                                        <div className="text-xl font-bold text-white font-mono">₹{inv.grandTotal?.toLocaleString()}</div>
                                        <div className={`text-xs px-2 py-0.5 rounded border inline-block mt-1 ${getStatusColor(inv.status)}`}>
                                            {inv.status}
                                        </div>
                                    </div>
                                    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button className="text-sm font-medium text-indigo-400 hover:text-indigo-300">View Details &rarr;</button>
                                    </div>
                                </div>
                            </motion.div>
                        ))
                    ) : (
                        <div className="text-center py-12 bg-white/5 rounded-2xl border border-dashed border-white/10">
                            <FileText className="w-12 h-12 mx-auto mb-3 text-white/20" />
                            <p className="text-muted-foreground">No invoices generated yet.</p>
                        </div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}

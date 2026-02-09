'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import {
    Plus, Search, Loader2,
    Building2, Edit, Trash2, FileText
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function BillRatesTab({ clientId }: { clientId: string }) {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [billRates, setBillRates] = useState<any[]>([]);
    const [search, setSearch] = useState('');

    useEffect(() => {
        fetchData();
    }, [clientId]);

    const fetchData = async () => {
        try {
            const billRatesRes = await api.getBillRates({ clientId });
            setBillRates(billRatesRes);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this bill rate?')) return;
        try {
            await api.deleteBillRate(id);
            fetchData();
        } catch (error) {
            console.error(error);
            alert('Failed to delete bill rate');
        }
    };

    const filteredRates = billRates.filter(rate =>
        rate.service.toLowerCase().includes(search.toLowerCase()) ||
        rate.unitId?.unitName?.toLowerCase().includes(search.toLowerCase()) ||
        rate.unitId?.unitCode?.toLowerCase().includes(search.toLowerCase())
    );

    if (loading) return <div className="flex justify-center p-8"><Loader2 className="w-8 h-8 animate-spin text-white/50" /></div>;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between gap-4 bg-card/30 backdrop-blur border border-white/10 rounded-2xl p-4">
                <div className="relative flex-1 max-w-md">
                    <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                        type="text"
                        placeholder="Search estimations..."
                        className="bg-transparent border-none outline-none text-sm pl-9 pr-4 w-full text-white placeholder:text-muted-foreground"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                    />
                </div>
                <button
                    onClick={() => router.push(`/clients/${clientId}/bill-rates/new`)}
                    className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-sm font-medium transition-all shadow-lg shadow-emerald-500/20"
                >
                    <Plus className="w-4 h-4" /> New Estimation
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <AnimatePresence>
                    {filteredRates.map((rate) => (
                        <motion.div
                            key={rate._id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            layout
                            className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all group"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="text-lg font-bold text-white mb-1">{rate.service}</h3>
                                    <div className="flex items-center gap-2 text-xs text-indigo-300">
                                        <Building2 className="w-3 h-3" />
                                        <span>{rate.unitId?.unitName || 'Linked to Unit'}</span>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <span className="text-xl font-bold text-emerald-400 font-mono">₹{rate.totals?.grandTotal?.toLocaleString() || 0}</span>
                                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Total / Month</p>
                                </div>
                            </div>

                            <div className="space-y-2 mb-6 bg-black/20 rounded-xl p-3">
                                <div className="flex justify-between text-xs">
                                    <span className="text-muted-foreground">Staff Count</span>
                                    <span className="text-white font-mono">{rate.nos}</span>
                                </div>
                                <div className="flex justify-between text-xs">
                                    <span className="text-muted-foreground">Month Days</span>
                                    <span className="text-white font-mono">{rate.monthDays}</span>
                                </div>
                                <div className="flex justify-between text-xs pt-2 border-t border-white/5">
                                    <span className="text-muted-foreground">Cost Per Head</span>
                                    <span className="text-emerald-300 font-mono">₹{rate.totals?.totalPerHead?.toLocaleString()}</span>
                                </div>
                            </div>

                            <div className="flex gap-2">
                                <button
                                    onClick={() => router.push(`/clients/${clientId}/bill-rates/${rate._id}/edit`)}
                                    className="flex-1 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-white text-xs font-medium flex items-center justify-center gap-2 transition-colors"
                                >
                                    <Edit className="w-3 h-3" /> Edit
                                </button>
                                <button
                                    onClick={() => handleDelete(rate._id)}
                                    className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            {!loading && filteredRates.length === 0 && (
                <div className="text-center py-12 text-muted-foreground bg-white/5 rounded-2xl border border-dashed border-white/10">
                    <FileText className="w-12 h-12 mx-auto mb-3 opacity-30" />
                    <p>No bill rate estimations found.</p>
                </div>
            )}
        </div>
    );
}

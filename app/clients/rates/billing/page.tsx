'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { AuroraBackground } from '@/components/ui/aurora-background';
import {
    Search, ArrowLeft, Loader2, Building2, MapPin, Edit,
    FileText, Plus, Calculator
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function GlobalBillRateListPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [billRates, setBillRates] = useState<any[]>([]);
    const [search, setSearch] = useState('');

    useEffect(() => {
        const load = async () => {
            try {
                // Fetch ALL bill rates (no client filter)
                const res = await api.getBillRates({});
                setBillRates(res);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    const filteredRates = billRates.filter(rate =>
        (rate.service?.toLowerCase() || '').includes(search.toLowerCase()) ||
        (rate.clientId?.companyName?.toLowerCase() || '').includes(search.toLowerCase()) ||
        (rate.unitId?.unitName?.toLowerCase() || '').includes(search.toLowerCase())
    );

    return (
        <AuroraBackground className="flex flex-col">
            <div className="h-full overflow-y-auto w-full p-8">
                <div className="max-w-7xl mx-auto space-y-8">
                    {/* Header */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
                        <div className="flex items-center gap-4">
                            <button onClick={() => router.push('/clients')} className="p-2 hover:bg-white/10 rounded-full transition-colors text-white">
                                <ArrowLeft className="w-6 h-6" />
                            </button>
                            <div>
                                <h1 className="text-3xl font-bold text-white">Bill Rate Breakups</h1>
                                <p className="text-muted-foreground">Master list of all client billing estimations.</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4 bg-card/30 backdrop-blur border border-white/10 rounded-2xl p-2">
                            <div className="relative">
                                <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                                <input
                                    type="text"
                                    placeholder="Search Client, Unit or Service..."
                                    className="bg-transparent border-none outline-none text-sm pl-9 pr-4 w-64 text-white placeholder:text-muted-foreground"
                                    value={search}
                                    onChange={e => setSearch(e.target.value)}
                                />
                            </div>
                            <div className="h-6 w-px bg-white/10" />
                            <button
                                onClick={() => router.push('/clients/rates/select')}
                                className="flex items-center gap-2 px-4 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-sm font-medium transition-all shadow-lg shadow-emerald-500/20"
                            >
                                <Plus className="w-4 h-4" /> New Estimation
                            </button>
                        </div>
                    </div>

                    {/* Content */}
                    {loading ? (
                        <div className="flex justify-center py-20"><Loader2 className="w-10 h-10 animate-spin text-emerald-400" /></div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
                            <AnimatePresence>
                                {filteredRates.map((rate) => (
                                    <motion.div
                                        key={rate._id}
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="bg-card/40 backdrop-blur border border-white/10 rounded-3xl p-6 hover:bg-card/60 transition-all group relative overflow-hidden"
                                    >
                                        <div className="flex justify-between items-start mb-4">
                                            <div>
                                                <div className="flex items-center gap-2 mb-2">
                                                    <span className="px-2 py-1 rounded bg-blue-500/10 text-blue-400 text-xs font-bold uppercase tracking-wider">
                                                        {rate.clientId?.companyName || 'Unknown Client'}
                                                    </span>
                                                </div>
                                                <h3 className="text-xl font-bold text-white leading-tight">{rate.service}</h3>
                                            </div>
                                            <div className="text-right">
                                                <span className="text-2xl font-bold text-emerald-400 font-mono">₹{rate.totals?.grandTotal?.toLocaleString() || 0}</span>
                                                <p className="text-[10px] text-muted-foreground uppercase">Monthly</p>
                                            </div>
                                        </div>

                                        <div className="space-y-3 mb-6 bg-black/20 rounded-xl p-4">
                                            <div className="flex items-center gap-2 text-sm text-indigo-300">
                                                <Building2 className="w-3 h-3" />
                                                <span className="truncate">{rate.unitId?.unitName || 'Linked Unit'}</span>
                                            </div>
                                            <div className="flex justify-between text-sm">
                                                <span className="text-muted-foreground">Staff Nos</span>
                                                <span className="text-white font-mono">{rate.nos}</span>
                                            </div>
                                            <div className="flex justify-between text-sm pt-2 border-t border-white/5">
                                                <span className="text-muted-foreground">Rate Per Head</span>
                                                <span className="text-emerald-300 font-mono">₹{rate.totals?.totalPerHead?.toLocaleString()}</span>
                                            </div>
                                        </div>

                                        <button
                                            onClick={() => router.push(`/clients/${rate.clientId?._id || rate.clientId}/bill-rates/${rate._id}/edit`)}
                                            className="w-full py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white text-xs font-medium flex items-center justify-center gap-2 transition-colors border border-white/5 hover:border-white/10"
                                        >
                                            <Edit className="w-3 h-3" /> Edit / View Details
                                        </button>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    )}

                    {!loading && filteredRates.length === 0 && (
                        <div className="text-center py-20 text-muted-foreground">
                            <Calculator className="w-16 h-16 mx-auto mb-4 opacity-20" />
                            <p className="text-lg">No bill rate estimations found.</p>
                            <button
                                onClick={() => router.push('/clients/rates/select')}
                                className="mt-4 text-emerald-400 hover:text-emerald-300 hover:underline"
                            >
                                Create the first one &rarr;
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </AuroraBackground>
    );
}

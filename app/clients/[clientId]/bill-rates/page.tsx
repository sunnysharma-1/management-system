'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { api } from '@/lib/api';
import { AuroraBackground } from '@/components/ui/aurora-background';
import {
    Plus, Search, Loader2, Briefcase,
    Building2, MapPin, Edit, Trash2, ArrowLeft,
    FileText
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function BillRateListPage() {
    const router = useRouter();
    const params = useParams();
    const clientId = params.clientId as string;

    const [loading, setLoading] = useState(true);
    const [client, setClient] = useState<any>(null);
    const [billRates, setBillRates] = useState<any[]>([]);
    const [search, setSearch] = useState('');

    useEffect(() => {
        fetchData();
    }, [clientId]);

    const fetchData = async () => {
        try {
            const [clientRes, billRatesRes] = await Promise.all([
                api.getClient(clientId),
                api.getBillRates({ clientId })
            ]);
            setClient(clientRes);
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

    if (loading) return <AuroraBackground className="flex justify-center items-center"><Loader2 className="w-10 h-10 animate-spin text-white" /></AuroraBackground>;
    if (!client) return <AuroraBackground className="flex justify-center items-center text-white">Client Not Found</AuroraBackground>;

    return (
        <AuroraBackground className="flex flex-col">
            <div className="h-full overflow-y-auto w-full p-8">
                <div className="max-w-7xl mx-auto space-y-8">
                    {/* Header */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
                        <div className="flex items-center gap-4">
                            <button onClick={() => router.push(`/clients/${clientId}`)} className="p-2 hover:bg-white/10 rounded-full transition-colors text-white">
                                <ArrowLeft className="w-6 h-6" />
                            </button>
                            <div>
                                <h1 className="text-3xl font-bold text-white">Bill Rates</h1>
                                <p className="text-muted-foreground">{client.companyName} - Billing Quotations</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 bg-card/30 backdrop-blur border border-white/10 rounded-2xl p-2">
                            <div className="relative">
                                <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                                <input
                                    type="text"
                                    placeholder="Search by Service or Unit..."
                                    className="bg-transparent border-none outline-none text-sm pl-9 pr-4 w-64 text-white placeholder:text-muted-foreground"
                                    value={search}
                                    onChange={e => setSearch(e.target.value)}
                                />
                            </div>
                            <div className="h-6 w-px bg-white/10" />
                            <button
                                onClick={() => router.push(`/clients/${clientId}/bill-rates/new`)}
                                className="flex items-center gap-2 px-4 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-sm font-medium transition-all shadow-lg shadow-emerald-500/20"
                            >
                                <Plus className="w-4 h-4" /> New Estimation
                            </button>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
                        <AnimatePresence>
                            {filteredRates.map((rate) => (
                                <motion.div
                                    key={rate._id}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    layout
                                    className="group bg-card/40 backdrop-blur-md border border-white/10 rounded-3xl p-6 hover:bg-card/60 transition-all relative overflow-hidden"
                                >
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <h3 className="text-xl font-bold text-white mb-1">{rate.service}</h3>
                                            <div className="flex items-center gap-2 text-sm text-indigo-300">
                                                <Building2 className="w-3 h-3" />
                                                <span>{rate.unitId ? 'Unit Linked' : 'Global ???'}</span>
                                                {/* We need to populate unit data properly in backend. For now it might just be ID */}
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <span className="text-2xl font-bold text-emerald-400 font-mono">₹{rate.totals?.grandTotal?.toLocaleString() || 0}</span>
                                            <p className="text-xs text-muted-foreground">Total / Month</p>
                                        </div>
                                    </div>

                                    <div className="space-y-3 mb-6 bg-black/20 rounded-xl p-4">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-muted-foreground">Staff Count (Nos)</span>
                                            <span className="text-white font-mono">{rate.nos}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-muted-foreground">Month Days</span>
                                            <span className="text-white font-mono">{rate.monthDays}</span>
                                        </div>
                                        <div className="flex justify-between text-sm pt-2 border-t border-white/5">
                                            <span className="text-muted-foreground">Cost Per Head</span>
                                            <span className="text-emerald-300 font-mono">₹{rate.totals?.totalPerHead?.toLocaleString()}</span>
                                        </div>
                                    </div>

                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => router.push(`/clients/${clientId}/bill-rates/${rate._id}/edit`)}
                                            className="flex-1 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white text-xs font-medium flex items-center justify-center gap-2 transition-colors"
                                        >
                                            <Edit className="w-3 h-3" /> Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(rate._id)}
                                            className="p-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>

                    {!loading && filteredRates.length === 0 && (
                        <div className="text-center py-20 text-muted-foreground">
                            <FileText className="w-16 h-16 mx-auto mb-4 opacity-30" />
                            <p>No bill rate estimations found.</p>
                        </div>
                    )}
                </div>
            </div>
        </AuroraBackground>
    );
}

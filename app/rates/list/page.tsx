'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { AuroraBackground } from '@/components/ui/aurora-background';
import {
    Plus, Search, Filter, Loader2,
    Briefcase, Building2, MapPin, IndianRupee,
    MoreVertical, Edit, Trash2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function RateListPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [rates, setRates] = useState<any[]>([]);
    const [search, setSearch] = useState('');

    useEffect(() => {
        fetchRates();
    }, []);

    const fetchRates = async () => {
        try {
            const res = await api.getRates();
            setRates(res);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const filteredRates = rates.filter(rate =>
        rate.designation.toLowerCase().includes(search.toLowerCase()) ||
        rate.clientId?.companyName.toLowerCase().includes(search.toLowerCase())
    );

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this rate structure?')) return;
        try {
            await api.deleteRate(id);
            fetchRates();
        } catch (error) {
            console.error(error);
            alert('Failed to delete rate');
        }
    };

    return (
        <AuroraBackground className="flex flex-col">
            <div className="h-full overflow-y-auto w-full p-8">
                <div className="max-w-7xl mx-auto space-y-8">
                    {/* Header */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
                        <div>
                            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">Rate Structures</h1>
                            <p className="text-muted-foreground">Manage Salary & Billing breakups for designations.</p>
                        </div>
                        <div className="flex items-center gap-4 bg-card/30 backdrop-blur border border-white/10 rounded-2xl p-2">
                            <div className="relative">
                                <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                                <input
                                    type="text"
                                    placeholder="Search by Designation or Client..."
                                    className="bg-transparent border-none outline-none text-sm pl-9 pr-4 w-64 text-white placeholder:text-muted-foreground"
                                    value={search}
                                    onChange={e => setSearch(e.target.value)}
                                />
                            </div>
                            <div className="h-6 w-px bg-white/10" />
                            <button
                                onClick={() => router.push('/rates/new')}
                                className="flex items-center gap-2 px-4 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-sm font-medium transition-all shadow-lg shadow-emerald-500/20"
                            >
                                <Plus className="w-4 h-4" /> New Rate Structure
                            </button>
                        </div>
                    </div>

                    {/* Content */}
                    {loading ? (
                        <div className="flex justify-center py-20"><Loader2 className="w-10 h-10 animate-spin text-emerald-500" /></div>
                    ) : (
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
                                                <h3 className="text-xl font-bold text-white mb-1">{rate.designation}</h3>
                                                <div className="flex items-center gap-2 text-sm text-indigo-300">
                                                    <Building2 className="w-3 h-3" />
                                                    <span>{rate.clientId?.companyName || 'Global / All Clients'}</span>
                                                </div>
                                            </div>
                                            <span className={`px-2 py-1 rounded text-xs font-medium border ${rate.type === 'Billing' ? 'bg-blue-500/10 border-blue-500/20 text-blue-400' :
                                                    rate.type === 'Salary' ? 'bg-green-500/10 border-green-500/20 text-green-400' :
                                                        'bg-purple-500/10 border-purple-500/20 text-purple-400'
                                                }`}>
                                                {rate.type}
                                            </span>
                                        </div>

                                        <div className="space-y-3 mb-6">
                                            <div className="flex justify-between text-sm">
                                                <span className="text-muted-foreground">Basic Pay</span>
                                                <span className="text-white font-mono">₹{rate.salaryComponents?.basic || 0}</span>
                                            </div>
                                            <div className="flex justify-between text-sm">
                                                <span className="text-muted-foreground">Gross Salary</span>
                                                <span className="text-emerald-400 font-mono font-bold">
                                                    ₹{Object.values(rate.salaryComponents || {}).reduce((a: any, b: any) => a + b, 0)}
                                                </span>
                                            </div>
                                            {rate.unitId && (
                                                <div className="text-xs text-muted-foreground flex items-center gap-1 mt-2 pt-2 border-t border-white/5">
                                                    <MapPin className="w-3 h-3" /> Specific Unit Linked
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex gap-2 pt-4 border-t border-white/10">
                                            <button
                                                onClick={() => router.push(`/rates/${rate._id}/edit`)}
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
                    )}
                    {!loading && filteredRates.length === 0 && (
                        <div className="text-center py-20 text-muted-foreground">
                            <Briefcase className="w-16 h-16 mx-auto mb-4 opacity-30" />
                            <p>No rate structures found.</p>
                        </div>
                    )}
                </div>
            </div>
        </AuroraBackground>
    );
}

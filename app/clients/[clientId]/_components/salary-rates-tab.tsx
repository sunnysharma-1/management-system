'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import {
    Plus, Loader2, MapPin
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function SalaryRatesTab({ clientId }: { clientId: string }) {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [rates, setRates] = useState<any[]>([]);

    useEffect(() => {
        fetchData();
    }, [clientId]);

    const fetchData = async () => {
        try {
            const ratesRes = await api.getRates({ clientId });
            // API might return generic rates too if logic allows, so double check filtering if needed
            // The getRates method in api.ts takes clientId and filters.
            setRates(ratesRes);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="flex justify-center p-8"><Loader2 className="w-8 h-8 animate-spin text-white/50" /></div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-end">
                <button
                    onClick={() => router.push(`/rates/new?clientId=${clientId}`)}
                    className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-sm font-medium transition-all shadow-lg shadow-emerald-500/20"
                >
                    <Plus className="w-4 h-4" /> Add Rate Structure
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <AnimatePresence>
                    {rates.length > 0 ? (
                        rates.map((rate: any) => (
                            <motion.div
                                key={rate._id}
                                whileHover={{ scale: 1.02 }}
                                onClick={() => router.push(`/rates/${rate._id}/edit`)}
                                className="bg-white/5 border border-white/10 rounded-xl p-4 cursor-pointer hover:bg-white/10 transition-colors group relative overflow-hidden"
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="font-bold text-white group-hover:text-emerald-300 transition-colors">{rate.designation}</h3>
                                    <span className="text-xs font-mono bg-white/10 px-2 py-1 rounded text-white/60">{String(rate.type)}</span>
                                </div>
                                <div className="space-y-1 mb-3">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">Basic</span>
                                        <span className="text-white font-mono">₹{rate.salaryComponents?.basic || 0}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">Gross</span>
                                        <span className="text-emerald-400 font-mono font-bold">
                                            ₹{Object.values(rate.salaryComponents || {}).reduce((a: any, b: any) => a + Number(b), 0)}
                                        </span>
                                    </div>
                                </div>
                                {rate.unitId && (
                                    <div className="text-xs text-muted-foreground flex items-center gap-1 pt-2 border-t border-white/5">
                                        <MapPin className="w-3 h-3" /> Unit Specific
                                    </div>
                                )}
                            </motion.div>
                        ))
                    ) : (
                        <div className="col-span-full py-12 text-center text-muted-foreground bg-white/5 rounded-xl border border-dashed border-white/10">
                            No salary rate structures found for this client.
                        </div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { AuroraBackground } from '@/components/ui/aurora-background';
import {
    Search, ArrowLeft, Loader2, Building2, MapPin, FileText
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function BillRatesClientSelectionPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [clients, setClients] = useState<any[]>([]);
    const [search, setSearch] = useState('');

    useEffect(() => {
        const load = async () => {
            try {
                const res = await api.getClients();
                setClients(res);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    const filteredClients = clients.filter(c =>
        c.companyName.toLowerCase().includes(search.toLowerCase()) ||
        c.clientCode.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <AuroraBackground className="flex flex-col">
            <div className="h-full overflow-y-auto w-full p-8">
                <div className="max-w-5xl mx-auto space-y-8">
                    {/* Header */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
                        <div className="flex items-center gap-4">
                            <button onClick={() => router.back()} className="p-2 hover:bg-white/10 rounded-full transition-colors text-white">
                                <ArrowLeft className="w-6 h-6" />
                            </button>
                            <div>
                                <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-300">
                                    New Bill Rate Estimation
                                </h1>
                                <p className="text-muted-foreground">Select a client to create a new quotation.</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4 bg-card/30 backdrop-blur border border-white/10 rounded-2xl p-2">
                            <div className="relative">
                                <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                                <input
                                    type="text"
                                    placeholder="Search Client..."
                                    className="bg-transparent border-none outline-none text-sm pl-9 pr-4 w-64 text-white placeholder:text-muted-foreground"
                                    value={search}
                                    onChange={e => setSearch(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Content */}
                    {loading ? (
                        <div className="flex justify-center py-20"><Loader2 className="w-10 h-10 animate-spin text-cyan-400" /></div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
                            <AnimatePresence>
                                {filteredClients.map((client) => (
                                    <motion.div
                                        key={client._id}
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        whileHover={{ scale: 1.02 }}
                                        onClick={() => router.push(`/clients/${client._id}/bill-rates/new`)}
                                        className="bg-card/40 backdrop-blur border border-white/10 rounded-2xl p-6 cursor-pointer hover:bg-white/10 transition-colors group"
                                    >
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="p-3 bg-blue-500/20 rounded-xl text-blue-400 group-hover:bg-blue-500/30 transition-colors">
                                                <Building2 className="w-6 h-6" />
                                            </div>
                                            <span className="text-xs font-mono bg-white/10 px-2 py-1 rounded text-white/50">{client.clientCode}</span>
                                        </div>

                                        <h3 className="text-xl font-bold text-white mb-2">{client.companyName}</h3>

                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                <MapPin className="w-4 h-4" />
                                                <span className="truncate">{client.address?.city || 'No Location'}, {client.address?.state}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm text-blue-300 pt-2">
                                                <FileText className="w-4 h-4" />
                                                <span className="font-medium">Create Estimation &rarr;</span>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    )}
                </div>
            </div>
        </AuroraBackground>
    );
}

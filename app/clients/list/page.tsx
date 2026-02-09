'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
    Search, Filter, Plus, ArrowLeft,
    Building2, MapPin, Phone, Mail,
    MoreVertical, Edit, FileText, Loader2,
    Briefcase
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { AuroraBackground } from '@/components/ui/aurora-background';
import { api } from '@/lib/api';

// Interface for Flattened Data
interface ClientUnit {
    id: string; // Composite ID (clientId_unitId)
    type: 'Client' | 'Unit';
    name: string; // Client Company Name or Unit Name
    code: string; // Client Code or Unit Code
    parentClient?: string; // For Units
    parentClientId?: string;
    location: string;
    contact: string;
    status: string;
    originalData: any;
}

export default function ClientListPage() {
    const router = useRouter();
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);
    const [listData, setListData] = useState<ClientUnit[]>([]);
    const [filteredData, setFilteredData] = useState<ClientUnit[]>([]);

    useEffect(() => {
        fetchClients();
    }, []);

    useEffect(() => {
        if (!search) {
            setFilteredData(listData);
            return;
        }

        const lowerSearch = search.toLowerCase();
        const filtered = listData.filter(item =>
            item.name.toLowerCase().includes(lowerSearch) ||
            item.code.toLowerCase().includes(lowerSearch) ||
            (item.parentClient || '').toLowerCase().includes(lowerSearch) ||
            item.location.toLowerCase().includes(lowerSearch)
        );
        setFilteredData(filtered);
    }, [search, listData]);

    const fetchClients = async () => {
        try {
            const res = await api.getClients();
            // Flatten Data
            const flattened: ClientUnit[] = [];

            res.forEach((client: any) => {
                // Add Client (Head Office) Entry if needed, or just Units?
                // User wants "Unified". Let's add Client as a "Master" entry
                flattened.push({
                    id: client._id,
                    type: 'Client',
                    name: client.companyName,
                    code: client.clientCode,
                    location: `${client.address?.city || ''}, ${client.address?.state || ''}`,
                    contact: client.contactPerson,
                    status: client.status,
                    originalData: client
                });

                // Add Units
                if (client.units && client.units.length > 0) {
                    client.units.forEach((unit: any) => {
                        flattened.push({
                            id: `${client._id}_${unit._id}`,
                            type: 'Unit',
                            name: unit.unitName,
                            code: unit.unitCode,
                            parentClient: client.companyName,
                            parentClientId: client._id,
                            location: `${unit.address?.city || ''}, ${unit.address?.state || ''}`,
                            contact: unit.contactPerson || 'N/A',
                            status: 'Active', // Units don't explicitly have status in schema, assume Active
                            originalData: unit
                        });
                    });
                }
            });

            setListData(flattened);
            setFilteredData(flattened);
        } catch (error) {
            console.error("Failed to fetch clients", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuroraBackground className="flex flex-col">
            <div className="h-full overflow-y-auto w-full p-8">
                <div className="max-w-7xl mx-auto space-y-8">

                    {/* Header */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
                        <div className="flex items-center gap-4">
                            <button onClick={() => router.back()} className="p-2 hover:bg-white/10 rounded-full transition-colors text-white">
                                <ArrowLeft className="w-6 h-6" />
                            </button>
                            <div>
                                <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">Client Directory</h1>
                                <p className="text-muted-foreground">Unified view of Clients & Site Units.</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4 bg-card/30 backdrop-blur border border-white/10 rounded-2xl p-2">
                            <div className="relative">
                                <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                                <input
                                    type="text"
                                    placeholder="Search Unit, Code, or Client..."
                                    className="bg-transparent border-none outline-none text-sm pl-9 pr-4 w-64 focus:w-80 transition-all text-white placeholder:text-muted-foreground"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                            </div>
                            <button className="p-2 hover:bg-white/10 rounded-xl text-muted-foreground hover:text-white transition-colors">
                                <Filter className="w-4 h-4" />
                            </button>
                            <div className="h-6 w-px bg-white/10" />
                            <button
                                onClick={() => router.push('/clients/new')}
                                className="flex items-center gap-2 px-4 py-1.5 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl text-sm font-medium transition-all shadow-lg shadow-primary/20"
                            >
                                <Plus className="w-4 h-4" /> New Client
                            </button>
                        </div>
                    </div>

                    {/* Content Grid */}
                    {loading ? (
                        <div className="flex justify-center py-20">
                            <Loader2 className="w-10 h-10 animate-spin text-primary" />
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 relative z-10 pb-8">
                            <AnimatePresence mode='popLayout'>
                                {filteredData.map((item) => (
                                    <motion.div
                                        key={item.id}
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        layout
                                        className="group bg-card/40 backdrop-blur-md border border-white/10 rounded-3xl p-5 hover:bg-card/60 transition-colors relative overflow-hidden"
                                    >
                                        {/* Action Menu (Placeholder) */}
                                        <div className="absolute top-4 right-4">
                                            <button className="p-2 hover:bg-white/10 rounded-full text-white/50 hover:text-white transition-colors">
                                                <MoreVertical className="w-4 h-4" />
                                            </button>
                                        </div>

                                        <div className="flex flex-col h-full">
                                            {/* Type Badge */}
                                            <div className="mb-4">
                                                <span className={`text-xs px-2 py-1 rounded-full border ${item.type === 'Client'
                                                    ? 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400'
                                                    : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                                                    }`}>
                                                    {item.type === 'Client' ? 'Head Office' : 'Unit Site'}
                                                </span>
                                            </div>

                                            {/* Main Info */}
                                            <div className="flex-1">
                                                <h3 className="text-lg font-bold text-white mb-1 line-clamp-1" title={item.name}>
                                                    {item.name}
                                                </h3>
                                                <p className="text-sm font-mono text-white/60 mb-3">{item.code}</p>

                                                {item.type === 'Unit' && (
                                                    <div className="flex items-center gap-2 mb-3 p-2 rounded-lg bg-white/5">
                                                        <Building2 className="w-3 h-3 text-indigo-400" />
                                                        <span className="text-xs text-indigo-300 font-medium truncate">
                                                            {item.parentClient}
                                                        </span>
                                                    </div>
                                                )}

                                                <div className="space-y-2 mt-4">
                                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                        <MapPin className="w-3 h-3 text-white/40" />
                                                        <span className="truncate">{item.location || 'No Location'}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                        <Briefcase className="w-3 h-3 text-white/40" />
                                                        <span className="truncate">{item.contact || 'No Contact'}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Footer Actions */}
                                            <div className="mt-6 pt-4 border-t border-white/10 flex gap-2">
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        if (item.type === 'Client') {
                                                            router.push(`/clients/${item.id}/edit`);
                                                        } else {
                                                            const unitId = item.id.split('_')[1];
                                                            router.push(`/clients/${item.parentClientId}/units/${unitId}/edit`);
                                                        }
                                                    }}
                                                    className="flex-1 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-medium text-white transition-colors flex items-center justify-center gap-2"
                                                >
                                                    <Edit className="w-3 h-3" /> Edit
                                                </button>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        if (item.type === 'Client') {
                                                            router.push(`/clients/${item.id}`);
                                                        } else {
                                                            const unitId = item.id.split('_')[1];
                                                            router.push(`/clients/${item.parentClientId}/units/${unitId}`);
                                                        }
                                                    }}
                                                    className="flex-1 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-medium text-white transition-colors flex items-center justify-center gap-2"
                                                >
                                                    <FileText className="w-3 h-3" /> Details
                                                </button>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    )}

                    {!loading && filteredData.length === 0 && (
                        <div className="text-center py-20 text-muted-foreground relative z-10 w-full bg-card/20 backdrop-blur rounded-3xl border border-white/5">
                            <Building2 className="w-16 h-16 mx-auto mb-4 opacity-50" />
                            <p className="text-lg">No clients or units found matching "{search}"</p>
                        </div>
                    )}

                </div>
            </div>
        </AuroraBackground>
    );
}

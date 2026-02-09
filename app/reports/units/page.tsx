'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { AuroraBackground } from '@/components/ui/aurora-background';
import {
    Download, Search, Filter, Loader2,
    FileText, MapPin, Building2, Phone
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function UnitReportsPage() {
    const [loading, setLoading] = useState(true);
    const [units, setUnits] = useState<any[]>([]);
    const [filteredUnits, setFilteredUnits] = useState<any[]>([]);
    const [search, setSearch] = useState('');
    const [clientFilter, setClientFilter] = useState('');
    const [clients, setClients] = useState<any[]>([]);

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        let result = units;

        if (search) {
            const lowerSearch = search.toLowerCase();
            result = result.filter(u =>
                u.unitName.toLowerCase().includes(lowerSearch) ||
                u.unitCode.toLowerCase().includes(lowerSearch) ||
                u.gstin?.toLowerCase().includes(lowerSearch)
            );
        }

        if (clientFilter) {
            result = result.filter(u => u.clientId === clientFilter);
        }

        setFilteredUnits(result);
    }, [search, clientFilter, units]);

    const fetchData = async () => {
        try {
            const res = await api.getClients();
            setClients(res);

            // Flatten Units
            const allUnits: any[] = [];
            res.forEach((client: any) => {
                if (client.units) {
                    client.units.forEach((unit: any) => {
                        allUnits.push({
                            ...unit,
                            clientId: client._id,
                            clientName: client.companyName,
                            location: `${unit.district || unit.billingAddress?.split(',')[1] || ''}, ${unit.billingToState || ''}`,
                            contact: unit.operationDepartment?.name || unit.accountsOfficer?.name || 'N/A',
                            phone: unit.operationDepartment?.phone || unit.phone || 'N/A'
                        });
                    });
                }
            });
            setUnits(allUnits);
            setFilteredUnits(allUnits);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleExport = () => {
        // Simple CSV Export
        const headers = ['Unit Code', 'Unit Name', 'Client', 'Location', 'GSTIN', 'Contact Person', 'Phone'];
        const rows = filteredUnits.map(u => [
            u.unitCode,
            u.unitName,
            u.clientName,
            u.location.replace(/,/g, ' '), // sanitize comma
            u.gstin || '-',
            u.contact,
            u.phone
        ]);

        const csvContent = [
            headers.join(','),
            ...rows.map(row => row.join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `unit_report_${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
    };

    return (
        <AuroraBackground className="flex flex-col">
            <div className="h-full overflow-y-auto w-full p-8">
                <div className="max-w-7xl mx-auto space-y-8">
                    {/* Header */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
                        <div>
                            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">Unit Master Report</h1>
                            <p className="text-muted-foreground">Comprehensive list of all site units and their details.</p>
                        </div>
                        <div className="flex items-center gap-4 bg-card/30 backdrop-blur border border-white/10 rounded-2xl p-2">
                            <div className="relative">
                                <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                                <input
                                    type="text"
                                    placeholder="Search Unit, Code, or GST..."
                                    className="bg-transparent border-none outline-none text-sm pl-9 pr-4 w-64 text-white placeholder:text-muted-foreground"
                                    value={search}
                                    onChange={e => setSearch(e.target.value)}
                                />
                            </div>
                            <div className="h-6 w-px bg-white/10" />
                            <select
                                className="bg-transparent border-none outline-none text-sm px-2 text-white w-40"
                                value={clientFilter}
                                onChange={e => setClientFilter(e.target.value)}
                            >
                                <option value="" className="text-black">All Clients</option>
                                {clients.map(c => (
                                    <option key={c._id} value={c._id} className="text-black">{c.companyName}</option>
                                ))}
                            </select>
                            <div className="h-6 w-px bg-white/10" />
                            <button
                                onClick={handleExport}
                                className="flex items-center gap-2 px-4 py-1.5 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl text-sm font-medium transition-all shadow-lg shadow-indigo-500/20"
                            >
                                <Download className="w-4 h-4" /> Export CSV
                            </button>
                        </div>
                    </div>

                    {/* Table */}
                    {loading ? (
                        <div className="flex justify-center py-20"><Loader2 className="w-10 h-10 animate-spin text-white" /></div>
                    ) : (
                        <div className="bg-card/40 backdrop-blur border border-white/10 rounded-3xl overflow-hidden relative z-10">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-white/5 border-b border-white/10">
                                            <th className="p-4 text-xs font-bold text-white/60 uppercase tracking-wider">Unit Code</th>
                                            <th className="p-4 text-xs font-bold text-white/60 uppercase tracking-wider">Unit Name</th>
                                            <th className="p-4 text-xs font-bold text-white/60 uppercase tracking-wider">Client (HO)</th>
                                            <th className="p-4 text-xs font-bold text-white/60 uppercase tracking-wider">Location</th>
                                            <th className="p-4 text-xs font-bold text-white/60 uppercase tracking-wider">State</th>
                                            <th className="p-4 text-xs font-bold text-white/60 uppercase tracking-wider">GSTIN</th>
                                            <th className="p-4 text-xs font-bold text-white/60 uppercase tracking-wider">Contact</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/5">
                                        {filteredUnits.length === 0 ? (
                                            <tr><td colSpan={7} className="p-8 text-center text-muted-foreground">No units found matching your criteria.</td></tr>
                                        ) : (
                                            filteredUnits.map((unit, idx) => (
                                                <tr key={idx} className="hover:bg-white/5 transition-colors">
                                                    <td className="p-4 font-mono text-sm text-indigo-300 font-medium">{unit.unitCode}</td>
                                                    <td className="p-4 text-sm text-white font-medium">{unit.unitName}</td>
                                                    <td className="p-4 text-sm text-white/80 flex items-center gap-2">
                                                        <Building2 className="w-3 h-3 opacity-50" /> {unit.clientName}
                                                    </td>
                                                    <td className="p-4 text-sm text-muted-foreground truncate max-w-[200px]" title={unit.location}>{unit.location}</td>
                                                    <td className="p-4 text-sm text-white/80">{unit.billingToState || '-'}</td>
                                                    <td className="p-4 text-sm font-mono text-emerald-400">{unit.gstin || '-'}</td>
                                                    <td className="p-4 text-sm text-white/80">
                                                        <div className="flex flex-col">
                                                            <span className="font-medium">{unit.contact}</span>
                                                            <span className="text-xs text-muted-foreground flex items-center gap-1"><Phone className="w-3 h-3" /> {unit.phone}</span>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                            <div className="p-4 border-t border-white/10 text-xs text-muted-foreground text-right">
                                Total Units: {filteredUnits.length}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AuroraBackground>
    );
}

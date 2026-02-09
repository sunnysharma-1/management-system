'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { AuroraBackground } from '@/components/ui/aurora-background';
import {
    Download, Search, Filter, ArrowLeft,
    Calendar, Building2, User
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

export default function AdvanceReportPage() {
    const router = useRouter();
    const [advances, setAdvances] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [filterClient, setFilterClient] = useState('');
    const [filterMonth, setFilterMonth] = useState('');
    const [clients, setClients] = useState<any[]>([]);

    useEffect(() => {
        fetchData();
    }, [filterClient, filterMonth]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [advRes, clientRes] = await Promise.all([
                api.getAdvances({ clientId: filterClient, month: filterMonth }),
                api.getClients()
            ]);
            setAdvances(advRes);
            setClients(clientRes);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const exportCSV = () => {
        const headers = ['Date', 'Employee', 'Amount', 'Recovery Month', 'Branch', 'Status', 'Remarks'];
        const rows = advances.map(adv => [
            new Date(adv.date).toLocaleDateString(),
            'Employee Name', // Need to populate properly or fetch
            adv.amount,
            adv.recoveryMonth,
            adv.clientId?.companyName || 'N/A',
            adv.status,
            adv.remarks
        ]);

        const csvContent = "data:text/csv;charset=utf-8,"
            + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "advance_report.csv");
        document.body.appendChild(link);
        link.click();
    };

    return (
        <AuroraBackground className="flex flex-col">
            <div className="flex-1 overflow-y-auto w-full p-8">
                <div className="max-w-7xl mx-auto space-y-8">

                    {/* Header */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
                        <div className="flex items-center gap-4">
                            <button onClick={() => router.back()} className="p-2 hover:bg-white/10 rounded-full transition-colors text-white">
                                <ArrowLeft className="w-6 h-6" />
                            </button>
                            <div>
                                <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">
                                    Advance History
                                </h1>
                                <p className="text-muted-foreground">Track employee advances and billing recovery.</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <button
                                onClick={exportCSV}
                                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 transition-all font-medium"
                            >
                                <Download className="w-4 h-4" /> Export CSV
                            </button>
                        </div>
                    </div>

                    {/* Filters */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 relative z-10">
                        <div className="bg-card/30 backdrop-blur border border-white/10 rounded-xl p-2 flex items-center">
                            <Building2 className="w-5 h-5 text-muted-foreground ml-3 mr-2" />
                            <select
                                className="bg-transparent border-none outline-none w-full text-white [&>option]:text-black"
                                value={filterClient}
                                onChange={(e) => setFilterClient(e.target.value)}
                            >
                                <option value="">All Branches</option>
                                {clients.map(c => (
                                    <option key={c._id} value={c._id}>{c.companyName}</option>
                                ))}
                            </select>
                        </div>

                        <div className="bg-card/30 backdrop-blur border border-white/10 rounded-xl p-2 flex items-center">
                            <Calendar className="w-5 h-5 text-muted-foreground ml-3 mr-2" />
                            <input
                                type="month"
                                className="bg-transparent border-none outline-none w-full text-white"
                                value={filterMonth}
                                onChange={(e) => setFilterMonth(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Table */}
                    <div className="relative z-10 bg-card/40 backdrop-blur border border-white/10 rounded-3xl overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-white/5 border-b border-white/10">
                                    <tr>
                                        <th className="p-6 text-sm font-semibold text-white">Date</th>
                                        <th className="p-6 text-sm font-semibold text-white">Employee</th>
                                        <th className="p-6 text-sm font-semibold text-white">Branch (at time)</th>
                                        <th className="p-6 text-sm font-semibold text-white">Amount</th>
                                        <th className="p-6 text-sm font-semibold text-white">Recovery</th>
                                        <th className="p-6 text-sm font-semibold text-white">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {loading ? (
                                        <tr><td colSpan={6} className="p-8 text-center text-muted-foreground">Loading...</td></tr>
                                    ) : advances.length === 0 ? (
                                        <tr><td colSpan={6} className="p-8 text-center text-muted-foreground">No records found</td></tr>
                                    ) : (
                                        advances.map((adv) => (
                                            <tr key={adv._id} className="hover:bg-white/5 transition-colors">
                                                <td className="p-6 font-mono text-sm text-muted-foreground">
                                                    {new Date(adv.date).toLocaleDateString()}
                                                </td>
                                                <td className="p-6">
                                                    <div className="font-medium text-white">
                                                        {/* Assuming Populate worked or we have ID */}
                                                        {adv.employeeId}
                                                        {/* Ideally backend populates names. For now showing ID if name missing */}
                                                    </div>
                                                </td>
                                                <td className="p-6">
                                                    <div className="flex items-center gap-2 text-white/80">
                                                        <Building2 className="w-4 h-4 text-indigo-400" />
                                                        {adv.clientId?.companyName || 'Unknown'}
                                                    </div>
                                                </td>
                                                <td className="p-6 font-bold text-emerald-400">
                                                    ₹{adv.amount}
                                                </td>
                                                <td className="p-6 text-sm text-white/70">
                                                    {adv.recoveryMonth}
                                                </td>
                                                <td className="p-6">
                                                    <span className={`px-3 py-1 rounded-full text-xs font-medium border
                                                        ${adv.status === 'Approved' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' :
                                                            adv.status === 'Pending' ? 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400' :
                                                                'bg-red-500/10 border-red-500/20 text-red-400'}
                                                    `}>
                                                        {adv.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                </div>
            </div>
        </AuroraBackground>
    );
}

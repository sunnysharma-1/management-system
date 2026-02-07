'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, Download, ChevronDown, ChevronUp } from 'lucide-react';
import { mockEmployees } from '@/lib/mock-data';

export function DetailedReportTable() {
    const [filter, setFilter] = useState<'All' | 'Active' | 'Inactive'>('All');
    const [searchTerm, setSearchTerm] = useState('');
    const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);

    const filteredData = mockEmployees.filter(emp => {
        const matchesFilter = filter === 'All' ? true :
            filter === 'Active' ? emp.status === 'Active' :
                emp.status !== 'Active';
        const matchesSearch = Object.values(emp).some(val =>
            String(val).toLowerCase().includes(searchTerm.toLowerCase())
        );
        return matchesFilter && matchesSearch;
    });

    const sortedData = [...filteredData].sort((a: any, b: any) => {
        if (!sortConfig) return 0;
        if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'asc' ? -1 : 1;
        if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
    });

    const handleSort = (key: string) => {
        let direction: 'asc' | 'desc' = 'asc';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    return (
        <div className="bg-card/30 backdrop-blur-md border border-white/10 rounded-3xl p-6 relative z-10 flex flex-col gap-6">

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h3 className="text-xl font-bold text-white">Current Employee Report</h3>
                    <p className="text-sm text-muted-foreground">Detailed roster with status and designations.</p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    <div className="relative">
                        <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                            type="text"
                            placeholder="Search report..."
                            className="bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <div className="flex bg-white/5 rounded-xl p-1 border border-white/10">
                        {['All', 'Active', 'Inactive'].map((f) => (
                            <button
                                key={f}
                                onClick={() => setFilter(f as any)}
                                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${filter === f ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-muted-foreground hover:text-white'}`}
                            >
                                {f}
                            </button>
                        ))}
                    </div>

                    <button className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-xl transition-all text-sm font-medium">
                        <Download className="w-4 h-4" /> Export CSV
                    </button>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-white/10 text-muted-foreground text-xs uppercase tracking-wider">
                            {[
                                { key: 'code', label: 'ID' },
                                { key: 'name', label: 'Employee Name' },
                                { key: 'dept', label: 'Department' },
                                { key: 'role', label: 'Designation' },
                                { key: 'joinDate', label: 'Joining Date' },
                                { key: 'status', label: 'Status' }
                            ].map((col) => (
                                <th
                                    key={col.key}
                                    className="p-4 font-semibold cursor-pointer hover:text-white transition-colors"
                                    onClick={() => handleSort(col.key)}
                                >
                                    <div className="flex items-center gap-1">
                                        {col.label}
                                        {sortConfig?.key === col.key && (
                                            sortConfig.direction === 'asc' ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />
                                        )}
                                    </div>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="text-sm">
                        <AnimatePresence>
                            {sortedData.map((emp, idx) => (
                                <motion.tr
                                    key={emp.code}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ delay: idx * 0.03 }}
                                    className="border-b border-white/5 hover:bg-white/5 transition-colors group"
                                >
                                    <td className="p-4 font-mono text-primary/80 group-hover:text-primary">{emp.code}</td>
                                    <td className="p-4 font-medium text-white flex items-center gap-3">
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${emp.status === 'Active' ? 'bg-blue-500/20 text-blue-400' : 'bg-red-500/20 text-red-400'}`}>
                                            {emp.avatar}
                                        </div>
                                        {emp.name}
                                    </td>
                                    <td className="p-4 text-muted-foreground">{emp.dept}</td>
                                    <td className="p-4 text-muted-foreground">{emp.role}</td>
                                    <td className="p-4 text-muted-foreground">{emp.joinDate}</td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded text-xs font-medium border ${emp.status === 'Active'
                                                ? 'bg-green-500/10 border-green-500/20 text-green-400'
                                                : emp.status === 'On Leave'
                                                    ? 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400'
                                                    : 'bg-red-500/10 border-red-500/20 text-red-400'
                                            }`}>
                                            {emp.status}
                                        </span>
                                        {emp.status !== 'Active' && emp.exitDate && (
                                            <span className="block text-[10px] text-muted-foreground mt-1">Left: {emp.exitDate}</span>
                                        )}
                                    </td>
                                </motion.tr>
                            ))}
                        </AnimatePresence>
                        {sortedData.length === 0 && (
                            <tr>
                                <td colSpan={6} className="p-8 text-center text-muted-foreground">
                                    No records found matching your filters.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <div className="flex items-center justify-between text-xs text-muted-foreground px-2">
                <p>Showing {sortedData.length} records</p>
                <div className="flex gap-2">
                    <button className="px-3 py-1 bg-white/5 hover:bg-white/10 rounded-lg transition-colors disabled:opacity-50" disabled>Previous</button>
                    <button className="px-3 py-1 bg-white/5 hover:bg-white/10 rounded-lg transition-colors disabled:opacity-50" disabled>Next</button>
                </div>
            </div>
        </div>
    );
}

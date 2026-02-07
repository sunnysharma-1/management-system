'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Search, User, MapPin, Phone, Briefcase, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { AuroraBackground } from '@/components/ui/aurora-background';
import { mockEmployees } from '@/lib/mock-data';

export default function EmployeeSearchPage() {
    const router = useRouter();
    const [query, setQuery] = useState('');

    const [query, setQuery] = useState('');
    const [results, setResults] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchResults = async () => {
            if (!query) {
                setResults([]);
                return;
            }
            setLoading(true);
            try {
                const data = await import('@/lib/api').then(m => m.api.getEmployees({ query }));
                setResults(data);
            } catch (error) {
                console.error("Search failed", error);
            } finally {
                setLoading(false);
            }
        };

        const timer = setTimeout(fetchResults, 400);
        return () => clearTimeout(timer);
    }, [query]);

    return (
        <AuroraBackground className="flex flex-col">
            <div className="h-full overflow-y-auto w-full p-8">
                <div className="max-w-4xl mx-auto">

                    {/* Header with Search Input */}
                    <div className="relative z-20 sticky top-0 bg-slate-950/80 backdrop-blur-xl -mx-8 px-8 py-4 mb-8 border-b border-white/10">
                        <div className="flex items-center gap-4 mb-6">
                            <button onClick={() => router.back()} className="p-2 hover:bg-white/10 rounded-full transition-colors text-white">
                                <ArrowLeft className="w-6 h-6" />
                            </button>
                            <h1 className="text-2xl font-bold">Global Search</h1>
                        </div>

                        <div className="relative group">
                            <div className="absolute inset-0 bg-gradient-to-r from-primary to-blue-600 rounded-2xl blur opacity-20 group-hover:opacity-40 transition-opacity" />
                            <div className="relative bg-card border border-white/10 rounded-2xl flex items-center p-2 shadow-2xl">
                                <Search className="w-6 h-6 text-muted-foreground ml-4" />
                                <input
                                    type="text"
                                    autoFocus
                                    placeholder="Search by Name, Employee ID, or Phone Number..."
                                    className="flex-1 bg-transparent border-none outline-none px-4 py-4 text-lg text-white placeholder:text-muted-foreground"
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                />
                                {query && (
                                    <div className="px-4 py-1 bg-white/10 rounded-lg text-xs font-mono text-muted-foreground">
                                        {results.length} RESULTS
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Results Area */}
                    <div className="relative z-10 space-y-4">
                        <AnimatePresence>
                            {query && results.map((emp, idx) => (
                                <motion.div
                                    key={emp._id || emp.employeeId}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, height: 0 }}
                                    transition={{ delay: idx * 0.05 }}
                                    onClick={() => router.push(`/employees/new?code=${emp.employeeId}`)}
                                    className="bg-card/40 backdrop-blur border border-white/5 hover:border-primary/50 rounded-2xl p-4 cursor-pointer group transition-all hover:bg-card/60"
                                >
                                    <div className="flex items-center gap-6">
                                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-zinc-800 to-zinc-900 flex items-center justify-center text-xl font-bold text-zinc-400 group-hover:from-primary/20 group-hover:to-blue-600/20 group-hover:text-primary transition-all">
                                            {emp.firstName ? emp.firstName.charAt(0) : 'E'}
                                        </div>

                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-1">
                                                <h3 className="text-lg font-bold text-white group-hover:text-primary transition-colors">{emp.firstName} {emp.lastName}</h3>
                                                <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-xs font-mono text-muted-foreground">
                                                    {emp.employeeId}
                                                </span>
                                            </div>

                                            <div className="flex items-center gap-6 text-sm text-muted-foreground">
                                                <div className="flex items-center gap-1.5">
                                                    <Briefcase className="w-4 h-4" /> {emp.department} • {emp.designation}
                                                </div>
                                                <div className="flex items-center gap-1.5">
                                                    <Phone className="w-4 h-4" /> {emp.phone}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="p-2 rounded-full bg-white/5 opacity-0 group-hover:opacity-100 transition-all -translate-x-4 group-hover:translate-x-0">
                                            <ChevronRight className="w-5 h-5 text-white" />
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>

                        {/* Empty States */}
                        {query && results.length === 0 && (
                            <div className="text-center py-20">
                                <p className="text-muted-foreground">No employees found matching "<span className="text-white">{query}</span>"</p>
                            </div>
                        )}

                        {!query && (
                            <div className="grid grid-cols-2 gap-4 opacity-30 mt-8">
                                <div className="p-8 border-2 dashed border-white/20 rounded-3xl flex flex-col items-center justify-center text-center">
                                    <User className="w-12 h-12 mb-4" />
                                    <h3 className="font-bold">Search by Name</h3>
                                    <p className="text-sm">"Sunny Sharma"</p>
                                </div>
                                <div className="p-8 border-2 dashed border-white/20 rounded-3xl flex flex-col items-center justify-center text-center">
                                    <Briefcase className="w-12 h-12 mb-4" />
                                    <h3 className="font-bold">Search by Code</h3>
                                    <p className="text-sm">"EMP-001"</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AuroraBackground>
    );
}

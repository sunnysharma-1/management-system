'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Search, Filter, Mail, Phone, MoreVertical, RefreshCw, UserX, Loader2, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { AuroraBackground } from '@/components/ui/aurora-background';
import { api } from '@/lib/api';
import { EmployeeLeftModal } from './_components/employee-left-modal';
import { EmployeeRejoinModal } from './_components/employee-rejoin-modal';
import { AdvanceModal } from '../_components/advance-modal';

export default function EmployeeListPage() {
    const router = useRouter();
    const [filter, setFilter] = useState<'Active' | 'Inactive' | 'All'>('Active');
    const [search, setSearch] = useState('');

    // Data State
    const [employees, setEmployees] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [isLoadingMore, setIsLoadingMore] = useState(false);

    // Modal States
    const [selectedEmp, setSelectedEmp] = useState<any>(null);
    const [showLeftModal, setShowLeftModal] = useState(false);
    const [showRejoinModal, setShowRejoinModal] = useState(false);
    const [showAdvanceModal, setShowAdvanceModal] = useState(false);

    const fetchEmployees = useCallback(async (isLoadMore = false) => {
        if (isLoadMore) {
            setIsLoadingMore(true);
        } else {
            setLoading(true);
        }

        try {
            const currentPage = isLoadMore ? page + 1 : 1;
            const res = await api.getEmployees({
                query: search,
                status: filter === 'All' ? undefined : filter,
                page: currentPage,
                limit: 12
            });

            if (isLoadMore) {
                setEmployees(prev => [...prev, ...res.employees]);
                setPage(currentPage);
            } else {
                setEmployees(res.employees);
                setPage(1);
            }

            setHasMore(res.currentPage < res.totalPages);
        } catch (error) {
            console.error("Failed to fetch employees", error);
        } finally {
            setLoading(false);
            setIsLoadingMore(false);
        }
    }, [search, filter, page]);

    // Initial fetch and debounce search/filter
    useEffect(() => {
        const timer = setTimeout(() => {
            fetchEmployees(false);
        }, 500);
        return () => clearTimeout(timer);
    }, [search, filter]);

    const handleLeft = (emp: any) => {
        setSelectedEmp(emp);
        setShowLeftModal(true);
    };

    const handleRejoin = (emp: any) => {
        setSelectedEmp(emp);
        setShowRejoinModal(true);
    };

    const handleLeftConfirm = async (data: any) => {
        try {
            await api.updateStatus(data.employeeId, {
                status: 'Inactive', // or 'Terminated' based on logic
                exitDetails: {
                    exitDate: data.leftDate,
                    reason: data.reason,
                    remark: data.remark,
                    clearance: {
                        idCard: data.idCardSubmitted,
                        assets: data.assetsSubmitted,
                        remark: data.idCardRemark
                    }
                }
            });
            alert(`Employee ${data.employeeId} marked as Left`);
            fetchEmployees(); // Refresh list
        } catch (error) {
            console.error(error);
            alert("Failed to update status");
        }
    };

    const handleRejoinConfirm = async (data: any) => {
        try {
            await api.updateStatus(data.employeeId, {
                status: 'Active',
                rejoinDate: data.rejoinDate,
                reason: data.reason
            });
            alert(`Employee ${data.employeeId} rejoined successfully`);
            fetchEmployees(); // Refresh list
        } catch (error) {
            console.error(error);
            alert("Failed to rejoin employee");
        }
    };

    return (
        <AuroraBackground className="flex flex-col">
            <EmployeeLeftModal
                isOpen={showLeftModal}
                onClose={() => setShowLeftModal(false)}
                employee={selectedEmp}
                onConfirm={handleLeftConfirm}
            />
            <EmployeeRejoinModal
                isOpen={showRejoinModal}
                onClose={() => setShowRejoinModal(false)}
                employee={selectedEmp}
                onConfirm={handleRejoinConfirm}
            />
            <AdvanceModal
                isOpen={showAdvanceModal}
                onClose={() => setShowAdvanceModal(false)}
                employee={selectedEmp}
                onSuccess={() => alert('Advance recorded successfully!')}
            />

            <div className="h-full overflow-y-auto w-full p-8">
                <div className="max-w-7xl mx-auto space-y-8">

                    {/* Header */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
                        <div className="flex items-center gap-4">
                            <button onClick={() => router.back()} className="p-2 hover:bg-white/10 rounded-full transition-colors text-white">
                                <ArrowLeft className="w-6 h-6" />
                            </button>
                            <div>
                                <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">Staff Directory</h1>
                                <p className="text-muted-foreground">Manage your workforce efficiently.</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4 bg-card/30 backdrop-blur border border-white/10 rounded-2xl p-2">
                            <div className="relative">
                                <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                                <input
                                    type="text"
                                    placeholder="Search employees..."
                                    className="bg-transparent border-none outline-none text-sm pl-9 pr-4 w-48 focus:w-64 transition-all text-white placeholder:text-muted-foreground"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                            </div>
                            <div className="h-6 w-px bg-white/10" />
                            <div className="flex gap-1">
                                {['Active', 'Inactive', 'All'].map((f) => (
                                    <button
                                        key={f}
                                        onClick={() => setFilter(f as any)}
                                        className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${filter === f ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20' : 'hover:bg-white/5 text-muted-foreground'}`}
                                    >
                                        {f}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Employee Grid */}
                    {loading ? (
                        <div className="flex justify-center py-20">
                            <Loader2 className="w-10 h-10 animate-spin text-primary" />
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 relative z-10 pb-8">
                            <AnimatePresence mode='popLayout'>
                                {employees.map((emp) => (
                                    <motion.div
                                        key={emp.employeeId || emp.code} // employeeId from mongo, code from mock fallback
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.9 }}
                                        layout
                                        className="group bg-card/40 backdrop-blur-md border border-white/10 rounded-3xl p-5 hover:bg-card/60 transition-colors relative overflow-hidden"
                                    >
                                        <div className="absolute top-0 right-0 p-4 z-10">
                                            {emp.status === 'Active' ? (
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); handleLeft(emp); }}
                                                    className="p-2 hover:bg-red-500/20 rounded-full text-red-400/70 hover:text-red-400 transition-colors bg-black/20 backdrop-blur-sm"
                                                    title="Mark as Left"
                                                >
                                                    <UserX className="w-4 h-4" />
                                                </button>
                                            ) : (
                                                <button className="p-2 hover:bg-white/10 rounded-full text-white/70 hover:text-white bg-black/20 backdrop-blur-sm">
                                                    <MoreVertical className="w-4 h-4" />
                                                </button>
                                            )}
                                        </div>

                                        <div className="flex flex-col items-center text-center cursor-pointer" onClick={() => router.push(`/employees/new?code=${emp.employeeId}`)}>
                                            <div className={`w-20 h-20 rounded-full mb-4 flex items-center justify-center text-2xl font-bold shadow-lg
                                                ${emp.status === 'Active' ? 'bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-blue-500/25' : 'bg-zinc-800 text-zinc-500'}
                                            `}>
                                                {emp.firstName ? emp.firstName.charAt(0) : 'E'}
                                            </div>
                                            <h3 className="text-lg font-bold text-white">{emp.firstName} {emp.lastName}</h3>
                                            <p className="text-sm text-primary font-medium mb-1">{emp.designation}</p>
                                            <div className="flex items-center gap-2 mb-4">
                                                <span className="text-xs px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-muted-foreground">
                                                    {emp.department}
                                                </span>
                                                <span className={`text-xs px-2 py-0.5 rounded-full border ${emp.status === 'Active' ? 'bg-green-500/10 border-green-500/20 text-green-400' : 'bg-red-500/10 border-red-500/20 text-red-400'
                                                    }`}>
                                                    {emp.status}
                                                </span>
                                            </div>

                                            <div className="w-full grid grid-cols-2 gap-2 mt-2">
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); router.push(`/employees/new?code=${emp.employeeId}`); }}
                                                    className="py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-medium text-white transition-colors"
                                                >
                                                    View Profile
                                                </button>
                                                {emp.status !== 'Active' ? (
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); handleRejoin(emp); }}
                                                        className="py-2 rounded-xl bg-green-500/10 hover:bg-green-500/20 text-xs font-medium text-green-400 transition-colors flex items-center justify-center gap-1 border border-green-500/20"
                                                    >
                                                        <RefreshCw className="w-3 h-3" /> Rejoin
                                                    </button>
                                                ) : (
                                                    <>
                                                        <button
                                                            onClick={(e) => { e.stopPropagation(); router.push(`/employees/new?code=${emp.employeeId}`); }}
                                                            className="py-2 rounded-xl bg-primary/10 hover:bg-primary/20 text-xs font-medium text-primary transition-colors border border-primary/20"
                                                        >
                                                            Edit
                                                        </button>
                                                        <button
                                                            onClick={(e) => { e.stopPropagation(); setSelectedEmp(emp); setShowAdvanceModal(true); }}
                                                            className="py-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-xs font-medium text-emerald-400 transition-colors border border-emerald-500/20"
                                                        >
                                                            Advance
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>

                            {/* Load More Trigger */}
                            {hasMore && (
                                <div className="col-span-full flex justify-center mt-8">
                                    <button
                                        onClick={() => fetchEmployees(true)}
                                        disabled={isLoadingMore}
                                        className="flex items-center gap-2 px-6 py-3 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 transition-all text-sm font-medium disabled:opacity-50"
                                    >
                                        {isLoadingMore ? <Loader2 className="w-4 h-4 animate-spin" /> : <ChevronDown className="w-4 h-4" />}
                                        {isLoadingMore ? 'Loading more...' : 'Load More Employees'}
                                    </button>
                                </div>
                            )}
                        </div>
                    )}

                    {!loading && employees.length === 0 && (
                        <div className="text-center py-20 text-muted-foreground relative z-10 w-full bg-card/20 backdrop-blur rounded-3xl border border-white/5">
                            <UserX className="w-16 h-16 mx-auto mb-4 opacity-50" />
                            <p className="text-lg">No {filter.toLowerCase()} employees found matching "{search}"</p>
                        </div>
                    )}
                </div>
            </div>
        </AuroraBackground>
    );
}

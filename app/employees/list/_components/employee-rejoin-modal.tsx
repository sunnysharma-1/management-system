'use client';

import { useState, useEffect } from 'react';
import { X, Calendar, UserPlus, Save } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface EmployeeRejoinModalProps {
    isOpen: boolean;
    onClose: () => void;
    employee: any;
    onConfirm: (data: any) => void;
}

export function EmployeeRejoinModal({ isOpen, onClose, employee, onConfirm }: EmployeeRejoinModalProps) {
    const [formData, setFormData] = useState({
        rejoinDate: '',
        reason: '',
    });

    useEffect(() => {
        if (isOpen) {
            setFormData({
                rejoinDate: new Date().toISOString().split('T')[0],
                reason: '',
            });
        }
    }, [isOpen]);

    if (!isOpen || !employee) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onConfirm({ ...formData, employeeId: employee.employeeId });
        onClose();
    };

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                />
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="relative w-full max-w-2xl bg-slate-900 border border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col"
                >
                    {/* Header */}
                    <div className="p-6 border-b border-white/10 flex justify-between items-center bg-slate-900/50">
                        <div>
                            <h2 className="text-xl font-bold flex items-center gap-2 text-green-400">
                                <UserPlus className="w-5 h-5" /> Employee Rejoin
                            </h2>
                            <p className="text-sm text-muted-foreground">Re-activate {employee.firstName} {employee.lastName}'s profile</p>
                        </div>
                        <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="p-8">
                        <div className="space-y-6">

                            {/* Static Info Summary */}
                            <div className="flex items-center gap-4 p-4 bg-green-500/10 border border-green-500/20 rounded-xl">
                                <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center text-green-400 font-bold text-lg">
                                    {employee.firstName ? employee.firstName.charAt(0) : 'E'}
                                </div>
                                <div>
                                    <h3 className="font-bold text-white">{employee.firstName} {employee.lastName}</h3>
                                    <p className="text-sm text-green-200/70">{employee.employeeId} • Left on {employee.exitDetails?.exitDate || 'N/A'}</p>
                                </div>
                            </div>

                            <form id="rejoinForm" onSubmit={handleSubmit} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-white flex items-center gap-1">Date of Rejoin <span className="text-green-400">*</span></label>
                                    <div className="relative">
                                        <input
                                            type="date"
                                            required
                                            className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 focus:ring-2 ring-green-500/50 outline-none text-white appearance-none"
                                            value={formData.rejoinDate}
                                            onChange={e => setFormData({ ...formData, rejoinDate: e.target.value })}
                                        />
                                        <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-white flex items-center gap-1">Reason for Rejoining <span className="text-green-400">*</span></label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="e.g. Rehired, Returned from Leave"
                                        className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 focus:ring-2 ring-green-500/50 outline-none text-white"
                                        value={formData.reason}
                                        onChange={e => setFormData({ ...formData, reason: e.target.value })}
                                    />
                                </div>
                            </form>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="p-6 border-t border-white/10 bg-slate-900/50 flex justify-end gap-3">
                        <button type="button" onClick={onClose} className="px-6 py-2.5 rounded-xl border border-white/10 hover:bg-white/5 transition-colors text-sm font-medium">
                            Cancel
                        </button>
                        <button
                            type="submit"
                            form="rejoinForm"
                            className="px-6 py-2.5 rounded-xl bg-green-500 hover:bg-green-600 text-white shadow-lg shadow-green-500/20 transition-colors text-sm font-medium flex items-center gap-2"
                        >
                            <Save className="w-4 h-4" /> Save & Reopen Profile
                        </button>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
'use client';

import { useState, useEffect } from 'react';
import { X, Calendar, AlertCircle, Save, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface EmployeeLeftModalProps {
    isOpen: boolean;
    onClose: () => void;
    employee: any;
    onConfirm: (data: any) => void;
}

export function EmployeeLeftModal({ isOpen, onClose, employee, onConfirm }: EmployeeLeftModalProps) {
    const [formData, setFormData] = useState({
        leftDate: '',
        reason: '',
        remark: '',
        idCardSubmitted: false,
        assetsSubmitted: false,
        idCardRemark: ''
    });

    useEffect(() => {
        if (isOpen) {
            setFormData({
                leftDate: new Date().toISOString().split('T')[0],
                reason: '',
                remark: '',
                idCardSubmitted: false,
                assetsSubmitted: false,
                idCardRemark: ''
            });
        }
    }, [isOpen]);

    if (!isOpen || !employee) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onConfirm({ ...formData, employeeId: employee.code });
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
                    className="relative w-full max-w-4xl bg-slate-900 border border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
                >
                    {/* Header */}
                    <div className="p-6 border-b border-white/10 flex justify-between items-center bg-slate-900/50">
                        <div>
                            <h2 className="text-xl font-bold flex items-center gap-2 text-red-500">
                                <UserMinusIcon className="w-5 h-5" /> Employee Left Details
                            </h2>
                            <p className="text-sm text-muted-foreground">Process exit for {employee.name} ({employee.code})</p>
                        </div>
                        <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="p-8 overflow-y-auto custom-scrollbar">
                        <div className="space-y-8">

                            {/* Static Employee Info */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 p-4 bg-slate-800/50 rounded-xl border border-white/5">
                                <div>
                                    <label className="text-xs text-muted-foreground uppercase font-bold">Name</label>
                                    <p className="font-medium text-white">{employee.name}</p>
                                </div>
                                <div>
                                    <label className="text-xs text-muted-foreground uppercase font-bold">Code</label>
                                    <p className="font-mono text-primary">{employee.code}</p>
                                </div>
                                <div>
                                    <label className="text-xs text-muted-foreground uppercase font-bold">Department</label>
                                    <p className="font-medium text-white">{employee.dept}</p>
                                </div>
                                <div>
                                    <label className="text-xs text-muted-foreground uppercase font-bold">Designation</label>
                                    <p className="font-medium text-white">{employee.role}</p>
                                </div>
                                <div>
                                    <label className="text-xs text-muted-foreground uppercase font-bold">Joining Date</label>
                                    <p className="font-medium text-white">{employee.joinDate}</p>
                                </div>
                                <div>
                                    <label className="text-xs text-muted-foreground uppercase font-bold">Mobile</label>
                                    <p className="font-medium text-white">{employee.phone}</p>
                                </div>
                            </div>

                            <form id="leftForm" onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-white flex items-center gap-1">Date of Left <span className="text-red-500">*</span></label>
                                        <div className="relative">
                                            <input
                                                type="date"
                                                required
                                                className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 focus:ring-2 ring-red-500/50 outline-none text-white appearance-none"
                                                value={formData.leftDate}
                                                onChange={e => setFormData({ ...formData, leftDate: e.target.value })}
                                            />
                                            <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-white flex items-center gap-1">Reason <span className="text-red-500">*</span></label>
                                        <input
                                            type="text"
                                            required
                                            placeholder="e.g. Resigned, Terminated, Absconding"
                                            className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 focus:ring-2 ring-red-500/50 outline-none text-white"
                                            value={formData.reason}
                                            onChange={e => setFormData({ ...formData, reason: e.target.value })}
                                        />
                                    </div>

                                    <div className="col-span-1 md:col-span-2 space-y-2">
                                        <label className="text-sm font-medium text-white">Remark</label>
                                        <textarea
                                            rows={2}
                                            className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 focus:ring-2 ring-red-500/50 outline-none text-white resize-none"
                                            value={formData.remark}
                                            onChange={e => setFormData({ ...formData, remark: e.target.value })}
                                        />
                                    </div>
                                </div>

                                {/* Clearance Section */}
                                <div className="p-4 rounded-xl border border-dashed border-white/20 bg-red-500/5 space-y-4">
                                    <h3 className="text-sm font-bold text-red-400 uppercase tracking-wider flex items-center gap-2">
                                        <AlertCircle className="w-4 h-4" /> Clearance Checklist
                                    </h3>
                                    <div className="flex flex-col md:flex-row gap-8">
                                        <label className="flex items-center gap-3 cursor-pointer group">
                                            <div className={`w-6 h-6 rounded-md border flex items-center justify-center transition-colors ${formData.idCardSubmitted ? 'bg-red-500 border-red-500' : 'border-white/20 bg-slate-950'}`}>
                                                {formData.idCardSubmitted && <CheckCircle className="w-4 h-4 text-white" />}
                                            </div>
                                            <input type="checkbox" className="hidden"
                                                checked={formData.idCardSubmitted}
                                                onChange={e => setFormData({ ...formData, idCardSubmitted: e.target.checked })}
                                            />
                                            <span className="text-sm group-hover:text-white transition-colors">ID Card Submitted</span>
                                        </label>

                                        <label className="flex items-center gap-3 cursor-pointer group">
                                            <div className={`w-6 h-6 rounded-md border flex items-center justify-center transition-colors ${formData.assetsSubmitted ? 'bg-red-500 border-red-500' : 'border-white/20 bg-slate-950'}`}>
                                                {formData.assetsSubmitted && <CheckCircle className="w-4 h-4 text-white" />}
                                            </div>
                                            <input type="checkbox" className="hidden"
                                                checked={formData.assetsSubmitted}
                                                onChange={e => setFormData({ ...formData, assetsSubmitted: e.target.checked })}
                                            />
                                            <span className="text-sm group-hover:text-white transition-colors">Asset Submission (Uniform etc.)</span>
                                        </label>
                                    </div>
                                    {formData.idCardSubmitted && (
                                        <div className="mt-2">
                                            <input
                                                type="text"
                                                placeholder="ID Card Remark / Condition"
                                                className="w-full bg-slate-950 border border-white/10 rounded-lg px-4 py-2 text-sm focus:ring-2 ring-red-500/50 outline-none"
                                                value={formData.idCardRemark}
                                                onChange={e => setFormData({ ...formData, idCardRemark: e.target.value })}
                                            />
                                        </div>
                                    )}
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
                            form="leftForm"
                            className="px-6 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-500/20 transition-colors text-sm font-medium flex items-center gap-2"
                        >
                            <Save className="w-4 h-4" /> Save Details
                        </button>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}

function UserMinusIcon(props: any) {
    return (
        <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><line x1="22" x2="16" y1="11" y2="11" /></svg>
    )
}

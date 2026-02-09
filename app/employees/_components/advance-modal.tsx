'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import {
    Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter
} from '@/components/ui/dialog';
import { Loader2, DollarSign, Calendar, Building2 } from 'lucide-react';

interface AdvanceModalProps {
    isOpen: boolean;
    onClose: () => void;
    employee: any;
    onSuccess: () => void;
}

export function AdvanceModal({ isOpen, onClose, employee, onSuccess }: AdvanceModalProps) {
    const [loading, setLoading] = useState(false);
    const [clients, setClients] = useState<any[]>([]);
    const [formData, setFormData] = useState({
        amount: '',
        recoveryMonth: new Date().toISOString().slice(0, 7), // YYYY-MM
        clientId: '',
        unitId: '', // Optional
        remarks: ''
    });

    useEffect(() => {
        if (isOpen) {
            fetchClients();
            // Pre-fill if employee has current deployment info (assuming mapped in future)
            // For now, we'll let user select or default to first if needed
        }
    }, [isOpen]);

    const fetchClients = async () => {
        try {
            const res = await api.getClients();
            setClients(res);
        } catch (error) {
            console.error('Failed to fetch clients');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.createAdvance({
                employeeId: employee._id,
                amount: Number(formData.amount),
                recoveryMonth: formData.recoveryMonth,
                clientId: formData.clientId,
                remarks: formData.remarks
            });
            onSuccess();
            onClose();
        } catch (error: any) {
            alert(error.message || 'Failed to create advance');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="bg-slate-900 border border-white/10 text-white sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold flex items-center gap-2">
                        <DollarSign className="w-5 h-5 text-emerald-400" />
                        Give Advance
                    </DialogTitle>
                </DialogHeader>

                <div className="py-4">
                    <p className="text-sm text-muted-foreground mb-4">
                        Record an advance payment for <span className="text-white font-medium">{employee?.firstName} {employee?.lastName}</span>.
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-xs font-medium text-muted-foreground">Amount (₹)</label>
                            <input
                                type="number"
                                required
                                min="1"
                                className="w-full bg-slate-950/50 border border-white/10 rounded-lg px-3 py-2 text-white outline-none focus:ring-2 ring-emerald-500/50 font-mono"
                                placeholder="e.g. 5000"
                                value={formData.amount}
                                onChange={e => setFormData({ ...formData, amount: e.target.value })}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-medium text-muted-foreground">Recovery Month</label>
                            <div className="relative">
                                <Calendar className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                                <input
                                    type="month"
                                    required
                                    className="w-full bg-slate-950/50 border border-white/10 rounded-lg pl-9 pr-3 py-2 text-white outline-none focus:ring-2 ring-emerald-500/50"
                                    value={formData.recoveryMonth}
                                    onChange={e => setFormData({ ...formData, recoveryMonth: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-medium text-muted-foreground">Current Branch / Client</label>
                            <div className="relative">
                                <Building2 className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                                <select
                                    required
                                    className="w-full bg-slate-950/50 border border-white/10 rounded-lg pl-9 pr-3 py-2 text-white outline-none focus:ring-2 ring-emerald-500/50 appearance-none"
                                    value={formData.clientId}
                                    onChange={e => setFormData({ ...formData, clientId: e.target.value })}
                                >
                                    <option value="" className="text-black">Select Branch</option>
                                    {clients.map(c => (
                                        <option key={c._id} value={c._id} className="text-black">{c.companyName}</option>
                                    ))}
                                </select>
                            </div>
                            <p className="text-[10px] text-muted-foreground">Required for billing history if employee leaves.</p>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-medium text-muted-foreground">Remarks</label>
                            <textarea
                                className="w-full bg-slate-950/50 border border-white/10 rounded-lg px-3 py-2 text-white outline-none focus:ring-2 ring-emerald-500/50 min-h-[60px]"
                                placeholder="Optional reason..."
                                value={formData.remarks}
                                onChange={e => setFormData({ ...formData, remarks: e.target.value })}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-2 rounded-lg transition-colors flex items-center justify-center gap-2 mt-4"
                        >
                            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Confirm Advance'}
                        </button>
                    </form>
                </div>
            </DialogContent>
        </Dialog>
    );
}

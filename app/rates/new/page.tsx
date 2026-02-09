'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useParams, useSearchParams } from 'next/navigation';
import { api } from '@/lib/api';
import { AuroraBackground } from '@/components/ui/aurora-background';
import {
    ArrowLeft, Save, Loader2, DollarSign,
    Building2, Briefcase
} from 'lucide-react';
import { motion } from 'framer-motion';

function RateFormContent() {
    const router = useRouter();
    const params = useParams();
    const searchParams = useSearchParams();
    const rateId = params.id as string; // If editing
    const prefillClientId = searchParams.get('clientId');
    const isEdit = !!rateId;

    const [loading, setLoading] = useState(false);
    const [clients, setClients] = useState<any[]>([]);

    // We don't need separate 'units' state anymore as we derive options from 'clients'
    // but we might want to keep it if we need to lookup unit details easily? 
    // Actually, flattening clients into a lookup map or just searching arrays is fine for this scale.

    const [formData, setFormData] = useState({
        clientId: prefillClientId || '',
        unitId: '',
        designation: '',
        type: 'Both', // Salary, Billing, Both
        salaryComponents: {
            basic: 0, da: 0, hra: 0, conveyance: 0, washing: 0,
            uniform: 0, special: 0, training: 0, roomRent: 0,
            medical: 0, leave: 0, bonus: 0, gratuity: 0,
            nh: 0, relievingCharge: 0, other: 0
        },
        deductions: {
            pfPercent: 12, esicPercent: 0.75,
            pt: 0, lwf: 100, tds: 0
        },
        // Custom Calculation Rules
        calculationRules: {
            pfBasis: 0, // 0 = Actual, 26 = Fixed 26 Days
            roomRentType: 'Fixed' // Simple string for select
        },
        billingComponents: {
            serviceChargePercent: 0,
            materialCost: 0,
            fixedBillingAmount: 0
        },
        isActive: true
    });

    useEffect(() => {
        fetchClients();
        if (isEdit) fetchRate();
    }, [rateId]);

    const fetchClients = async () => {
        try {
            const res = await api.getClients();
            setClients(res);
        } catch (error) {
            console.error('Failed to fetch clients');
        }
    };

    const fetchRate = async () => {
        setLoading(true);
        try {
            const res = await api.getRate(rateId);

            // Backfill defaults for new fields if missing in existing records
            if (!res.calculationRules) {
                res.calculationRules = { pfBasis: 0, roomRentType: 'Fixed' };
            }
            if (res.deductions && res.deductions.lwf === undefined) {
                res.deductions.lwf = 100;
            }

            setFormData(res);
            // Note: We don't need to populate units state specifically anymore
            // since we use the 'clients' list to generate all options.
        } catch (error) {
            console.error('Failed to fetch rate');
        } finally {
            setLoading(false);
        }
    };

    const handleScopeChange = (value: string) => {
        if (!value) return;
        const [type, id] = value.split('_');

        if (type === 'client') {
            setFormData({ ...formData, clientId: id, unitId: '' });
        } else if (type === 'unit') {
            // Find the unit to get the clientId
            let foundClient: any = null;

            for (const c of clients) {
                const u = (c.units || []).find((un: any) => un._id === id);
                if (u) {
                    foundClient = c;
                    break;
                }
            }

            if (foundClient) {
                setFormData({ ...formData, clientId: foundClient._id, unitId: id });
            }
        }
    };

    const handleSalaryChange = (field: string, value: number) => {
        setFormData({
            ...formData,
            salaryComponents: { ...formData.salaryComponents, [field]: value }
        });
    };

    const calculateTotal = () => {
        return Object.values(formData.salaryComponents).reduce((a: any, b: any) => a + Number(b), 0);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (isEdit) {
                await api.updateRate(rateId, formData);
            } else {
                await api.createRate(formData);
            }
            router.push('/rates/list');
        } catch (error: any) {
            alert(`Failed: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    const inputClass = "w-full bg-slate-950/50 border border-white/10 rounded-xl px-4 py-3 focus:ring-2 ring-emerald-500/50 outline-none text-white transition-all font-mono";
    const labelClass = "text-sm font-medium text-white/80 block mb-2";

    if (loading && isEdit) return <AuroraBackground className="flex justify-center items-center"><Loader2 className="w-10 h-10 animate-spin text-white" /></AuroraBackground>;

    return (
        <AuroraBackground className="flex flex-col">
            <div className="h-full overflow-y-auto w-full p-8">
                <div className="max-w-5xl mx-auto space-y-8">
                    <div className="flex items-center gap-4">
                        <button onClick={() => router.back()} className="p-2 hover:bg-white/10 rounded-full transition-colors text-white">
                            <ArrowLeft className="w-6 h-6" />
                        </button>
                        <h1 className="text-3xl font-bold text-white">{isEdit ? 'Edit Rate Structure' : 'New Rate Structure'}</h1>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-8 pb-20">
                        {/* 1. Context */}
                        <div className="bg-card/40 backdrop-blur border border-white/10 rounded-2xl p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="md:col-span-1">
                                <label className={labelClass}>Applicable Scope (Unit / Client)</label>
                                <select
                                    className={inputClass}
                                    value={formData.unitId ? `unit_${formData.unitId}` : formData.clientId ? `client_${typeof formData.clientId === 'object' ? (formData.clientId as any)._id : formData.clientId}` : ''}
                                    onChange={e => handleScopeChange(e.target.value)}
                                    required
                                >
                                    <option value="">-- Select Context --</option>

                                    {/* Unit Specific Options - PRIORITIZED */}
                                    <optgroup label="Specific Units">
                                        {clients.flatMap(c => (c.units || []).map((u: any) => ({ ...u, clientName: c.companyName, clientId: c._id }))).map((u: any) => (
                                            <option key={`unit_${u._id}`} value={`unit_${u._id}`}>
                                                {u.unitCode} - {u.unitName} - {u.clientName}
                                            </option>
                                        ))}
                                    </optgroup>

                                    {/* Only Generic Clients Options */}
                                    <optgroup label="Global / Client-Wide">
                                        {clients.map(c => (
                                            <option key={`client_${c._id}`} value={`client_${c._id}`}>
                                                [GLOBAL] - {c.companyName}
                                            </option>
                                        ))}
                                    </optgroup>
                                </select>
                            </div>

                            <div>
                                <label className={labelClass}>Designation</label>
                                <input
                                    type="text"
                                    required
                                    className={inputClass}
                                    placeholder="e.g. Security Guard"
                                    value={formData.designation}
                                    onChange={e => setFormData({ ...formData, designation: e.target.value })}
                                />
                            </div>
                        </div>

                        {/* 2. Salary Components */}
                        <div className="bg-card/40 backdrop-blur border border-white/10 rounded-2xl p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                    <DollarSign className="w-5 h-5 text-emerald-400" /> Salary Components
                                </h2>
                                <div className="text-right">
                                    <p className="text-xs text-muted-foreground uppercase">Gross Salary</p>
                                    <p className="text-2xl font-bold text-emerald-400">₹{calculateTotal()}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                {Object.keys(formData.salaryComponents).map(key => (
                                    <div key={key}>
                                        <label className="text-xs font-medium text-white/60 mb-1 block uppercase">{
                                            key === 'nh' ? 'National Holidays' :
                                                key === 'relievingCharge' ? 'Relieving Charges' :
                                                    key.replace(/([A-Z])/g, ' $1').trim()
                                        }</label>
                                        <input
                                            type="number"
                                            className={inputClass}
                                            value={(formData.salaryComponents as any)[key]}
                                            onChange={e => handleSalaryChange(key, Number(e.target.value))}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* 3. Deductions & Calculation Rules */}
                        <div className="bg-card/40 backdrop-blur border border-white/10 rounded-2xl p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div>
                                <h3 className="text-lg font-bold text-red-400 mb-4">Deduction Rules</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div><label className={labelClass}>PF (%)</label><input type="number" step="0.01" className={inputClass} value={formData.deductions.pfPercent} onChange={e => setFormData({ ...formData, deductions: { ...formData.deductions, pfPercent: Number(e.target.value) } })} /></div>
                                    <div><label className={labelClass}>ESIC (%)</label><input type="number" step="0.01" className={inputClass} value={formData.deductions.esicPercent} onChange={e => setFormData({ ...formData, deductions: { ...formData.deductions, esicPercent: Number(e.target.value) } })} /></div>
                                    <div><label className={labelClass}>LWF (Fixed)</label><input type="number" className={inputClass} value={formData.deductions.lwf} onChange={e => setFormData({ ...formData, deductions: { ...formData.deductions, lwf: Number(e.target.value) } })} /></div>
                                    <div><label className={labelClass}>PT (Professional Tax)</label><input type="number" className={inputClass} value={formData.deductions.pt} onChange={e => setFormData({ ...formData, deductions: { ...formData.deductions, pt: Number(e.target.value) } })} /></div>
                                </div>
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-indigo-400 mb-4">Calculation Logic</h3>
                                <div className="space-y-4">
                                    <div>
                                        <label className={labelClass}>PF Calculation Basis</label>
                                        <select
                                            className={inputClass}
                                            value={(formData.calculationRules as any)?.pfBasis || 0}
                                            onChange={e => setFormData({ ...formData, calculationRules: { ...formData.calculationRules, pfBasis: Number(e.target.value) } })}
                                        >
                                            <option value={0}>Actual Days Worked</option>
                                            <option value={26}>Fixed 26 Days</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className={labelClass}>Room Rent Calculation</label>
                                        <select
                                            className={inputClass}
                                            value={(formData.calculationRules as any)?.roomRentType || 'Fixed'}
                                            onChange={e => setFormData({ ...formData, calculationRules: { ...formData.calculationRules, roomRentType: e.target.value } })}
                                        >
                                            <option value="Fixed">Fixed Amount</option>
                                            <option value="Pro-Rata">Pro-Rata (Based on Duty)</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="mt-6 pt-6 border-t border-white/10">
                                    <h3 className="text-lg font-bold text-indigo-400 mb-4">Billing Config</h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div><label className={labelClass}>Service Charge (%)</label><input type="number" step="0.01" className={inputClass} value={formData.billingComponents.serviceChargePercent} onChange={e => setFormData({ ...formData, billingComponents: { ...formData.billingComponents, serviceChargePercent: Number(e.target.value) } })} /></div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="fixed bottom-0 left-0 right-0 p-4 bg-slate-950/80 backdrop-blur border-t border-white/10 z-50 flex justify-end gap-4">
                            <button type="button" onClick={() => router.back()} className="px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white font-bold transition-colors">
                                Cancel
                            </button>
                            <button type="submit" disabled={loading} className="px-8 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-bold shadow-lg shadow-emerald-500/25 flex items-center gap-2 transition-all disabled:opacity-50">
                                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                                Save Rate Structure
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AuroraBackground>
    );
}

export default function RateFormPage() {
    return (
        <Suspense fallback={<AuroraBackground className="flex justify-center items-center"><Loader2 className="w-10 h-10 animate-spin text-white" /></AuroraBackground>}>
            <RateFormContent />
        </Suspense>
    );
}

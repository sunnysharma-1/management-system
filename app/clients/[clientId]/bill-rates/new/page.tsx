'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { api } from '@/lib/api';
import { AuroraBackground } from '@/components/ui/aurora-background';
import {
    ArrowLeft, Save, Loader2, DollarSign,
    Calculator, Building2, MapPin, Search
} from 'lucide-react';

function BillRateFormContent() {
    const router = useRouter();
    const params = useParams();
    const clientId = params.clientId as string;
    const billRateId = params.billRateId as string; // Check path param name in next step
    // Actually path is /clients/[clientId]/bill-rates/new so no billRateId.
    // Use search param or check if [id] folder exists for edit. Assume create for now.

    // Actually we need to support Edit. 
    // If folder structure is `[clientId]/bill-rates/[billRateId]/edit`, then we get billRateId.
    // For now let's build the form component.

    const [loading, setLoading] = useState(false);
    const [client, setClient] = useState<any>(null);
    const [unitSearch, setUnitSearch] = useState('');
    const [showUnitDropdown, setShowUnitDropdown] = useState(false);
    const [selectedUnit, setSelectedUnit] = useState<any>(null);

    const [formData, setFormData] = useState({
        clientId: clientId,
        unitId: '',
        service: '',
        nos: 1,
        monthDays: 26,
        month: '',
        year: new Date().getFullYear(),
        components: {
            basic: 0, da: 0, hra: 0, conveyance: 0, washing: 0,
            uniform: 0, special: 0, education: 0,
            medical: 0, leave: 0, bonus: 0, gratuity: 0,
            other: 0, roomRent: 0, nh: 0, relievingCharge: 0
        },
        terms: {
            epfPercent: 13, esiPercent: 3.25, bonusPercent: 8.33,
            leavePercent: 5, gratuityPercent: 4.81, holidayPercent: 0,
            serviceChargePercent: 10
        },
        totals: {
            grossSalary: 0,
            epfAmount: 0, esiAmount: 0, bonusAmount: 0,
            leaveAmount: 0, gratuityAmount: 0, holidayAmount: 0,
            serviceChargeAmount: 0, totalPerHead: 0, grandTotal: 0
        }
    });

    useEffect(() => {
        fetchClientData();
    }, [clientId]);

    // Auto-Calculate Wrapper
    useEffect(() => {
        calculateTotals();
    }, [formData.components, formData.terms, formData.nos, formData.monthDays]);

    const fetchClientData = async () => {
        try {
            const res = await api.getClient(clientId);
            setClient(res);
        } catch (error) {
            console.error(error);
        }
    };

    const handleUnitSearch = (query: string) => {
        setUnitSearch(query);
        setShowUnitDropdown(true);
    };

    const selectUnit = (unit: any) => {
        setSelectedUnit(unit);
        setFormData({ ...formData, unitId: unit._id });
        setUnitSearch(`${unit.unitCode} - ${unit.unitName}`);
        setShowUnitDropdown(false);
    };

    const calculateTotals = () => {
        const c = formData.components;
        const t = formData.terms;

        // 1. Gross Salary
        const gross = Object.values(c).reduce((a, b) => a + Number(b), 0);

        // 2. Employer Contributions (Usually on Basic or Gross depending on rules)
        // Implementation: EPF on Basic+DA usually capped at 15000. Simplified here: EPF on Basic
        // ESI on Gross if Gross < 21000. Simplified here: ESI on Gross.

        let basicForPF = Number(c.basic) + Number(c.da); // Simplified
        if (basicForPF > 15000) basicForPF = 15000; // Cap? User didn't specify. Standard rule.

        // Wait, normally EPF % is on Basic + DA.
        // Let's use simple logic: (Basic + DA) * Percent
        const pfBasis = Number(c.basic) + Number(c.da);
        const epfAmt = Math.round((pfBasis * t.epfPercent) / 100);

        const esiAmt = Math.round((gross * t.esiPercent) / 100);

        // 3. Statutory & Others
        // Bonus on Basic (min 7000 or actual). Simplified: on Basic.
        const bonusAmt = Math.round((Number(c.basic) * t.bonusPercent) / 100);
        const leaveAmt = Math.round((Number(c.basic) * t.leavePercent) / 100); // Usually on Gross or Basic
        const gratuityAmt = Math.round((Number(c.basic) * t.gratuityPercent) / 100);

        // Holiday % usually on Gross or Basic
        const holidayAmt = Math.round((Number(c.basic) * t.holidayPercent) / 100);

        // Subtotal Cost to Company (without Service Charge)
        const subTotal = gross + epfAmt + esiAmt + bonusAmt + leaveAmt + gratuityAmt + holidayAmt;

        // Service Charge
        const scAmt = Math.round((subTotal * t.serviceChargePercent) / 100);

        const totalPerHead = subTotal + scAmt;
        const grandTotal = totalPerHead * formData.nos;

        setFormData(prev => ({
            ...prev,
            totals: {
                grossSalary: gross,
                epfAmount: epfAmt,
                esiAmount: esiAmt,
                bonusAmount: bonusAmt,
                leaveAmount: leaveAmt,
                gratuityAmount: gratuityAmt,
                holidayAmount: holidayAmt,
                serviceChargeAmount: scAmt,
                totalPerHead: totalPerHead,
                grandTotal: grandTotal
            }
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.unitId) {
            alert('Please select a Unit');
            return;
        }

        setLoading(true);
        try {
            await api.createBillRate(formData);
            router.push(`/clients/${clientId}/bill-rates`);
        } catch (error: any) {
            alert(`Failed: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    // Filter units for dropdown
    const filteredUnits = client?.units?.filter((u: any) =>
        u.unitCode.toLowerCase().includes(unitSearch.toLowerCase()) ||
        u.unitName.toLowerCase().includes(unitSearch.toLowerCase())
    ) || [];

    const inputClass = "w-full bg-slate-950/50 border border-white/10 rounded-xl px-3 py-2 focus:ring-1 ring-emerald-500/50 outline-none text-white text-sm font-mono";
    const labelClass = "text-xs font-medium text-white/60 block mb-1 uppercase tracking-wider";

    if (!client) return <AuroraBackground className="flex justify-center items-center"><Loader2 className="w-10 h-10 animate-spin text-white" /></AuroraBackground>;

    return (
        <AuroraBackground className="flex flex-col">
            <div className="h-full overflow-y-auto w-full p-8">
                <div className="max-w-7xl mx-auto space-y-6">
                    <div className="flex items-center gap-4">
                        <button onClick={() => router.back()} className="p-2 hover:bg-white/10 rounded-full transition-colors text-white">
                            <ArrowLeft className="w-6 h-6" />
                        </button>
                        <h1 className="text-3xl font-bold text-white">New Bill Estimation</h1>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6 pb-20">
                        {/* 1. TOP SECTION - Context */}
                        <div className="bg-card/40 backdrop-blur border border-white/10 rounded-2xl p-6">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {/* Unit Search */}
                                <div className="relative">
                                    <label className={labelClass}>Unit (Search by Code)</label>
                                    <div className="relative">
                                        <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                                        <input
                                            type="text"
                                            className={inputClass + " pl-9"}
                                            placeholder="Type Unit Code..."
                                            value={unitSearch}
                                            onChange={e => handleUnitSearch(e.target.value)}
                                            onFocus={() => setShowUnitDropdown(true)}
                                        // onBlur={() => setTimeout(() => setShowUnitDropdown(false), 200)} // Delay for click
                                        />
                                    </div>
                                    {showUnitDropdown && unitSearch && (
                                        <div className="absolute top-full left-0 right-0 mt-2 bg-slate-900 border border-white/10 rounded-xl shadow-xl z-50 max-h-60 overflow-y-auto">
                                            {filteredUnits.length > 0 ? filteredUnits.map((u: any) => (
                                                <div
                                                    key={u._id}
                                                    className="p-3 hover:bg-white/5 cursor-pointer border-b border-white/5 last:border-0"
                                                    onClick={() => selectUnit(u)}
                                                >
                                                    <div className="text-sm font-bold text-white">{u.unitCode}</div>
                                                    <div className="text-xs text-muted-foreground">{u.unitName}</div>
                                                </div>
                                            )) : (
                                                <div className="p-4 text-center text-xs text-muted-foreground">No units found</div>
                                            )}
                                        </div>
                                    )}
                                </div>
                                {/* Service / Designation */}
                                <div>
                                    <label className={labelClass}>Service / Designation</label>
                                    <input
                                        type="text"
                                        className={inputClass}
                                        placeholder="e.g. Supervisor"
                                        value={formData.service}
                                        onChange={e => setFormData({ ...formData, service: e.target.value })}
                                        required
                                    />
                                </div>
                                {/* Nos & Period */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className={labelClass}>Nos (Count)</label>
                                        <input
                                            type="number"
                                            className={inputClass}
                                            value={formData.nos}
                                            onChange={e => setFormData({ ...formData, nos: Number(e.target.value) })}
                                        />
                                    </div>
                                    <div>
                                        <label className={labelClass}>Month Days</label>
                                        <input
                                            type="number"
                                            className={inputClass}
                                            value={formData.monthDays}
                                            onChange={e => setFormData({ ...formData, monthDays: Number(e.target.value) })}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* 2. LEFT - BILL BREAKUP (Earnings) */}
                            <div className="bg-card/40 backdrop-blur border border-white/10 rounded-2xl p-6">
                                <h3 className="text-emerald-400 font-bold mb-4 uppercase text-sm tracking-wider flex items-center gap-2">
                                    <DollarSign className="w-4 h-4" /> Bill BreakUp
                                </h3>
                                <div className="space-y-3">
                                    {Object.keys(formData.components).map(key => (
                                        <div key={key} className="grid grid-cols-3 gap-4 items-center">
                                            <label className="text-sm text-white/80 col-span-1 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</label>
                                            <div className="col-span-2">
                                                <input
                                                    type="number"
                                                    className={inputClass}
                                                    value={(formData.components as any)[key]}
                                                    onChange={e => setFormData({
                                                        ...formData,
                                                        components: { ...formData.components, [key]: Number(e.target.value) }
                                                    })}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                    <div className="pt-4 border-t border-white/10 flex justify-between items-center">
                                        <span className="font-bold text-white">Gross Salary</span>
                                        <span className="font-mono text-emerald-400 font-bold">₹{formData.totals.grossSalary}</span>
                                    </div>
                                </div>
                            </div>

                            {/* 3. RIGHT - BILL TERMS & TOTALS */}
                            <div className="bg-card/40 backdrop-blur border border-white/10 rounded-2xl p-6">
                                <h3 className="text-indigo-400 font-bold mb-4 uppercase text-sm tracking-wider flex items-center gap-2">
                                    <Calculator className="w-4 h-4" /> Bill Terms
                                </h3>
                                <div className="space-y-4">
                                    {/* EPF */}
                                    <div className="grid grid-cols-12 gap-2 items-center bg-white/5 p-2 rounded-lg">
                                        <div className="col-span-3 text-sm font-medium">EPF</div>
                                        <div className="col-span-4"><div className="flex items-center gap-1"><input type="number" step="0.01" className={inputClass} value={formData.terms.epfPercent} onChange={e => setFormData({ ...formData, terms: { ...formData.terms, epfPercent: Number(e.target.value) } })} /><span className="text-xs text-muted-foreground">%</span></div></div>
                                        <div className="col-span-5 text-right font-mono text-indigo-300">₹{formData.totals.epfAmount}</div>
                                    </div>
                                    {/* ESI */}
                                    <div className="grid grid-cols-12 gap-2 items-center bg-white/5 p-2 rounded-lg">
                                        <div className="col-span-3 text-sm font-medium">ESI</div>
                                        <div className="col-span-4"><div className="flex items-center gap-1"><input type="number" step="0.01" className={inputClass} value={formData.terms.esiPercent} onChange={e => setFormData({ ...formData, terms: { ...formData.terms, esiPercent: Number(e.target.value) } })} /><span className="text-xs text-muted-foreground">%</span></div></div>
                                        <div className="col-span-5 text-right font-mono text-indigo-300">₹{formData.totals.esiAmount}</div>
                                    </div>
                                    {/* Bonus */}
                                    <div className="grid grid-cols-12 gap-2 items-center p-2">
                                        <div className="col-span-3 text-sm text-muted-foreground">Bonus</div>
                                        <div className="col-span-4"><div className="flex items-center gap-1"><input type="number" step="0.01" className={inputClass} value={formData.terms.bonusPercent} onChange={e => setFormData({ ...formData, terms: { ...formData.terms, bonusPercent: Number(e.target.value) } })} /><span className="text-xs text-muted-foreground">%</span></div></div>
                                        <div className="col-span-5 text-right font-mono text-white/60">₹{formData.totals.bonusAmount}</div>
                                    </div>
                                    {/* Leave */}
                                    <div className="grid grid-cols-12 gap-2 items-center p-2">
                                        <div className="col-span-3 text-sm text-muted-foreground">Leave</div>
                                        <div className="col-span-4"><div className="flex items-center gap-1"><input type="number" step="0.01" className={inputClass} value={formData.terms.leavePercent} onChange={e => setFormData({ ...formData, terms: { ...formData.terms, leavePercent: Number(e.target.value) } })} /><span className="text-xs text-muted-foreground">%</span></div></div>
                                        <div className="col-span-5 text-right font-mono text-white/60">₹{formData.totals.leaveAmount}</div>
                                    </div>
                                    {/* Gratuity */}
                                    <div className="grid grid-cols-12 gap-2 items-center p-2">
                                        <div className="col-span-3 text-sm text-muted-foreground">Gratuity</div>
                                        <div className="col-span-4"><div className="flex items-center gap-1"><input type="number" step="0.01" className={inputClass} value={formData.terms.gratuityPercent} onChange={e => setFormData({ ...formData, terms: { ...formData.terms, gratuityPercent: Number(e.target.value) } })} /><span className="text-xs text-muted-foreground">%</span></div></div>
                                        <div className="col-span-5 text-right font-mono text-white/60">₹{formData.totals.gratuityAmount}</div>
                                    </div>

                                    {/* Service Charge */}
                                    <div className="pt-4 mt-4 border-t border-white/10">
                                        <div className="grid grid-cols-12 gap-2 items-center bg-emerald-500/10 p-3 rounded-lg border border-emerald-500/20">
                                            <div className="col-span-4 text-sm font-bold text-emerald-400">Service Charge</div>
                                            <div className="col-span-3"><div className="flex items-center gap-1"><input type="number" step="0.01" className={inputClass} value={formData.terms.serviceChargePercent} onChange={e => setFormData({ ...formData, terms: { ...formData.terms, serviceChargePercent: Number(e.target.value) } })} /><span className="text-xs text-emerald-400">%</span></div></div>
                                            <div className="col-span-5 text-right font-mono font-bold text-emerald-400">₹{formData.totals.serviceChargeAmount}</div>
                                        </div>
                                    </div>

                                    {/* Totals */}
                                    <div className="space-y-2 pt-4">
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="text-muted-foreground">Total Per Head</span>
                                            <span className="font-mono text-white">₹{formData.totals.totalPerHead.toLocaleString()}</span>
                                        </div>
                                        <div className="flex justify-between items-center text-lg font-bold bg-white/10 p-4 rounded-xl">
                                            <span className="text-white">Grand Total ({formData.nos} Nos)</span>
                                            <span className="font-mono text-emerald-400">₹{formData.totals.grandTotal.toLocaleString()}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex justify-end gap-4">
                            <button type="button" onClick={() => router.back()} className="px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white font-bold transition-colors">
                                Cancel
                            </button>
                            <button type="submit" disabled={loading} className="px-8 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-bold shadow-lg shadow-emerald-500/25 flex items-center gap-2 transition-all disabled:opacity-50">
                                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                                Save Estimation
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AuroraBackground>
    );
}

export default function BillRateFormPage() {
    return (
        <Suspense fallback={<AuroraBackground className="flex justify-center items-center"><Loader2 className="w-10 h-10 animate-spin text-white" /></AuroraBackground>}>
            <BillRateFormContent />
        </Suspense>
    );
}

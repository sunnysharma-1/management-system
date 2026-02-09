'use client';

import { IndianRupee, Calculator, RefreshCw, Plus, Minus, Search, Check } from 'lucide-react';
import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface SalaryTabProps {
    formData: any;
    setFormData: (data: any) => void;
}

export function SalaryTab({ formData, setFormData }: SalaryTabProps) {
    const s = formData.salaryDetails || {};
    const [clients, setClients] = useState<any[]>([]);
    const [units, setUnits] = useState<any[]>([]);
    const [rates, setRates] = useState<any[]>([]);
    const [selectedUnitId, setSelectedUnitId] = useState('');
    const [isRateModalOpen, setIsRateModalOpen] = useState(false);

    useEffect(() => {
        fetchClients();
    }, []);

    const fetchClients = async () => {
        try {
            const res = await api.getClients();
            setClients(res);

            // Flatten units for easy selection
            const flattenedUnits = res.flatMap((client: any) =>
                (client.units || []).map((unit: any) => ({
                    ...unit,
                    clientName: client.companyName,
                    clientId: client._id
                }))
            );
            setUnits(flattenedUnits);
        } catch (error) {
            console.error("Failed to fetch clients");
        }
    };

    const handleUnitSelect = async (unitId: string) => {
        setSelectedUnitId(unitId);
        const unit = units.find(u => u._id === unitId);

        if (unit) {
            try {
                // Fetch all rates for this client
                const allRates = await api.getRates({ clientId: unit.clientId });

                // Filter: Generic OR Specific to this unit
                const relevantRates = allRates.filter((r: any) =>
                    !r.unitId || r.unitId === unitId
                );

                setRates(relevantRates);
            } catch (error) {
                console.error("Failed to fetch rates");
            }
        } else {
            setRates([]);
        }
    };

    const applyRate = (rate: any) => {
        const comp = rate.salaryComponents || {};
        const ded = rate.deductions || {};

        const newDetails = {
            ...s,
            basic: comp.basic || 0,
            da: comp.da || 0,
            hra: comp.hra || 0,
            conveyance: comp.conveyance || 0,
            washing: comp.washing || 0,
            uniform: comp.uniform || 0,
            special: comp.special || 0,
            training: comp.training || 0,
            roomRent: comp.roomRent || 0,
            medical: comp.medical || 0,
            leave: comp.leave || 0,
            bonus: comp.bonus || 0,
            gratuity: comp.gratuity || 0,
            nh: comp.nh || 0,
            relievingCharge: comp.relievingCharge || 0,

            // Deductions Config
            pfPercent: ded.pfPercent || 0,
            esicPercent: ded.esicPercent || 0,
            otherDeduction: ded.lwf || 0
        };

        // Recalculate totals immediately
        const totalEarnings = Object.values(comp).reduce((a: number, b: any) => a + Number(b), 0);

        // Quick Calc for PF/ESIC if percentages exist
        let pfAmt = 0;
        let esicAmt = 0;

        if (ded.pfPercent > 0) pfAmt = Math.round((comp.basic * ded.pfPercent) / 100);
        if (ded.esicPercent > 0) esicAmt = Math.round((totalEarnings * ded.esicPercent) / 100);

        newDetails.pfAmount = pfAmt;
        newDetails.esicAmount = esicAmt;

        setFormData({
            ...formData,
            salaryDetails: newDetails,
            grossSalary: totalEarnings
        });

        setIsRateModalOpen(false);
    };

    const handleChange = (field: string, value: number) => {
        const newDetails = { ...s, [field]: value };

        // Auto-calculate Totals
        const totalEarnings = (newDetails.basic || 0) + (newDetails.da || 0) + (newDetails.hra || 0) +
            (newDetails.conveyance || 0) + (newDetails.washing || 0) + (newDetails.uniform || 0) +
            (newDetails.special || 0) + (newDetails.training || 0) + (newDetails.roomRent || 0) +
            (newDetails.medical || 0) + (newDetails.leave || 0) + (newDetails.bonus || 0) +
            (newDetails.gratuity || 0) + (newDetails.nh || 0) + (newDetails.relievingCharge || 0);

        const totalDeductions = (newDetails.pfAmount || 0) + (newDetails.esicAmount || 0) +
            (newDetails.tds || 0) + (newDetails.deathBenefit || 0) + (newDetails.otherDeduction || 0);

        const netSalary = totalEarnings - totalDeductions;

        setFormData({
            ...formData,
            salaryDetails: newDetails,
            grossSalary: totalEarnings
        });
    };

    // Helper for Percentage Calculation
    const calculatePercentage = (field: 'pf' | 'esic', percent: number) => {
        const basic = s.basic || 0;
        const gross = formData.grossSalary || 0;

        // PF usually on Basic, ESIC on Gross
        const base = field === 'pf' ? basic : gross;
        const amount = Math.round((base * percent) / 100);

        const newDetails = {
            ...s,
            [`${field}Percent`]: percent,
            [`${field}Amount`]: amount
        };

        setFormData({ ...formData, salaryDetails: newDetails });
    };


    return (
        <div className="space-y-6">
            <div className="bg-gradient-to-br from-card/80 to-card/40 backdrop-blur border border-white/10 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-green-500/10 rounded-lg text-green-400"><IndianRupee className="w-5 h-5" /></div>
                        <div>
                            <h2 className="text-lg font-semibold">Salary Structure</h2>
                            <p className="text-sm text-muted-foreground">Detailed breakdown of Earnings & Deductions</p>
                        </div>
                    </div>

                    {/* Rate Selection Dialog */}
                    <Dialog open={isRateModalOpen} onOpenChange={setIsRateModalOpen}>
                        <DialogTrigger asChild>
                            <Button variant="outline" className="border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10">
                                <Search className="w-4 h-4 mr-2" /> Auto-fill from Rate Card
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="bg-slate-900 border-white/10 text-white max-w-2xl">
                            <DialogHeader>
                                <DialogTitle>Select Rate Structure</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4 pt-4">
                                <div>
                                    <label className="text-sm text-muted-foreground mb-2 block">Select Unit</label>
                                    <select
                                        className="w-full bg-slate-950 border border-white/10 rounded-xl p-3 outline-none"
                                        value={selectedUnitId}
                                        onChange={(e) => handleUnitSelect(e.target.value)}
                                    >
                                        <option value="">-- Choose Unit --</option>
                                        {units.map(u => (
                                            <option key={u._id} value={u._id}>
                                                {u.unitCode} - {u.unitName} - {u.clientName}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="max-h-[300px] overflow-y-auto space-y-2">
                                    {rates.length > 0 ? (
                                        rates.map((rate: any) => (
                                            <div
                                                key={rate._id}
                                                onClick={() => applyRate(rate)}
                                                className="p-4 rounded-xl bg-white/5 hover:bg-white/10 cursor-pointer border border-white/5 transition-colors flex justify-between items-center group"
                                            >
                                                <div>
                                                    <div className="font-bold text-white group-hover:text-emerald-400 transition-colors">
                                                        {rate.designation}
                                                    </div>
                                                    <div className="text-xs text-muted-foreground flex gap-2 mt-1">
                                                        {rate.unitId ? (
                                                            <span className="bg-emerald-500/10 text-emerald-400 px-1.5 rounded border border-emerald-500/20">Specific to Unit</span>
                                                        ) : (
                                                            <span className="bg-blue-500/10 text-blue-400 px-1.5 rounded border border-blue-500/20">Generic / All Units</span>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <div className="text-emerald-400 font-mono font-bold">
                                                        ₹{Object.values(rate.salaryComponents || {}).reduce((a: number, b: any) => a + Number(b), 0)}
                                                    </div>
                                                    <div className="text-xs text-muted-foreground">Gross Salary</div>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        selectedUnitId && <div className="text-center py-8 text-muted-foreground">No rates found matching this unit configuration.</div>
                                    )}
                                </div>
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-2 gap-12">

                    {/* EARNINGS */}
                    <div className="space-y-6">
                        <h3 className="text-sm font-bold uppercase text-green-400 tracking-wider flex items-center gap-2">
                            <Plus className="w-4 h-4" /> Earnings
                        </h3>
                        <div className="grid grid-cols-2 gap-4">
                            <InputField label="Basic" value={s.basic} onChange={v => handleChange('basic', v)} />
                            <InputField label="DA / VDA" value={s.da} onChange={v => handleChange('da', v)} />
                            <InputField label="HRA" value={s.hra} onChange={v => handleChange('hra', v)} />
                            <InputField label="Conveyance" value={s.conveyance} onChange={v => handleChange('conveyance', v)} />
                            <InputField label="Washing Allow." value={s.washing} onChange={v => handleChange('washing', v)} />
                            <InputField label="Uniform Allow." value={s.uniform} onChange={v => handleChange('uniform', v)} />
                            <InputField label="Special Allow." value={s.special} onChange={v => handleChange('special', v)} />
                            <InputField label="Training Allow." value={s.training} onChange={v => handleChange('training', v)} />
                            <InputField label="Room Rent" value={s.roomRent} onChange={v => handleChange('roomRent', v)} />
                            <InputField label="Medical Allow." value={s.medical} onChange={v => handleChange('medical', v)} />
                            <InputField label="Leave Allow." value={s.leave} onChange={v => handleChange('leave', v)} />
                            <InputField label="Bonus" value={s.bonus} onChange={v => handleChange('bonus', v)} />
                            <InputField label="Gratuity" value={s.gratuity} onChange={v => handleChange('gratuity', v)} />
                            <InputField label="National Holidays" value={s.nh} onChange={v => handleChange('nh', v)} />
                            <InputField label="Relieving Charges" value={s.relievingCharge} onChange={v => handleChange('relievingCharge', v)} />
                        </div>
                        {/* Overtime Section */}
                        <div className="pt-4 mt-4 border-t border-white/10">
                            <h4 className="text-xs font-semibold text-muted-foreground mb-3">Overtime Rates</h4>
                            <div className="grid grid-cols-2 gap-4">
                                <InputField label="OT Rate" value={s.otRate} onChange={v => handleChange('otRate', v)} />
                                <InputField label="OT Hrs Rate" value={s.otHrsRate} onChange={v => handleChange('otHrsRate', v)} />
                            </div>
                        </div>
                    </div>

                    {/* DEDUCTIONS & TOTALS */}
                    <div className="space-y-8">
                        <div>
                            <h3 className="text-sm font-bold uppercase text-red-400 tracking-wider flex items-center gap-2 mb-6">
                                <Minus className="w-4 h-4" /> Deductions
                            </h3>
                            <div className="space-y-4">
                                {/* PF Row */}
                                <div className="grid grid-cols-12 gap-2 items-end">
                                    <div className="col-span-4 text-sm font-medium text-muted-foreground">Provident Fund</div>
                                    <div className="col-span-3">
                                        <label className="text-xs text-muted-foreground mb-1 block">%</label>
                                        <input type="number" className="w-full bg-background/50 border border-white/10 rounded-lg px-2 py-1.5 text-sm"
                                            value={s.pfPercent || ''} onChange={e => calculatePercentage('pf', Number(e.target.value))} placeholder="12%"
                                        />
                                    </div>
                                    <div className="col-span-5">
                                        <label className="text-xs text-muted-foreground mb-1 block">Amount</label>
                                        <input type="number" className="w-full bg-background/50 border border-white/10 rounded-lg px-2 py-1.5 text-sm font-mono text-red-300"
                                            value={s.pfAmount || ''} onChange={e => handleChange('pfAmount', Number(e.target.value))}
                                        />
                                    </div>
                                </div>

                                {/* ESIC Row */}
                                <div className="grid grid-cols-12 gap-2 items-end">
                                    <div className="col-span-4 text-sm font-medium text-muted-foreground">ESIC</div>
                                    <div className="col-span-3">
                                        <input type="number" className="w-full bg-background/50 border border-white/10 rounded-lg px-2 py-1.5 text-sm"
                                            value={s.esicPercent || ''} onChange={e => calculatePercentage('esic', Number(e.target.value))} placeholder="0.75%"
                                        />
                                    </div>
                                    <div className="col-span-5">
                                        <input type="number" className="w-full bg-background/50 border border-white/10 rounded-lg px-2 py-1.5 text-sm font-mono text-red-300"
                                            value={s.esicAmount || ''} onChange={e => handleChange('esicAmount', Number(e.target.value))}
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4 pt-2">
                                    <InputField label="TDS" value={s.tds} onChange={v => handleChange('tds', v)} textColor="text-red-300" />
                                    <InputField label="Death Benefit" value={s.deathBenefit} onChange={v => handleChange('deathBenefit', v)} textColor="text-red-300" />
                                    <InputField label="Other Ded." value={s.otherDeduction} onChange={v => handleChange('otherDeduction', v)} textColor="text-red-300" />
                                </div>
                            </div>
                        </div>

                        {/* Summary Card */}
                        <div className="p-6 bg-slate-900/50 rounded-2xl border border-white/10 space-y-4">
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-muted-foreground">Total Earnings</span>
                                <span className="font-mono text-green-400">₹{formData.grossSalary || 0}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-muted-foreground">Total Deductions</span>
                                <span className="font-mono text-red-400">
                                    -₹{(s.pfAmount || 0) + (s.esicAmount || 0) + (s.tds || 0) + (s.deathBenefit || 0) + (s.otherDeduction || 0)}
                                </span>
                            </div>
                            <div className="pt-4 border-t border-white/10 mt-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-lg font-bold text-white">Net Pay</span>
                                    <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-emerald-500">
                                        ₹{(formData.grossSalary || 0) - ((s.pfAmount || 0) + (s.esicAmount || 0) + (s.tds || 0) + (s.deathBenefit || 0) + (s.otherDeduction || 0))}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function InputField({ label, value, onChange, textColor = "text-green-300" }: { label: string, value: number, onChange: (v: number) => void, textColor?: string }) {
    return (
        <div className="space-y-1">
            <label className="text-xs font-medium text-muted-foreground">{label}</label>
            <div className="relative">
                <input
                    type="number"
                    className={`w-full bg-background/50 border border-white/10 rounded-lg pl-3 pr-3 py-2 text-sm font-mono focus:ring-1 ring-primary/50 outline-none ${textColor}`}
                    value={value || ''}
                    onChange={e => onChange(Number(e.target.value))}
                    placeholder="0"
                />
            </div>
        </div>
    );
}

'use client';

import { IndianRupee, Calculator, RefreshCw, Plus, Minus } from 'lucide-react';
import { useEffect } from 'react';

interface SalaryTabProps {
    formData: any;
    setFormData: (data: any) => void;
}

export function SalaryTab({ formData, setFormData }: SalaryTabProps) {
    const s = formData.salaryDetails || {};

    const handleChange = (field: string, value: number) => {
        const newDetails = { ...s, [field]: value };

        // Auto-calculate Totals
        const totalEarnings = (newDetails.basic || 0) + (newDetails.da || 0) + (newDetails.hra || 0) +
            (newDetails.conveyance || 0) + (newDetails.washing || 0) + (newDetails.uniform || 0) +
            (newDetails.special || 0) + (newDetails.training || 0) + (newDetails.roomRent || 0) +
            (newDetails.medical || 0) + (newDetails.leave || 0) + (newDetails.bonus || 0) +
            (newDetails.gratuity || 0);

        const totalDeductions = (newDetails.pfAmount || 0) + (newDetails.esicAmount || 0) +
            (newDetails.tds || 0) + (newDetails.deathBenefit || 0) + (newDetails.otherDeduction || 0);

        const netSalary = totalEarnings - totalDeductions;

        setFormData({
            ...formData,
            salaryDetails: newDetails,
            grossSalary: totalEarnings // Assuming Gross is Total Earnings for now
        });
    };

    // Helper for Percentage Calculation
    const calculatePercentage = (field: 'pf' | 'esic', percent: number) => {
        const basic = s.basic || 0;
        const amount = Math.round((basic * percent) / 100);

        const newDetails = {
            ...s,
            [`${field}Percent`]: percent,
            [`${field}Amount`]: amount
        };
        // Trigger generic update to recalc totals
        setFormData({ ...formData, salaryDetails: newDetails });
        // We need to re-trigger the total calc, simplified here by just calling handleChange logic effectively in next render or via effect if needed. 
        // For simplicity in this controlled component, we'll manually calc net here too or just let user adjust amount.
        // Better: Just update the amount field directly via the existing handler pattern if possible, but state update is async.
        // Let's just update the specific amount field.
        handleChange(`${field}Amount`, amount);
        // Also update the percent field in state (we need to add it to handle change logic or just spread it)
        setFormData(prev => ({
            ...prev,
            salaryDetails: { ...prev.salaryDetails, [`${field}Percent`]: percent, [`${field}Amount`]: amount }
        }));
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

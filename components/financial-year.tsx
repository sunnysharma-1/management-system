'use client';

import { useState } from 'react';
import { useMasterData, FinancialYear } from './providers/master-data-context';
import { Calendar, Plus, Trash2, Check, Edit, X } from 'lucide-react';

export function FinancialYearManager() {
    const { data, addFinancialYear, updateFinancialYear, deleteFinancialYear } = useMasterData();
    const [isEditing, setIsEditing] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);

    // Form State
    const [label, setLabel] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [isActive, setIsActive] = useState(false);

    const handleEdit = (fy: FinancialYear) => {
        setEditingId(fy.id);
        setLabel(fy.label);
        setStartDate(fy.startDate);
        setEndDate(fy.endDate);
        setIsActive(fy.isActive);
        setIsEditing(true);
    };

    const handleCreate = () => {
        setEditingId(null);
        setLabel('');
        setStartDate('');
        setEndDate('');
        setIsActive(false);
        setIsEditing(true);
    };

    const handleSave = () => {
        if (!label || !startDate || !endDate) return;

        const newFY: FinancialYear = {
            id: editingId || `fy-${Date.now()}`,
            label,
            startDate,
            endDate,
            isActive
        };

        if (editingId) {
            updateFinancialYear(newFY);
        } else {
            addFinancialYear(newFY);
        }
        setIsEditing(false);
    };

    return (
        <div className="p-6 max-w-6xl mx-auto space-y-6 animate-fade-in">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Financial Year</h1>
                    <p className="text-muted-foreground">Manage fiscal years and active periods</p>
                </div>
                {!isEditing && (
                    <button
                        onClick={handleCreate}
                        className="bg-primary text-primary-foreground px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
                    >
                        <Plus className="w-4 h-4" />
                        Add Financial Year
                    </button>
                )}
            </div>

            {isEditing && (
                <div className="bg-[#1f1428] border border-primary/20 rounded-xl p-6 shadow-lg shadow-primary/5 mb-8 animate-slide-down">
                    <h3 className="text-lg font-semibold mb-4">{editingId ? 'Edit Financial Year' : 'New Financial Year'}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div>
                            <label className="block text-sm font-medium mb-2 opacity-80">Label</label>
                            <input
                                type="text"
                                value={label}
                                onChange={(e) => setLabel(e.target.value)}
                                placeholder="e.g. 2024-2025"
                                className="w-full bg-[#130d1f] border border-gray-700 rounded-lg px-4 py-2 focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2 opacity-80">Start Date</label>
                            <input
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                className="w-full bg-[#130d1f] border border-gray-700 rounded-lg px-4 py-2 focus:border-primary focus:ring-1 focus:ring-primary outline-none [color-scheme:dark]"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2 opacity-80">End Date</label>
                            <input
                                type="date"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                className="w-full bg-[#130d1f] border border-gray-700 rounded-lg px-4 py-2 focus:border-primary focus:ring-1 focus:ring-primary outline-none [color-scheme:dark]"
                            />
                        </div>
                        <div className="flex items-center pt-6">
                            <label className="flex items-center cursor-pointer gap-2">
                                <input
                                    type="checkbox"
                                    checked={isActive}
                                    onChange={(e) => setIsActive(e.target.checked)}
                                    className="rounded border-gray-600 bg-gray-700 text-primary w-5 h-5"
                                />
                                <span>Set as Active Financial Year</span>
                            </label>
                        </div>
                    </div>
                    <div className="flex justify-end gap-3 mt-6">
                        <button
                            onClick={() => setIsEditing(false)}
                            className="px-4 py-2 rounded-lg border border-gray-600 hover:bg-gray-800 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSave}
                            className="bg-primary text-primary-foreground px-6 py-2 rounded-lg flex items-center gap-2 hover:bg-primary/90 transition-all font-medium"
                        >
                            <Check className="w-4 h-4" />
                            Save Changes
                        </button>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 gap-4">
                {data.financialYears.map((fy) => (
                    <div key={fy.id} className={`p-4 rounded-xl border flex items-center justify-between transition-all group ${fy.isActive ? 'bg-primary/10 border-primary shadow-md shadow-primary/10' : 'bg-[#1f1428] border-gray-800 hover:border-gray-700'}`}>
                        <div className="flex items-center gap-4">
                            <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${fy.isActive ? 'bg-primary text-white' : 'bg-gray-800 text-gray-400'}`}>
                                <Calendar className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className={`text-lg font-bold ${fy.isActive ? 'text-primary' : 'text-foreground'}`}>{fy.label}</h3>
                                <p className="text-sm text-muted-foreground">{fy.startDate} to {fy.endDate}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            {fy.isActive && (
                                <span className="bg-primary/20 text-primary px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider">
                                    Active
                                </span>
                            )}

                            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                    onClick={() => handleEdit(fy)}
                                    className="p-2 hover:bg-primary/20 text-primary rounded-lg transition-colors"
                                >
                                    <Edit className="w-4 h-4" />
                                </button>
                                {!fy.isActive && (
                                    <button
                                        onClick={() => deleteFinancialYear(fy.id)}
                                        className="p-2 hover:bg-destructive/20 text-destructive rounded-lg transition-colors"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

'use client';

import { useState } from 'react';
import { useMasterData, MasterItem } from './providers/master-data-context';
import { Plus, Edit, Trash2, Save, X, Search, Database } from 'lucide-react';

interface FieldCheck {
    key: string;
    label: string;
}

interface GenericMasterProps {
    title: string;
    dataKey: string; // Key in MasterState (e.g., 'countries', 'states')
    fields: FieldCheck[]; // Columns to display/edit
    parentKey?: string; // If dependent on another master (e.g. State needs Country)
}

export function GenericMaster({ title, dataKey, fields, parentKey }: GenericMasterProps) {
    const { data, addItem, updateItem, deleteItem } = useMasterData();
    const [isEditing, setIsEditing] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [formData, setFormData] = useState<Record<string, string>>({});
    const [searchTerm, setSearchTerm] = useState('');

    const items = (data as any)[dataKey] as MasterItem[] || [];

    const handleEdit = (item: MasterItem) => {
        setEditingId(item.id);
        const newFormData: Record<string, string> = {};
        fields.forEach(f => {
            newFormData[f.key] = item[f.key] || '';
        });
        // Add parent ID if exists
        if (parentKey) {
            newFormData[parentKey] = item[parentKey] || '';
        }
        setFormData(newFormData);
        setIsEditing(true);
    };

    const handleCreate = () => {
        setEditingId(null);
        const newFormData: Record<string, string> = {};
        fields.forEach(f => newFormData[f.key] = '');
        if (parentKey) newFormData[parentKey] = '';
        setFormData(newFormData);
        setIsEditing(true);
    };

    const handleSave = () => {
        // Basic validation: ensure at least first field is filled
        if (!formData[fields[0].key]) return;

        const newItem: MasterItem = {
            id: editingId || `${dataKey.slice(0, 3)}-${Date.now()}`,
            name: formData['name'] || formData[fields[0].key], // fallback name
            ...formData,
        };

        if (editingId) {
            // @ts-ignore - we know context handles dynamic keys
            updateItem(dataKey as any, newItem);
        } else {
            // @ts-ignore
            addItem(dataKey as any, newItem);
        }
        setIsEditing(false);
    };

    const handleDelete = (id: string) => {
        if (window.confirm('Are you sure you want to delete this item?')) {
            // @ts-ignore
            deleteItem(dataKey as any, id);
        }
    };

    const filteredItems = items.filter(item =>
        Object.values(item).some(val =>
            String(val).toLowerCase().includes(searchTerm.toLowerCase())
        )
    );

    // Helper to render parent dropdown
    const renderParentSelect = () => {
        if (!parentKey) return null;

        // Determine parent data key (naive pluralization: country -> countries)
        let parentDataKey = parentKey + 's';
        if (parentKey === 'country') parentDataKey = 'countries'; // specific fix
        if (parentKey.endsWith('y')) parentDataKey = parentKey.slice(0, -1) + 'ies'; // generic fix

        const parentItems = (data as any)[parentDataKey] as MasterItem[] || [];

        return (
            <div className="mb-4">
                <label className="block text-sm font-medium mb-2 opacity-80 capitalize">{parentKey.replace('Id', '')}</label>
                <select
                    value={formData[parentKey] || ''}
                    onChange={(e) => setFormData({ ...formData, [parentKey]: e.target.value })}
                    className="w-full bg-[#130d1f] border border-gray-700 rounded-lg px-4 py-2 focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                >
                    <option value="">Select {parentKey}</option>
                    {parentItems.map(p => (
                        <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                </select>
            </div>
        );
    };

    return (
        <div className="p-6 max-w-5xl mx-auto space-y-6 animate-fade-in">
            <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                <div>
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-lg text-primary">
                            <Database className="w-6 h-6" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">{title}</h1>
                            <p className="text-muted-foreground text-sm">Master Data Management</p>
                        </div>
                    </div>
                </div>

                <div className="flex gap-3 w-full md:w-auto">
                    <div className="relative flex-1 md:w-64">
                        <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-500" />
                        <input
                            type="text"
                            placeholder="Search records..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-[#1f1428] border border-gray-700 rounded-lg pl-9 pr-4 py-2 text-sm focus:border-primary focus:outline-none"
                        />
                    </div>
                    {!isEditing && (
                        <button
                            onClick={handleCreate}
                            className="bg-primary text-primary-foreground px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-primary/90 transition-all font-medium whitespace-nowrap"
                        >
                            <Plus className="w-4 h-4" />
                            Add New
                        </button>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* List Section */}
                <div className={`md:col-span-${isEditing ? '2' : '3'} transition-all`}>
                    <div className="bg-[#1f1428] border border-gray-800 rounded-xl overflow-hidden shadow-sm">
                        <table className="w-full">
                            <thead className="bg-gray-900/50 text-xs uppercase font-semibold text-gray-400">
                                <tr>
                                    {fields.map(f => (
                                        <th key={f.key} className="px-6 py-3 text-left">{f.label}</th>
                                    ))}
                                    {parentKey && <th className="px-6 py-3 text-left capitalize">{parentKey.replace('Id', '')}</th>}
                                    <th className="px-6 py-3 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-800">
                                {filteredItems.length === 0 ? (
                                    <tr>
                                        <td colSpan={fields.length + 2} className="px-6 py-8 text-center text-muted-foreground">
                                            No records found. Click "Add New" to Create.
                                        </td>
                                    </tr>
                                ) : (
                                    filteredItems.map(item => (
                                        <tr key={item.id} className="hover:bg-gray-800/50 transition-colors group">
                                            {fields.map(f => (
                                                <td key={f.key} className="px-6 py-3 text-sm">{item[f.key]}</td>
                                            ))}
                                            {parentKey && (
                                                <td className="px-6 py-3 text-sm text-gray-400">
                                                    {/* Naive lookup for display. In real app, optimize this. */}
                                                    {item[parentKey]}
                                                </td>
                                            )}
                                            <td className="px-6 py-3 text-right">
                                                <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button onClick={() => handleEdit(item)} className="p-1.5 hover:bg-primary/20 text-primary rounded transition-colors"><Edit className="w-4 h-4" /></button>
                                                    <button onClick={() => handleDelete(item.id)} className="p-1.5 hover:bg-destructive/20 text-destructive rounded transition-colors"><Trash2 className="w-4 h-4" /></button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Edit Form Section */}
                {isEditing && (
                    <div className="md:col-span-1 animate-slide-left">
                        <div className="bg-[#1f1428] border border-primary/20 rounded-xl p-6 shadow-xl sticky top-6">
                            <div className="flex justify-between items-center mb-6 border-b border-gray-800 pb-4">
                                <h3 className="font-semibold">{editingId ? 'Edit Record' : 'New Record'}</h3>
                                <button onClick={() => setIsEditing(false)} className="text-gray-500 hover:text-white"><X className="w-5 h-5" /></button>
                            </div>

                            <div className="space-y-4">
                                {renderParentSelect()}

                                {fields.map(f => (
                                    <div key={f.key}>
                                        <label className="block text-sm font-medium mb-2 opacity-80">{f.label}</label>
                                        <input
                                            type="text"
                                            value={formData[f.key] || ''}
                                            onChange={(e) => setFormData({ ...formData, [f.key]: e.target.value })}
                                            className="w-full bg-[#130d1f] border border-gray-700 rounded-lg px-4 py-2 focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                                        />
                                    </div>
                                ))}
                            </div>

                            <div className="flex gap-3 mt-8 pt-4 border-t border-gray-800">
                                <button
                                    onClick={() => setIsEditing(false)}
                                    className="flex-1 px-4 py-2 rounded-lg border border-gray-600 hover:bg-gray-800 transition-colors text-sm"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSave}
                                    className="flex-1 bg-primary text-primary-foreground px-4 py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-primary/90 transition-all text-sm font-medium"
                                >
                                    <Save className="w-4 h-4" />
                                    Save
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

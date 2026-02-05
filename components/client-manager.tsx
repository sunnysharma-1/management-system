'use client';

import { useState } from 'react';
import { useBilling, Client } from './providers/billing-context';
import { useMasterData } from './providers/master-data-context';
import { Plus, Edit, Trash2, Save, X, Search, Users } from 'lucide-react';

export function ClientManager() {
    const { clients, addClient, updateClient, deleteClient } = useBilling();
    const { data } = useMasterData(); // for states
    const [isEditing, setIsEditing] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [formData, setFormData] = useState<Partial<Client>>({});
    const [searchTerm, setSearchTerm] = useState('');

    const handleEdit = (client: Client) => {
        setEditingId(client.id);
        setFormData(client);
        setIsEditing(true);
    };

    const handleCreate = () => {
        setEditingId(null);
        setFormData({ state: 'Maharashtra' }); // Default
        setIsEditing(true);
    };

    const handleSave = () => {
        if (!formData.name || !formData.gstin) return;

        const newClient: Client = {
            id: editingId || `c-${Date.now()}`,
            name: formData.name,
            address: formData.address || '',
            gstin: formData.gstin,
            state: formData.state || 'Maharashtra',
            email: formData.email || '',
            paymentTerms: formData.paymentTerms || 'Net 30',
        };

        if (editingId) {
            updateClient(newClient);
        } else {
            addClient(newClient);
        }
        setIsEditing(false);
    };

    const filteredClients = clients.filter(c =>
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.gstin.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="p-6 max-w-6xl mx-auto space-y-6 animate-fade-in">
            <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                <div>
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-accent/10 rounded-lg text-accent">
                            <Users className="w-6 h-6" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">Client Manager</h1>
                            <p className="text-muted-foreground text-sm">Manage billing clients and details</p>
                        </div>
                    </div>
                </div>

                <div className="flex gap-3 w-full md:w-auto">
                    <div className="relative flex-1 md:w-64">
                        <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-500" />
                        <input
                            type="text"
                            placeholder="Search clients..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-[#1f1428] border border-gray-700 rounded-lg pl-9 pr-4 py-2 text-sm focus:border-accent focus:outline-none"
                        />
                    </div>
                    {!isEditing && (
                        <button
                            onClick={handleCreate}
                            className="bg-accent text-accent-foreground px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-accent/90 transition-all font-medium whitespace-nowrap"
                        >
                            <Plus className="w-4 h-4" />
                            Add Client
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
                                    <th className="px-6 py-3 text-left">Client Name</th>
                                    <th className="px-6 py-3 text-left">GSTIN</th>
                                    <th className="px-6 py-3 text-left">State</th>
                                    <th className="px-6 py-3 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-800">
                                {filteredClients.map(client => (
                                    <tr key={client.id} className="hover:bg-gray-800/50 transition-colors group">
                                        <td className="px-6 py-3 text-sm font-medium">{client.name}</td>
                                        <td className="px-6 py-3 text-sm text-gray-400 font-mono">{client.gstin}</td>
                                        <td className="px-6 py-3 text-sm text-gray-400">{client.state}</td>
                                        <td className="px-6 py-3 text-right">
                                            <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button onClick={() => handleEdit(client)} className="p-1.5 hover:bg-accent/20 text-accent rounded transition-colors"><Edit className="w-4 h-4" /></button>
                                                <button onClick={() => deleteClient(client.id)} className="p-1.5 hover:bg-destructive/20 text-destructive rounded transition-colors"><Trash2 className="w-4 h-4" /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Edit Form Section */}
                {isEditing && (
                    <div className="md:col-span-1 animate-slide-left">
                        <div className="bg-[#1f1428] border border-accent/20 rounded-xl p-6 shadow-xl sticky top-6">
                            <div className="flex justify-between items-center mb-6 border-b border-gray-800 pb-4">
                                <h3 className="font-semibold">{editingId ? 'Edit Client' : 'New Client'}</h3>
                                <button onClick={() => setIsEditing(false)} className="text-gray-500 hover:text-white"><X className="w-5 h-5" /></button>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1 opacity-80">Client Name *</label>
                                    <input
                                        type="text"
                                        value={formData.name || ''}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full bg-[#130d1f] border border-gray-700 rounded-lg px-4 py-2 focus:border-accent focus:ring-1 focus:ring-accent outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1 opacity-80">GSTIN *</label>
                                    <input
                                        type="text"
                                        value={formData.gstin || ''}
                                        onChange={(e) => setFormData({ ...formData, gstin: e.target.value })}
                                        className="w-full bg-[#130d1f] border border-gray-700 rounded-lg px-4 py-2 focus:border-accent focus:ring-1 focus:ring-accent outline-none uppercase"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1 opacity-80">Email</label>
                                    <input
                                        type="email"
                                        value={formData.email || ''}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="w-full bg-[#130d1f] border border-gray-700 rounded-lg px-4 py-2 focus:border-accent focus:ring-1 focus:ring-accent outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1 opacity-80">State</label>
                                    {data.states.length > 0 ? (
                                        <select
                                            value={formData.state || ''}
                                            onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                                            className="w-full bg-[#130d1f] border border-gray-700 rounded-lg px-4 py-2 focus:border-accent focus:ring-1 focus:ring-accent outline-none"
                                        >
                                            {data.states.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
                                        </select>
                                    ) : (
                                        <input
                                            type="text"
                                            value={formData.state || ''}
                                            onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                                            className="w-full bg-[#130d1f] border border-gray-700 rounded-lg px-4 py-2 focus:border-accent focus:ring-1 focus:ring-accent outline-none"
                                        />
                                    )}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1 opacity-80">Address</label>
                                    <textarea
                                        value={formData.address || ''}
                                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                        rows={3}
                                        className="w-full bg-[#130d1f] border border-gray-700 rounded-lg px-4 py-2 focus:border-accent focus:ring-1 focus:ring-accent outline-none resize-none"
                                    />
                                </div>
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
                                    className="flex-1 bg-accent text-accent-foreground px-4 py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-accent/90 transition-all text-sm font-medium"
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

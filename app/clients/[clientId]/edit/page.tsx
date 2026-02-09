'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { api } from '@/lib/api';
import { AuroraBackground } from '@/components/ui/aurora-background';
import { ArrowLeft, Loader2, Save, Building2 } from 'lucide-react';

export default function EditClientPage() {
    const router = useRouter();
    const params = useParams();
    const clientId = params.clientId as string;

    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        companyName: '',
        clientCode: '',
        contactPerson: '',
        email: '',
        phone: '',
        gstin: '',
        address: { street: '', city: '', state: '', zipCode: '', country: 'India' }
    });

    useEffect(() => {
        fetchData();
    }, [clientId]);

    const fetchData = async () => {
        try {
            const clients = await api.getClients();
            const client = clients.find((c: any) => c._id === clientId);
            if (client) {
                setFormData({
                    companyName: client.companyName || '',
                    clientCode: client.clientCode || '',
                    contactPerson: client.contactPerson || '',
                    email: client.email || '',
                    phone: client.phone || '',
                    gstin: client.gstin || '',
                    address: {
                        street: client.address?.street || '',
                        city: client.address?.city || '',
                        state: client.address?.state || '',
                        zipCode: client.address?.zipCode || '',
                        country: client.address?.country || 'India'
                    }
                });
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            // Need updateClient API.
            await api.updateClient(clientId, formData);
            alert('Client updated successfully!');
            router.push('/clients/list');
        } catch (error: any) {
            console.error(error);
            alert(`Failed: ${error.message || 'Unknown error'}`);
        } finally {
            setLoading(false);
        }
    };

    const inputClass = "w-full bg-slate-950/50 border border-white/10 rounded-xl px-4 py-3 focus:ring-2 ring-indigo-500/50 outline-none text-white transition-all";
    const labelClass = "text-sm font-medium text-white/80 block mb-2";

    if (loading) return <AuroraBackground className="flex justify-center items-center"><Loader2 className="w-10 h-10 animate-spin text-white" /></AuroraBackground>;

    return (
        <AuroraBackground className="flex flex-col">
            <div className="h-full overflow-y-auto w-full p-8">
                <div className="max-w-4xl mx-auto space-y-8">
                    <div className="flex items-center gap-4">
                        <button onClick={() => router.back()} className="p-2 hover:bg-white/10 rounded-full transition-colors text-white">
                            <ArrowLeft className="w-6 h-6" />
                        </button>
                        <h1 className="text-3xl font-bold text-white">Edit Client (Head Office)</h1>
                    </div>

                    <form onSubmit={handleSubmit} className="bg-card/40 backdrop-blur border border-white/10 rounded-2xl p-8 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="col-span-2"><label className={labelClass}>Company Name</label><input required className={inputClass} value={formData.companyName} onChange={e => setFormData({ ...formData, companyName: e.target.value })} /></div>
                            <div><label className={labelClass}>Client Code</label><input required className={inputClass} value={formData.clientCode} onChange={e => setFormData({ ...formData, clientCode: e.target.value })} /></div>
                            <div><label className={labelClass}>GSTIN</label><input className={inputClass} value={formData.gstin} onChange={e => setFormData({ ...formData, gstin: e.target.value })} /></div>
                            <div><label className={labelClass}>Contact Person</label><input required className={inputClass} value={formData.contactPerson} onChange={e => setFormData({ ...formData, contactPerson: e.target.value })} /></div>
                            <div><label className={labelClass}>Email</label><input type="email" required className={inputClass} value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} /></div>
                            <div><label className={labelClass}>Phone</label><input className={inputClass} value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} /></div>
                        </div>

                        <div className="pt-6 border-t border-white/10">
                            <h3 className="text-white font-bold mb-4">Address</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="col-span-2"><label className={labelClass}>Street</label><input className={inputClass} value={formData.address.street} onChange={e => setFormData({ ...formData, address: { ...formData.address, street: e.target.value } })} /></div>
                                <div><label className={labelClass}>City</label><input className={inputClass} value={formData.address.city} onChange={e => setFormData({ ...formData, address: { ...formData.address, city: e.target.value } })} /></div>
                                <div><label className={labelClass}>State</label><input className={inputClass} value={formData.address.state} onChange={e => setFormData({ ...formData, address: { ...formData.address, state: e.target.value } })} /></div>
                                <div><label className={labelClass}>Zip Code</label><input className={inputClass} value={formData.address.zipCode} onChange={e => setFormData({ ...formData, address: { ...formData.address, zipCode: e.target.value } })} /></div>
                            </div>
                        </div>

                        <div className="flex justify-end pt-4">
                            <button type="submit" className="px-8 py-3 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl font-bold shadow-lg shadow-indigo-500/25 flex items-center gap-2 transition-all">
                                <Save className="w-5 h-5" /> Save Changes
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AuroraBackground>
    );
}

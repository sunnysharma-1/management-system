'use client';

import { useState, useEffect } from 'react';
import { useMasterData, CompanyKYC } from './providers/master-data-context';
import { Building2, Mail, Phone, Globe, CreditCard, Save } from 'lucide-react';

export function CompanyKYCForm() {
    const { data, updateCompanyKYC } = useMasterData();
    const [formData, setFormData] = useState<CompanyKYC | null>(null);
    const [isSaved, setIsSaved] = useState(false);

    useEffect(() => {
        if (data.companyKYC) {
            setFormData(data.companyKYC);
        }
    }, [data.companyKYC]);

    const handleChange = (field: keyof CompanyKYC, value: string) => {
        if (!formData) return;
        setFormData({ ...formData, [field]: value });
        setIsSaved(false);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (formData) {
            updateCompanyKYC(formData);
            setIsSaved(true);
            setTimeout(() => setIsSaved(false), 3000);
        }
    };

    if (!formData) return <div>Loading...</div>;

    return (
        <div className="p-6 max-w-5xl mx-auto space-y-6 animate-fade-in">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Company KYC</h1>
                    <p className="text-muted-foreground">Manage your organization's legal and contact details</p>
                </div>
                {isSaved && (
                    <div className="bg-green-500/10 text-green-500 px-4 py-2 rounded-lg border border-green-500/20 flex items-center gap-2 animate-pulse">
                        <Save className="w-4 h-4" />
                        Saved Successfully
                    </div>
                )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Information */}
                <div className="bg-[#1f1428] border border-primary/20 rounded-xl p-6 shadow-lg shadow-primary/5">
                    <div className="flex items-center gap-3 mb-6 border-b border-gray-800 pb-4">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                            <Building2 className="w-5 h-5" />
                        </div>
                        <h2 className="text-xl font-semibold">Basic Information</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium mb-2 opacity-80">Company Name</label>
                            <input
                                type="text"
                                value={formData.companyName}
                                onChange={(e) => handleChange('companyName', e.target.value)}
                                className="w-full bg-[#130d1f] border border-gray-700 rounded-lg px-4 py-3 focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                            />
                        </div>

                        <div className="md:col-span-1">
                            <label className="block text-sm font-medium mb-2 opacity-80">Registered Address</label>
                            <textarea
                                value={formData.registeredAddress}
                                onChange={(e) => handleChange('registeredAddress', e.target.value)}
                                rows={3}
                                className="w-full bg-[#130d1f] border border-gray-700 rounded-lg px-4 py-3 focus:border-primary focus:ring-1 focus:ring-primary outline-none resize-none"
                            />
                        </div>

                        <div className="md:col-span-1">
                            <label className="block text-sm font-medium mb-2 opacity-80">Corporate Office Address</label>
                            <textarea
                                value={formData.corporateAddress}
                                onChange={(e) => handleChange('corporateAddress', e.target.value)}
                                rows={3}
                                className="w-full bg-[#130d1f] border border-gray-700 rounded-lg px-4 py-3 focus:border-primary focus:ring-1 focus:ring-primary outline-none resize-none"
                            />
                        </div>
                    </div>
                </div>

                {/* Contact Details */}
                <div className="bg-[#1f1428] border border-primary/20 rounded-xl p-6 shadow-lg shadow-primary/5">
                    <div className="flex items-center gap-3 mb-6 border-b border-gray-800 pb-4">
                        <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center text-accent">
                            <Globe className="w-5 h-5" />
                        </div>
                        <h2 className="text-xl font-semibold">Contact Details</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <label className="block text-sm font-medium mb-2 opacity-80">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-500" />
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => handleChange('email', e.target.value)}
                                    className="w-full bg-[#130d1f] border border-gray-700 rounded-lg pl-10 pr-4 py-2 focus:border-accent focus:ring-1 focus:ring-accent outline-none"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2 opacity-80">Phone Number</label>
                            <div className="relative">
                                <Phone className="absolute left-3 top-3 w-5 h-5 text-gray-500" />
                                <input
                                    type="text"
                                    value={formData.phone}
                                    onChange={(e) => handleChange('phone', e.target.value)}
                                    className="w-full bg-[#130d1f] border border-gray-700 rounded-lg pl-10 pr-4 py-2 focus:border-accent focus:ring-1 focus:ring-accent outline-none"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2 opacity-80">Website</label>
                            <div className="relative">
                                <Globe className="absolute left-3 top-3 w-5 h-5 text-gray-500" />
                                <input
                                    type="text"
                                    value={formData.website}
                                    onChange={(e) => handleChange('website', e.target.value)}
                                    className="w-full bg-[#130d1f] border border-gray-700 rounded-lg pl-10 pr-4 py-2 focus:border-accent focus:ring-1 focus:ring-accent outline-none"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Legal Information */}
                <div className="bg-[#1f1428] border border-primary/20 rounded-xl p-6 shadow-lg shadow-primary/5">
                    <div className="flex items-center gap-3 mb-6 border-b border-gray-800 pb-4">
                        <div className="w-10 h-10 rounded-lg bg-pink-500/10 flex items-center justify-center text-pink-500">
                            <CreditCard className="w-5 h-5" />
                        </div>
                        <h2 className="text-xl font-semibold">Legal Information</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div>
                            <label className="block text-sm font-medium mb-2 opacity-80">GST No</label>
                            <input
                                type="text"
                                value={formData.gstNo}
                                onChange={(e) => handleChange('gstNo', e.target.value)}
                                className="w-full bg-[#130d1f] border border-gray-700 rounded-lg px-4 py-2 focus:border-pink-500 focus:ring-1 focus:ring-pink-500 outline-none uppercase font-mono"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2 opacity-80">PAN No</label>
                            <input
                                type="text"
                                value={formData.panNo}
                                onChange={(e) => handleChange('panNo', e.target.value)}
                                className="w-full bg-[#130d1f] border border-gray-700 rounded-lg px-4 py-2 focus:border-pink-500 focus:ring-1 focus:ring-pink-500 outline-none uppercase font-mono"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2 opacity-80">CIN No</label>
                            <input
                                type="text"
                                value={formData.cinNo}
                                onChange={(e) => handleChange('cinNo', e.target.value)}
                                className="w-full bg-[#130d1f] border border-gray-700 rounded-lg px-4 py-2 focus:border-pink-500 focus:ring-1 focus:ring-pink-500 outline-none uppercase font-mono"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2 opacity-80">TAN No</label>
                            <input
                                type="text"
                                value={formData.tanNo}
                                onChange={(e) => handleChange('tanNo', e.target.value)}
                                className="w-full bg-[#130d1f] border border-gray-700 rounded-lg px-4 py-2 focus:border-pink-500 focus:ring-1 focus:ring-pink-500 outline-none uppercase font-mono"
                            />
                        </div>
                    </div>
                </div>

                <div className="flex justify-end pt-4">
                    <button
                        type="submit"
                        className="bg-gradient-to-r from-primary to-accent text-white px-8 py-3 rounded-lg font-bold shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 flex items-center gap-2"
                    >
                        <Save className="w-5 h-5" />
                        Save Company Details
                    </button>
                </div>
            </form>
        </div>
    );
}

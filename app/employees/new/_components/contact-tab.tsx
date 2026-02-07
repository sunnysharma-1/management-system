'use client';

import { Phone, MapPin } from 'lucide-react';

interface ContactTabProps {
    formData: any;
    setFormData: (data: any) => void;
}

export function ContactTab({ formData, setFormData }: ContactTabProps) {
    const handleChange = (field: string, value: any) => {
        setFormData({ ...formData, [field]: value });
    };

    return (
        <div className="space-y-6">
            <div className="bg-card/40 backdrop-blur border border-white/10 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-green-500/10 rounded-lg text-green-400"><Phone className="w-5 h-5" /></div>
                    <h2 className="text-lg font-semibold">Contact Details</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Mobile No. (Self) <span className="text-red-400">*</span></label>
                        <input type="tel" className="w-full bg-background/50 border border-white/10 rounded-lg px-4 py-2 focus:ring-2 ring-primary/50 outline-none"
                            value={formData.phone} onChange={e => handleChange('phone', e.target.value)}
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Mobile No. (Home)</label>
                        <input type="tel" className="w-full bg-background/50 border border-white/10 rounded-lg px-4 py-2 focus:ring-2 ring-primary/50 outline-none"
                            value={formData.homePhone} onChange={e => handleChange('homePhone', e.target.value)}
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Email Address</label>
                        <input type="email" className="w-full bg-background/50 border border-white/10 rounded-lg px-4 py-2 focus:ring-2 ring-primary/50 outline-none"
                            value={formData.email} onChange={e => handleChange('email', e.target.value)}
                        />
                    </div>
                </div>
            </div>

            <div className="bg-card/40 backdrop-blur border border-white/10 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-amber-500/10 rounded-lg text-amber-400"><MapPin className="w-5 h-5" /></div>
                    <h2 className="text-lg font-semibold">Address Details</h2>
                </div>

                {/* Present Address */}
                <div className="space-y-4 mb-8">
                    <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Present / Local Address</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div className="col-span-1 md:col-span-2 lg:col-span-3 space-y-2">
                            <label className="text-sm font-medium">Full Address</label>
                            <input type="text" className="w-full bg-background/50 border border-white/10 rounded-lg px-4 py-2 focus:ring-2 ring-primary/50 outline-none"
                                value={formData.presentAddress} onChange={e => handleChange('presentAddress', e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">State</label>
                            <input type="text" className="w-full bg-background/50 border border-white/10 rounded-lg px-4 py-2 focus:ring-2 ring-primary/50 outline-none"
                                value={formData.presentState} onChange={e => handleChange('presentState', e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">District</label>
                            <input type="text" className="w-full bg-background/50 border border-white/10 rounded-lg px-4 py-2 focus:ring-2 ring-primary/50 outline-none"
                                value={formData.presentDistrict} onChange={e => handleChange('presentDistrict', e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Pin Code</label>
                            <input type="text" className="w-full bg-background/50 border border-white/10 rounded-lg px-4 py-2 focus:ring-2 ring-primary/50 outline-none"
                                value={formData.presentPin} onChange={e => handleChange('presentPin', e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                {/* Permanent Address */}
                <div className="space-y-4">
                    <div className="flex items-center gap-2">
                        <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Permanent Address</h3>
                        <label className="flex items-center gap-2 text-xs cursor-pointer">
                            <input type="checkbox" className="rounded border-white/20 bg-white/5"
                                checked={formData.sameAsPresent}
                                onChange={(e) => {
                                    const checked = e.target.checked;
                                    handleChange('sameAsPresent', checked);
                                    if (checked) {
                                        handleChange('permanentAddress', formData.presentAddress);
                                        handleChange('permanentState', formData.presentState);
                                        handleChange('permanentDistrict', formData.presentDistrict);
                                        handleChange('permanentPin', formData.presentPin);
                                    }
                                }}
                            />
                            Same as Present
                        </label>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div className="col-span-1 md:col-span-2 lg:col-span-3 space-y-2">
                            <label className="text-sm font-medium">Full Address</label>
                            <input type="text" className="w-full bg-background/50 border border-white/10 rounded-lg px-4 py-2 focus:ring-2 ring-primary/50 outline-none"
                                value={formData.permanentAddress} onChange={e => handleChange('permanentAddress', e.target.value)}
                                disabled={formData.sameAsPresent}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">State</label>
                            <input type="text" className="w-full bg-background/50 border border-white/10 rounded-lg px-4 py-2 focus:ring-2 ring-primary/50 outline-none"
                                value={formData.permanentState} onChange={e => handleChange('permanentState', e.target.value)}
                                disabled={formData.sameAsPresent}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">District</label>
                            <input type="text" className="w-full bg-background/50 border border-white/10 rounded-lg px-4 py-2 focus:ring-2 ring-primary/50 outline-none"
                                value={formData.permanentDistrict} onChange={e => handleChange('permanentDistrict', e.target.value)}
                                disabled={formData.sameAsPresent}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Pin Code</label>
                            <input type="text" className="w-full bg-background/50 border border-white/10 rounded-lg px-4 py-2 focus:ring-2 ring-primary/50 outline-none"
                                value={formData.permanentPin} onChange={e => handleChange('permanentPin', e.target.value)}
                                disabled={formData.sameAsPresent}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

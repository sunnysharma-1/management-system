'use client';

import { User, Ruler } from 'lucide-react';

interface PersonalTabProps {
    formData: any;
    setFormData: (data: any) => void;
}

export function PersonalTab({ formData, setFormData }: PersonalTabProps) {
    const handleChange = (field: string, value: any) => {
        setFormData({ ...formData, [field]: value });
    };

    return (
        <div className="space-y-6">
            {/* Basic Details */}
            <div className="bg-card/40 backdrop-blur border border-white/10 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400"><User className="w-5 h-5" /></div>
                    <h2 className="text-lg font-semibold">Basic Information</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">First Name <span className="text-red-400">*</span></label>
                        <input type="text" className="w-full bg-background/50 border border-white/10 rounded-lg px-4 py-2 focus:ring-2 ring-primary/50 outline-none"
                            value={formData.firstName} onChange={e => handleChange('firstName', e.target.value)}
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Middle Name</label>
                        <input type="text" className="w-full bg-background/50 border border-white/10 rounded-lg px-4 py-2 focus:ring-2 ring-primary/50 outline-none"
                            value={formData.middleName} onChange={e => handleChange('middleName', e.target.value)}
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Last Name <span className="text-red-400">*</span></label>
                        <input type="text" className="w-full bg-background/50 border border-white/10 rounded-lg px-4 py-2 focus:ring-2 ring-primary/50 outline-none"
                            value={formData.lastName} onChange={e => handleChange('lastName', e.target.value)}
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Father's Name</label>
                        <input type="text" className="w-full bg-background/50 border border-white/10 rounded-lg px-4 py-2 focus:ring-2 ring-primary/50 outline-none"
                            value={formData.fatherName} onChange={e => handleChange('fatherName', e.target.value)}
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Mother's Name</label>
                        <input type="text" className="w-full bg-background/50 border border-white/10 rounded-lg px-4 py-2 focus:ring-2 ring-primary/50 outline-none"
                            value={formData.motherName} onChange={e => handleChange('motherName', e.target.value)}
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Date of Birth <span className="text-red-400">*</span></label>
                        <input type="date" className="w-full bg-background/50 border border-white/10 rounded-lg px-4 py-2 focus:ring-2 ring-primary/50 outline-none"
                            value={formData.dob} onChange={e => handleChange('dob', e.target.value)}
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Gender <span className="text-red-400">*</span></label>
                        <select className="w-full bg-background/50 border border-white/10 rounded-lg px-4 py-2 focus:ring-2 ring-primary/50 outline-none"
                            value={formData.gender} onChange={e => handleChange('gender', e.target.value)}
                        >
                            <option value="">Select Gender</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Marital Status</label>
                        <select className="w-full bg-background/50 border border-white/10 rounded-lg px-4 py-2 focus:ring-2 ring-primary/50 outline-none"
                            value={formData.maritalStatus} onChange={e => handleChange('maritalStatus', e.target.value)}
                        >
                            <option value="">Select Status</option>
                            <option value="Single">Single</option>
                            <option value="Married">Married</option>
                            <option value="Divorced">Divorced</option>
                            <option value="Widowed">Widowed</option>
                        </select>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Wife/Husband Name</label>
                        <input type="text" className="w-full bg-background/50 border border-white/10 rounded-lg px-4 py-2 focus:ring-2 ring-primary/50 outline-none"
                            value={formData.spouseName} onChange={e => handleChange('spouseName', e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {/* Physical Standards */}
            <div className="bg-card/40 backdrop-blur border border-white/10 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-pink-500/10 rounded-lg text-pink-400"><Ruler className="w-5 h-5" /></div>
                    <h2 className="text-lg font-semibold">Physical Standards & Uniform</h2>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Height (cm)</label>
                        <input type="number" className="w-full bg-background/50 border border-white/10 rounded-lg px-4 py-2 focus:ring-2 ring-primary/50 outline-none"
                            value={formData.height} onChange={e => handleChange('height', e.target.value)}
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Weight (kg)</label>
                        <input type="number" className="w-full bg-background/50 border border-white/10 rounded-lg px-4 py-2 focus:ring-2 ring-primary/50 outline-none"
                            value={formData.weight} onChange={e => handleChange('weight', e.target.value)}
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Blood Group</label>
                        <select className="w-full bg-background/50 border border-white/10 rounded-lg px-4 py-2 focus:ring-2 ring-primary/50 outline-none"
                            value={formData.bloodGroup} onChange={e => handleChange('bloodGroup', e.target.value)}
                        >
                            <option value="">Select</option>
                            <option value="A+">A+</option>
                            <option value="A-">A-</option>
                            <option value="B+">B+</option>
                            <option value="B-">B-</option>
                            <option value="O+">O+</option>
                            <option value="O-">O-</option>
                            <option value="AB+">AB+</option>
                            <option value="AB-">AB-</option>
                        </select>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Identification Mark</label>
                        <input type="text" className="w-full bg-background/50 border border-white/10 rounded-lg px-4 py-2 focus:ring-2 ring-primary/50 outline-none"
                            value={formData.identificationMark} onChange={e => handleChange('identificationMark', e.target.value)}
                        />
                    </div>

                    {/* Uniform Sizes */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Shirt Size</label>
                        <select className="w-full bg-background/50 border border-white/10 rounded-lg px-4 py-2 focus:ring-2 ring-primary/50 outline-none"
                            value={formData.shirtSize} onChange={e => handleChange('shirtSize', e.target.value)}
                        >
                            <option value="">Select</option>
                            <option value="S">S</option>
                            <option value="M">M</option>
                            <option value="L">L</option>
                            <option value="XL">XL</option>
                            <option value="XXL">XXL</option>
                        </select>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Trouser Size</label>
                        <input type="number" placeholder="inches" className="w-full bg-background/50 border border-white/10 rounded-lg px-4 py-2 focus:ring-2 ring-primary/50 outline-none"
                            value={formData.trouserSize} onChange={e => handleChange('trouserSize', e.target.value)}
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Shoe Size</label>
                        <input type="number" className="w-full bg-background/50 border border-white/10 rounded-lg px-4 py-2 focus:ring-2 ring-primary/50 outline-none"
                            value={formData.shoeSize} onChange={e => handleChange('shoeSize', e.target.value)}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

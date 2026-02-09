'use client';

import { User, Ruler, Loader2, Download, Search } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface PersonalTabProps {
    formData: any;
    setFormData: (data: any) => void;
}

export function PersonalTab({ formData, setFormData }: PersonalTabProps) {
    const { toast } = useToast();
    const [fetchingAadhar, setFetchingAadhar] = useState(false);

    const handleChange = (field: string, value: any) => {
        setFormData({ ...formData, [field]: value });
    };

    const handleFetchAadhar = async () => {
        if (!formData.aadharNo || formData.aadharNo.length < 12) {
            toast({
                title: "Invalid Aadhar Number",
                description: "Please enter a valid 12-digit Aadhar number.",
                variant: "destructive",
            });
            return;
        }

        setFetchingAadhar(true);

        // Simulate API call
        setTimeout(() => {
            setFetchingAadhar(false);

            // Mock Data
            const mockData = {
                firstName: "Rahul",
                lastName: "Verma",
                gender: "Male",
                dob: "1995-08-15",
                fatherName: "Suresh Verma",
                presentAddress: "Flat 402, Sunshine Apartments, Sector 62",
                presentState: "Uttar Pradesh",
                presentDistrict: "Noida",
                presentPin: "201309",
                permanentAddress: "House No. 12, Civil Lines",
                permanentState: "Uttar Pradesh",
                permanentDistrict: "Lucknow",
                permanentPin: "226001",
                height: "175",
                weight: "72",
                bloodGroup: "B+",
                identificationMark: "Mole on right cheek",
                shirtSize: "L",
                trouserSize: "32",
                shoeSize: "9",
            };

            setFormData({
                ...formData,
                ...mockData,
                sameAsPresent: false
            });

            toast({
                title: "Details Fetched Successfully",
                description: `Auto-filled details for ${mockData.firstName} ${mockData.lastName}.`,
            });

        }, 1500);
    };

    return (
        <div className="space-y-6">
            {/* Quick Fill Section */}
            <div className="bg-gradient-to-r from-blue-600/10 to-purple-600/10 border border-blue-500/20 rounded-2xl p-6">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-blue-500/20 rounded-xl">
                        <Search className="w-6 h-6 text-blue-400" />
                    </div>
                    <div className="flex-1">
                        <h3 className="text-lg font-semibold text-blue-100">Quick Fill with Aadhar</h3>
                        <p className="text-sm text-blue-300/70">Enter Aadhar number to auto-populate Personal & Physical details.</p>
                    </div>
                </div>
                <div className="mt-4 flex gap-3 max-w-md">
                    <input
                        type="text"
                        className="flex-1 bg-background/50 border border-white/10 rounded-lg px-4 py-2 font-mono placeholder:text-muted-foreground focus:ring-2 ring-blue-500/50 outline-none"
                        value={formData.aadharNo || ''}
                        onChange={e => handleChange('aadharNo', e.target.value)}
                        placeholder="Enter 12-digit Aadhar (e.g. 123456789012)"
                        maxLength={14}
                    />
                    <Button
                        onClick={handleFetchAadhar}
                        disabled={fetchingAadhar || !formData.aadharNo}
                        className="bg-blue-600 hover:bg-blue-700"
                    >
                        {fetchingAadhar ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Download className="w-4 h-4 mr-2" />}
                        {fetchingAadhar ? 'Fetching...' : 'Auto-fill'}
                    </Button>
                </div>
            </div>

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

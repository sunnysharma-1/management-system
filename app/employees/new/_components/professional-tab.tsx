'use client';

import { Briefcase, Building2, Landmark, BadgeCheck, Loader2, Download } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface ProfessionalTabProps {
    formData: any;
    setFormData: (data: any) => void;
}

export function ProfessionalTab({ formData, setFormData }: ProfessionalTabProps) {
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

            // Mock Data - In real app, this comes from API
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
                // Physical Standards
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
                sameAsPresent: false // Reset strict mapping if data fetched is different
            });

            toast({
                title: "Details Fetched Successfully",
                description: `Auto-filled details for ${mockData.firstName} ${mockData.lastName} from Aadhar database.`,
            });

        }, 1500);
    };

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Employment Details */}
                <div className="bg-card/40 backdrop-blur border border-white/10 rounded-2xl p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-purple-500/10 rounded-lg text-purple-400"><Briefcase className="w-5 h-5" /></div>
                        <h2 className="text-lg font-semibold">Employment Details</h2>
                    </div>
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Employee Code <span className="text-red-400">*</span></label>
                            <input type="text" className="w-full bg-background/50 border border-white/10 rounded-lg px-4 py-2 font-mono"
                                value={formData.employeeId} onChange={e => handleChange('employeeId', e.target.value)}
                                placeholder="EMP-XXXX"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Date of Joining <span className="text-red-400">*</span></label>
                            <input type="date" className="w-full bg-background/50 border border-white/10 rounded-lg px-4 py-2"
                                value={formData.joiningDate} onChange={e => handleChange('joiningDate', e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Department</label>
                            <select className="w-full bg-background/50 border border-white/10 rounded-lg px-4 py-2"
                                value={formData.department} onChange={e => handleChange('department', e.target.value)}
                            >
                                <option value="Security">Security</option>
                                <option value="Admin">Admin</option>
                                <option value="Operations">Operations</option>
                                <option value="Housekeeping">Housekeeping</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Designation</label>
                            <input type="text" className="w-full bg-background/50 border border-white/10 rounded-lg px-4 py-2"
                                value={formData.designation} onChange={e => handleChange('designation', e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Status</label>
                            <select className="w-full bg-background/50 border border-white/10 rounded-lg px-4 py-2"
                                value={formData.status} onChange={e => handleChange('status', e.target.value)}
                            >
                                <option value="Active">Active</option>
                                <option value="Inactive">Inactive</option>
                                <option value="On Leave">On Leave</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Bank Details */}
                <div className="bg-card/40 backdrop-blur border border-white/10 rounded-2xl p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-indigo-500/10 rounded-lg text-indigo-400"><Landmark className="w-5 h-5" /></div>
                        <h2 className="text-lg font-semibold">Bank Account</h2>
                    </div>
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Account Number</label>
                            <input type="text" className="w-full bg-background/50 border border-white/10 rounded-lg px-4 py-2 font-mono"
                                value={formData.accountNumber} onChange={e => handleChange('accountNumber', e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">IFSC Code</label>
                            <input type="text" className="w-full bg-background/50 border border-white/10 rounded-lg px-4 py-2 font-mono uppercase"
                                value={formData.ifscCode} onChange={e => handleChange('ifscCode', e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Bank Name</label>
                            <input type="text" className="w-full bg-background/50 border border-white/10 rounded-lg px-4 py-2"
                                value={formData.bankName} onChange={e => handleChange('bankName', e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Branch Name</label>
                            <input type="text" className="w-full bg-background/50 border border-white/10 rounded-lg px-4 py-2"
                                value={formData.bankBranch} onChange={e => handleChange('bankBranch', e.target.value)}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Statutory Details */}
            <div className="bg-card/40 backdrop-blur border border-white/10 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-red-500/10 rounded-lg text-red-400"><BadgeCheck className="w-5 h-5" /></div>
                    <div className="flex-1">
                        <h2 className="text-lg font-semibold">Statutory & ID Proofs</h2>
                        <p className="text-xs text-muted-foreground">Enter Aadhar to auto-fill personal details.</p>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Aadhar Number <span className="text-red-400">*</span></label>
                        <div className="flex gap-2">
                            <input type="text" className="w-full bg-background/50 border border-white/10 rounded-lg px-4 py-2 font-mono"
                                value={formData.aadharNo} onChange={e => handleChange('aadharNo', e.target.value)}
                                placeholder="1234 5678 9012"
                                maxLength={14}
                            />
                            <Button
                                onClick={handleFetchAadhar}
                                disabled={fetchingAadhar || !formData.aadharNo}
                                variant="secondary"
                                className="shrink-0"
                            >
                                {fetchingAadhar ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4 mr-1" />}
                                {fetchingAadhar ? 'Wait' : 'Fetch'}
                            </Button>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">PAN Number</label>
                        <input type="text" className="w-full bg-background/50 border border-white/10 rounded-lg px-4 py-2 font-mono uppercase"
                            value={formData.panNo} onChange={e => handleChange('panNo', e.target.value)}
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">UAN Number</label>
                        <input type="text" className="w-full bg-background/50 border border-white/10 rounded-lg px-4 py-2 font-mono"
                            value={formData.uanNo} onChange={e => handleChange('uanNo', e.target.value)}
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">ESIC IP Number</label>
                        <input type="text" className="w-full bg-background/50 border border-white/10 rounded-lg px-4 py-2 font-mono"
                            value={formData.esicNo} onChange={e => handleChange('esicNo', e.target.value)}
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">PF Number</label>
                        <input type="text" className="w-full bg-background/50 border border-white/10 rounded-lg px-4 py-2 font-mono"
                            value={formData.pfNo} onChange={e => handleChange('pfNo', e.target.value)}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

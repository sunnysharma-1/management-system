'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, Search, User, Phone, Briefcase, FileText, IndianRupee, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { PersonalTab } from './_components/personal-tab';
import { ContactTab } from './_components/contact-tab';
import { ProfessionalTab } from './_components/professional-tab';
import { DocumentsTab } from './_components/documents-tab';
import { SalaryTab } from './_components/salary-tab';

export default function NewEmployeePage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeTab, setActiveTab] = useState('personal');

    // MOCK DATA for Search
    const mockEmployee = {
        firstName: 'Sunny', lastName: 'Sharma', email: 'sunny@example.com', phone: '9876543210',
        dob: '1995-08-15', gender: 'Male', maritalStatus: 'Single', spouseName: '',
        height: '175', weight: '70', bloodGroup: 'O+', identificationMark: 'Mole on neck',
        shirtSize: 'M', trouserSize: '32', shoeSize: '9',
        presentAddress: '123 Main St', presentState: 'Delhi', presentDistrict: 'New Delhi', presentPin: '110001',
        permanentAddress: '123 Main St', permanentState: 'Delhi', permanentDistrict: 'New Delhi', permanentPin: '110001', sameAsPresent: true,
        employeeId: 'EMP-001', joiningDate: '2023-01-01', department: 'Admin', designation: 'Manager', status: 'Active',
        accountNumber: '1234567890', ifscCode: 'SBIN0001234', bankName: 'SBI', bankBranch: 'CP Branch',
        aadharNo: '1234-5678-9012', panNo: 'ABCDE1234F', uanNo: '100000000000', pfNo: 'DL/CPM/1234567/000/0000123', esicNo: '1000000000',
        grossSalary: 50000,
        salaryDetails: {
            basic: 25000, da: 5000, hra: 10000, conveyance: 2000, washing: 1000, uniform: 1000,
            special: 5000, training: 1000, roomRent: 0, medical: 0, leave: 0, bonus: 0, gratuity: 0,
            otRate: 100, otHrsRate: 200,
            pfPercent: 12, pfAmount: 1800, esicPercent: 0.75, esicAmount: 200, tds: 500, deathBenefit: 0, otherDeduction: 0
        }
    };

    const emptyForm = {
        firstName: '', middleName: '', lastName: '', fatherName: '', motherName: '', email: '',
        dob: '', gender: '', maritalStatus: '', spouseName: '',
        height: '', weight: '', bloodGroup: '', identificationMark: '',
        shirtSize: '', trouserSize: '', shoeSize: '',
        phone: '', homePhone: '',
        presentAddress: '', presentState: '', presentDistrict: '', presentPin: '',
        permanentAddress: '', permanentState: '', permanentDistrict: '', permanentPin: '', sameAsPresent: false,
        employeeId: '', joiningDate: '', department: 'Security', designation: 'Guard', status: 'Active',
        accountNumber: '', ifscCode: '', bankName: '', bankBranch: '',
        aadharNo: '', panNo: '', uanNo: '', pfNo: '', esicNo: '',
        grossSalary: 0,
        salaryDetails: {
            basic: 0, da: 0, hra: 0, conveyance: 0, washing: 0, uniform: 0,
            special: 0, training: 0, roomRent: 0, medical: 0, leave: 0, bonus: 0, gratuity: 0,
            otRate: 0, otHrsRate: 0,
            pfPercent: 0, pfAmount: 0, esicPercent: 0, esicAmount: 0, tds: 0, deathBenefit: 0, otherDeduction: 0
        }
    };

    const [formData, setFormData] = useState(emptyForm);

    const handleSearch = () => {
        // Mock API Call
        if (searchQuery === 'EMP-001') {
            setFormData(mockEmployee);
            alert("Employee Found: Sunny Sharma");
        } else {
            alert("Employee not found. Please try 'EMP-001'");
        }
    };

    const handleReset = () => {
        setFormData(emptyForm);
        setSearchQuery('');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        // TODO: Integrate API call
        console.log("Submitting:", formData);

        // Simulate API delay
        setTimeout(() => {
            setIsLoading(false);
            router.push('/employees');
        }, 1000);
    };

    const tabs = [
        { id: 'personal', label: 'Personal & Physical', icon: User },
        { id: 'contact', label: 'Contact & Address', icon: Phone },
        { id: 'professional', label: 'Professional & Stat', icon: Briefcase },
        { id: 'documents', label: 'Documents', icon: FileText },
        { id: 'salary', label: 'Salary Structure', icon: IndianRupee },
    ];

    return (
        <div className="h-full overflow-y-auto bg-slate-950 text-slate-100">
            {/* Top Navigation Bar */}
            <div className="bg-slate-900/50 backdrop-blur border-b border-white/10 sticky top-0 z-50 px-8 py-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button onClick={() => router.back()} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                        <ArrowLeft className="w-6 h-6" />
                    </button>
                    <div>
                        <h1 className="text-xl font-bold">Manage Employee</h1>
                        <p className="text-xs text-muted-foreground">Add New or Edit Existing</p>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search by EMP Code..."
                            className="bg-slate-800 border border-white/10 rounded-full pl-10 pr-4 py-2 text-sm w-64 focus:ring-2 ring-primary/50 outline-none"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                        />
                        <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                    </div>
                    <button onClick={handleSearch} className="p-2 bg-primary/20 hover:bg-primary/30 text-primary rounded-full transition-colors">
                        <Search className="w-5 h-5" />
                    </button>
                    <button onClick={handleReset} className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-full transition-colors" title="Reset Form">
                        <RefreshCw className="w-5 h-5" />
                    </button>
                </div>
            </div>

            <div className="max-w-7xl mx-auto p-8">
                {/* Tabs Navigation */}
                <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2 scrollbar-hide">
                    {tabs.map((tab) => {
                        const Icon = tab.icon;
                        const isActive = activeTab === tab.id;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-2 px-6 py-3 rounded-full text-sm font-medium transition-all whitespace-nowrap
                                    ${isActive
                                        ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/25'
                                        : 'bg-card/50 hover:bg-card text-muted-foreground hover:text-foreground border border-white/5'
                                    }`}
                            >
                                <Icon className="w-4 h-4" />
                                {tab.label}
                            </button>
                        );
                    })}
                </div>

                {/* Main Form Content */}
                <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="min-h-[500px]"
                >
                    {activeTab === 'personal' && <PersonalTab formData={formData} setFormData={setFormData} />}
                    {activeTab === 'contact' && <ContactTab formData={formData} setFormData={setFormData} />}
                    {activeTab === 'professional' && <ProfessionalTab formData={formData} setFormData={setFormData} />}
                    {activeTab === 'documents' && <DocumentsTab formData={formData} setFormData={setFormData} />}
                    {activeTab === 'salary' && <SalaryTab formData={formData} setFormData={setFormData} />}
                </motion.div>

                {/* Footer Action */}
                <div className="mt-12 flex justify-end gap-4 border-t border-white/10 pt-6">
                    <button
                        onClick={() => router.back()}
                        className="px-8 py-3 rounded-xl border border-white/10 hover:bg-white/5 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={isLoading}
                        className="px-8 py-3 bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90 text-white rounded-xl font-bold shadow-lg shadow-primary/25 flex items-center gap-2"
                    >
                        {isLoading ? 'Saving...' : <><Save className="w-5 h-5" /> Save Employee Record</>}
                    </button>
                </div>
            </div>
        </div>
    );
}

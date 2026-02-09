'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
    Building2, MapPin, Briefcase, FileText,
    Save, ArrowLeft, Loader2, CheckCircle,
    PlusCircle, Search, ChevronDown, User, Shield, CreditCard
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { AuroraBackground } from '@/components/ui/aurora-background';
import { api } from '@/lib/api';
// Use Tabs for organization? Or just sections. Tabs are cleaner for this amount of fields.
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function NewClientUnitPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    // Existing Clients
    const [existingClients, setExistingClients] = useState<any[]>([]);
    const [filteredClients, setFilteredClients] = useState<any[]>([]);
    const [showClientDropdown, setShowClientDropdown] = useState(false);

    // Selection State
    const [selectedClientId, setSelectedClientId] = useState('');
    const [clientNameInput, setClientNameInput] = useState('');
    const [isNewClient, setIsNewClient] = useState(false);

    // New Client Extra Fields (Required if creating new)
    const [newClientDetails, setNewClientDetails] = useState({
        clientCode: '',
        contactPerson: '',
        email: '',
        gstin: '',
        phone: '',
        address: { street: '', city: '', state: '', zipCode: '', country: 'India' }
    });

    // Expanded Unit Form Data
    const emptyUnitForm = {
        // Identification
        unitName: '', // Shipped To
        unitCode: '',
        oldUnitCode: '',
        printName: '', // Billed To

        // Addresses & Location
        shippingAddress: '',
        billingAddress: '',
        billingFromState: '',
        billingToState: '',
        placeOfSupply: '',
        placeOfSupplyAddress: '',
        district: '',
        pinCode: '',
        region: '',
        gstin: '', // Billing GSTIN
        stateOffice: '',
        fieldArea: '',

        // Contact
        attention: '',
        phone: '',
        fax: '',
        email: '',
        website: '',

        // Agreement & Work Order
        workOrderNo: '',
        workOrderDate: '',
        workStartDate: '',
        workCompletionDate: '',
        agreementNo: '',
        agreementDate: '',
        agreementExpDate: '',
        renewalLetterDate: '',

        // Employee Setup
        noOfEmployees: '' as any,
        minAge: '' as any,
        maxAge: '' as any,
        leaveOpening: '' as any,
        showLeaveOnPaySlip: false,
        isUniformFree: false,
        bonusPaidInMonth: '',

        // Department Contacts
        accountsOfficer: { name: '', designation: '', phone: '', mobile: '', email: '' },
        operationDepartment: { name: '', designation: '', phone: '', mobile: '', email: '' },

        // Statutory & Compliance
        panCardNo: '',
        tanNo: '',
        tinNo: '',
        serviceTaxNo: '',
        pfCode: '',
        esicCode: '',
        professionalTaxRegNo: '',
        roc: '',
        wagesRevision: '',
        controller: '',
        salaryTransferredBy: '',
        gstCategory: '',
        vendorCode: '',

        // Billing Config
        billType: 'Muster',
        billGenerateType: 'Invoice',
        printFormat: 'Std',
        bank: '',
        isGstApplicable: true,
        isIgstApplicable: false,
        isUnionTerritory: false,
        systemBilling: false,
        billingInDecimal: false,
        contractPeriodShown: '',

        remarks: '',
        natureOfService: '', // Kept
        rateStructure: '', // Kept as string

        // Retain address object for backward compatibility/API requirements if strictly validated
        // For UI we use flattened inputs but populate this on submit if needed
        address: { street: '', city: '', state: '', zipCode: '', country: 'India' }
    };
    const [unitForm, setUnitForm] = useState(emptyUnitForm);
    const [activeTab, setActiveTab] = useState("basic");

    useEffect(() => {
        fetchClients();
    }, []);

    const fetchClients = async () => {
        try {
            const res = await api.getClients();
            setExistingClients(res);
            setFilteredClients(res);
        } catch (error) {
            console.error("Failed to fetch clients", error);
        }
    };

    // Filter Logic
    useEffect(() => {
        if (!clientNameInput) {
            setFilteredClients(existingClients);
            return;
        }
        const filtered = existingClients.filter(c =>
            c.companyName.toLowerCase().includes(clientNameInput.toLowerCase()) ||
            c.clientCode.toLowerCase().includes(clientNameInput.toLowerCase())
        );
        setFilteredClients(filtered);
    }, [clientNameInput, existingClients]);


    const handleClientSelect = (client: any) => {
        setClientNameInput(client.companyName);
        setSelectedClientId(client._id);
        setIsNewClient(false);
        setShowClientDropdown(false);
    };

    const handleCreateNewClient = () => {
        setSelectedClientId('');
        setIsNewClient(true);
        setShowClientDropdown(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            let finalClientId = selectedClientId;

            // Scenario 1: Create New Client First
            if (isNewClient || !selectedClientId) {
                if (!clientNameInput) throw new Error("Client Name is required");

                const clientPayload = {
                    companyName: clientNameInput,
                    ...newClientDetails,
                    status: 'Active'
                };

                const newClientRes = await api.createClient(clientPayload);
                finalClientId = newClientRes._id;
            }

            if (!finalClientId) throw new Error("Could not determine Client ID");

            // Sync legacy address object if needed (from shipping/billing fields)
            const submissionData = {
                ...unitForm,
                address: {
                    street: unitForm.shippingAddress,
                    city: unitForm.district, // Approximate mapping
                    state: unitForm.billingToState,
                    zipCode: unitForm.pinCode,
                    country: 'India'
                }
            };

            await api.addUnit(finalClientId, submissionData);

            alert("Site Unit Added Successfully!");
            router.push('/clients/list');

        } catch (error: any) {
            console.error(error);
            alert(`Failed: ${error.message || 'Unknown error'}`);
        } finally {
            setLoading(false);
        }
    };

    // Helper for input classes
    const inputClass = "w-full bg-slate-950/50 border border-white/10 rounded-xl px-4 py-3 focus:ring-2 ring-emerald-500/50 outline-none text-white transition-all";
    const labelClass = "text-sm font-medium text-white/80 block mb-2";

    return (
        <AuroraBackground className="flex flex-col">
            <div className="h-full overflow-y-auto w-full p-8">
                <div className="max-w-6xl mx-auto space-y-8">

                    {/* Header */}
                    <div className="flex items-center gap-4">
                        <button onClick={() => router.back()} className="p-2 hover:bg-white/10 rounded-full transition-colors text-white">
                            <ArrowLeft className="w-6 h-6" />
                        </button>
                        <div>
                            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">
                                Unit Master
                            </h1>
                            <p className="text-muted-foreground">Add new site units and configure appointment rules.</p>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-8 pb-20">

                        {/* ---------------- CLIENT SELECTION (Condensed) ---------------- */}
                        <div className="bg-card/40 backdrop-blur border border-white/10 rounded-2xl p-6 relative z-20">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-2 bg-indigo-500/10 rounded-lg text-indigo-400"><Building2 className="w-5 h-5" /></div>
                                <h2 className="text-lg font-semibold text-white">Client Selection</h2>
                            </div>

                            <div className="max-w-xl relative">
                                <label className={labelClass}>Client Name <span className="text-red-400">*</span></label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        className={inputClass}
                                        value={clientNameInput}
                                        onChange={e => {
                                            setClientNameInput(e.target.value);
                                            setSelectedClientId('');
                                            setIsNewClient(true);
                                            setShowClientDropdown(true);
                                        }}
                                        onFocus={() => setShowClientDropdown(true)}
                                        placeholder="Search or Create New Client..."
                                        required
                                    />
                                    <ChevronDown className="w-4 h-4 text-muted-foreground absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                                </div>

                                {/* Dropdown Logic same as before... */}
                                {showClientDropdown && clientNameInput && (
                                    <div className="absolute top-full left-0 right-0 mt-2 bg-slate-900 border border-white/10 rounded-xl shadow-xl max-h-60 overflow-y-auto z-50">
                                        {filteredClients.map(client => (
                                            <div key={client._id} onClick={() => handleClientSelect(client)} className="px-4 py-3 hover:bg-white/5 cursor-pointer flex items-center justify-between group">
                                                <span className="text-white group-hover:text-indigo-300">{client.companyName}</span>
                                                <span className="text-xs text-muted-foreground bg-white/5 px-2 py-1 rounded">{client.clientCode}</span>
                                            </div>
                                        ))}
                                        <div onClick={handleCreateNewClient} className="px-4 py-3 border-t border-white/5 hover:bg-indigo-500/10 cursor-pointer text-indigo-400 font-medium flex items-center gap-2">
                                            <PlusCircle className="w-4 h-4" /> Create "{clientNameInput}" as New Client
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* New Client Inline Form (Simplified) */}
                            <AnimatePresence>
                                {isNewClient && (
                                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="mt-4 overflow-hidden">
                                        <div className="bg-indigo-500/5 rounded-xl p-4 border border-indigo-500/10 grid grid-cols-1 md:grid-cols-3 gap-4">
                                            <div><label className="text-xs uppercase font-bold text-muted-foreground">Code *</label><input required type="text" className="w-full bg-slate-950/50 border border-white/10 rounded-lg px-3 py-2 text-sm text-white uppercase" value={newClientDetails.clientCode} onChange={e => setNewClientDetails({ ...newClientDetails, clientCode: e.target.value })} /></div>
                                            <div><label className="text-xs uppercase font-bold text-muted-foreground">Contact *</label><input required type="text" className="w-full bg-slate-950/50 border border-white/10 rounded-lg px-3 py-2 text-sm text-white" value={newClientDetails.contactPerson} onChange={e => setNewClientDetails({ ...newClientDetails, contactPerson: e.target.value })} /></div>
                                            <div><label className="text-xs uppercase font-bold text-muted-foreground">Email *</label><input required type="email" className="w-full bg-slate-950/50 border border-white/10 rounded-lg px-3 py-2 text-sm text-white" value={newClientDetails.email} onChange={e => setNewClientDetails({ ...newClientDetails, email: e.target.value })} /></div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>


                        {/* ---------------- 2. EXPANDED UNIT FORM ---------------- */}
                        <div className="bg-card/40 backdrop-blur border border-white/10 rounded-2xl p-6 relative z-10">

                            {/* TABS NAVIGATION */}
                            <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
                                {[
                                    { id: 'basic', label: 'Basic Info & Address', icon: MapPin },
                                    { id: 'agreement', label: 'Agreement & Rules', icon: FileText },
                                    { id: 'contacts', label: 'Department Contacts', icon: User },
                                    { id: 'statutory', label: 'Statutory & Billing', icon: Shield },
                                ].map(tab => (
                                    <button
                                        key={tab.id}
                                        type="button"
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`px-4 py-2 rounded-xl flex items-center gap-2 text-sm font-medium transition-all whitespace-nowrap ${activeTab === tab.id
                                                ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/25'
                                                : 'bg-white/5 text-muted-foreground hover:bg-white/10 hover:text-white'
                                            }`}
                                    >
                                        <tab.icon className="w-4 h-4" /> {tab.label}
                                    </button>
                                ))}
                            </div>

                            <div className="min-h-[400px]">
                                {/* === TAB 1: BASIC INFO === */}
                                {activeTab === 'basic' && (
                                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                            <div className="col-span-2"><label className={labelClass}>Unit Name (Shipped To) *</label><input required type="text" className={inputClass} value={unitForm.unitName} onChange={e => setUnitForm({ ...unitForm, unitName: e.target.value })} /></div>
                                            <div><label className={labelClass}>Unit Code *</label><input required type="text" className={inputClass} value={unitForm.unitCode} onChange={e => setUnitForm({ ...unitForm, unitCode: e.target.value })} /></div>

                                            <div className="col-span-2"><label className={labelClass}>Print Name (Billed To)</label><input type="text" className={inputClass} value={unitForm.printName} onChange={e => setUnitForm({ ...unitForm, printName: e.target.value })} /></div>
                                            <div><label className={labelClass}>Old Unit Code</label><input type="text" className={inputClass} value={unitForm.oldUnitCode} onChange={e => setUnitForm({ ...unitForm, oldUnitCode: e.target.value })} /></div>

                                            <div className="col-span-2"><label className={labelClass}>Shipping Address</label><textarea rows={3} className={inputClass} value={unitForm.shippingAddress} onChange={e => setUnitForm({ ...unitForm, shippingAddress: e.target.value })} /></div>
                                            <div className="col-span-1"><label className={labelClass}>Billing Address</label><textarea rows={3} className={inputClass} value={unitForm.billingAddress} onChange={e => setUnitForm({ ...unitForm, billingAddress: e.target.value })} /></div>

                                            <div><label className={labelClass}>State</label><input type="text" className={inputClass} value={unitForm.billingToState} onChange={e => setUnitForm({ ...unitForm, billingToState: e.target.value })} /></div>
                                            <div><label className={labelClass}>District</label><input type="text" className={inputClass} value={unitForm.district} onChange={e => setUnitForm({ ...unitForm, district: e.target.value })} /></div>
                                            <div><label className={labelClass}>Pin Code</label><input type="text" className={inputClass} value={unitForm.pinCode} onChange={e => setUnitForm({ ...unitForm, pinCode: e.target.value })} /></div>

                                            <div><label className={labelClass}>Billing From State</label><input type="text" className={inputClass} value={unitForm.billingFromState} onChange={e => setUnitForm({ ...unitForm, billingFromState: e.target.value })} /></div>
                                            <div><label className={labelClass}>Place Of Supply</label><input type="text" className={inputClass} value={unitForm.placeOfSupply} onChange={e => setUnitForm({ ...unitForm, placeOfSupply: e.target.value })} /></div>
                                            <div><label className={labelClass}>Region</label><input type="text" className={inputClass} value={unitForm.region} onChange={e => setUnitForm({ ...unitForm, region: e.target.value })} /></div>
                                        </div>
                                    </motion.div>
                                )}

                                {/* === TAB 2: AGREEMENT === */}
                                {activeTab === 'agreement' && (
                                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                            <div><label className={labelClass}>Work Order No.</label><input type="text" className={inputClass} value={unitForm.workOrderNo} onChange={e => setUnitForm({ ...unitForm, workOrderNo: e.target.value })} /></div>
                                            <div><label className={labelClass}>Work Order Date</label><input type="date" className={inputClass} value={unitForm.workOrderDate} onChange={e => setUnitForm({ ...unitForm, workOrderDate: e.target.value })} /></div>
                                            <div><label className={labelClass}>Work Start Date</label><input type="date" className={inputClass} value={unitForm.workStartDate} onChange={e => setUnitForm({ ...unitForm, workStartDate: e.target.value })} /></div>

                                            <div><label className={labelClass}>Agreement No.</label><input type="text" className={inputClass} value={unitForm.agreementNo} onChange={e => setUnitForm({ ...unitForm, agreementNo: e.target.value })} /></div>
                                            <div><label className={labelClass}>Agreement Date</label><input type="date" className={inputClass} value={unitForm.agreementDate} onChange={e => setUnitForm({ ...unitForm, agreementDate: e.target.value })} /></div>
                                            <div><label className={labelClass}>Agreement Exp Date</label><input type="date" className={inputClass} value={unitForm.agreementExpDate} onChange={e => setUnitForm({ ...unitForm, agreementExpDate: e.target.value })} /></div>

                                            <div><label className={labelClass}>No of Employees</label><input type="number" className={inputClass} value={unitForm.noOfEmployees} onChange={e => setUnitForm({ ...unitForm, noOfEmployees: e.target.value })} /></div>
                                            <div><label className={labelClass}>Min Age</label><input type="number" className={inputClass} value={unitForm.minAge} onChange={e => setUnitForm({ ...unitForm, minAge: e.target.value })} /></div>
                                            <div><label className={labelClass}>Max Age</label><input type="number" className={inputClass} value={unitForm.maxAge} onChange={e => setUnitForm({ ...unitForm, maxAge: e.target.value })} /></div>

                                            <div><label className={labelClass}>Bonus Paid Month</label><input type="text" className={inputClass} value={unitForm.bonusPaidInMonth} onChange={e => setUnitForm({ ...unitForm, bonusPaidInMonth: e.target.value })} /></div>
                                            <div className="flex items-center gap-3 pt-8">
                                                <input type="checkbox" className="w-5 h-5 accent-emerald-500" checked={unitForm.isUniformFree} onChange={e => setUnitForm({ ...unitForm, isUniformFree: e.target.checked })} />
                                                <label className="text-white">Is Uniform Free?</label>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}

                                {/* === TAB 3: CONTACTS === */}
                                {activeTab === 'contacts' && (
                                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                                        <div className="bg-white/5 p-6 rounded-xl border border-white/10">
                                            <h3 className="text-emerald-400 font-bold mb-4 uppercase text-sm tracking-wider">Operation Department</h3>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div><label className={labelClass}>Contact Name</label><input type="text" className={inputClass} value={unitForm.operationDepartment.name} onChange={e => setUnitForm({ ...unitForm, operationDepartment: { ...unitForm.operationDepartment, name: e.target.value } })} /></div>
                                                <div><label className={labelClass}>Designation</label><input type="text" className={inputClass} value={unitForm.operationDepartment.designation} onChange={e => setUnitForm({ ...unitForm, operationDepartment: { ...unitForm.operationDepartment, designation: e.target.value } })} /></div>
                                                <div><label className={labelClass}>Phone</label><input type="text" className={inputClass} value={unitForm.operationDepartment.phone} onChange={e => setUnitForm({ ...unitForm, operationDepartment: { ...unitForm.operationDepartment, phone: e.target.value } })} /></div>
                                                <div><label className={labelClass}>Email</label><input type="email" className={inputClass} value={unitForm.operationDepartment.email} onChange={e => setUnitForm({ ...unitForm, operationDepartment: { ...unitForm.operationDepartment, email: e.target.value } })} /></div>
                                            </div>
                                        </div>

                                        <div className="bg-white/5 p-6 rounded-xl border border-white/10">
                                            <h3 className="text-indigo-400 font-bold mb-4 uppercase text-sm tracking-wider">Accounts Officer</h3>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div><label className={labelClass}>Contact Name</label><input type="text" className={inputClass} value={unitForm.accountsOfficer.name} onChange={e => setUnitForm({ ...unitForm, accountsOfficer: { ...unitForm.accountsOfficer, name: e.target.value } })} /></div>
                                                <div><label className={labelClass}>Designation</label><input type="text" className={inputClass} value={unitForm.accountsOfficer.designation} onChange={e => setUnitForm({ ...unitForm, accountsOfficer: { ...unitForm.accountsOfficer, designation: e.target.value } })} /></div>
                                                <div><label className={labelClass}>Phone</label><input type="text" className={inputClass} value={unitForm.accountsOfficer.phone} onChange={e => setUnitForm({ ...unitForm, accountsOfficer: { ...unitForm.accountsOfficer, phone: e.target.value } })} /></div>
                                                <div><label className={labelClass}>Email</label><input type="email" className={inputClass} value={unitForm.accountsOfficer.email} onChange={e => setUnitForm({ ...unitForm, accountsOfficer: { ...unitForm.accountsOfficer, email: e.target.value } })} /></div>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}

                                {/* === TAB 4: STATUTORY === */}
                                {activeTab === 'statutory' && (
                                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                            <div><label className={labelClass}>GSTIN</label><input type="text" className={inputClass} value={unitForm.gstin} onChange={e => setUnitForm({ ...unitForm, gstin: e.target.value })} /></div>
                                            <div><label className={labelClass}>PAN Card No</label><input type="text" className={inputClass} value={unitForm.panCardNo} onChange={e => setUnitForm({ ...unitForm, panCardNo: e.target.value })} /></div>
                                            <div><label className={labelClass}>TAN No</label><input type="text" className={inputClass} value={unitForm.tanNo} onChange={e => setUnitForm({ ...unitForm, tanNo: e.target.value })} /></div>

                                            <div><label className={labelClass}>PF Code</label><input type="text" className={inputClass} value={unitForm.pfCode} onChange={e => setUnitForm({ ...unitForm, pfCode: e.target.value })} /></div>
                                            <div><label className={labelClass}>ESIC Code</label><input type="text" className={inputClass} value={unitForm.esicCode} onChange={e => setUnitForm({ ...unitForm, esicCode: e.target.value })} /></div>
                                            <div><label className={labelClass}>Service Tax No</label><input type="text" className={inputClass} value={unitForm.serviceTaxNo} onChange={e => setUnitForm({ ...unitForm, serviceTaxNo: e.target.value })} /></div>

                                            <div><label className={labelClass}>ROC</label><input type="text" className={inputClass} value={unitForm.roc} onChange={e => setUnitForm({ ...unitForm, roc: e.target.value })} /></div>
                                            <div><label className={labelClass}>Vendor Code</label><input type="text" className={inputClass} value={unitForm.vendorCode} onChange={e => setUnitForm({ ...unitForm, vendorCode: e.target.value })} /></div>
                                            <div><label className={labelClass}>GST Category</label><input type="text" className={inputClass} value={unitForm.gstCategory} onChange={e => setUnitForm({ ...unitForm, gstCategory: e.target.value })} /></div>
                                        </div>

                                        <div className="pt-6 border-t border-white/10">
                                            <h3 className="text-white font-bold mb-4">Billing Configuration</h3>
                                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                                <div className="flex gap-2"><input type="checkbox" checked={unitForm.isGstApplicable} onChange={e => setUnitForm({ ...unitForm, isGstApplicable: e.target.checked })} className="accent-emerald-500 w-4 h-4 mt-1" /> <label className="text-white text-sm">GST Applicable</label></div>
                                                <div className="flex gap-2"><input type="checkbox" checked={unitForm.isIgstApplicable} onChange={e => setUnitForm({ ...unitForm, isIgstApplicable: e.target.checked })} className="accent-emerald-500 w-4 h-4 mt-1" /> <label className="text-white text-sm">IGST Applicable</label></div>
                                                <div className="flex gap-2"><input type="checkbox" checked={unitForm.systemBilling} onChange={e => setUnitForm({ ...unitForm, systemBilling: e.target.checked })} className="accent-emerald-500 w-4 h-4 mt-1" /> <label className="text-white text-sm">System Billing</label></div>
                                                <div className="flex gap-2"><input type="checkbox" checked={unitForm.billingInDecimal} onChange={e => setUnitForm({ ...unitForm, billingInDecimal: e.target.checked })} className="accent-emerald-500 w-4 h-4 mt-1" /> <label className="text-white text-sm">Billing in Decimal</label></div>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}

                            </div>
                        </div>

                        {/* Actions */}
                        <div className="fixed bottom-0 left-0 right-0 p-4 bg-slate-950/80 backdrop-blur border-t border-white/10 z-50 flex justify-end gap-4">
                            <button type="button" onClick={() => router.back()} className="px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white font-bold transition-colors">
                                Cancel
                            </button>
                            <button type="submit" disabled={loading} className="px-8 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-bold shadow-lg shadow-emerald-500/25 flex items-center gap-2 transition-all disabled:opacity-50">
                                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                                Save Unit Master
                            </button>
                        </div>

                    </form>
                </div>
            </div>
        </AuroraBackground>
    );
}

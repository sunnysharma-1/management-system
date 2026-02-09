'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { useMasterData } from './providers/master-data-context';
import { FileText, Plus, Trash2, Save, Printer, Search, Loader2 } from 'lucide-react';
import { InvoiceTemplate } from './invoice-template';
import { Invoice, InvoiceItem } from './providers/billing-context';

export function InvoiceGenerator() {
    const { data: masterData } = useMasterData();

    // --- State ---
    const [loading, setLoading] = useState(false);

    // Header Data
    const [invoiceDate, setInvoiceDate] = useState(new Date().toISOString().split('T')[0]);
    const [month, setMonth] = useState(new Date().toLocaleString('default', { month: 'long' }));
    const [year, setYear] = useState(new Date().getFullYear());
    const [fromPeriod, setFromPeriod] = useState('');
    const [toPeriod, setToPeriod] = useState('');
    const [billMonthDays, setBillMonthDays] = useState(30);

    // Client/Unit Selection
    const [unitQuery, setUnitQuery] = useState('');
    const [searching, setSearching] = useState(false);
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [selectedUnit, setSelectedUnit] = useState<any>(null);
    const [selectedClient, setSelectedClient] = useState<any>(null);

    // Item Input State
    const [inputSeq, setInputSeq] = useState(1); // Auto-incrementing
    const [inputService, setInputService] = useState('');
    const [inputDesc, setInputDesc] = useState('');
    const [inputNOP, setInputNOP] = useState(1);
    const [inputRate, setInputRate] = useState(0);
    const [inputMonthDays, setInputMonthDays] = useState(30); // Default to header month days?
    const [inputDuty, setInputDuty] = useState(0);

    // Item Components Input (Defaults)
    const [inputSCPercent, setInputSCPercent] = useState(10);
    const [inputPFPercent, setInputPFPercent] = useState(13);
    const [inputESICPercent, setInputESICPercent] = useState(3.25);
    const [inputLWFRate, setInputLWFRate] = useState(0);
    const [inputLeviRate, setInputLeviRate] = useState(0);

    // Items List
    const [items, setItems] = useState<InvoiceItem[]>([]);

    // Footer - Bank & Flags
    const [selectedBankId, setSelectedBankId] = useState('');
    const [remarks, setRemarks] = useState('');
    const [isServiceChargeOnPrint, setIsServiceChargeOnPrint] = useState(true);
    const [isReverseCharges, setIsReverseCharges] = useState(false);
    const [isArrearBill, setIsArrearBill] = useState(false);
    const [docketNumber, setDocketNumber] = useState('');

    // Footer - Totals & Rates (Global overrides if needed, but driven by items or defaults)
    // We'll calculate these on the fly based on items, but allow editing the %? 
    // For now, let's keep the Input Row valid and sum them up.

    // Global Tax Rates
    const [cgstPercent, setCgstPercent] = useState(9);
    const [sgstPercent, setSgstPercent] = useState(9);
    const [igstPercent, setIgstPercent] = useState(0); // If interstate
    const [tdsPercent, setTdsPercent] = useState(0);
    const [reimbursement, setReimbursement] = useState(0);
    const [others, setOthers] = useState(0);

    // --- Derived Totals ---
    const totalDutyAmount = items.reduce((sum, item) => sum + item.amount, 0);
    const totalServiceCharge = items.reduce((sum, item) => sum + item.scAmount, 0);
    const totalPF = items.reduce((sum, item) => sum + item.pfAmount, 0);
    const totalESIC = items.reduce((sum, item) => sum + item.esicAmount, 0);
    const totalLWF = items.reduce((sum, item) => sum + item.lwfAmount, 0);
    const totalLevi = items.reduce((sum, item) => sum + item.leviAmount, 0);

    const subTotal = totalDutyAmount + totalServiceCharge + totalPF + totalESIC + totalLWF + totalLevi;

    const cgstAmount = (subTotal * cgstPercent) / 100;
    const sgstAmount = (subTotal * sgstPercent) / 100;
    const igstAmount = (subTotal * igstPercent) / 100;
    const taxTotal = cgstAmount + sgstAmount + igstAmount;

    const grandTotal = subTotal + taxTotal + others;
    const tdsAmount = (subTotal * tdsPercent) / 100;
    const netAmount = grandTotal - tdsAmount + reimbursement;

    // --- Effects ---
    // Update GST based on state
    useEffect(() => {
        if (selectedClient?.state && masterData.companyKYC?.registeredAddress) {
            // Simple check - in real app, parse state from address string properly
            const isInter = !masterData.companyKYC.registeredAddress.toLowerCase().includes(selectedClient.state.toLowerCase());
            if (isInter) {
                setIgstPercent(18);
                setCgstPercent(0);
                setSgstPercent(0);
            } else {
                setIgstPercent(0);
                setCgstPercent(9);
                setSgstPercent(9);
            }
        }
    }, [selectedClient, masterData.companyKYC]);


    // --- Handlers ---

    // Unit Search
    useEffect(() => {
        const timer = setTimeout(async () => {
            if (unitQuery.length < 2) {
                setSearchResults([]);
                return;
            }
            setSearching(true);
            try {
                const clients = await api.getClients();
                const matches: any[] = [];
                clients.forEach((client: any) => {
                    client.units?.forEach((unit: any) => {
                        if (
                            unit.unitName.toLowerCase().includes(unitQuery.toLowerCase()) ||
                            unit.unitCode.toLowerCase().includes(unitQuery.toLowerCase())
                        ) {
                            matches.push({ ...unit, parentClient: client });
                        }
                    });
                });
                setSearchResults(matches.slice(0, 10));
            } catch (err) { console.error(err); } finally { setSearching(false); }
        }, 500);
        return () => clearTimeout(timer);
    }, [unitQuery]);

    const handleSelectUnit = async (unit: any) => {
        setSelectedUnit(unit);
        setSelectedClient(unit.parentClient);
        setUnitQuery(`${unit.unitName}`);
        setSearchResults([]);

        // Try to fetch bill rates to populate defaults?
        // For this tailored UI, maybe we just set the client and let user add items?
        // Or we can auto-add items. Let's support auto-add if available.
        try {
            const billRates = await api.getBillRates({ clientId: unit.parentClient._id, unitId: unit._id });
            if (billRates && billRates.length > 0) {
                const newItems = billRates.map((rate: any, idx: number) => {
                    const amount = (rate.totals?.totalPerHead || 0) * (rate.nos || 1); // Default full month
                    return {
                        id: `auto-${Date.now()}-${idx}`,
                        seqNo: idx + 1,
                        service: rate.service,
                        description: '',
                        nop: rate.nos || 1,
                        rate: rate.totals?.totalPerHead || 0,
                        monthDays: 30,
                        duty: 30,
                        amount: amount,
                        // Defaults from rate structure could go here if available
                        scPercent: 10, scAmount: amount * 0.10,
                        pfPercent: 13, pfAmount: amount * 0.13,
                        esicPercent: 3.25, esicAmount: amount * 0.0325,
                        lwfRate: 0, lwfAmount: 0,
                        leviRate: 0, leviAmount: 0,
                    };
                });
                setItems(newItems);
                setInputSeq(newItems.length + 1);
            }
        } catch (e) { console.log("No bill rates or error", e); }
    };

    const handleAddItem = () => {
        // Calculate Item Amounts
        // Logic: Amount = (Rate / MonthDays) * Duty * NOP
        // If Duty is 0, maybe use Rate * NOP (Fixed)? 
        // Screenshot shows Rate 18741, MonthDays 31, Duty 0, Amount 0. So Duty is required.
        const calculatedAmount = inputDuty > 0
            ? Math.round((inputRate / inputMonthDays) * inputDuty * inputNOP)
            : 0;

        const newItem: InvoiceItem = {
            id: `item-${Date.now()}`,
            seqNo: inputSeq,
            service: inputService,
            description: inputDesc,
            nop: inputNOP,
            rate: inputRate,
            monthDays: inputMonthDays,
            duty: inputDuty,
            amount: calculatedAmount,

            scPercent: inputSCPercent,
            scAmount: Math.round(calculatedAmount * (inputSCPercent / 100)),

            pfPercent: inputPFPercent,
            pfAmount: Math.round(calculatedAmount * (inputPFPercent / 100)),

            esicPercent: inputESICPercent,
            esicAmount: Math.round(calculatedAmount * (inputESICPercent / 100)),

            lwfRate: inputLWFRate,
            lwfAmount: inputLWFRate * inputNOP, // Usually per person

            leviRate: inputLeviRate,
            leviAmount: inputLeviRate * inputNOP,
        };

        setItems([...items, newItem]);
        setInputSeq(prev => prev + 1);
        // Reset Inputs partially
        setInputService('');
        setInputDesc('');
        setInputDuty(0);
        // Keep rates/percentages as they likely repeat
    };

    const removeItem = (id: string) => {
        setItems(items.filter(i => i.id !== id));
    };

    const handleSave = async () => {
        if (!selectedClient || !selectedUnit) return alert("Select Client/Unit first");

        setLoading(true);
        try {
            const payload: Invoice = {
                invoiceNo: `INV/${new Date().getFullYear()}/${Math.floor(Math.random() * 10000)}`,
                date: invoiceDate,

                fromPeriod: fromPeriod,
                toPeriod: toPeriod,
                month: month,
                year: year,
                monthDays: billMonthDays,

                clientId: selectedClient._id,
                unitId: selectedUnit._id,
                clientName: selectedClient.companyName,
                unitName: selectedUnit.unitName,

                bank: masterData.banks.find(b => b.id === selectedBankId) as any,

                items: items,

                totalDuty: totalDutyAmount,
                serviceChargePercent: inputSCPercent, // Global or average? Using input for now
                serviceChargeAmount: totalServiceCharge,
                pfEmployerPercent: inputPFPercent,
                pfEmployerAmount: totalPF,
                esicEmployerPercent: inputESICPercent,
                esicEmployerAmount: totalESIC,
                lwfTotal: totalLWF,
                leviTotal: totalLevi,

                subTotal: subTotal,

                cgstPercent, cgstAmount,
                sgstPercent, sgstAmount,
                igstPercent, igstAmount,

                taxTotal,
                others,
                grandTotal,

                tdsPercent, tdsAmount,
                reimbursement,
                netAmount,

                status: 'Pending',
                remarks,
                isServiceChargeOnPrint,
                isReverseCharges,
                isArrearBill,
                docketNumber
            };

            await api.createInvoice(payload);
            alert('Invoice Saved!');
            // Reset logic here if needed
            setItems([]);
        } catch (e) {
            console.error(e);
            alert('Failed to save');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-4 max-w-[1920px] mx-auto text-sm space-y-4 animate-fade-in pb-24 text-slate-800 bg-white min-h-screen">

            {/* --- HEADER --- */}
            <div className="border rounded-md p-4 bg-slate-50 shadow-sm">
                <div className="grid grid-cols-4 gap-4 mb-4">
                    <div>
                        <label className="block text-xs font-bold text-slate-500 mb-1">Bill No</label>
                        <input type="text" disabled placeholder="Auto-Generated" className="w-full border p-1 rounded bg-slate-100" />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-500 mb-1">Bill Date</label>
                        <input type="date" value={invoiceDate} onChange={e => setInvoiceDate(e.target.value)} className="w-full border p-1 rounded" />
                    </div>
                    <div className="relative">
                        <label className="block text-xs font-bold text-slate-500 mb-1">Client Name</label>
                        {/* Reusing Search Logic for visual simplicity in this mockup */}
                        <div className="relative">
                            <input
                                type="text"
                                value={unitQuery}
                                onChange={e => setUnitQuery(e.target.value)}
                                placeholder="Search Client/Unit..."
                                className="w-full border p-1 rounded"
                            />
                            {searching && <Loader2 className="absolute right-2 top-1.5 w-3 h-3 animate-spin" />}
                            {searchResults.length > 0 && (
                                <div className="absolute top-full left-0 right-0 bg-white border shadow-lg z-50 max-h-60 overflow-y-auto">
                                    {searchResults.map(res => (
                                        <div key={res._id} onClick={() => handleSelectUnit(res)} className="p-2 hover:bg-slate-100 cursor-pointer border-b">
                                            <div className="font-bold">{res.unitName}</div>
                                            <div className="text-xs text-slate-500">{res.parentClient.companyName}</div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-500 mb-1">Unit Name</label>
                        <input type="text" value={selectedUnit?.unitName || ''} disabled className="w-full border p-1 rounded bg-slate-100" />
                    </div>
                </div>

                <div className="grid grid-cols-4 gap-4">
                    <div className="grid grid-cols-2 gap-2">
                        <div>
                            <label className="block text-xs font-bold text-slate-500 mb-1">Month</label>
                            <select value={month} onChange={e => setMonth(e.target.value)} className="w-full border p-1 rounded">
                                {['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'].map(m => (
                                    <option key={m} value={m}>{m}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 mb-1">Year</label>
                            <select value={year} onChange={e => setYear(parseInt(e.target.value))} className="w-full border p-1 rounded">
                                {[2024, 2025, 2026].map(y => <option key={y} value={y}>{y}</option>)}
                            </select>
                        </div>
                    </div>
                    <div className="col-span-2">
                        <label className="block text-xs font-bold text-slate-500 mb-1">Bill Period</label>
                        <div className="flex gap-2">
                            <input type="date" value={fromPeriod} onChange={e => setFromPeriod(e.target.value)} className="w-full border p-1 rounded" />
                            <span className="self-center">-</span>
                            <input type="date" value={toPeriod} onChange={e => setToPeriod(e.target.value)} className="w-full border p-1 rounded" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-500 mb-1">Month Days</label>
                        <input type="number" value={billMonthDays} onChange={e => setBillMonthDays(parseInt(e.target.value))} className="w-full border p-1 rounded" />
                    </div>
                </div>
                {selectedUnit && <div className="mt-2 text-xs text-slate-500">{selectedUnit.billingAddress}</div>}
            </div>

            {/* --- INPUT ROW --- */}
            <div className="border rounded-md bg-blue-50/50 p-2 overflow-x-auto">
                <table className="w-full min-w-[1200px]">
                    <thead>
                        <tr className="text-xs text-left text-slate-600">
                            <th className="p-1">Service</th>
                            <th className="p-1">Desc</th>
                            <th className="p-1 w-12">NOP</th>
                            <th className="p-1 w-12">Duty</th>
                            <th className="p-1 w-20">Rate</th>
                            <th className="p-1 w-12">Days</th>
                            <th className="p-1 w-24">Amount</th>
                            <th className="p-1 w-12">SC(%)</th>
                            <th className="p-1 w-12">PF(%)</th>
                            <th className="p-1 w-12">ESI(%)</th>
                            <th className="p-1 w-16">LWF Rate</th>
                            <th className="p-1 w-16">Levi Rate</th>
                            <th className="p-1">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td className="p-1"><input className="w-full border p-1 h-8 rounded" placeholder="Select Service" value={inputService} onChange={e => setInputService(e.target.value)} /></td>
                            <td className="p-1"><input className="w-full border p-1 h-8 rounded" value={inputDesc} onChange={e => setInputDesc(e.target.value)} /></td>
                            <td className="p-1"><input type="number" className="w-full border p-1 h-8 rounded" value={inputNOP} onChange={e => setInputNOP(parseFloat(e.target.value))} /></td>
                            <td className="p-1"><input type="number" className="w-full border p-1 h-8 rounded" value={inputDuty} onChange={e => setInputDuty(parseFloat(e.target.value))} /></td>
                            <td className="p-1"><input type="number" className="w-full border p-1 h-8 rounded" value={inputRate} onChange={e => setInputRate(parseFloat(e.target.value))} /></td>
                            <td className="p-1"><input type="number" className="w-full border p-1 h-8 rounded" value={inputMonthDays} onChange={e => setInputMonthDays(parseFloat(e.target.value))} /></td>
                            <td className="p-1"><div className="w-full bg-slate-200 h-8 flex items-center px-2 rounded font-bold">
                                {inputDuty > 0 ? Math.round((inputRate / inputMonthDays) * inputDuty * inputNOP) : 0}
                            </div></td>
                            <td className="p-1"><input type="number" className="w-full border p-1 h-8 rounded" value={inputSCPercent} onChange={e => setInputSCPercent(parseFloat(e.target.value))} /></td>
                            <td className="p-1"><input type="number" className="w-full border p-1 h-8 rounded" value={inputPFPercent} onChange={e => setInputPFPercent(parseFloat(e.target.value))} /></td>
                            <td className="p-1"><input type="number" className="w-full border p-1 h-8 rounded" value={inputESICPercent} onChange={e => setInputESICPercent(parseFloat(e.target.value))} /></td>
                            <td className="p-1"><input type="number" className="w-full border p-1 h-8 rounded" value={inputLWFRate} onChange={e => setInputLWFRate(parseFloat(e.target.value))} /></td>
                            <td className="p-1"><input type="number" className="w-full border p-1 h-8 rounded" value={inputLeviRate} onChange={e => setInputLeviRate(parseFloat(e.target.value))} /></td>
                            <td className="p-1">
                                <button onClick={handleAddItem} className="bg-yellow-400 hover:bg-yellow-500 text-black px-4 py-1 rounded font-bold text-xs uppercase shadow-sm">
                                    Add to List
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            {/* --- GRID --- */}
            <div className="border rounded-md overflow-hidden bg-white">
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[1200px] text-xs">
                        <thead className="bg-[#4472c4] text-white">
                            <tr>
                                <th className="p-2 border-r border-blue-400">SrNo</th>
                                <th className="p-2 border-r border-blue-400 text-left">Service</th>
                                <th className="p-2 border-r border-blue-400 text-left">Description</th>
                                <th className="p-2 border-r border-blue-400">No of Person</th>
                                <th className="p-2 border-r border-blue-400">Rate</th>
                                <th className="p-2 border-r border-blue-400">MonthDays</th>
                                <th className="p-2 border-r border-blue-400">Duty</th>
                                <th className="p-2 border-r border-blue-400">Amount</th>
                                <th className="p-2 border-r border-blue-400">SC(%)<br />SC Amt</th>
                                <th className="p-2 border-r border-blue-400">PF(%)<br />PF Amt</th>
                                <th className="p-2 border-r border-blue-400">ESIC(%)<br />ESIC Amt</th>
                                <th className="p-2 border-r border-blue-400">LWF Rate<br />LWF Amt</th>
                                <th className="p-2 border-r border-blue-400">Levi(Per)<br />(Amount)</th>
                                <th className="p-2">Del</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {items.map((item, idx) => (
                                <tr key={item.id} className="hover:bg-slate-50">
                                    <td className="p-2 text-center border-r">{idx + 1}</td>
                                    <td className="p-2 border-r">{item.service}</td>
                                    <td className="p-2 border-r">{item.description}</td>
                                    <td className="p-2 text-center border-r">{item.nop}</td>
                                    <td className="p-2 text-right border-r">{item.rate}</td>
                                    <td className="p-2 text-center border-r">{item.monthDays}</td>
                                    <td className="p-2 text-center border-r">{item.duty}</td>
                                    <td className="p-2 text-right border-r font-bold">{item.amount}</td>

                                    <td className="p-2 text-center border-r">
                                        <div>{item.scPercent}</div>
                                        <div className="text-slate-500">{item.scAmount}</div>
                                    </td>
                                    <td className="p-2 text-center border-r">
                                        <div>{item.pfPercent}</div>
                                        <div className="text-slate-500">{item.pfAmount}</div>
                                    </td>
                                    <td className="p-2 text-center border-r">
                                        <div>{item.esicPercent}</div>
                                        <div className="text-slate-500">{item.esicAmount}</div>
                                    </td>
                                    <td className="p-2 text-center border-r">
                                        <div>{item.lwfRate}</div>
                                        <div className="text-slate-500">{item.lwfAmount}</div>
                                    </td>
                                    <td className="p-2 text-center border-r">
                                        <div>{item.leviRate}</div>
                                        <div className="text-slate-500">{item.leviAmount}</div>
                                    </td>
                                    <td className="p-2 text-center">
                                        <button onClick={() => removeItem(item.id)} className="text-red-500 hover:text-red-700"><Trash2 className="w-4 h-4" /></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* --- FOOTER --- */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-4">

                {/* Left Side: Remarks & Bank */}
                <div className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-slate-500 mb-1">Remarks</label>
                        <textarea
                            className="w-full border rounded p-2 text-xs h-16"
                            value={remarks} onChange={e => setRemarks(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-500 mb-1">Bank</label>
                        <select
                            className="w-full border rounded p-2 text-xs"
                            value={selectedBankId} onChange={e => setSelectedBankId(e.target.value)}
                        >
                            <option value="">-- Select Bank --</option>
                            {masterData.banks.map(b => (
                                <option key={b.id} value={b.id}>{b.name}</option>
                            ))}
                        </select>
                    </div>
                    {/* Display Bank Details if selected */}
                    {(() => {
                        const bank = masterData.banks.find(b => b.id === selectedBankId);
                        if (bank) return (
                            <div className="grid grid-cols-2 gap-4 text-xs bg-slate-50 p-3 rounded border">
                                <div><span className="font-bold">Branch:</span> {bank.branch}</div>
                                <div><span className="font-bold">IFSC:</span> {bank.ifsc}</div>
                                <div className="col-span-2"><span className="font-bold">Ac No:</span> {bank.accountNo}</div>
                            </div>
                        );
                    })()}

                    <div className="space-y-2 mt-4">
                        <label className="flex items-center gap-2 text-xs font-bold">
                            <input type="checkbox" checked={isServiceChargeOnPrint} onChange={e => setIsServiceChargeOnPrint(e.target.checked)} />
                            Service Charge On Print
                        </label>
                        <label className="flex items-center gap-2 text-xs font-bold">
                            <input type="checkbox" checked={isReverseCharges} onChange={e => setIsReverseCharges(e.target.checked)} />
                            Is Reverse Charges
                        </label>
                        <label className="flex items-center gap-2 text-xs font-bold">
                            <input type="checkbox" checked={isArrearBill} onChange={e => setIsArrearBill(e.target.checked)} />
                            Is Arrear Bill
                        </label>
                    </div>

                    <div className="mt-4">
                        <label className="block text-xs font-bold text-slate-500 mb-1">Docket Number</label>
                        <input type="text" value={docketNumber} onChange={e => setDocketNumber(e.target.value)} className="w-full border rounded p-2 text-xs" />
                    </div>
                </div>

                {/* Right Side: Totals */}
                <div className="space-y-1 text-xs">
                    <div className="flex justify-between items-center py-1 border-b">
                        <span className="font-bold">Total Duty : 0</span>
                        <span className="font-bold">Total : {totalDutyAmount.toFixed(2)}</span>
                    </div>

                    {/* Dynamic Rows */}
                    <div className="grid grid-cols-[1fr,100px,100px] gap-2 items-center py-1">
                        <span>Service Charge</span>
                        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded">
                            <input type="number" value={inputSCPercent} disabled className="w-12 bg-transparent text-right outline-none" /> %
                        </div>
                        <div className="text-right">{totalServiceCharge.toFixed(2)}</div>
                    </div>
                    <div className="grid grid-cols-[1fr,100px,100px] gap-2 items-center py-1">
                        <span>Pf Employer</span>
                        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded">
                            <input type="number" value={inputPFPercent} disabled className="w-12 bg-transparent text-right outline-none" /> %
                        </div>
                        <div className="text-right">{totalPF.toFixed(2)}</div>
                    </div>
                    <div className="grid grid-cols-[1fr,100px,100px] gap-2 items-center py-1">
                        <span>Esic Employer</span>
                        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded">
                            <input type="number" value={inputESICPercent} disabled className="w-12 bg-transparent text-right outline-none" /> %
                        </div>
                        <div className="text-right">{totalESIC.toFixed(2)}</div>
                    </div>
                    <div className="grid grid-cols-[1fr,100px,100px] gap-2 items-center py-1">
                        <span>LWF</span>
                        <div></div>
                        <div className="text-right">{totalLWF.toFixed(2)}</div>
                    </div>
                    <div className="grid grid-cols-[1fr,100px,100px] gap-2 items-center py-1">
                        <span>Levi</span>
                        <div></div>
                        <div className="text-right">{totalLevi.toFixed(2)}</div>
                    </div>

                    <div className="grid grid-cols-[1fr,100px] gap-2 items-center py-1 border-t border-b bg-red-50 text-red-600 font-bold">
                        <span>Sub Total</span>
                        <div className="text-right">{subTotal.toFixed(2)}</div>
                    </div>

                    {/* Taxes */}
                    <div className="grid grid-cols-[1fr,100px,100px] gap-2 items-center py-1">
                        <span>CGST</span>
                        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded">
                            <input type="number" value={cgstPercent} onChange={e => setCgstPercent(parseFloat(e.target.value))} className="w-12 bg-transparent text-right outline-none" /> %
                        </div>
                        <div className="text-right">{cgstAmount.toFixed(2)}</div>
                    </div>
                    <div className="grid grid-cols-[1fr,100px,100px] gap-2 items-center py-1">
                        <span>SGST</span>
                        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded">
                            <input type="number" value={sgstPercent} onChange={e => setSgstPercent(parseFloat(e.target.value))} className="w-12 bg-transparent text-right outline-none" /> %
                        </div>
                        <div className="text-right">{sgstAmount.toFixed(2)}</div>
                    </div>
                    <div className="grid grid-cols-[1fr,100px,100px] gap-2 items-center py-1">
                        <span>IGST</span>
                        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded">
                            <input type="number" value={igstPercent} onChange={e => setIgstPercent(parseFloat(e.target.value))} className="w-12 bg-transparent text-right outline-none" /> %
                        </div>
                        <div className="text-right">{igstAmount.toFixed(2)}</div>
                    </div>

                    <div className="grid grid-cols-[1fr,100px] gap-2 items-center py-1 font-bold text-red-600">
                        <span>Tax Amount</span>
                        <div className="text-right">{taxTotal.toFixed(2)}</div>
                    </div>

                    <div className="grid grid-cols-[1fr,100px] gap-2 items-center py-1">
                        <span>Others</span>
                        <input type="number" value={others} onChange={e => setOthers(parseFloat(e.target.value))} className="border rounded px-1 text-right w-full" />
                    </div>

                    <div className="grid grid-cols-[1fr,100px] gap-2 items-center py-1 font-bold text-red-600 border-t">
                        <span>Total (Tax Amount + Sub Total)</span>
                        <div className="text-right">{grandTotal.toFixed(2)}</div>
                    </div>

                    <div className="grid grid-cols-[1fr,100px,100px] gap-2 items-center py-1">
                        <span>TDS</span>
                        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded">
                            <input type="number" value={tdsPercent} onChange={e => setTdsPercent(parseFloat(e.target.value))} className="w-12 bg-transparent text-right outline-none" /> %
                        </div>
                        <div className="text-right">{tdsAmount.toFixed(2)}</div>
                    </div>
                    <div className="grid grid-cols-[1fr,100px] gap-2 items-center py-1">
                        <span>Reimbursement</span>
                        <input type="number" value={reimbursement} onChange={e => setReimbursement(parseFloat(e.target.value))} className="border rounded px-1 text-right w-full" />
                    </div>

                    <div className="grid grid-cols-[1fr,100px] gap-2 items-center py-1 font-bold text-xl border-t-2 border-slate-300 mt-2">
                        <span>Net Amount</span>
                        <div className="text-right text-green-600">{netAmount.toFixed(2)}</div>
                    </div>
                </div>
            </div>

            <div className="fixed bottom-6 right-6 flex gap-4">
                <button onClick={() => window.location.reload()} className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-full shadow-lg font-bold">
                    Reset
                </button>
                <button onClick={handleSave} disabled={loading} className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-2 rounded-full shadow-lg font-bold flex items-center gap-2">
                    {loading ? <Loader2 className="animate-spin" /> : <Save className="w-5 h-5" />}
                    Save
                </button>
            </div>

        </div>
    );
}

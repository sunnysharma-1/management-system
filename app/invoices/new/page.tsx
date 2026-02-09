'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Save, Trash2, Plus, RefreshCw, ArrowLeft,
    Search, Calendar, Building2, CreditCard,
    FileText, User, Check, AlertCircle, Loader2
} from 'lucide-react';
import { api } from '@/lib/api';
import { toast } from 'sonner';
import { AuroraBackground } from '@/components/ui/aurora-background';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from '@/components/ui/table';
import { cn } from '@/lib/utils';

// --- Types ---
interface InvoiceItem {
    id: string;
    seqNo: number;
    service: string;
    description: string;
    nop: number;
    duty: number;
    rate: number;
    monthDays: number;
    amount: number;

    scPercent: number; scAmount: number;
    pfPercent: number; pfAmount: number;
    esicPercent: number; esicAmount: number;
    lwfRate: number; lwfAmount: number;
    leviRate: number; leviAmount: number;
}

export default function NewInvoicePage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    // --- Header State ---
    const [invoiceDate, setInvoiceDate] = useState(new Date().toISOString().split('T')[0]);
    const [month, setMonth] = useState('February');
    const [year, setYear] = useState('2026');
    const [fromPeriod, setFromPeriod] = useState('');
    const [toPeriod, setToPeriod] = useState('');
    const [billMonthDays, setBillMonthDays] = useState(30);

    // --- Client/Unit Search ---
    const [unitQuery, setUnitQuery] = useState('');
    const [searching, setSearching] = useState(false);
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [selectedUnit, setSelectedUnit] = useState<any>(null);
    const [selectedClient, setSelectedClient] = useState<any>(null);

    // --- Item Input State ---
    const [items, setItems] = useState<InvoiceItem[]>([]);
    const [inputService, setInputService] = useState('');
    const [inputDesc, setInputDesc] = useState('');
    const [inputNOP, setInputNOP] = useState(1);
    const [inputRate, setInputRate] = useState(0);
    const [inputDuty, setInputDuty] = useState(0);
    const [inputDays, setInputDays] = useState(30);

    // Statutory Defaults
    const [inputSCPercent, setInputSCPercent] = useState(10);
    const [inputPFPercent, setInputPFPercent] = useState(13);
    const [inputESICPercent, setInputESICPercent] = useState(3.25);
    const [inputLWFRate, setInputLWFRate] = useState(0);
    const [inputLeviRate, setInputLeviRate] = useState(0);

    // --- Footer State ---
    const [remarks, setRemarks] = useState('');
    const [bank, setBank] = useState(''); // Just ID or Name for now
    const [isServiceChargeOnPrint, setIsServiceChargeOnPrint] = useState(true);
    const [isReverseCharges, setIsReverseCharges] = useState(false);
    const [isArrearBill, setIsArrearBill] = useState(false);
    const [docketNumber, setDocketNumber] = useState('');

    // Global Taxes
    const [cgstPercent, setCgstPercent] = useState(9);
    const [sgstPercent, setSgstPercent] = useState(9);
    const [igstPercent, setIgstPercent] = useState(0);
    const [tdsPercent, setTdsPercent] = useState(0);
    const [others, setOthers] = useState(0);

    // --- Effects ---
    // Unit Search Debounce
    useEffect(() => {
        const timer = setTimeout(async () => {
            // Only search if query length > 1 AND it's not the already selected unit name
            if (unitQuery.length < 2 || (selectedUnit && unitQuery === selectedUnit.unitName)) {
                setSearchResults([]);
                return;
            }
            setSearching(true);
            try {
                const clients = await api.getClients();
                const matches: any[] = [];
                clients.forEach((c: any) => {
                    c.units?.forEach((u: any) => {
                        if (u.unitName.toLowerCase().includes(unitQuery.toLowerCase()) ||
                            c.companyName.toLowerCase().includes(unitQuery.toLowerCase())) {
                            matches.push({ ...u, parentClient: c });
                        }
                    });
                });
                setSearchResults(matches.slice(0, 10));
            } catch (err) { console.error(err); } finally { setSearching(false); }
        }, 300);
        return () => clearTimeout(timer);
    }, [unitQuery, selectedUnit]);

    const handleSelectUnit = (unit: any) => {
        setSelectedUnit(unit);
        setSelectedClient(unit.parentClient);
        setUnitQuery(unit.unitName); // Keep input synced
        setSearchResults([]);

        // Auto-set state based on client if needed
        // e.g. check GST state code for IGST
    };

    // Derived Item Code
    const calculatedItemAmount = useMemo(() => {
        if (inputDuty <= 0 || inputDays <= 0) return 0;
        return Math.round((inputRate / inputDays) * inputDuty * inputNOP);
    }, [inputRate, inputDays, inputDuty, inputNOP]);

    const handleAddItem = () => {
        if (!inputService || calculatedItemAmount <= 0) {
            toast.error("Invalid item details");
            return;
        }

        const newItem: InvoiceItem = {
            id: Math.random().toString(36).substr(2, 9),
            seqNo: items.length + 1,
            service: inputService,
            description: inputDesc,
            nop: inputNOP,
            rate: inputRate,
            monthDays: inputDays,
            duty: inputDuty,
            amount: calculatedItemAmount,

            scPercent: inputSCPercent, scAmount: Math.round(calculatedItemAmount * (inputSCPercent / 100)),
            pfPercent: inputPFPercent, pfAmount: Math.round(calculatedItemAmount * (inputPFPercent / 100)),
            esicPercent: inputESICPercent, esicAmount: Math.round(calculatedItemAmount * (inputESICPercent / 100)),
            lwfRate: inputLWFRate, lwfAmount: inputLWFRate * inputNOP,
            leviRate: inputLeviRate, leviAmount: inputLeviRate * inputNOP
        };

        setItems([...items, newItem]);
        // Reset specific fields
        setInputService('');
        setInputDesc('');
        setInputDuty(0);
    };

    const handleDeleteItem = (id: string) => {
        setItems(items.filter(i => i.id !== id));
    };

    // --- Footer Calculations ---
    const totals = useMemo(() => {
        const totalDuty = items.reduce((sum, item) => sum + item.duty, 0);
        const totalBasic = items.reduce((sum, item) => sum + item.amount, 0);

        const totalSC = items.reduce((sum, item) => sum + item.scAmount, 0);
        const totalPF = items.reduce((sum, item) => sum + item.pfAmount, 0);
        const totalESIC = items.reduce((sum, item) => sum + item.esicAmount, 0);
        const totalLWF = items.reduce((sum, item) => sum + item.lwfAmount, 0);
        const totalLevi = items.reduce((sum, item) => sum + item.leviAmount, 0);

        const subTotal = totalBasic + totalSC + totalPF + totalESIC + totalLWF + totalLevi;

        const cgstAmount = (subTotal * cgstPercent) / 100;
        const sgstAmount = (subTotal * sgstPercent) / 100;
        const igstAmount = (subTotal * igstPercent) / 100;
        const taxTotal = cgstAmount + sgstAmount + igstAmount;

        const grandTotal = subTotal + taxTotal + others;
        const tdsAmount = (subTotal * tdsPercent) / 100;

        return { totalDuty, totalBasic, totalSC, totalPF, totalESIC, totalLWF, totalLevi, subTotal, cgstAmount, sgstAmount, igstAmount, taxTotal, grandTotal, tdsAmount };
    }, [items, cgstPercent, sgstPercent, igstPercent, others, tdsPercent]);


    const handleSave = async () => {
        if (!selectedClient || !selectedUnit) {
            toast.error("Select Client & Unit");
            return;
        }
        setIsSaving(true);
        try {
            await api.createInvoice({
                billNo: "Auto-Gen", // Backend handles this usually
                date: invoiceDate,
                clientId: selectedClient._id,
                unitId: selectedUnit._id,
                items,
                ...totals,     // Spread calculated totals
                month,
                year: Number(year),
                bank,
                remarks,
                docketNumber,
                isServiceChargeOnPrint,
                isReverseCharges,
                isArrearBill,
                status: 'Pending'
            });
            toast.success("Invoice Saved Successfully!");
            router.push('/invoices'); // or reset
        } catch (e) {
            console.error(e);
            toast.error("Failed to save invoice");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <AuroraBackground className="flex flex-col h-screen overflow-hidden bg-background text-foreground font-sans">
            {/* --- Top Bar --- */}
            <div className="h-16 border-b border-primary/20 bg-background/80 backdrop-blur-md flex items-center justify-between px-6 z-50">
                <div className="flex items-center gap-3">
                    <Button variant="ghost" size="icon" onClick={() => router.back()} className="text-muted-foreground hover:text-primary">
                        <ArrowLeft className="w-5 h-5" />
                    </Button>
                    <div>
                        <h1 className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary via-purple-400 to-accent animate-neon-glow">
                            INVOICE GENERATOR
                        </h1>
                        <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-mono">Axis Nova Billing Engine</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <Button
                        variant="outline"
                        onClick={() => setItems([])}
                        className="border-primary/20 text-muted-foreground hover:text-primary hover:bg-primary/5 hover:border-primary/50 transition-all font-mono text-xs"
                    >
                        <RefreshCw className="w-3 h-3 mr-2" /> RESET
                    </Button>
                    <Button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white shadow-[0_0_20px_rgba(168,85,247,0.4)] border-none font-bold tracking-wider text-xs"
                    >
                        {isSaving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
                        SAVE INVOICE
                    </Button>
                </div>
            </div>

            {/* --- Scrollable Content --- */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent">

                {/* --- HEADER SECTION --- */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
                    className="grid grid-cols-12 gap-6"
                >
                    {/* Basic Info Card */}
                    <Card className="col-span-12 lg:col-span-8 bg-card/40 backdrop-blur-xl border-primary/10 p-6 shadow-2xl space-y-6 relative overflow-hidden group">
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none group-hover:from-primary/10 transition-colors duration-500" />

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
                            {/* Bill No & Date */}
                            <div className="space-y-4">
                                <div className="space-y-1.5">
                                    <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Bill No</Label>
                                    <div className="h-10 px-3 flex items-center bg-black/20 border border-white/5 rounded-md text-muted-foreground font-mono text-sm">
                                        Auto-Generated
                                    </div>
                                </div>
                                <div className="space-y-1.5">
                                    <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Bill Date</Label>
                                    <div className="relative">
                                        <Calendar className="absolute left-3 top-2.5 w-4 h-4 text-primary" />
                                        <Input
                                            type="date"
                                            value={invoiceDate}
                                            onChange={(e) => setInvoiceDate(e.target.value)}
                                            className="pl-9 bg-black/20 border-white/10 focus:border-primary/50 h-10 transition-all focus:shadow-[0_0_10px_rgba(168,85,247,0.2)]"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Client & Unit Search */}
                            <div className="md:col-span-2 space-y-4">
                                <div className="space-y-1.5 relative">
                                    <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center justify-between">
                                        <span>Client / Unit Search</span>
                                        {searching && <Loader2 className="w-3 h-3 animate-spin text-accent" />}
                                    </Label>
                                    <div className="relative group/search">
                                        <Search className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground group-focus-within/search:text-accent transition-colors" />
                                        <Input
                                            value={unitQuery}
                                            onChange={(e) => setUnitQuery(e.target.value)}
                                            placeholder="Search by Client Name or Unit Name..."
                                            className="pl-9 bg-black/20 border-white/10 focus:border-accent/50 h-10 transition-all focus:shadow-[0_0_10px_rgb(0,255,255,0.2)]"
                                        />
                                        {/* Dropdown Results */}
                                        <AnimatePresence>
                                            {searchResults.length > 0 && (
                                                <motion.div
                                                    initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 5 }}
                                                    className="absolute top-full left-0 right-0 mt-2 bg-[#1a1025] border border-primary/20 rounded-xl shadow-2xl z-50 overflow-hidden"
                                                >
                                                    {searchResults.map((result: any) => (
                                                        <div
                                                            key={result._id}
                                                            onClick={() => handleSelectUnit(result)}
                                                            className="p-3 hover:bg-primary/10 cursor-pointer border-b border-white/5 last:border-0 transition-colors flex flex-col gap-1"
                                                        >
                                                            <div className="font-bold text-white text-sm flex items-center gap-2">
                                                                <Building2 className="w-3 h-3 text-accent" /> {result.unitName}
                                                            </div>
                                                            <div className="text-xs text-muted-foreground pl-5">{result.parentClient.companyName}</div>
                                                        </div>
                                                    ))}
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <Label className="text-[10px] text-muted-foreground uppercase">Selected Client</Label>
                                        <div className="min-h-[2.5rem] flex items-center px-3 bg-primary/5 border border-primary/10 rounded-md text-sm text-primary font-medium truncate">
                                            {selectedClient?.companyName || "No Client Selected"}
                                        </div>
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label className="text-[10px] text-muted-foreground uppercase">Selected Unit</Label>
                                        <div className="min-h-[2.5rem] flex items-center px-3 bg-accent/5 border border-accent/10 rounded-md text-sm text-accent font-medium truncate">
                                            {selectedUnit?.unitName || "No Unit Selected"}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Card>

                    {/* Period Info Card */}
                    <Card className="col-span-12 lg:col-span-4 bg-card/40 backdrop-blur-xl border-white/5 p-6 shadow-xl space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <Label className="text-[10px] text-muted-foreground uppercase">Month</Label>
                                <Select value={month} onValueChange={setMonth}>
                                    <SelectTrigger className="h-9 bg-black/20 border-white/10"><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        {['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'].map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-[10px] text-muted-foreground uppercase">Year</Label>
                                <Input value={year} onChange={e => setYear(e.target.value)} className="h-9 bg-black/20 border-white/10" />
                            </div>
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-[10px] text-muted-foreground uppercase">Bill Period</Label>
                            <div className="flex gap-2 items-center">
                                <Input type="date" value={fromPeriod} onChange={e => setFromPeriod(e.target.value)} className="h-9 bg-black/20 border-white/10 text-xs" />
                                <span className="text-muted-foreground px-1">-</span>
                                <Input type="date" value={toPeriod} onChange={e => setToPeriod(e.target.value)} className="h-9 bg-black/20 border-white/10 text-xs" />
                            </div>
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-[10px] text-muted-foreground uppercase">Bill Month Days</Label>
                            <Input type="number" value={billMonthDays} onChange={e => setBillMonthDays(Number(e.target.value))} className="h-9 bg-black/20 border-white/10" />
                        </div>
                    </Card>
                </motion.div>

                {/* --- INPUT ROW --- */}
                <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1, duration: 0.4 }}>
                    <Card className="bg-black/40 border border-primary/20 p-4 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-primary to-accent" />
                        <div className="flex flex-wrap lg:flex-nowrap gap-3 items-end">
                            <div className="w-full lg:w-48 space-y-1">
                                <Label className="text-[10px] text-primary font-bold">SERVICE</Label>
                                <Input placeholder="Service Name" value={inputService} onChange={e => setInputService(e.target.value)} className="h-8 bg-black/40 border-primary/20 focus:border-primary text-xs" />
                            </div>
                            <div className="w-full lg:flex-1 space-y-1">
                                <Label className="text-[10px] text-muted-foreground">DESCRIPTION</Label>
                                <Input placeholder="Details..." value={inputDesc} onChange={e => setInputDesc(e.target.value)} className="h-8 bg-black/40 border-white/10 text-xs" />
                            </div>
                            <div className="w-16 space-y-1">
                                <Label className="text-[10px] text-muted-foreground text-center block">NOP</Label>
                                <Input type="number" value={inputNOP} onChange={e => setInputNOP(Number(e.target.value))} className="h-8 bg-black/40 border-white/10 text-center text-xs" />
                            </div>
                            <div className="w-16 space-y-1">
                                <Label className="text-[10px] text-muted-foreground text-center block">DUTY</Label>
                                <Input type="number" value={inputDuty} onChange={e => setInputDuty(Number(e.target.value))} className="h-8 bg-black/40 border-white/10 text-center text-xs" />
                            </div>
                            <div className="w-20 space-y-1">
                                <Label className="text-[10px] text-muted-foreground text-center block">RATE</Label>
                                <Input type="number" value={inputRate} onChange={e => setInputRate(Number(e.target.value))} className="h-8 bg-black/40 border-white/10 text-center text-xs" />
                            </div>
                            <div className="w-16 space-y-1">
                                <Label className="text-[10px] text-muted-foreground text-center block">DAYS</Label>
                                <Input type="number" value={inputDays} onChange={e => setInputDays(Number(e.target.value))} className="h-8 bg-black/40 border-white/10 text-center text-xs" />
                            </div>
                            <div className="w-24 space-y-1">
                                <Label className="text-[10px] text-accent font-bold text-center block">AMOUNT</Label>
                                <div className="h-8 flex items-center justify-center bg-accent/10 border border-accent/20 rounded text-accent font-bold text-xs">
                                    {calculatedItemAmount}
                                </div>
                            </div>
                            <div className="w-32">
                                <Button onClick={handleAddItem} className="w-full h-8 bg-primary hover:bg-primary/90 text-white font-bold text-xs">
                                    <Plus className="w-3 h-3 mr-1" /> ADD
                                </Button>
                            </div>
                        </div>
                        {/* Secondary Inputs Row */}
                        <div className="flex flex-wrap gap-4 mt-3 pt-3 border-t border-white/5 items-center">
                            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Statutory %:</span>
                            <div className="flex items-center gap-2">
                                <Label className="text-[10px] text-muted-foreground">SC</Label>
                                <Input type="number" className="h-6 w-12 text-[10px] bg-black/20 border-white/10 text-center" value={inputSCPercent} onChange={e => setInputSCPercent(Number(e.target.value))} />
                            </div>
                            <div className="flex items-center gap-2">
                                <Label className="text-[10px] text-muted-foreground">PF</Label>
                                <Input type="number" className="h-6 w-12 text-[10px] bg-black/20 border-white/10 text-center" value={inputPFPercent} onChange={e => setInputPFPercent(Number(e.target.value))} />
                            </div>
                            <div className="flex items-center gap-2">
                                <Label className="text-[10px] text-muted-foreground">ESI</Label>
                                <Input type="number" className="h-6 w-12 text-[10px] bg-black/20 border-white/10 text-center" value={inputESICPercent} onChange={e => setInputESICPercent(Number(e.target.value))} />
                            </div>
                            <div className="flex items-center gap-2">
                                <Label className="text-[10px] text-muted-foreground">LWF</Label>
                                <Input type="number" className="h-6 w-12 text-[10px] bg-black/20 border-white/10 text-center" value={inputLWFRate} onChange={e => setInputLWFRate(Number(e.target.value))} />
                            </div>
                            <div className="flex items-center gap-2">
                                <Label className="text-[10px] text-muted-foreground">Levi</Label>
                                <Input type="number" className="h-6 w-12 text-[10px] bg-black/20 border-white/10 text-center" value={inputLeviRate} onChange={e => setInputLeviRate(Number(e.target.value))} />
                            </div>
                        </div>
                    </Card>
                </motion.div>

                {/* --- ITEMS TABLE --- */}
                <div className="rounded-xl border border-white/10 overflow-hidden bg-black/40 backdrop-blur-sm shadow-2xl">
                    <Table>
                        <TableHeader className="bg-gradient-to-r from-primary/10 to-transparent">
                            <TableRow className="border-white/5 hover:bg-transparent">
                                <TableHead className="text-primary font-bold text-xs">#</TableHead>
                                <TableHead className="text-primary font-bold text-xs">SERVICE</TableHead>
                                <TableHead className="text-primary font-bold text-xs">DESC</TableHead>
                                <TableHead className="text-primary font-bold text-xs text-center">NOP</TableHead>
                                <TableHead className="text-primary font-bold text-xs text-right">RATE</TableHead>
                                <TableHead className="text-primary font-bold text-xs text-center">DUTY</TableHead>
                                <TableHead className="text-accent font-bold text-xs text-right">AMOUNT</TableHead>
                                <TableHead className="text-muted-foreground font-bold text-[10px] text-center">SC / PF / ESI</TableHead>
                                <TableHead className="text-right w-10"></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {items.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={9} className="h-24 text-center text-muted-foreground text-xs">No items added yet.</TableCell>
                                </TableRow>
                            ) : (
                                items.map((item, idx) => (
                                    <TableRow key={item.id} className="border-white/5 hover:bg-white/5 transition-colors">
                                        <TableCell className="text-xs text-muted-foreground">{idx + 1}</TableCell>
                                        <TableCell className="text-xs font-semibold text-white">{item.service}</TableCell>
                                        <TableCell className="text-[10px] text-muted-foreground">{item.description}</TableCell>
                                        <TableCell className="text-xs text-center">{item.nop}</TableCell>
                                        <TableCell className="text-xs text-right">{item.rate}</TableCell>
                                        <TableCell className="text-xs text-center">{item.duty}</TableCell>
                                        <TableCell className="text-xs text-right font-bold text-accent">{item.amount}</TableCell>
                                        <TableCell className="text-[10px] text-center text-muted-foreground">
                                            {item.scAmount} / {item.pfAmount} / {item.esicAmount}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button variant="ghost" size="icon" className="h-6 w-6 text-destructive hover:bg-destructive/10" onClick={() => handleDeleteItem(item.id)}>
                                                <Trash2 className="w-3 h-3" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>

                {/* --- FOOTER TOTALS --- */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pb-10">
                    <Card className="bg-card/30 border-white/5 p-6 space-y-4">
                        <div className="space-y-2">
                            <Label className="text-xs font-bold text-muted-foreground uppercase">Remarks</Label>
                            <Textarea
                                value={remarks} onChange={e => setRemarks(e.target.value)}
                                className="bg-black/20 border-white/10 min-h-[80px] text-xs resize-none"
                            />
                        </div>
                        <div className="space-y-4 pt-4 border-t border-white/5">
                            <div className="flex items-center justify-between">
                                <Label className="text-xs">Service Charge On Print</Label>
                                <Switch checked={isServiceChargeOnPrint} onCheckedChange={setIsServiceChargeOnPrint} />
                            </div>
                            <div className="flex items-center justify-between">
                                <Label className="text-xs">Reverse Charges</Label>
                                <Switch checked={isReverseCharges} onCheckedChange={setIsReverseCharges} />
                            </div>
                            <div className="flex items-center justify-between">
                                <Label className="text-xs">Arrear Bill</Label>
                                <Switch checked={isArrearBill} onCheckedChange={setIsArrearBill} />
                            </div>
                        </div>
                    </Card>

                    <Card className="bg-gradient-to-br from-card/50 to-black/50 border-primary/20 p-0 overflow-hidden shadow-2xl">
                        <div className="bg-primary/10 p-3 border-b border-primary/10 flex justify-between items-center">
                            <h3 className="text-sm font-bold text-white">Financial Summary</h3>
                            <div className="text-xs text-primary font-mono">Total Duty: <span className="font-bold">{totals.totalDuty}</span></div>
                        </div>
                        <div className="p-4 space-y-2 text-xs">
                            <div className="flex justify-between text-muted-foreground">
                                <span>Total Basic</span>
                                <span className="text-white font-mono">{totals.totalBasic}</span>
                            </div>
                            <div className="flex justify-between text-muted-foreground">
                                <span>Statutory (SC+PF+ESI+LWF+Levi)</span>
                                <span className="text-white font-mono">{(totals.totalSC + totals.totalPF + totals.totalESIC + totals.totalLWF + totals.totalLevi).toFixed(0)}</span>
                            </div>
                            <div className="h-px bg-white/10 my-2" />
                            <div className="flex justify-between text-white font-bold text-sm">
                                <span>SUB TOTAL</span>
                                <span>{totals.subTotal}</span>
                            </div>
                            <div className="h-px bg-white/10 my-2" />
                            <div className="flex justify-between items-center">
                                <span className="text-muted-foreground">CGST ({cgstPercent}%)</span>
                                <span className="text-white font-mono">{totals.cgstAmount.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-muted-foreground">SGST ({sgstPercent}%)</span>
                                <span className="text-white font-mono">{totals.sgstAmount.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-muted-foreground">IGST ({igstPercent}%)</span>
                                <span className="text-white font-mono">{totals.igstAmount.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between items-center text-accent">
                                <span className="font-bold">Total Tax</span>
                                <span className="font-mono">{totals.taxTotal.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between items-center pt-2">
                                <span className="text-muted-foreground">Others</span>
                                <Input type="number" value={others} onChange={e => setOthers(Number(e.target.value))} className="w-20 h-6 text-right bg-black/20 border-white/10 text-xs" />
                            </div>
                            <div className="h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent my-3" />
                            <div className="flex justify-between items-center text-lg font-bold text-white">
                                <span>GRAND TOTAL</span>
                                <span className="text-primary drop-shadow-[0_0_8px_rgba(168,85,247,0.5)]">{totals.grandTotal.toFixed(0)}</span>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </AuroraBackground>
    );
}

'use client';

import { useState, useEffect } from 'react';
import { useBilling, Invoice, InvoiceItem } from './providers/billing-context';
import { useMasterData } from './providers/master-data-context';
import { FileText, Plus, Trash2, Save, Printer } from 'lucide-react';
import { InvoiceTemplate } from './invoice-template';

export function InvoiceGenerator() {
    const { clients, addInvoice } = useBilling();
    const { data: masterData } = useMasterData();

    const [selectedClientId, setSelectedClientId] = useState('');
    const [invoiceDate, setInvoiceDate] = useState(new Date().toISOString().split('T')[0]);
    const [dueDate, setDueDate] = useState('');
    const [items, setItems] = useState<InvoiceItem[]>([]);
    const [notes, setNotes] = useState('Thank you for your business.');

    const [showPreview, setShowPreview] = useState(false);

    // Calculation State
    const [subTotal, setSubTotal] = useState(0);
    const [taxTotal, setTaxTotal] = useState(0);
    const [grandTotal, setGrandTotal] = useState(0);

    // Derived
    const selectedClient = clients.find(c => c.id === selectedClientId);
    const isInterState = selectedClient?.state && masterData.companyKYC?.registeredAddress?.includes(selectedClient.state) === false;

    useEffect(() => {
        const sub = items.reduce((sum, item) => sum + item.amount, 0);
        const tax = items.reduce((sum, item) => sum + (item.amount * (item.taxRate / 100)), 0);
        setSubTotal(sub);
        setTaxTotal(tax);
        setGrandTotal(sub + tax);
    }, [items]);

    const handleAddItem = () => {
        setItems([...items, {
            id: `item-${Date.now()}`,
            description: 'New Service Item',
            hsn: '9985',
            quantity: 1,
            rate: 0,
            taxRate: 18,
            amount: 0
        }]);
    };

    const updateItem = (id: string, field: keyof InvoiceItem, value: any) => {
        setItems(items.map(item => {
            if (item.id === id) {
                const updated = { ...item, [field]: value };
                // Recalc amount if qt or rate changes
                if (field === 'quantity' || field === 'rate') {
                    updated.amount = updated.quantity * updated.rate;
                }
                return updated;
            }
            return item;
        }));
    };

    const removeItem = (id: string) => {
        setItems(items.filter(i => i.id !== id));
    };

    const handleSave = () => {
        if (!selectedClient) return alert('Please select a client');

        const newInvoice: Invoice = {
            id: `inv-${Date.now()}`,
            invoiceNo: `INV/${new Date().getFullYear()}/${Math.floor(Math.random() * 1000)}`,
            date: invoiceDate,
            dueDate: dueDate || invoiceDate,
            clientId: selectedClientId,
            clientName: selectedClient.name,
            items,
            subTotal,
            taxTotal,
            grandTotal,
            status: 'Pending',
            notes
        };

        addInvoice(newInvoice);
        alert('Invoice Generated Successfully!');
        // Reset or redirect could happen here
    };

    // Preview Logic
    const currentInvoiceData: Invoice = {
        id: 'preview',
        invoiceNo: 'PREVIEW',
        date: invoiceDate,
        dueDate: dueDate,
        clientId: selectedClientId || '',
        clientName: selectedClient?.name || '',
        items,
        subTotal,
        taxTotal,
        grandTotal,
        status: 'Draft',
        notes
    };

    if (showPreview) {
        return (
            <div className="fixed inset-0 bg-black/80 z-50 flex flex-col items-center justify-center p-4 overflow-auto">
                <div className="bg-white text-black w-full max-w-[210mm] min-h-[297mm] shadow-2xl rounded-sm overflow-hidden mb-4 scale-75 md:scale-100 origin-top">
                    <InvoiceTemplate invoice={currentInvoiceData} company={masterData.companyKYC} />
                </div>
                <div className="fixed bottom-8 flex gap-4">
                    <button
                        onClick={() => setShowPreview(false)}
                        className="bg-gray-800 text-white px-6 py-3 rounded-full shadow-xl hover:bg-gray-700 transition-all font-bold"
                    >
                        Close Preview
                    </button>
                    <button
                        onClick={() => window.print()}
                        className="bg-primary text-white px-6 py-3 rounded-full shadow-xl hover:bg-primary/90 transition-all font-bold flex items-center gap-2"
                    >
                        <Printer className="w-5 h-5" />
                        Print / Save PDF
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 max-w-6xl mx-auto space-y-6 animate-fade-in pb-24">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Generate Invoice</h1>
                    <p className="text-muted-foreground">Create professional GST invoices</p>
                </div>
                <button
                    onClick={handleSave}
                    className="bg-primary text-primary-foreground px-6 py-2 rounded-lg flex items-center gap-2 hover:bg-primary/90 transition-all font-bold shadow-lg shadow-primary/25"
                >
                    <Save className="w-5 h-5" />
                    Save Invoice
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Header Info */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-[#1f1428] border border-gray-800 rounded-xl p-6">
                        <h3 className="text-lg font-semibold mb-4 text-primary">Client Details</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-1 opacity-80">Select Client</label>
                                <select
                                    value={selectedClientId}
                                    onChange={(e) => setSelectedClientId(e.target.value)}
                                    className="w-full bg-[#130d1f] border border-gray-700 rounded-lg px-4 py-2 focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                                >
                                    <option value="">-- Choose Client --</option>
                                    {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                </select>
                            </div>
                        </div>
                        {selectedClient && (
                            <div className="mt-4 p-4 bg-primary/5 rounded-lg border border-primary/10 text-sm">
                                <p><strong className="text-primary">GSTIN:</strong> {selectedClient.gstin}</p>
                                <p><strong className="text-primary">Address:</strong> {selectedClient.address}</p>
                                <p><strong className="text-primary">State:</strong> {selectedClient.state}</p>
                            </div>
                        )}
                    </div>

                    <div className="bg-[#1f1428] border border-gray-800 rounded-xl p-6">
                        <h3 className="text-lg font-semibold mb-4 text-primary">Invoice Details</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-1 opacity-80">Invoice Date</label>
                                <input
                                    type="date"
                                    value={invoiceDate}
                                    onChange={(e) => setInvoiceDate(e.target.value)}
                                    className="w-full bg-[#130d1f] border border-gray-700 rounded-lg px-4 py-2 focus:border-primary outline-none [color-scheme:dark]"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1 opacity-80">Due Date</label>
                                <input
                                    type="date"
                                    value={dueDate}
                                    onChange={(e) => setDueDate(e.target.value)}
                                    className="w-full bg-[#130d1f] border border-gray-700 rounded-lg px-4 py-2 focus:border-primary outline-none [color-scheme:dark]"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Summary Sidebar */}
                <div className="lg:col-span-1">
                    <div className="bg-gradient-to-br from-[#1f1428] to-[#2d1b3d] border border-primary/20 rounded-xl p-6 sticky top-6 shadow-xl">
                        <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
                            <FileText className="w-5 h-5 text-accent" />
                            Invoice Summary
                        </h3>

                        <div className="space-y-3 mb-6">
                            <div className="flex justify-between text-muted-foreground">
                                <span>Sub Total</span>
                                <span>₹{subTotal.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-muted-foreground">
                                <span>Tax ({isInterState ? 'IGST' : 'CGST+SGST'})</span>
                                <span>₹{taxTotal.toFixed(2)}</span>
                            </div>
                            <div className="h-px bg-gray-700 my-2"></div>
                            <div className="flex justify-between text-xl font-bold text-white">
                                <span>Total</span>
                                <span className="text-accent">₹{grandTotal.toFixed(2)}</span>
                            </div>
                        </div>

                        <button
                            onClick={() => setShowPreview(true)}
                            className="w-full bg-gray-800 hover:bg-gray-700 text-white py-2 rounded-lg mb-2 flex items-center justify-center gap-2 transition-colors"
                        >
                            <Printer className="w-4 h-4" /> Preview PDF
                        </button>
                    </div>
                </div>
            </div>

            {/* Line Items */}
            <div className="bg-[#1f1428] border border-gray-800 rounded-xl p-6">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold">Line Items</h3>
                    <button
                        onClick={handleAddItem}
                        className="text-sm bg-primary/10 text-primary px-3 py-1.5 rounded-lg hover:bg-primary/20 flex items-center gap-1 transition-colors"
                    >
                        <Plus className="w-4 h-4" /> Add Item
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full min-w-[800px]">
                        <thead className="bg-gray-900/50 text-xs uppercase text-gray-400">
                            <tr>
                                <th className="px-4 py-3 text-left w-1/3">Description</th>
                                <th className="px-4 py-3 text-left w-24">HSN</th>
                                <th className="px-4 py-3 text-right w-24">Qty</th>
                                <th className="px-4 py-3 text-right w-32">Rate</th>
                                <th className="px-4 py-3 text-right w-24">Tax %</th>
                                <th className="px-4 py-3 text-right w-32">Amount</th>
                                <th className="px-4 py-3 w-16"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-800">
                            {items.map(item => (
                                <tr key={item.id} className="group">
                                    <td className="px-4 py-2">
                                        <input
                                            type="text"
                                            value={item.description}
                                            onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                                            className="w-full bg-transparent border-none focus:ring-0 p-0 text-sm"
                                            placeholder="Item description"
                                        />
                                    </td>
                                    <td className="px-4 py-2">
                                        <input
                                            type="text"
                                            value={item.hsn}
                                            onChange={(e) => updateItem(item.id, 'hsn', e.target.value)}
                                            className="w-full bg-transparent border-none focus:ring-0 p-0 text-sm"
                                        />
                                    </td>
                                    <td className="px-4 py-2">
                                        <input
                                            type="number"
                                            value={item.quantity}
                                            onChange={(e) => updateItem(item.id, 'quantity', parseFloat(e.target.value))}
                                            className="w-full bg-transparent border-none focus:ring-0 p-0 text-sm text-right"
                                        />
                                    </td>
                                    <td className="px-4 py-2">
                                        <input
                                            type="number"
                                            value={item.rate}
                                            onChange={(e) => updateItem(item.id, 'rate', parseFloat(e.target.value))}
                                            className="w-full bg-transparent border-none focus:ring-0 p-0 text-sm text-right"
                                        />
                                    </td>
                                    <td className="px-4 py-2 text-right text-sm text-muted-foreground">
                                        {item.taxRate}%
                                    </td>
                                    <td className="px-4 py-2 text-right text-sm font-medium">
                                        ₹{item.amount.toLocaleString()}
                                    </td>
                                    <td className="px-4 py-2 text-center">
                                        <button
                                            onClick={() => removeItem(item.id)}
                                            className="text-destructive hover:bg-destructive/10 p-1.5 rounded transition-colors"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {items.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground border-t border-gray-800 mt-2">
                        No items added. Click "Add Item" to start.
                    </div>
                )}
            </div>

            <div className="bg-[#1f1428] border border-gray-800 rounded-xl p-6">
                <label className="block text-sm font-medium mb-2 opacity-80">Footer Notes</label>
                <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full bg-[#130d1f] border border-gray-700 rounded-lg px-4 py-2 focus:border-primary outline-none"
                    rows={2}
                />
            </div>
        </div>
    );
}

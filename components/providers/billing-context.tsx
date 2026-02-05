'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface Client {
    id: string;
    name: string;
    address: string;
    gstin: string;
    state: string; // state code or name for tax calc
    email: string;
    paymentTerms: string; // e.g. "Net 30"
}

export interface InvoiceItem {
    id: string;
    description: string;
    hsn: string;
    quantity: number;
    rate: number;
    taxRate: number; // e.g. 18
    amount: number;
}

export interface Invoice {
    id: string;
    invoiceNo: string;
    date: string;
    dueDate: string;
    clientId: string;
    clientName: string; // denormalized for easier display
    items: InvoiceItem[];
    subTotal: number;
    taxTotal: number;
    grandTotal: number;
    status: 'Draft' | 'Pending' | 'Paid' | 'Overdue';
    notes?: string;
}

interface BillingContextType {
    clients: Client[];
    invoices: Invoice[];
    addClient: (client: Client) => void;
    updateClient: (client: Client) => void;
    deleteClient: (id: string) => void;
    addInvoice: (invoice: Invoice) => void;
    updateInvoice: (invoice: Invoice) => void;
    deleteInvoice: (id: string) => void;
}

const BillingContext = createContext<BillingContextType | undefined>(undefined);

const INITIAL_CLIENTS: Client[] = [
    { id: 'c-1', name: 'Acme Corp', address: '123 Industry Park, Pune', gstin: '27AABC1234F1Z5', state: 'Maharashtra', email: 'accounts@acme.com', paymentTerms: 'Net 30' },
    { id: 'c-2', name: 'Global Tech', address: '456 Tech Park, Bangalore', gstin: '29XYZ9876L1Z2', state: 'Karnataka', email: 'billing@globaltech.com', paymentTerms: 'Net 15' },
];

const INITIAL_INVOICES: Invoice[] = [
    // Pre-populate some data for the 'Show to Client' demo
    {
        id: 'inv-1',
        invoiceNo: 'INV/24-25/001',
        date: '2024-04-10',
        dueDate: '2024-05-10',
        clientId: 'c-1',
        clientName: 'Acme Corp',
        items: [
            { id: 'i-1', description: 'Security Services - March 2024', hsn: '998525', quantity: 1, rate: 50000, taxRate: 18, amount: 50000 }
        ],
        subTotal: 50000,
        taxTotal: 9000,
        grandTotal: 59000,
        status: 'Paid'
    }
];

export function BillingProvider({ children }: { children: ReactNode }) {
    const [clients, setClients] = useState<Client[]>(INITIAL_CLIENTS);
    const [invoices, setInvoices] = useState<Invoice[]>(INITIAL_INVOICES);

    // Load from localStorage
    useEffect(() => {
        const storedClients = localStorage.getItem('hrm_clients');
        const storedInvoices = localStorage.getItem('hrm_invoices');
        if (storedClients) setClients(JSON.parse(storedClients));
        if (storedInvoices) setInvoices(JSON.parse(storedInvoices));
    }, []);

    // Save changes
    useEffect(() => { localStorage.setItem('hrm_clients', JSON.stringify(clients)); }, [clients]);
    useEffect(() => { localStorage.setItem('hrm_invoices', JSON.stringify(invoices)); }, [invoices]);

    const addClient = (client: Client) => setClients(prev => [...prev, client]);
    const updateClient = (client: Client) => setClients(prev => prev.map(c => c.id === client.id ? client : c));
    const deleteClient = (id: string) => setClients(prev => prev.filter(c => c.id !== id));

    const addInvoice = (invoice: Invoice) => setInvoices(prev => [invoice, ...prev]);
    const updateInvoice = (invoice: Invoice) => setInvoices(prev => prev.map(i => i.id === invoice.id ? invoice : i));
    const deleteInvoice = (id: string) => setInvoices(prev => prev.filter(i => i.id !== id));

    return (
        <BillingContext.Provider value={{
            clients, invoices,
            addClient, updateClient, deleteClient,
            addInvoice, updateInvoice, deleteInvoice
        }}>
            {children}
        </BillingContext.Provider>
    );
}

export function useBilling() {
    const context = useContext(BillingContext);
    if (context === undefined) {
        throw new Error('useBilling must be used within a BillingProvider');
    }
    return context;
}

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

const INITIAL_CLIENTS: Client[] = [];
const INITIAL_INVOICES: Invoice[] = [];

export function BillingProvider({ children }: { children: ReactNode }) {
    const [clients, setClients] = useState<Client[]>(INITIAL_CLIENTS);
    const [invoices, setInvoices] = useState<Invoice[]>(INITIAL_INVOICES);

    // Load from localStorage
    // The original instruction implies removing seeding logic.
    // Since INITIAL_CLIENTS and INITIAL_INVOICES are already empty,
    // "clearing seeding logic" means removing the localStorage load/save effects.

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

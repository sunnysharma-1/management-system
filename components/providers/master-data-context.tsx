'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Types for Company Data
export interface CompanyKYC {
    id: string; // usually just 'default' for single company
    companyName: string;
    registeredAddress: string;
    corporateAddress: string;
    email: string;
    phone: string;
    website: string;
    gstNo: string;
    panNo: string;
    cinNo: string;
    tanNo: string;
    logoUrl?: string;
    themeColor?: string;
}

export interface FinancialYear {
    id: string;
    label: string; // e.g. "2024-2025"
    startDate: string;
    endDate: string;
    isActive: boolean;
}

// Flexible type for generic master entries
export interface MasterItem {
    id: string;
    name: string;
    code?: string;
    [key: string]: any; // Allow other properties
}

interface MasterState {
    companyKYC: CompanyKYC | null;
    financialYears: FinancialYear[];
    countries: MasterItem[];
    states: MasterItem[];
    districts: MasterItem[];
    cities: MasterItem[]; // field-area?
    professionalTaxes: MasterItem[];
    lwfRules: MasterItem[];
    banks: MasterItem[];
    paymentModes: MasterItem[];
    // Add more as needed
}

interface MasterDataContextType {
    data: MasterState;
    updateCompanyKYC: (data: CompanyKYC) => void;
    // Financial Year Actions
    addFinancialYear: (fy: FinancialYear) => void;
    updateFinancialYear: (fy: FinancialYear) => void;
    deleteFinancialYear: (id: string) => void;
    // Generic Actions
    addItem: (key: keyof MasterState, item: MasterItem) => void;
    updateItem: (key: keyof MasterState, item: MasterItem) => void;
    deleteItem: (key: keyof MasterState, id: string) => void;
}

const MasterDataContext = createContext<MasterDataContextType | undefined>(undefined);

const INITIAL_DATA: MasterState = {
    companyKYC: {
        id: 'default',
        companyName: 'AXIS Security Services Ltd.',
        registeredAddress: '123 Business Park, Mumbai',
        corporateAddress: '456 Corporate Tower, Delhi',
        email: 'info@axis.com',
        phone: '+91 9876543210',
        website: 'www.axis.com',
        gstNo: '27AAAAA0000A1Z5',
        panNo: 'AAAA0000A',
        cinNo: 'U12345MH2024PTC123456',
        tanNo: 'MUMB12345C',
    },
    financialYears: [
        { id: 'fy-1', label: '2023-2024', startDate: '2023-04-01', endDate: '2024-03-31', isActive: false },
        { id: 'fy-2', label: '2024-2025', startDate: '2024-04-01', endDate: '2025-03-31', isActive: true },
    ],
    countries: [{ id: 'in', name: 'India', code: 'IN' }],
    states: [
        { id: 'mh', name: 'Maharashtra', code: 'MH', countryId: 'in' },
        { id: 'dl', name: 'Delhi', code: 'DL', countryId: 'in' },
        { id: 'ka', name: 'Karnataka', code: 'KA', countryId: 'in' }
    ],
    districts: [],
    cities: [],
    professionalTaxes: [],
    lwfRules: [],
    banks: [
        { id: 'bank-1', name: 'HDFC Bank', branch: 'Mumbai Main', ifsc: 'HDFC0001234', accountNo: '50200012345678' },
        { id: 'bank-2', name: 'ICICI Bank', branch: 'Delhi CP', ifsc: 'ICIC0005678', accountNo: '100100123456' }
    ],
    paymentModes: [],
};

export function MasterDataProvider({ children }: { children: ReactNode }) {
    const [data, setData] = useState<MasterState>(INITIAL_DATA);

    // Load from localStorage
    useEffect(() => {
        const stored = localStorage.getItem('hrm_master_data');
        if (stored) {
            setData(JSON.parse(stored));
        } else {
            localStorage.setItem('hrm_master_data', JSON.stringify(INITIAL_DATA));
        }
    }, []);

    // Save to localStorage whenever data changes
    useEffect(() => {
        localStorage.setItem('hrm_master_data', JSON.stringify(data));
    }, [data]);

    const updateCompanyKYC = (kyc: CompanyKYC) => {
        setData(prev => ({ ...prev, companyKYC: kyc }));
    };

    const addFinancialYear = (fy: FinancialYear) => {
        setData(prev => {
            // If new one is active, deactivate others
            const updatedFYs = fy.isActive
                ? prev.financialYears.map(f => ({ ...f, isActive: false }))
                : [...prev.financialYears];
            return { ...prev, financialYears: [...updatedFYs, fy] };
        });
    };

    const updateFinancialYear = (fy: FinancialYear) => {
        setData(prev => {
            let updatedFYs = prev.financialYears.map(f => f.id === fy.id ? fy : f);
            if (fy.isActive) {
                updatedFYs = updatedFYs.map(f => f.id === fy.id ? f : { ...f, isActive: false });
            }
            return { ...prev, financialYears: updatedFYs };
        });
    };

    const deleteFinancialYear = (id: string) => {
        setData(prev => ({
            ...prev,
            financialYears: prev.financialYears.filter(f => f.id !== id)
        }));
    };

    const addItem = (key: keyof MasterState, item: MasterItem) => {
        // Safety check
        if (!Array.isArray(data[key])) return;

        setData(prev => ({
            ...prev,
            [key]: [...(prev[key] as any[]), item]
        }));
    };

    const updateItem = (key: keyof MasterState, item: MasterItem) => {
        if (!Array.isArray(data[key])) return;

        setData(prev => ({
            ...prev,
            [key]: (prev[key] as any[]).map(i => i.id === item.id ? item : i)
        }));
    };

    const deleteItem = (key: keyof MasterState, id: string) => {
        if (!Array.isArray(data[key])) return;

        setData(prev => ({
            ...prev,
            [key]: (prev[key] as any[]).filter(i => i.id !== id)
        }));
    };

    return (
        <MasterDataContext.Provider value={{
            data,
            updateCompanyKYC,
            addFinancialYear,
            updateFinancialYear,
            deleteFinancialYear,
            addItem,
            updateItem,
            deleteItem
        }}>
            {children}
        </MasterDataContext.Provider>
    );
}

export function useMasterData() {
    const context = useContext(MasterDataContext);
    if (context === undefined) {
        throw new Error('useMasterData must be used within a MasterDataProvider');
    }
    return context;
}

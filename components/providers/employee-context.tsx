'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface Employee {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    department: string;
    designation: string;
    joiningDate: string;
    salary: number; // Monthly Gross
    bankAccount: string;
    address: string;
    status: 'Active' | 'Inactive';
}

export interface SalarySlip {
    id: string;
    employeeId: string;
    month: string; // YYYY-MM
    basic: number;
    hra: number;
    allowances: number;
    gross: number;
    pf: number;
    profTax: number;
    incomeTax: number;
    totalDeductions: number;
    netPay: number;
    generatedDate: string;
}

interface EmployeeContextType {
    employees: Employee[];
    salarySlips: SalarySlip[];
    addEmployee: (emp: Employee) => void;
    updateEmployee: (emp: Employee) => void;
    deleteEmployee: (id: string) => void;
    generatePayroll: (month: string) => void;
    getSlipsForMonth: (month: string) => SalarySlip[];
    getSlipById: (id: string) => SalarySlip | undefined;
}

const EmployeeContext = createContext<EmployeeContextType | undefined>(undefined);

const INITIAL_EMPLOYEES: Employee[] = []; // Removed demo data

export function EmployeeProvider({ children }: { children: ReactNode }) {
    const [employees, setEmployees] = useState<Employee[]>(INITIAL_EMPLOYEES);
    const [salarySlips, setSalarySlips] = useState<SalarySlip[]>([]);

    // Load from localStorage
    useEffect(() => {
        const storedEmps = localStorage.getItem('hrm_employees');
        const storedSlips = localStorage.getItem('hrm_salary_slips');
        if (storedEmps) setEmployees(JSON.parse(storedEmps));
        if (storedSlips) setSalarySlips(JSON.parse(storedSlips));
    }, []);

    // Save to localStorage
    useEffect(() => { localStorage.setItem('hrm_employees', JSON.stringify(employees)); }, [employees]);
    useEffect(() => { localStorage.setItem('hrm_salary_slips', JSON.stringify(salarySlips)); }, [salarySlips]);

    const addEmployee = (emp: Employee) => setEmployees(prev => [...prev, emp]);
    const updateEmployee = (emp: Employee) => setEmployees(prev => prev.map(e => e.id === emp.id ? emp : e));
    const deleteEmployee = (id: string) => setEmployees(prev => prev.filter(e => e.id !== id));

    const generatePayroll = (month: string) => {
        // Simple logic: Process for all active employees
        // Avoid duplicates for same month
        const existingSlips = salarySlips.filter(s => s.month === month);
        const processedIds = new Set(existingSlips.map(s => s.employeeId));

        const newSlips: SalarySlip[] = employees
            .filter(e => e.status === 'Active' && !processedIds.has(e.id))
            .map(e => {
                // Basic Salary Logic (Simplified)
                // Basic = 50% of Gross
                // HRA = 40% of Basic
                // PF = 12% of Basic
                // PT = 200 (Standard)
                const gross = Number(e.salary);
                const basic = Math.round(gross * 0.5);
                const hra = Math.round(basic * 0.4);
                const allowances = gross - basic - hra;

                const pf = Math.round(basic * 0.12);
                const profTax = 200;
                const incomeTax = gross > 50000 ? Math.round((gross - 50000) * 0.1) : 0; // Dummy slab

                const totalDeductions = pf + profTax + incomeTax;
                const netPay = gross - totalDeductions;

                return {
                    id: `slip-${month}-${e.id}`,
                    employeeId: e.id,
                    month,
                    basic,
                    hra,
                    allowances,
                    gross,
                    pf,
                    profTax,
                    incomeTax,
                    totalDeductions,
                    netPay,
                    generatedDate: new Date().toISOString()
                };
            });

        if (newSlips.length > 0) {
            setSalarySlips(prev => [...prev, ...newSlips]);
            alert(`Payroll processed for ${newSlips.length} employees for ${month}`);
        } else {
            alert('No pending payroll for this month.');
        }
    };

    const getSlipsForMonth = (month: string) => salarySlips.filter(s => s.month === month);
    const getSlipById = (id: string) => salarySlips.find(s => s.id === id);

    return (
        <EmployeeContext.Provider value={{
            employees, salarySlips,
            addEmployee, updateEmployee, deleteEmployee,
            generatePayroll, getSlipsForMonth, getSlipById
        }}>
            {children}
        </EmployeeContext.Provider>
    );
}

export function useEmployee() {
    const context = useContext(EmployeeContext);
    if (context === undefined) {
        throw new Error('useEmployee must be used within an EmployeeProvider');
    }
    return context;
}

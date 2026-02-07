'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type AttendanceStatus = 'Present' | 'Absent' | 'Half Day' | 'Leave';

export interface AttendanceRecord {
    id: string;
    employeeId: string;
    date: string; // YYYY-MM-DD
    status: AttendanceStatus;
    checkIn?: string; // HH:mm
    checkOut?: string; // HH:mm
    notes?: string;
}

interface AttendanceContextType {
    records: AttendanceRecord[];
    markAttendance: (record: Omit<AttendanceRecord, 'id'>) => void;
    getEmployeeAttendance: (employeeId: string, month: string) => AttendanceRecord[];
    getDayAttendance: (date: string) => AttendanceRecord[];
    getStatsForDate: (date: string) => { present: number; absent: number; total: number };
}

const AttendanceContext = createContext<AttendanceContextType | undefined>(undefined);

export function AttendanceProvider({ children }: { children: ReactNode }) {
    const [records, setRecords] = useState<AttendanceRecord[]>([]);

    // Load from localStorage
    useEffect(() => {
        const stored = localStorage.getItem('hrm_attendance');
        if (stored) {
            setRecords(JSON.parse(stored));
        } else {
            setRecords([]);
        }
    }, []);

    // Save to localStorage
    useEffect(() => {
        if (records.length > 0) {
            localStorage.setItem('hrm_attendance', JSON.stringify(records));
        }
    }, [records]);

    const markAttendance = (newRecord: Omit<AttendanceRecord, 'id'>) => {
        setRecords(prev => {
            // Remove existing record for same emp and date if exists
            const filtered = prev.filter(r => !(r.employeeId === newRecord.employeeId && r.date === newRecord.date));
            return [...filtered, { ...newRecord, id: `att-${Date.now()}` }];
        });
    };

    const getEmployeeAttendance = (employeeId: string, month: string) => {
        // month is YYYY-MM
        return records.filter(r => r.employeeId === employeeId && r.date.startsWith(month));
    };

    const getDayAttendance = (date: string) => {
        return records.filter(r => r.date === date);
    };

    const getStatsForDate = (date: string) => {
        const dayRecords = getDayAttendance(date);
        const present = dayRecords.filter(r => r.status === 'Present' || r.status === 'Half Day').length;
        const absent = dayRecords.filter(r => r.status === 'Absent' || r.status === 'Leave').length;
        return { present, absent, total: dayRecords.length };
    };

    return (
        <AttendanceContext.Provider value={{
            records,
            markAttendance,
            getEmployeeAttendance,
            getDayAttendance,
            getStatsForDate
        }}>
            {children}
        </AttendanceContext.Provider>
    );
}

export function useAttendance() {
    const context = useContext(AttendanceContext);
    if (context === undefined) {
        throw new Error('useAttendance must be used within an AttendanceProvider');
    }
    return context;
}

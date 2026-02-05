'use client';

import React, { useState } from "react"
import { useEmployee } from './providers/employee-context';
import { useAttendance, AttendanceStatus } from './providers/attendance-context';
import { Calendar, Clock, CheckCircle, XCircle, AlertCircle, ChevronLeft, ChevronRight } from 'lucide-react';

export function AttendanceModule() {
    const { employees } = useEmployee();
    const { records, markAttendance, getDayAttendance } = useAttendance();
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

    // Daily Stats for Selected Date
    const dayRecords = getDayAttendance(selectedDate);
    const presentCount = dayRecords.filter(r => r.status === 'Present').length;
    const absentCount = dayRecords.filter(r => r.status === 'Absent').length;
    const leaveCount = dayRecords.filter(r => r.status === 'Leave').length;

    const handleMark = (empId: string, status: AttendanceStatus) => {
        markAttendance({
            employeeId: empId,
            date: selectedDate,
            status,
            checkIn: status === 'Present' ? '09:00' : undefined,
            checkOut: status === 'Present' ? '18:00' : undefined
        });
    };

    const handleDateChange = (days: number) => {
        const date = new Date(selectedDate);
        date.setDate(date.getDate() + days);
        setSelectedDate(date.toISOString().split('T')[0]);
    };

    return (
        <div className="flex-1 overflow-auto animate-fade-in">
            <div className="bg-gradient-to-r from-accent/95 to-accent/80 text-accent-foreground px-8 py-6 border-b border-accent/20">
                <h1 className="text-3xl font-bold flex items-center gap-3">
                    <Calendar className="w-8 h-8" />
                    Attendance Management
                </h1>
                <p className="opacity-90 mt-2">Track daily employee attendance and leaves</p>
            </div>

            <div className="p-8 max-w-7xl mx-auto">
                {/* Date Control */}
                <div className="flex flex-col md:flex-row justify-between items-center mb-8 bg-card border border-border p-4 rounded-xl shadow-sm">
                    <div className="flex items-center gap-4">
                        <button onClick={() => handleDateChange(-1)} className="p-2 hover:bg-muted rounded-full transition-colors"><ChevronLeft /></button>
                        <div className="text-xl font-bold font-mono bg-muted/50 px-4 py-1 rounded">{selectedDate}</div>
                        <button onClick={() => handleDateChange(1)} className="p-2 hover:bg-muted rounded-full transition-colors"><ChevronRight /></button>
                    </div>
                    <div className="flex gap-4 mt-4 md:mt-0">
                        <div className="flex items-center gap-2 text-emerald-500 font-bold bg-emerald-500/10 px-3 py-1 rounded-full"><CheckCircle className="w-4 h-4" /> Present: {presentCount}</div>
                        <div className="flex items-center gap-2 text-red-500 font-bold bg-red-500/10 px-3 py-1 rounded-full"><XCircle className="w-4 h-4" /> Absent: {absentCount}</div>
                        <div className="flex items-center gap-2 text-yellow-500 font-bold bg-yellow-500/10 px-3 py-1 rounded-full"><AlertCircle className="w-4 h-4" /> Leave: {leaveCount}</div>
                    </div>
                </div>

                {/* Attendance Grid */}
                <div className="bg-card border border-border rounded-xl overflow-hidden shadow">
                    <div className="grid grid-cols-[2fr_1fr_2fr_1fr] bg-muted/50 p-4 font-semibold text-muted-foreground border-b border-border">
                        <div>Employee</div>
                        <div>Department</div>
                        <div className="text-center">Status</div>
                        <div className="text-right">Actions</div>
                    </div>
                    <div className="divide-y divide-border">
                        {employees.filter(e => e.status === 'Active').map(emp => {
                            const record = dayRecords.find(r => r.employeeId === emp.id);
                            const status = record?.status || 'Not Marked';

                            return (
                                <div key={emp.id} className="grid grid-cols-[2fr_1fr_2fr_1fr] p-4 items-center hover:bg-muted/30 transition-colors">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary">
                                            {emp.firstName[0]}{emp.lastName[0]}
                                        </div>
                                        <div>
                                            <div className="font-medium">{emp.firstName} {emp.lastName}</div>
                                            <div className="text-xs text-muted-foreground">{emp.id}</div>
                                        </div>
                                    </div>
                                    <div className="text-sm text-muted-foreground">{emp.department}</div>
                                    <div className="flex justify-center">
                                        <div className={`px-3 py-1 rounded-full text-xs font-bold border ${status === 'Present' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' :
                                                status === 'Absent' ? 'bg-red-500/10 text-red-500 border-red-500/20' :
                                                    status === 'Leave' ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' :
                                                        'bg-gray-500/10 text-gray-400 border-gray-500/20'
                                            }`}>
                                            {status.toUpperCase()}
                                        </div>
                                        {record?.checkIn && (
                                            <div className="ml-2 text-xs flex items-center gap-1 text-muted-foreground">
                                                <Clock className="w-3 h-3" /> {record.checkIn} - {record.checkOut}
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex justify-end gap-2">
                                        <button
                                            onClick={() => handleMark(emp.id, 'Present')}
                                            title="Mark Present"
                                            className={`p-2 rounded-lg transition-all ${status === 'Present' ? 'bg-emerald-500 text-white' : 'hover:bg-emerald-500/20 text-emerald-500'}`}
                                        ><CheckCircle className="w-4 h-4" /></button>

                                        <button
                                            onClick={() => handleMark(emp.id, 'Absent')}
                                            title="Mark Absent"
                                            className={`p-2 rounded-lg transition-all ${status === 'Absent' ? 'bg-red-500 text-white' : 'hover:bg-red-500/20 text-red-500'}`}
                                        ><XCircle className="w-4 h-4" /></button>

                                        <button
                                            onClick={() => handleMark(emp.id, 'Leave')}
                                            title="Mark Leave"
                                            className={`p-2 rounded-lg transition-all ${status === 'Leave' ? 'bg-yellow-500 text-white' : 'hover:bg-yellow-500/20 text-yellow-500'}`}
                                        ><AlertCircle className="w-4 h-4" /></button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}

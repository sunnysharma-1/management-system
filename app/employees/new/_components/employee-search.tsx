'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Search, Loader2 } from 'lucide-react';

import { cn } from '@/lib/utils';
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandItem,
    CommandList,
} from '@/components/ui/command';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { api } from '@/lib/api';

export function EmployeeSearch() {
    const router = useRouter();
    const [open, setOpen] = React.useState(false);
    const [query, setQuery] = React.useState('');
    const [employees, setEmployees] = React.useState<any[]>([]);
    const [loading, setLoading] = React.useState(false);
    const [selectedIndex, setSelectedIndex] = React.useState(0);

    React.useEffect(() => {
        const fetchEmployees = async () => {
            if (!query) {
                setEmployees([]);
                return;
            }

            setLoading(true);
            try {
                // Fetch with limit to keep it snappy, advanced matching happens on backend
                const data = await api.getEmployees({ query, limit: 10, page: 1 });
                setEmployees(data.employees || []);
                setSelectedIndex(0); // Reset selection on new results
            } catch (error) {
                console.error("Search failed", error);
                setEmployees([]);
            } finally {
                setLoading(false);
            }
        };

        const timer = setTimeout(fetchEmployees, 300);
        return () => clearTimeout(timer);
    }, [query]);

    const handleSelect = (employeeId: string) => {
        setOpen(false);
        router.push(`/employees/new?code=${employeeId}`);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setSelectedIndex(prev => (prev + 1) % employees.length);
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setSelectedIndex(prev => (prev - 1 + employees.length) % employees.length);
        } else if (e.key === 'Enter') {
            e.preventDefault();
            if (employees.length > 0) {
                handleSelect(employees[selectedIndex]?.employeeId || employees[0].employeeId);
            }
        }
    };

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <div className="relative w-full max-w-xl">
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <Search className="h-5 w-5 text-slate-400 group-focus-within:text-primary transition-colors" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search by Name or Code (e.g. 001)..."
                            className="block w-full pl-11 pr-4 py-3 bg-slate-900 border border-slate-700/50 rounded-xl text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all shadow-lg shadow-black/20"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            onKeyDown={handleKeyDown}
                            onClick={() => setOpen(true)}
                            autoComplete="off"
                        />
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                            <kbd className="hidden sm:inline-flex h-6 select-none items-center gap-1 rounded border border-slate-700 bg-slate-800 px-2 text-[10px] font-medium text-slate-400 opacity-100">
                                <span className="text-xs">↵</span>
                            </kbd>
                        </div>
                    </div>
                </div>
            </PopoverTrigger>
            <PopoverContent
                className="p-0 w-[var(--radix-popover-trigger-width)] min-w-[300px] bg-slate-900/95 backdrop-blur-xl border-slate-700/50 shadow-2xl overflow-hidden"
                align="start"
                sideOffset={8}
                onOpenAutoFocus={(e) => e.preventDefault()} // Prevent focus stealing
            >
                <Command className="bg-transparent text-slate-100" shouldFilter={false}>
                    <div className="px-4 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider border-b border-slate-700/50 flex justify-between items-center bg-slate-900/50">
                        <span>{loading ? 'Searching...' : 'Results'}</span>
                        {employees.length > 0 && <span className="text-primary">{employees.length} found</span>}
                    </div>

                    <CommandList className="max-h-[350px] overflow-y-auto custom-scrollbar p-1">
                        {!loading && employees.length === 0 && query && (
                            <CommandEmpty className="py-12 text-center text-sm text-slate-400 flex flex-col items-center gap-3">
                                <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center">
                                    <Search className="w-6 h-6 opacity-20" />
                                </div>
                                <div className="flex flex-col gap-1">
                                    <span className="font-medium text-slate-300">No employee found</span>
                                    <span className="text-xs text-slate-500">Try searching by name or ID code</span>
                                </div>
                            </CommandEmpty>
                        )}
                        <CommandGroup>
                            {employees.map((employee, index) => {
                                const isSelected = index === selectedIndex;
                                return (
                                    <CommandItem
                                        key={employee.employeeId}
                                        value={`${employee.firstName} ${employee.lastName} ${employee.employeeId}`}
                                        onSelect={() => handleSelect(employee.employeeId)}
                                        className={cn(
                                            "flex items-center gap-3 p-3 rounded-lg cursor-pointer mb-1 last:mb-0 transition-all border border-transparent",
                                            isSelected ? "bg-primary/10 border-white/5 shadow-sm" : "hover:bg-white/5"
                                        )}
                                    >
                                        <Avatar className={cn(
                                            "h-10 w-10 border-2 transition-colors",
                                            isSelected ? "border-primary/50" : "border-slate-700"
                                        )}>
                                            <AvatarImage src={employee.documents?.photo} alt={employee.firstName} className="object-cover" />
                                            <AvatarFallback className={cn(
                                                "text-xs font-medium",
                                                isSelected ? "bg-primary/20 text-primary" : "bg-slate-800 text-slate-400"
                                            )}>
                                                {employee.firstName?.[0]}{employee.lastName?.[0]}
                                            </AvatarFallback>
                                        </Avatar>

                                        <div className="flex flex-col flex-1 gap-0.5 overflow-hidden">
                                            <div className="flex items-center justify-between">
                                                <span className={cn(
                                                    "font-medium truncate",
                                                    isSelected ? "text-primary" : "text-slate-200"
                                                )}>
                                                    {employee.firstName} {employee.lastName}
                                                </span>
                                                <span className={cn(
                                                    "text-[10px] px-2 py-0.5 rounded-full border font-medium",
                                                    employee.status === 'Active'
                                                        ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                                                        : 'bg-red-500/10 border-red-500/20 text-red-400'
                                                )}>
                                                    {employee.status}
                                                </span>
                                            </div>
                                            <div className="flex items-center justify-between text-xs text-slate-500">
                                                <span className="flex items-center gap-1.5 truncate">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-slate-600"></span>
                                                    {employee.designation}
                                                </span>
                                                <span className={cn(
                                                    "font-mono text-[10px] px-1.5 py-0.5 rounded transition-colors",
                                                    isSelected ? "bg-primary/20 text-primary" : "bg-slate-800/50"
                                                )}>
                                                    {employee.employeeId}
                                                </span>
                                            </div>
                                        </div>
                                    </CommandItem>
                                );
                            })}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}

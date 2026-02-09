'use client';

import { AuroraBackground } from '@/components/ui/aurora-background';
import { useRouter } from 'next/navigation';
import {
    FileText, Building2, Users, ArrowRight,
    BarChart3, PieChart, DollarSign
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function ReportsDashboard() {
    const router = useRouter();

    const reports = [
        {
            title: 'Unit Master Report',
            description: 'Comprehensive list of all site units, locations, compliances, and contacts.',
            icon: Building2,
            color: 'text-indigo-400',
            bg: 'bg-indigo-500/10',
            link: '/reports/units'
        },
        {
            title: 'Employee Strength',
            description: 'Headcount analysis per unit and designation.',
            icon: Users,
            color: 'text-emerald-400',
            bg: 'bg-emerald-500/10',
            link: '/reports/employees' // Placeholder
        },
        {
            title: 'Billing History',
            description: 'Track generated invoices and payment status per unit.',
            icon: BarChart3,
            color: 'text-blue-400',
            bg: 'bg-blue-500/10',
            link: '/reports/billing' // Placeholder
        },
        {
            title: 'Advance History',
            description: 'Track employee advances and recovery status pending/approved.',
            icon: DollarSign,
            color: 'text-emerald-400',
            bg: 'bg-emerald-500/10',
            link: '/reports/advances'
        },
        {
            title: 'Statutory Compliance',
            description: 'EPF, ESIC, and GST compliance status overview.',
            icon: FileText,
            color: 'text-purple-400',
            bg: 'bg-purple-500/10',
            link: '/reports/statutory' // Placeholder
        }
    ];

    return (
        <AuroraBackground className="flex flex-col">
            <div className="h-full overflow-y-auto w-full p-8">
                <div className="max-w-6xl mx-auto space-y-12">

                    <div className="text-center space-y-4">
                        <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">
                            Reports & Analytics
                        </h1>
                        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                            Access detailed insights about your Units, Employees, and Billing operations.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {reports.map((report, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                onClick={() => report.link && router.push(report.link)}
                                className={`group bg-card/40 backdrop-blur border border-white/10 rounded-3xl p-8 hover:bg-card/60 transition-all cursor-pointer relative overflow-hidden`}
                            >
                                <div className={`absolute top-0 right-0 p-32 ${report.bg} opacity-20 rounded-full blur-3xl -mr-16 -mt-16 transition-opacity group-hover:opacity-40`} />

                                <div className="relative z-10 flex items-start gap-6">
                                    <div className={`p-4 rounded-2xl ${report.bg} border border-white/5`}>
                                        <report.icon className={`w-8 h-8 ${report.color}`} />
                                    </div>
                                    <div className="flex-1 space-y-2">
                                        <h3 className="text-xl font-bold text-white group-hover:text-indigo-300 transition-colors">
                                            {report.title}
                                        </h3>
                                        <p className="text-muted-foreground leading-relaxed">
                                            {report.description}
                                        </p>
                                    </div>
                                    <div className="self-center">
                                        <div className="p-2 rounded-full bg-white/5 group-hover:bg-white/10 text-white/50 group-hover:text-white transition-all">
                                            <ArrowRight className="w-5 h-5" />
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                </div>
            </div>
        </AuroraBackground>
    );
}

'use client';

import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
    Briefcase, FileText, TrendingUp, Users,
    MapPin, Wallet, PieChart, Sparkles, ArrowRight
} from 'lucide-react';
import { AuroraBackground } from '@/components/ui/aurora-background';
import { KineticCard } from '@/components/ui/kinetic-card';

export default function ClientsPage() {
    const router = useRouter();

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: { type: "spring", stiffness: 100 }
        }
    };

    return (
        <AuroraBackground className="flex flex-col">
            <div className="flex-1 overflow-y-auto p-8">
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="max-w-7xl mx-auto space-y-8"
                >
                    {/* Header Section */}
                    <div className="space-y-2 mb-12 relative z-10">
                        <motion.h1
                            className="text-5xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-white/50 tracking-tight"
                            initial={{ x: -50, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ duration: 0.8 }}
                        >
                            Client<span className="text-secondary">.Nexus</span>
                        </motion.h1>
                        <motion.p
                            className="text-xl text-muted-foreground max-w-2xl font-light"
                            initial={{ x: -25, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                        >
                            Manage client relationships, sites, and financial structures with precision.
                        </motion.p>
                    </div>

                    {/* Bento Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 auto-rows-[200px]">

                        {/* 1. Clients & Units (Large Vertical - 2x2) */}
                        <motion.div variants={itemVariants} className="col-span-1 md:col-span-2 row-span-2">
                            <KineticCard
                                onClick={() => router.push('/clients/list')}
                                gradientColor="from-indigo-600/30 to-violet-500/30"
                                className="h-full p-8 flex flex-col justify-between group"
                            >
                                <div className="space-y-4">
                                    <div className="p-4 rounded-2xl bg-indigo-500/20 w-fit text-indigo-400">
                                        <Briefcase className="w-10 h-10" />
                                    </div>
                                    <div>
                                        <h2 className="text-3xl font-bold text-white mb-2">Clients & Units</h2>
                                        <p className="text-white/60 text-lg">Manage client profiles and their specific site locations.</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 text-indigo-300 font-medium group-hover:gap-4 transition-all">
                                    View Clients <ArrowRight className="w-5 h-5" />
                                </div>
                                <div className="absolute right-[-20px] bottom-[-20px] opacity-20 rotate-12 group-hover:rotate-6 transition-transform duration-700">
                                    <MapPin className="w-64 h-64 text-indigo-500" />
                                </div>
                            </KineticCard>
                        </motion.div>

                        {/* 2. Salary Rate Breakup (Horizontal - 2x1) */}
                        <motion.div variants={itemVariants} className="col-span-1 md:col-span-2 row-span-1">
                            <KineticCard
                                onClick={() => router.push('/rates/list')}
                                gradientColor="from-emerald-600/30 to-teal-500/30"
                                className="h-full p-8 flex items-center justify-between group"
                            >
                                <div className="space-y-2 z-10">
                                    <div className="flex items-center gap-3">
                                        <Wallet className="w-6 h-6 text-emerald-400" />
                                        <h2 className="text-2xl font-bold text-white">Salary Rates</h2>
                                    </div>
                                    <p className="text-white/60">Define guard salary structures per site.</p>
                                </div>
                                <div className="relative">
                                    <Users className="w-24 h-24 text-emerald-500/20 group-hover:text-emerald-500/40 transition-colors" />
                                </div>
                            </KineticCard>
                        </motion.div>

                        {/* 3. Bill Rate Breakup (Small - 1x1) */}
                        <motion.div variants={itemVariants} className="col-span-1 row-span-1">
                            <KineticCard
                                onClick={() => router.push('/clients/rates/billing')}
                                gradientColor="from-blue-600/30 to-cyan-500/30"
                                className="h-full p-6 flex flex-col justify-between group"
                            >
                                <FileText className="w-8 h-8 text-blue-400" />
                                <div>
                                    <h3 className="text-xl font-bold text-white">Bill Rates</h3>
                                    <p className="text-xs text-white/50 mt-1">Client Charge Settings</p>
                                </div>
                            </KineticCard>
                        </motion.div>

                        {/* 4. Reports (Small - 1x1) */}
                        <motion.div variants={itemVariants} className="col-span-1 row-span-1">
                            <KineticCard
                                onClick={() => router.push('/reports')}
                                gradientColor="from-rose-600/30 to-red-500/30"
                                className="h-full p-6 flex flex-col justify-between group"
                            >
                                <PieChart className="w-8 h-8 text-rose-400" />
                                <div>
                                    <h3 className="text-xl font-bold text-white">Reports</h3>
                                    <p className="text-xs text-white/50 mt-1">Client Analytics</p>
                                </div>
                            </KineticCard>
                        </motion.div>

                        {/* 5. Placeholder (Wide) */}
                        <motion.div variants={itemVariants} className="col-span-1 md:col-span-2 lg:col-span-4 row-span-1">
                            <KineticCard
                                gradientColor="from-gray-800/50 to-zinc-800/50"
                                className="h-full p-6 flex items-center justify-center gap-4 opacity-50 hover:opacity-100 transition-opacity"
                            >
                                <Sparkles className="w-5 h-5 text-white/40" />
                                <span className="text-white/40 font-mono text-sm uppercase tracking-widest">Contract Management System Coming Soon</span>
                            </KineticCard>
                        </motion.div>

                    </div>
                </motion.div>
            </div>
        </AuroraBackground>
    );
}

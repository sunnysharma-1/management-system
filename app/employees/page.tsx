'use client';

import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
    UserPlus, FileText, Users, Search,
    ArrowRight, Calculator, RefreshCw, Sparkles,
    Briefcase, TrendingUp
} from 'lucide-react';
import { AuroraBackground } from '@/components/ui/aurora-background';
import { KineticCard } from '@/components/ui/kinetic-card';

export default function EmployeesPage() {
    const router = useRouter();

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                type: "spring",
                stiffness: 100
            }
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
                            Workforce<span className="text-primary">.Axis</span>
                        </motion.h1>
                        <motion.p
                            className="text-xl text-muted-foreground max-w-2xl font-light"
                            initial={{ x: -25, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                        >
                            Orchestrate your team with precision. Manage onboarding, analytics, and compliance in one unified dimension.
                        </motion.p>
                    </div>

                    {/* Asymmetric Bento Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 auto-rows-[200px]">

                        {/* 1. Onboard New (Large Vertical - 2x2) */}
                        <motion.div variants={itemVariants} className="col-span-1 md:col-span-2 row-span-2">
                            <KineticCard
                                onClick={() => router.push('/employees/new')}
                                gradientColor="from-blue-600/30 to-cyan-500/30"
                                className="h-full p-8 flex flex-col justify-between"
                            >
                                <div className="space-y-4">
                                    <div className="p-4 rounded-2xl bg-blue-500/20 w-fit text-blue-400">
                                        <UserPlus className="w-10 h-10" />
                                    </div>
                                    <div>
                                        <h2 className="text-3xl font-bold text-white mb-2">Onboard Talent</h2>
                                        <p className="text-white/60 text-lg">Initialize new employee records with our smart salary calculator.</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 text-blue-300 font-medium group-hover:gap-4 transition-all">
                                    Start Onboarding <ArrowRight className="w-5 h-5" />
                                </div>

                                {/* Decorative Background Elements */}
                                <div className="absolute right-[-20px] bottom-[-20px] opacity-20 rotate-12 group-hover:rotate-6 transition-transform duration-700">
                                    <Briefcase className="w-64 h-64 text-blue-500" />
                                </div>
                            </KineticCard>
                        </motion.div>

                        {/* 2. Reports (Horizontal - 2x1) */}
                        <motion.div variants={itemVariants} className="col-span-1 md:col-span-2 row-span-1">
                            <KineticCard
                                onClick={() => router.push('/employees/reports')}
                                gradientColor="from-purple-600/30 to-pink-500/30"
                                className="h-full p-8 flex items-center justify-between"
                            >
                                <div className="space-y-2 z-10">
                                    <div className="flex items-center gap-3">
                                        <FileText className="w-6 h-6 text-purple-400" />
                                        <h2 className="text-2xl font-bold text-white">Analytics & Reports</h2>
                                    </div>
                                    <p className="text-white/60">Generate detailed insights.</p>
                                </div>
                                <div className="relative">
                                    <TrendingUp className="w-24 h-24 text-purple-500/20 group-hover:text-purple-500/40 transition-colors" />
                                </div>
                            </KineticCard>
                        </motion.div>

                        {/* 3. Staff List (Small - 1x1) */}
                        <motion.div variants={itemVariants} className="col-span-1 row-span-1">
                            <KineticCard
                                onClick={() => router.push('/employees/list')}
                                gradientColor="from-green-600/30 to-emerald-500/30"
                                className="h-full p-6 flex flex-col justify-between group"
                            >
                                <Users className="w-8 h-8 text-green-400" />
                                <div>
                                    <h3 className="text-xl font-bold text-white">Directory</h3>
                                    <p className="text-xs text-white/50 mt-1">Active & Exited</p>
                                </div>
                            </KineticCard>
                        </motion.div>

                        {/* 4. Search (Small - 1x1) */}
                        <motion.div variants={itemVariants} className="col-span-1 row-span-1">
                            <KineticCard
                                onClick={() => router.push('/employees/search')}
                                gradientColor="from-amber-600/30 to-orange-500/30"
                                className="h-full p-6 flex flex-col justify-between"
                            >
                                <Search className="w-8 h-8 text-amber-400" />
                                <div>
                                    <h3 className="text-xl font-bold text-white">Search</h3>
                                    <p className="text-xs text-white/50 mt-1">Find by ID/Name</p>
                                </div>
                            </KineticCard>
                        </motion.div>

                        {/* 5. Placeholder / Future (Small - 1x1) */}
                        <motion.div variants={itemVariants} className="col-span-1 md:col-span-2 lg:col-span-4 row-span-1">
                            <KineticCard
                                gradientColor="from-gray-800/50 to-zinc-800/50"
                                className="h-full p-6 flex items-center justify-center gap-4 opacity-50 hover:opacity-100 transition-opacity"
                            >
                                <Sparkles className="w-5 h-5 text-white/40" />
                                <span className="text-white/40 font-mono text-sm uppercase tracking-widest">More modules coming soon</span>
                            </KineticCard>
                        </motion.div>

                    </div>
                </motion.div>
            </div>
        </AuroraBackground>
    );
}

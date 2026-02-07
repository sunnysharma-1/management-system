'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft, FileText, Download, TrendingUp, Users, UserMinus, UserPlus } from 'lucide-react';
import { motion } from 'framer-motion';
import { AuroraBackground } from '@/components/ui/aurora-background';
import { mockEmployees, departmentStats, hiringTrends } from '@/lib/mock-data';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend, CartesianGrid } from 'recharts';

export default function EmployeeReportsPage() {
    const router = useRouter();

    const stats = [
        { title: 'Total Active', count: mockEmployees.filter(e => e.status === 'Active').length, icon: Users, color: 'text-blue-400', bg: 'bg-blue-500/10' },
        { title: 'New Joiners (This Month)', count: 3, icon: UserPlus, color: 'text-green-400', bg: 'bg-green-500/10' },
        { title: 'Exited / Inactive', count: mockEmployees.filter(e => e.status !== 'Active').length, icon: UserMinus, color: 'text-red-400', bg: 'bg-red-500/10' },
    ];

    return (
        <AuroraBackground className="flex flex-col">
            <div className="h-full overflow-y-auto w-full">
                <div className="max-w-7xl mx-auto p-8 space-y-8">

                    {/* Header */}
                    <div className="flex items-center justify-between mb-8 relative z-10">
                        <div className="flex items-center gap-4">
                            <button onClick={() => router.back()} className="p-2 hover:bg-white/10 rounded-full transition-colors text-white">
                                <ArrowLeft className="w-6 h-6" />
                            </button>
                            <div>
                                <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">Workforce Analytics</h1>
                                <p className="text-muted-foreground">Real-time insights into employee distribution and trends.</p>
                            </div>
                        </div>
                        <button className="flex items-center gap-2 px-4 py-2 bg-primary/20 hover:bg-primary/30 text-primary border border-primary/20 rounded-xl transition-all">
                            <Download className="w-4 h-4" /> Export Report
                        </button>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
                        {stats.map((stat, idx) => {
                            const Icon = stat.icon;
                            return (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.1 }}
                                    className="bg-card/30 backdrop-blur-md border border-white/10 rounded-3xl p-6 hover:bg-card/40 transition-colors"
                                >
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <p className="text-muted-foreground text-sm font-medium mb-1">{stat.title}</p>
                                            <h3 className="text-4xl font-bold text-white mb-2">{stat.count}</h3>
                                            <div className="text-xs text-green-400 flex items-center gap-1">
                                                <TrendingUp className="w-3 h-3" /> +12% from last month
                                            </div>
                                        </div>
                                        <div className={`p-3 rounded-2xl ${stat.bg} ${stat.color}`}>
                                            <Icon className="w-6 h-6" />
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>

                    {/* Charts Section */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 relative z-10">

                        {/* Hiring Trend */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.3 }}
                            className="bg-card/30 backdrop-blur-md border border-white/10 rounded-3xl p-8"
                        >
                            <h3 className="text-lg font-bold text-white mb-6">Hiring & Attrition Trends</h3>
                            <div className="h-[300px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={hiringTrends}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                                        <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                                        <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                                        <Tooltip
                                            contentStyle={{ backgroundColor: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                                            itemStyle={{ color: '#fff' }}
                                        />
                                        <Legend />
                                        <Bar dataKey="hired" name="Hired" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={20} />
                                        <Bar dataKey="left" name="Left" fill="#ef4444" radius={[4, 4, 0, 0]} barSize={20} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </motion.div>

                        {/* Department Distribution */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.4 }}
                            className="bg-card/30 backdrop-blur-md border border-white/10 rounded-3xl p-8"
                        >
                            <h3 className="text-lg font-bold text-white mb-6">Department Distribution</h3>
                            <div className="h-[300px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={departmentStats}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={60}
                                            outerRadius={100}
                                            paddingAngle={5}
                                            dataKey="count"
                                        >
                                            {departmentStats.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.fill} stroke="rgba(0,0,0,0.5)" strokeWidth={2} />
                                            ))}
                                        </Pie>
                                        <Tooltip
                                            contentStyle={{ backgroundColor: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                                            itemStyle={{ color: '#fff' }}
                                        />
                                        <Legend verticalAlign="bottom" height={36} iconType="circle" />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        </motion.div>
                    </div>

                    <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-6 flex items-center gap-4 relative z-10">
                        <div className="p-3 bg-blue-500/20 rounded-full text-blue-400">
                            <FileText className="w-6 h-6" />
                        </div>
                        <div className="flex-1">
                            <h4 className="text-lg font-semibold text-blue-100">Monthly Compliance Report</h4>
                            <p className="text-sm text-blue-200/70">Generated automatically on the 1st of every month.</p>
                        </div>
                        <button className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-xl text-sm font-semibold transition-colors shadow-lg shadow-blue-500/20">
                            Download PDF
                        </button>
                    </div>

                </div>
            </div>
        </AuroraBackground>
    );
}

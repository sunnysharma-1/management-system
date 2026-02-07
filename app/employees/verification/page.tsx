'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Shield, Search, CheckCircle, XCircle, Clock, FileText } from 'lucide-react';
import { motion } from 'framer-motion';

export default function PoliceVerificationPage() {
    const router = useRouter();
    const [filter, setFilter] = useState('All');

    // Mock Data for Demo
    // Data state
    const requests: any[] = [];

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Verified': return 'bg-green-500/10 text-green-400 border-green-500/20';
            case 'Rejected': return 'bg-red-500/10 text-red-400 border-red-500/20';
            case 'Submitted': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
            default: return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'; // Pending
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'Verified': return <CheckCircle className="w-4 h-4" />;
            case 'Rejected': return <XCircle className="w-4 h-4" />;
            case 'Submitted': return <FileText className="w-4 h-4" />;
            default: return <Clock className="w-4 h-4" />;
        }
    };

    return (
        <div className="h-full overflow-y-auto p-8">
            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
                <button
                    onClick={() => router.back()}
                    className="p-2 hover:bg-white/10 rounded-full transition-colors"
                >
                    <ArrowLeft className="w-6 h-6" />
                </button>
                <div>
                    <h1 className="text-2xl font-bold flex items-center gap-2">
                        Police Verification <Shield className="w-6 h-6 text-primary" />
                    </h1>
                    <p className="text-muted-foreground">Track and manage employee background checks.</p>
                </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
                {['All', 'Pending', 'Submitted', 'Verified', 'Rejected'].map(status => (
                    <button
                        key={status}
                        onClick={() => setFilter(status)}
                        className={`px-4 py-2 rounded-full text-sm font-medium border transition-all ${filter === status
                            ? 'bg-primary/20 border-primary text-primary'
                            : 'bg-card/40 border-white/10 text-muted-foreground hover:bg-white/5'
                            }`}
                    >
                        {status}
                    </button>
                ))}
            </div>

            {/* List */}
            <div className="space-y-4">
                {requests.filter(r => filter === 'All' || r.status === filter).map((req, idx) => (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }}
                        key={req.id}
                        className="bg-card/40 backdrop-blur border border-white/10 rounded-xl p-4 flex items-center justify-between group hover:border-primary/30 transition-all"
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-secondary/30 flex items-center justify-center text-lg font-bold">
                                {req.name.charAt(0)}
                            </div>
                            <div>
                                <h3 className="font-semibold text-foreground">{req.name}</h3>
                                <p className="text-xs text-muted-foreground font-mono">{req.empId} • applied {req.date}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium border flex items-center gap-2 ${getStatusColor(req.status)}`}>
                                {getStatusIcon(req.status)}
                                {req.status}
                            </span>

                            <div className="hidden group-hover:flex gap-2">
                                <button className="px-3 py-1 bg-primary text-primary-foreground text-xs rounded-lg hover:bg-primary/90">
                                    Update Status
                                </button>
                                <button className="px-3 py-1 bg-white/10 hover:bg-white/20 text-xs rounded-lg">
                                    View Docs
                                </button>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}

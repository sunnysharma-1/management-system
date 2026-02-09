'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams, useSearchParams } from 'next/navigation';
import { api } from '@/lib/api';
import { AuroraBackground } from '@/components/ui/aurora-background';
import { ArrowLeft, Loader2, Edit, Building2, MapPin, DollarSign, Plus, Calculator, LayoutDashboard } from 'lucide-react';
import { motion } from 'framer-motion';

import { OverviewTab } from './_components/overview-tab';
import { SalaryRatesTab } from './_components/salary-rates-tab';
import { BillRatesTab } from './_components/bill-rates-tab';

export default function ClientDetailsPage() {
    const router = useRouter();
    const params = useParams();
    const searchParams = useSearchParams();
    const clientId = params.clientId as string;

    const [loading, setLoading] = useState(true);
    const [client, setClient] = useState<any>(null);
    const [activeTab, setActiveTab] = useState<'overview' | 'salary-rates' | 'bill-rates'>('overview');

    useEffect(() => {
        const tabParam = searchParams.get('tab');
        if (tabParam === 'bill-rates' || tabParam === 'salary-rates' || tabParam === 'overview') {
            setActiveTab(tabParam);
        }
    }, [searchParams]);

    useEffect(() => {
        const fetchClient = async () => {
            try {
                const res = await api.getClient(clientId);
                setClient(res);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchClient();
    }, [clientId]);

    if (loading) return <AuroraBackground className="flex justify-center items-center"><Loader2 className="w-10 h-10 animate-spin text-white" /></AuroraBackground>;
    if (!client) return <AuroraBackground className="flex justify-center items-center text-white">Client Not Found</AuroraBackground>;

    const tabs = [
        { id: 'overview', label: 'Overview', icon: LayoutDashboard },
        { id: 'salary-rates', label: 'Salary Rates', icon: DollarSign },
        { id: 'bill-rates', label: 'Bill Rates', icon: Calculator },
    ];

    return (
        <AuroraBackground className="flex flex-col">
            <div className="h-full overflow-y-auto w-full p-8">
                <div className="max-w-6xl mx-auto space-y-8">
                    {/* Header */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="flex items-center gap-4">
                            <button onClick={() => router.back()} className="p-2 hover:bg-white/10 rounded-full transition-colors text-white">
                                <ArrowLeft className="w-6 h-6" />
                            </button>
                            <div>
                                <h1 className="text-3xl font-bold text-white">{client.companyName}</h1>
                                <p className="text-muted-foreground">Manage Client, Rates & Billing</p>
                            </div>
                        </div>
                        <button
                            onClick={() => router.push(`/clients/${clientId}/edit`)}
                            className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-xl flex items-center gap-2 font-medium transition-colors self-start md:self-auto"
                        >
                            <Edit className="w-4 h-4" /> Edit Client
                        </button>
                    </div>

                    {/* Tabs */}
                    <div className="flex items-center gap-2 border-b border-white/10 pb-1 overflow-x-auto">
                        {tabs.map(tab => {
                            const Icon = tab.icon;
                            const isActive = activeTab === tab.id;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id as any)}
                                    className={`flex items-center gap-2 px-6 py-3 rounded-t-xl transition-all relative whitespace-nowrap ${isActive
                                        ? 'text-white bg-white/10'
                                        : 'text-muted-foreground hover:text-white hover:bg-white/5'
                                        }`}
                                >
                                    <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-400' : ''}`} />
                                    <span className="font-medium">{tab.label}</span>
                                    {isActive && (
                                        <motion.div
                                            layoutId="activeTab"
                                            className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-400"
                                        />
                                    )}
                                </button>
                            );
                        })}
                    </div>

                    {/* Tab Content */}
                    <div className="min-h-[400px]">
                        {activeTab === 'overview' && <OverviewTab client={client} clientId={clientId} />}
                        {activeTab === 'salary-rates' && <SalaryRatesTab clientId={clientId} />}
                        {activeTab === 'bill-rates' && <BillRatesTab clientId={clientId} />}
                    </div>
                </div>
            </div>
        </AuroraBackground>
    );
}

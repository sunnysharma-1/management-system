'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import UnitForm from '@/app/clients/_components/unit-form';
import { api } from '@/lib/api';
import { AuroraBackground } from '@/components/ui/aurora-background';
import { ArrowLeft, Loader2 } from 'lucide-react';

export default function UnitDetailsPage() {
    const router = useRouter();
    const params = useParams();
    const clientId = params.clientId as string;
    const unitId = params.unitId as string;

    const [loading, setLoading] = useState(true);
    const [clientData, setClientData] = useState<any>(null);
    const [unitData, setUnitData] = useState<any>(null);

    useEffect(() => {
        fetchData();
    }, [clientId, unitId]);

    const fetchData = async () => {
        try {
            const clients = await api.getClients();
            const client = clients.find((c: any) => c._id === clientId);

            if (client) {
                setClientData(client);
                const unit = client.units.find((u: any) => u._id === unitId);
                if (unit) {
                    setUnitData(unit);
                }
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <AuroraBackground className="flex items-center justify-center">
                <Loader2 className="w-10 h-10 animate-spin text-white" />
            </AuroraBackground>
        );
    }

    if (!clientData || !unitData) {
        return (
            <AuroraBackground className="flex items-center justify-center text-white">
                Client or Unit not found.
            </AuroraBackground>
        );
    }

    return (
        <AuroraBackground className="flex flex-col">
            <div className="h-full overflow-y-auto w-full p-8">
                <div className="max-w-6xl mx-auto space-y-8">
                    <div className="flex items-center gap-4">
                        <button onClick={() => router.back()} className="p-2 hover:bg-white/10 rounded-full transition-colors text-white">
                            <ArrowLeft className="w-6 h-6" />
                        </button>
                        <h1 className="text-3xl font-bold text-white">Unit Details</h1>
                    </div>

                    <UnitForm
                        mode="view"
                        clientId={clientId}
                        clientName={clientData.companyName}
                        initialData={unitData}
                        onCancel={() => router.back()}
                        onSubmitSuccess={() => { }}
                    />
                </div>
            </div>
        </AuroraBackground>
    );
}

'use client';

import { useRouter } from 'next/navigation';
import { AuroraBackground } from '@/components/ui/aurora-background';
import { ArrowLeft, Construction } from 'lucide-react';

export default function NewInvoicePage() {
    const router = useRouter();

    return (
        <AuroraBackground className="flex flex-col">
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-6">
                <div className="bg-indigo-500/20 p-6 rounded-full">
                    <Construction className="w-16 h-16 text-indigo-400" />
                </div>
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Invoice Generator</h1>
                    <p className="text-muted-foreground max-w-md mx-auto">
                        This module is under construction. It will allow selecting a client, picking a bill period, and auto-calculating the bill using the defined rates.
                    </p>
                </div>
                <button
                    onClick={() => router.back()}
                    className="px-6 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-colors flex items-center gap-2"
                >
                    <ArrowLeft className="w-4 h-4" /> Go Back
                </button>
            </div>
        </AuroraBackground>
    );
}

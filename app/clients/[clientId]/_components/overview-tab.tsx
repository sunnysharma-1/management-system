'use client';

import { useRouter } from 'next/navigation';
import { Building2, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';

export function OverviewTab({ client, clientId }: { client: any, clientId: string }) {
    const router = useRouter();

    return (
        <div className="space-y-8">
            {/* HO Info */}
            <div className="bg-card/40 backdrop-blur border border-white/10 rounded-2xl p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                    <h3 className="text-indigo-400 font-bold mb-4 uppercase text-sm tracking-wider">Company Details</h3>
                    <div className="space-y-4">
                        <div><label className="text-xs text-muted-foreground block">Code</label><div className="text-white text-lg font-mono">{client.clientCode}</div></div>
                        <div><label className="text-xs text-muted-foreground block">GSTIN</label><div className="text-white font-mono">{client.gstin || '-'}</div></div>
                        <div><label className="text-xs text-muted-foreground block">Primary Contact</label><div className="text-white">{client.contactPerson}</div></div>
                        <div><label className="text-xs text-muted-foreground block">Email</label><div className="text-white">{client.email}</div></div>
                        <div><label className="text-xs text-muted-foreground block">Phone</label><div className="text-white">{client.phone || '-'}</div></div>
                    </div>
                </div>
                <div>
                    <h3 className="text-emerald-400 font-bold mb-4 uppercase text-sm tracking-wider">Registered Address</h3>
                    <div className="bg-white/5 p-4 rounded-xl text-white/80 leading-relaxed">
                        {client.address?.street}<br />
                        {client.address?.city}, {client.address?.state}<br />
                        {client.address?.zipCode}<br />
                        {client.address?.country}
                    </div>
                </div>
            </div>

            {/* Units List */}
            <div>
                <div className="flex items-center gap-2 mb-4">
                    <Building2 className="w-5 h-5 text-indigo-400" />
                    <h2 className="text-xl font-bold text-white">Site Units ({client.units?.length || 0})</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {client.units?.map((unit: any) => (
                        <motion.div
                            key={unit._id}
                            whileHover={{ scale: 1.02 }}
                            onClick={() => router.push(`/clients/${clientId}/units/${unit._id}`)}
                            className="bg-white/5 border border-white/10 rounded-xl p-4 cursor-pointer hover:bg-white/10 transition-colors group"
                        >
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="font-bold text-white group-hover:text-indigo-300 transition-colors">{unit.unitName}</h3>
                                <span className="text-xs font-mono bg-white/10 px-2 py-1 rounded text-white/60">{unit.unitCode}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <MapPin className="w-3 h-3" />
                                <span className="truncate">{unit.district || unit.billingAddress || 'No Address'}</span>
                            </div>
                        </motion.div>
                    ))}
                    <button
                        onClick={() => router.push('/clients/new')}
                        className="border border-dashed border-white/20 rounded-xl p-4 flex flex-col items-center justify-center gap-2 text-muted-foreground hover:text-white hover:border-white/40 transition-all"
                    >
                        <div className="p-2 bg-white/5 rounded-full"><Building2 className="w-5 h-5" /></div>
                        <span className="text-sm font-medium">Add New Unit</span>
                    </button>
                </div>
            </div>
        </div>
    );
}

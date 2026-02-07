'use client';

import { Upload, FileText, CheckCircle } from 'lucide-react';

interface DocumentsTabProps {
    formData: any;
    setFormData: (data: any) => void;
}

export function DocumentsTab({ formData, setFormData }: DocumentsTabProps) {
    // Mock upload handler
    const handleUpload = (type: string) => {
        // In a real app, this would handle file selection and upload
        alert(`Upload function for ${type} would trigger here.`);
    };

    const docs = [
        { key: 'photo', label: 'Employee Photo', required: true },
        { key: 'aadharCard', label: 'Aadhar Card (Front & Back)', required: true },
        { key: 'panCard', label: 'PAN Card', required: false },
        { key: 'passbook', label: 'Bank Passbook / Cheque', required: true },
        { key: 'education', label: 'Education Certificates', required: false },
    ];

    return (
        <div className="space-y-6">
            <div className="bg-card/40 backdrop-blur border border-white/10 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-8">
                    <div className="p-2 bg-orange-500/10 rounded-lg text-orange-400"><FileText className="w-5 h-5" /></div>
                    <div className='flex-1'>
                        <h2 className="text-lg font-semibold">Document Uploads</h2>
                        <p className="text-sm text-muted-foreground">Supported formats: JPG, PNG, PDF (Max 5MB)</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {docs.map((doc) => (
                        <div key={doc.key} className="bg-background/20 border border-white/10 rounded-xl p-4 flex flex-col gap-4 group hover:border-primary/50 transition-colors">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="font-medium text-foreground">{doc.label}</h3>
                                    {doc.required && <span className="text-xs text-red-400">* Required</span>}
                                </div>
                                <div className="p-2 rounded-full bg-white/5 group-hover:bg-primary/20 transition-colors">
                                    <FileText className="w-5 h-5 text-muted-foreground group-hover:text-primary" />
                                </div>
                            </div>

                            <button
                                onClick={() => handleUpload(doc.key)}
                                className="mt-auto w-full py-3 border-2 border-dashed border-white/20 rounded-lg flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-foreground hover:border-primary/50 hover:bg-primary/5 transition-all"
                            >
                                <Upload className="w-4 h-4" /> Upload File
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

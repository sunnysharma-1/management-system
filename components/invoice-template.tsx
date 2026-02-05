'use client';

import { LegacyRef, forwardRef } from 'react';
import { Invoice } from './providers/billing-context';
import { CompanyKYC } from './providers/master-data-context';

interface InvoiceTemplateProps {
    invoice: Invoice;
    company: CompanyKYC | null;
}

export const InvoiceTemplate = forwardRef((props: InvoiceTemplateProps, ref: LegacyRef<HTMLDivElement>) => {
    const { invoice, company } = props;

    if (!invoice || !company) return null;

    return (
        <div ref={ref} className="bg-white text-black p-8 max-w-[210mm] mx-auto min-h-[297mm] relative shadow-2xl print:shadow-none print:w-full">
            {/* Header */}
            <div className="flex justify-between items-start border-b-2 border-gray-800 pb-6 mb-8">
                <div className="flex items-center gap-4">
                    {company.logoUrl && (
                        <img src={company.logoUrl} alt="Logo" className="w-16 h-16 object-contain" />
                    )}
                    <div>
                        <h1 className="text-2xl font-bold uppercase tracking-wide text-gray-900">{company.companyName}</h1>
                        <p className="text-sm text-gray-600 max-w-[300px] whitespace-pre-wrap">{company.registeredAddress}</p>
                        <p className="text-sm text-gray-600 mt-1">GSTIN: <span className="font-mono font-semibold">{company.gstNo}</span></p>
                        <p className="text-sm text-gray-600">Email: {company.email} | Phone: {company.phone}</p>
                    </div>
                </div>
                <div className="text-right">
                    <h2 className="text-4xl font-black text-gray-200 uppercase tracking-widest mb-2">Invoice</h2>
                    <p className="text-lg font-bold text-gray-800">#{invoice.invoiceNo}</p>
                    <p className="text-sm text-gray-600">Date: {invoice.date}</p>
                    <p className="text-sm text-gray-600">Due Date: <span className="text-red-600 font-semibold">{invoice.dueDate}</span></p>
                </div>
            </div>

            {/* Bill To */}
            <div className="mb-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Bill To</h3>
                <h2 className="text-xl font-bold text-gray-900">{invoice.clientName}</h2>
                {/* We would fetch full client details here in a real app, assuming they are available or passed in invoice object */}
                <p className="text-sm text-gray-600 mt-1">Client ID: {invoice.clientId}</p>
            </div>

            {/* Table */}
            <div className="mb-0">
                <table className="w-full">
                    <thead>
                        <tr className="bg-gray-900 text-white text-xs uppercase">
                            <th className="py-3 px-4 text-left rounded-tl-lg">Description</th>
                            <th className="py-3 px-4 text-left">HSN</th>
                            <th className="py-3 px-4 text-right">Qty</th>
                            <th className="py-3 px-4 text-right">Rate</th>
                            <th className="py-3 px-4 text-right">Tax %</th>
                            <th className="py-3 px-4 text-right rounded-tr-lg">Amount</th>
                        </tr>
                    </thead>
                    <tbody className="text-sm divide-y divide-gray-200">
                        {invoice.items.map((item, idx) => (
                            <tr key={idx}>
                                <td className="py-4 px-4 font-medium text-gray-900">{item.description}</td>
                                <td className="py-4 px-4 text-gray-600">{item.hsn}</td>
                                <td className="py-4 px-4 text-right text-gray-600">{item.quantity}</td>
                                <td className="py-4 px-4 text-right text-gray-600">₹{item.rate.toLocaleString()}</td>
                                <td className="py-4 px-4 text-right text-gray-600">{item.taxRate}%</td>
                                <td className="py-4 px-4 text-right font-bold text-gray-900">₹{item.amount.toLocaleString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Totals */}
            <div className="flex justify-end mt-0">
                <div className="w-1/2 bg-gray-50 p-6 rounded-b-lg border-t-0 border border-gray-200">
                    <div className="flex justify-between mb-2 text-sm text-gray-600">
                        <span>Sub Total</span>
                        <span>₹{invoice.subTotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between mb-2 text-sm text-gray-600">
                        <span>Tax Total</span>
                        <span>₹{invoice.taxTotal.toFixed(2)}</span>
                    </div>
                    <div className="h-px bg-gray-300 my-3"></div>
                    <div className="flex justify-between text-xl font-bold text-gray-900">
                        <span>Grand Total</span>
                        <span>₹{invoice.grandTotal.toFixed(2)}</span>
                    </div>
                </div>
            </div>

            {/* Terms & Footer */}
            <div className="absolute bottom-8 left-8 right-8">
                <div className="grid grid-cols-2 gap-8 mb-8">
                    <div>
                        <h4 className="text-xs font-bold uppercase text-gray-500 mb-2">Terms & Conditions</h4>
                        <ul className="text-xs text-gray-600 list-disc pl-4 space-y-1">
                            <li>Payment is due within {30} days.</li>
                            <li>Please make checks payable to {company.companyName}.</li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-xs font-bold uppercase text-gray-500 mb-2">Bank Details</h4>
                        <p className="text-xs text-gray-600">Bank: HDFC Bank</p>
                        <p className="text-xs text-gray-600">Acct: 1234567890</p>
                        <p className="text-xs text-gray-600">IFSC: HDFC0001234</p>
                    </div>
                </div>

                <div className="text-center border-t border-gray-200 pt-6">
                    <p className="text-2xl font-signature text-gray-400">Authorized Signatory</p>
                    <p className="text-xs text-gray-400 mt-1 uppercase tracking-wider">This is a computer generated invoice</p>
                </div>
            </div>
        </div>
    );
});

InvoiceTemplate.displayName = 'InvoiceTemplate';

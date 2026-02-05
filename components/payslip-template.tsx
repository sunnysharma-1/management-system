'use client';

import { LegacyRef, forwardRef } from 'react';
import { CompanyKYC } from './providers/master-data-context';
import { SalarySlip, Employee } from './providers/employee-context';

interface PayslipTemplateProps {
    slip: SalarySlip;
    employee: Employee;
    company: CompanyKYC | null;
}

export const PayslipTemplate = forwardRef((props: PayslipTemplateProps, ref: LegacyRef<HTMLDivElement>) => {
    const { slip, employee, company } = props;

    if (!slip || !employee || !company) return null;

    return (
        <div ref={ref} className="bg-white text-black p-8 max-w-[210mm] mx-auto min-h-[297mm] relative shadow-2xl print:shadow-none print:w-full font-serif">
            {/* Header */}
            <div className="text-center border-b-2 border-gray-800 pb-4 mb-6">
                <h1 className="text-2xl font-bold uppercase tracking-wide text-gray-900">{company.companyName}</h1>
                <p className="text-sm text-gray-600">{company.registeredAddress} | {company.email}</p>
                <h2 className="text-xl font-bold mt-4 uppercase underline decoration-double">Payslip for {slip.month}</h2>
            </div>

            {/* Employee Details */}
            <div className="grid grid-cols-2 gap-x-12 gap-y-2 mb-6 text-sm border-b border-gray-300 pb-6">
                <div className="flex justify-between"><span className="font-semibold">Employee Name:</span> <span>{employee.firstName} {employee.lastName}</span></div>
                <div className="flex justify-between"><span className="font-semibold">Employee ID:</span> <span>{employee.id}</span></div>
                <div className="flex justify-between"><span className="font-semibold">Designation:</span> <span>{employee.designation}</span></div>
                <div className="flex justify-between"><span className="font-semibold">Department:</span> <span>{employee.department}</span></div>
                <div className="flex justify-between"><span className="font-semibold">Bank Account:</span> <span>{employee.bankAccount}</span></div>
                <div className="flex justify-between"><span className="font-semibold">Joining Date:</span> <span>{employee.joiningDate}</span></div>
            </div>

            {/* Earnings & Deductions Table */}
            <div className="mb-6 border border-gray-800">
                <div className="grid grid-cols-2 border-b border-gray-800 bg-gray-100">
                    <div className="p-2 font-bold text-center border-r border-gray-800">EARNINGS</div>
                    <div className="p-2 font-bold text-center">DEDUCTIONS</div>
                </div>
                <div className="grid grid-cols-2">
                    {/* Earnings Column */}
                    <div className="border-r border-gray-800">
                        <div className="flex justify-between p-2 hover:bg-gray-50"><span>Basic Salary</span> <span>₹{slip.basic.toLocaleString()}</span></div>
                        <div className="flex justify-between p-2 hover:bg-gray-50"><span>HRA</span> <span>₹{slip.hra.toLocaleString()}</span></div>
                        <div className="flex justify-between p-2 hover:bg-gray-50"><span>Special Allowances</span> <span>₹{slip.allowances.toLocaleString()}</span></div>
                        <div className="flex justify-between p-2 hover:bg-gray-50 font-bold mt-4 border-t border-gray-300"><span>Total Earnings</span> <span>₹{slip.gross.toLocaleString()}</span></div>
                    </div>

                    {/* Deductions Column */}
                    <div>
                        <div className="flex justify-between p-2 hover:bg-gray-50"><span>Provident Fund (PF)</span> <span>₹{slip.pf.toLocaleString()}</span></div>
                        <div className="flex justify-between p-2 hover:bg-gray-50"><span>Professional Tax</span> <span>₹{slip.profTax.toLocaleString()}</span></div>
                        <div className="flex justify-between p-2 hover:bg-gray-50"><span>Income Tax (TDS)</span> <span>₹{slip.incomeTax.toLocaleString()}</span></div>
                        <div className="flex justify-between p-2 hover:bg-gray-50 font-bold mt-4 border-t border-gray-300"><span>Total Deductions</span> <span>₹{slip.totalDeductions.toLocaleString()}</span></div>
                    </div>
                </div>
            </div>

            {/* Net Pay */}
            <div className="border border-gray-800 p-4 mb-12 bg-gray-50">
                <div className="flex justify-between items-center">
                    <span className="text-lg font-bold uppercase">Net Salary Payable:</span>
                    <span className="text-2xl font-bold">₹{slip.netPay.toLocaleString()}</span>
                </div>
                <p className="text-sm text-gray-500 mt-2 italic">(In words: Rupees {numberToWords(slip.netPay)} Only)</p>
            </div>

            {/* Footer / Signatures */}
            <div className="flex justify-between mt-24 px-8">
                <div className="text-center">
                    <div className="border-t border-gray-400 w-48 mb-2"></div>
                    <p className="font-semibold">Employee Signature</p>
                </div>
                <div className="text-center">
                    <div className="border-t border-gray-400 w-48 mb-2"></div>
                    <p className="font-semibold">Director / Auth. Signatory</p>
                </div>
            </div>

            <div className="absolute bottom-4 left-0 w-full text-center text-xs text-gray-400">
                Generated on {new Date(slip.generatedDate).toLocaleDateString()}
            </div>
        </div>
    );
});

PayslipTemplate.displayName = 'PayslipTemplate';

// Helper for demo (simple version)
function numberToWords(num: number): string {
    // Very basic placeholder. In real app use a library.
    return "Amount";
}

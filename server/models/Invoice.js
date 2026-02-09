const mongoose = require('mongoose');

const InvoiceSchema = new mongoose.Schema({
    invoiceNo: { type: String, required: true, unique: true },
    date: { type: Date, required: true }, // Bill Date

    // Period Details
    fromPeriod: Date,
    toPeriod: Date,
    month: String,
    year: Number,
    monthDays: Number,

    // Client & Unit
    clientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Client', required: true },
    unitId: { type: mongoose.Schema.Types.ObjectId, ref: 'Client.units' },
    clientName: String,
    unitName: String,

    // Bank Details
    bank: {
        id: String,
        name: String,
        branch: String,
        ifsc: String,
        accountNo: String
    },

    // Line Items
    items: [{
        seqNo: Number,
        service: String,
        description: String,
        nop: Number, // No of Person
        rate: Number,
        monthDays: Number, // working days for calculation? or just for display
        duty: Number, // Duty days
        amount: Number, // Basic Amount

        // Specific Components per Item
        scPercent: { type: Number, default: 0 },
        scAmount: { type: Number, default: 0 },

        pfPercent: { type: Number, default: 0 },
        pfAmount: { type: Number, default: 0 },

        esicPercent: { type: Number, default: 0 },
        esicAmount: { type: Number, default: 0 },

        lwfRate: { type: Number, default: 0 },
        lwfAmount: { type: Number, default: 0 },

        // Calculations basis (Basic/Gross/OnAmount) - storing the result logic if needed, 
        // but mostly we just store the resulting amounts.
        // The UI shows "PF(Basic)(Gross)(OnAmount)" etc, which implies configuration, but for the Invoice record we likely just need the final values.

        leviRate: { type: Number, default: 0 },
        leviAmount: { type: Number, default: 0 },
    }],

    // Footer Totals
    totalDuty: Number,

    // Charges & Taxes Summary
    serviceChargePercent: Number,
    serviceChargeAmount: Number,

    pfEmployerPercent: Number,
    pfEmployerAmount: Number,

    esicEmployerPercent: Number,
    esicEmployerAmount: Number,

    lwfTotal: Number,
    leviTotal: Number,

    subTotal: { type: Number, required: true }, // Sum of (Item Amounts + SC + Employer Contribs etc) - depends on logic

    // GST
    cgstPercent: Number,
    cgstAmount: Number,
    sgstPercent: Number,
    sgstAmount: Number,
    igstPercent: Number,
    igstAmount: Number,

    taxTotal: { type: Number, required: true },

    others: Number,

    grandTotal: { type: Number, required: true }, // Total (Tax + Sub)

    tdsPercent: Number,
    tdsAmount: Number,

    reimbursement: Number,

    netAmount: Number, // Final Payable

    // Flags & Meta
    status: {
        type: String,
        enum: ['Draft', 'Pending', 'Paid', 'Overdue', 'Cancelled'],
        default: 'Pending'
    },
    remarks: String,
    isServiceChargeOnPrint: Boolean,
    isReverseCharges: Boolean,
    isArrearBill: Boolean,
    docketNumber: String

}, { timestamps: true });

module.exports = mongoose.model('Invoice', InvoiceSchema);

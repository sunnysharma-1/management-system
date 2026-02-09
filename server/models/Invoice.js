const mongoose = require('mongoose');

const InvoiceSchema = new mongoose.Schema({
    billNo: { type: String, required: true, unique: true },
    billDate: { type: Date, required: true },

    // Client & Unit Details (Snapshot)
    clientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Client', required: true },
    clientName: String, // Snapshot
    unitId: { type: mongoose.Schema.Types.ObjectId, ref: 'Client.units' },
    unitName: String, // Snapshot

    // Period Details
    month: { type: String, required: true }, // e.g. "February"
    year: { type: Number, required: true }, // e.g. 2026
    billPeriodFrom: Date,
    billPeriodTo: Date,
    monthDays: Number,

    // Line Items
    items: [{
        serviceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Service' }, // Optional reference if you have partial services
        service: { type: String, required: true },
        description: String,
        nop: { type: Number, default: 0 }, // No of Persons
        duty: { type: Number, default: 0 },
        rate: { type: Number, required: true },
        days: { type: Number, default: 0 },
        amount: { type: Number, required: true },

        // Statutory Components per Item
        scPercent: { type: Number, default: 0 },
        scAmount: { type: Number, default: 0 },

        pfPercent: { type: Number, default: 0 },
        pfAmount: { type: Number, default: 0 },

        esicPercent: { type: Number, default: 0 },
        esicAmount: { type: Number, default: 0 },

        lwfRate: { type: Number, default: 0 },
        lwfAmount: { type: Number, default: 0 },

        leviRate: { type: Number, default: 0 },
        leviAmount: { type: Number, default: 0 },
    }],

    // Financial Totals
    totalDuty: { type: Number, default: 0 },

    // Summary of Statutory Amounts (Sum of items)
    serviceChargePercent: { type: Number, default: 0 }, // If global
    serviceChargeAmount: { type: Number, default: 0 },

    pfEmployerPercent: { type: Number, default: 0 },
    pfEmployerAmount: { type: Number, default: 0 },

    esicEmployerPercent: { type: Number, default: 0 },
    esicEmployerAmount: { type: Number, default: 0 },

    lwfTotal: { type: Number, default: 0 },
    leviTotal: { type: Number, default: 0 },

    subTotal: { type: Number, required: true }, // Sum up to this point

    // Taxes
    cgstPercent: { type: Number, default: 0 },
    cgstAmount: { type: Number, default: 0 },
    sgstPercent: { type: Number, default: 0 },
    sgstAmount: { type: Number, default: 0 },
    igstPercent: { type: Number, default: 0 },
    igstAmount: { type: Number, default: 0 },

    taxAmount: { type: Number, default: 0 }, // Total Tax

    others: { type: Number, default: 0 },

    grandTotal: { type: Number, required: true }, // SubTotal + Tax + Others

    tdsPercent: { type: Number, default: 0 },
    tdsAmount: { type: Number, default: 0 },

    // Meta / Footer Inputs
    remarks: String,
    bank: {
        id: mongoose.Schema.Types.ObjectId,
        name: String,
        branch: String,
        ifsc: String,
        accountNo: String
    },

    // Flags
    isServiceChargeOnPrint: { type: Boolean, default: true },
    isReverseCharges: { type: Boolean, default: false },
    isArrearBill: { type: Boolean, default: false },
    docketNumber: String,

    status: {
        type: String,
        enum: ['Draft', 'Pending', 'Paid', 'Overdue', 'Cancelled'],
        default: 'Draft'
    },

    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },

}, { timestamps: true });

module.exports = mongoose.model('Invoice', InvoiceSchema);

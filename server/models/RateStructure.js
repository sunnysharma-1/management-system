const mongoose = require('mongoose');

const RateStructureSchema = new mongoose.Schema({
    clientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Client',
        required: true
    },
    unitId: {
        type: mongoose.Schema.Types.ObjectId,
        required: false // Optional: If null, applies to all units of the client
    },
    designation: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['Salary', 'Billing', 'Both'],
        default: 'Both'
    },
    // Salary Components (Earnings)
    salaryComponents: {
        basic: { type: Number, default: 0 },
        da: { type: Number, default: 0 },
        hra: { type: Number, default: 0 },
        conveyance: { type: Number, default: 0 },
        washing: { type: Number, default: 0 },
        uniform: { type: Number, default: 0 },
        special: { type: Number, default: 0 },
        training: { type: Number, default: 0 },
        roomRent: { type: Number, default: 0 },
        medical: { type: Number, default: 0 },
        leave: { type: Number, default: 0 },
        bonus: { type: Number, default: 0 },
        gratuity: { type: Number, default: 0 },
        nh: { type: Number, default: 0 }, // National Holidays
        relievingCharge: { type: Number, default: 0 }, // Relieving Charges
        other: { type: Number, default: 0 }
    },
    // Deductions Config (Percentages or Fixed Amounts)
    deductions: {
        pfPercent: { type: Number, default: 12 },
        esicPercent: { type: Number, default: 0.75 },
        pt: { type: Number, default: 0 }, // Professional Tax
        lwf: { type: Number, default: 100 }, // Labour Welfare Fund
        tds: { type: Number, default: 0 }
    },
    // Calculation Rules
    calculationRules: {
        pfBasis: { type: Number, default: 0 }, // 0 = Actual Days, 26 = Fixed 26 Days
        roomRentType: { type: String, enum: ['Fixed', 'Pro-Rata'], default: 'Fixed' } // Fixed Amount vs Pro-rata based on duty
    },
    // Billing Components (If type is Billing or Both)
    billingComponents: {
        serviceChargePercent: { type: Number, default: 0 },
        materialCost: { type: Number, default: 0 },
        fixedBillingAmount: { type: Number, default: 0 } // If fixed billing
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });

// Compound index to ensure unique designation per unit (or client if unit is null)
RateStructureSchema.index({ clientId: 1, unitId: 1, designation: 1 }, { unique: true });

module.exports = mongoose.model('RateStructure', RateStructureSchema);

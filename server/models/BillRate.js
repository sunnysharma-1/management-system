const mongoose = require('mongoose');

const BillRateSchema = new mongoose.Schema({
    clientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Client',
        required: true
    },
    unitId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Unit', // Assuming Unit is embedded in Client, but if we need a direct ref we might need a separate model or just store the ID. 
        // Since Units are subdocuments of Client, we often store them as just IDs or use a specific pattern. 
        // For now, storing as ObjectId is fine, but we might need to look it up from the Client.
        required: true
    },
    service: { // Designation / Service Name
        type: String,
        required: true
    },
    nos: { // Number of staff
        type: Number,
        default: 1
    },
    monthDays: {
        type: Number,
        default: 26
    },
    month: {
        type: String, // e.g., "January", "01"
        required: false
    },
    year: {
        type: Number,
        required: false
    },
    // Bill Breakup (Salary Part)
    components: {
        basic: { type: Number, default: 0 },
        da: { type: Number, default: 0 },
        hra: { type: Number, default: 0 },
        conveyance: { type: Number, default: 0 },
        washing: { type: Number, default: 0 },
        uniform: { type: Number, default: 0 },
        special: { type: Number, default: 0 },
        education: { type: Number, default: 0 }, // Ex Allow
        medical: { type: Number, default: 0 },
        leave: { type: Number, default: 0 },
        bonus: { type: Number, default: 0 },
        gratuity: { type: Number, default: 0 },
        other: { type: Number, default: 0 },
        roomRent: { type: Number, default: 0 },
        nh: { type: Number, default: 0 }, // National Holidays
        relievingCharge: { type: Number, default: 0 }
    },
    // Bill Terms (Percentages / Fixed)
    terms: {
        epfPercent: { type: Number, default: 13 }, // Employer PF
        esiPercent: { type: Number, default: 3.25 }, // Employer ESI
        bonusPercent: { type: Number, default: 8.33 },
        leavePercent: { type: Number, default: 5 }, // Leave / PL
        gratuityPercent: { type: Number, default: 4.81 },
        holidayPercent: { type: Number, default: 0 }, // National Holiday %
        serviceChargePercent: { type: Number, default: 10 },
    },
    // Totals (Calculated/Stored)
    totals: {
        grossSalary: { type: Number, default: 0 }, // Total of components
        epfAmount: { type: Number, default: 0 },
        esiAmount: { type: Number, default: 0 },
        bonusAmount: { type: Number, default: 0 },
        leaveAmount: { type: Number, default: 0 },
        gratuityAmount: { type: Number, default: 0 },
        holidayAmount: { type: Number, default: 0 },
        serviceChargeAmount: { type: Number, default: 0 },
        totalPerHead: { type: Number, default: 0 }, // Cost to Company per person
        grandTotal: { type: Number, default: 0 } // totalPerHead * nos
    },
    isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('BillRate', BillRateSchema);

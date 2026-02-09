const mongoose = require('mongoose');
const RateStructure = require('./models/RateStructure');
const Client = require('./models/Client');
require('dotenv').config();

const seedRates = async () => {
    try {
        const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/orbit_hrm_db';
        await mongoose.connect(mongoUri);
        console.log('Connected to MongoDB');

        // Fetch Clients to link rates
        const google = await Client.findOne({ clientCode: 'CLI-GOOG' });
        const microsoft = await Client.findOne({ clientCode: 'CLI-MSFT' });

        if (!google || !google.units || google.units.length === 0) {
            console.error('Clients not found. Please run seedClients.js first.');
            process.exit(1);
        }

        const rates = [
            // 1. Google Generic Rate
            {
                clientId: google._id,
                designation: 'Security Guard',
                type: 'Both',
                salaryComponents: {
                    basic: 15000, da: 3000, hra: 4000, conveyance: 1500, washing: 500,
                    uniform: 500, special: 0, training: 0, roomRent: 0,
                    medical: 0, leave: 0, bonus: 1200, gratuity: 0,
                    nh: 500, relievingCharge: 200, other: 0
                },
                deductions: {
                    pfPercent: 12, esicPercent: 0.75,
                    pt: 200, lwf: 100, tds: 0
                },
                calculationRules: {
                    pfBasis: 0, // Actual Days
                    roomRentType: 'Fixed'
                },
                billingComponents: {
                    serviceChargePercent: 10,
                    materialCost: 500,
                    fixedBillingAmount: 0
                },
                isActive: true
            },
            // 2. Google Unit Specific Rate (Hyderabad)
            {
                clientId: google._id,
                unitId: google.units[0]._id, // First unit
                designation: 'Supervisor',
                type: 'Both',
                salaryComponents: {
                    basic: 20000, da: 4000, hra: 5000, conveyance: 2000, washing: 500,
                    uniform: 500, special: 1000, training: 0, roomRent: 0,
                    medical: 0, leave: 0, bonus: 1500, gratuity: 0,
                    nh: 500, relievingCharge: 300, other: 0
                },
                deductions: {
                    pfPercent: 12, esicPercent: 0.75,
                    pt: 250, lwf: 100, tds: 500
                },
                calculationRules: {
                    pfBasis: 26, // Fixed 26 Days
                    roomRentType: 'Pro-Rata'
                },
                billingComponents: {
                    serviceChargePercent: 12,
                    materialCost: 0,
                    fixedBillingAmount: 0
                },
                isActive: true
            },
            // 3. Microsoft Generic Rate
            {
                clientId: microsoft._id,
                designation: 'Housekeeping Staff',
                type: 'Both',
                salaryComponents: {
                    basic: 12000, da: 2000, hra: 3000, conveyance: 1000, washing: 200,
                    uniform: 200, special: 0, training: 0, roomRent: 2000,
                    medical: 0, leave: 0, bonus: 0, gratuity: 0,
                    nh: 0, relievingCharge: 0, other: 0
                },
                deductions: {
                    pfPercent: 12, esicPercent: 0.75,
                    pt: 0, lwf: 100, tds: 0
                },
                calculationRules: {
                    pfBasis: 0,
                    roomRentType: 'Fixed'
                },
                billingComponents: {
                    serviceChargePercent: 8,
                    materialCost: 200,
                    fixedBillingAmount: 0
                },
                isActive: true
            }
        ];

        // Clear existing rates for these clients to avoid duplicates? 
        // Or just delete all for clean seed.
        await RateStructure.deleteMany({});
        console.log('Cleared existing Rate Structures');

        await RateStructure.insertMany(rates);
        console.log(`Seeded ${rates.length} Rate Structures`);

        mongoose.connection.close();
        process.exit(0);

    } catch (error) {
        console.error('Error seeding rates:', error);
        process.exit(1);
    }
};

seedRates();

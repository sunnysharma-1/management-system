const mongoose = require('mongoose');
const Client = require('./models/Client');
require('dotenv').config();

const verify = async () => {
    try {
        const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/orbit_hrm_db';
        await mongoose.connect(mongoUri);
        console.log('Connected to MongoDB');

        const google = await Client.findOne({ companyName: 'Google India' });
        if (!google) {
            console.log('Google India NOT FOUND');
            process.exit(1);
        }

        console.log('Found Client:', google.companyName);
        const hydUnit = google.units.find(u => u.unitCode === 'UNT-GOOG-HYD');

        if (hydUnit) {
            console.log('--- Unit: Google Hyderabad ---');
            console.log('Work Order No:', hydUnit.workOrderNo);
            console.log('Accounts Officer:', hydUnit.accountsOfficer);
            console.log('Min Age:', hydUnit.minAge);
            console.log('Max Age:', hydUnit.maxAge);
            console.log('Billing Address:', hydUnit.billingAddress);
        } else {
            console.log('Hyderabad Unit NOT FOUND');
        }

        mongoose.connection.close();
        process.exit(0);
    } catch (error) {
        console.error('Error verifying:', error);
        process.exit(1);
    }
};

verify();

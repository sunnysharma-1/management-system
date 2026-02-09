const mongoose = require('mongoose');
const Client = require('./models/Client');
require('dotenv').config();

const mockClients = [
    {
        companyName: 'Google India',
        clientCode: 'CLI-GOOG',
        contactPerson: 'Sundar P.',
        email: 'admin@google.com',
        phone: '040-66666666',
        address: { street: 'Hi-Tech City', city: 'Hyderabad', state: 'Telangana', zipCode: '500081', country: 'India' },
        gstin: '36AAAAA0000A1Z5',
        status: 'Active',
        units: [
            {
                unitName: 'Google - Hyderabad Campus',
                unitCode: 'UNT-GOOG-HYD',
                oldUnitCode: 'G-HYD-001',
                printName: 'Google India Pvt Ltd',
                shippingAddress: 'Building 12, Mindspace, Hyderabad, Telangana - 500081',
                billingAddress: 'Building 12, Mindspace, Hyderabad, Telangana - 500081',
                billingFromState: 'Telangana',
                billingToState: 'Telangana',
                placeOfSupply: 'Telangana',
                gstin: '36AAAAA0000A1Z5',
                district: 'Rangareddy',
                pinCode: '500081',
                region: 'South',
                stateOffice: 'Hyderabad',
                fieldArea: 'Gachibowli',

                workOrderNo: 'WO-2023-001',
                workOrderDate: new Date('2023-01-01'),
                workStartDate: new Date('2023-01-15'),
                agreementNo: 'AGR-GOOG-HYD',
                agreementDate: new Date('2022-12-01'),
                agreementExpDate: new Date('2025-12-31'),

                noOfEmployees: 50,
                minAge: 21,
                maxAge: 45,
                leaveOpening: 0,
                showLeaveOnPaySlip: true,
                isUniformFree: true,
                bonusPaidInMonth: 'October',

                accountsOfficer: {
                    name: 'Karthik Rao',
                    designation: 'Finance Lead',
                    phone: '040-12345678',
                    mobile: '9876543210',
                    email: 'karthik.rao@google.com'
                },
                operationDepartment: {
                    name: 'Ravi Kumar',
                    designation: 'Security Manager',
                    phone: '040-87654321',
                    mobile: '9988776655',
                    email: 'ravi.k@google.com'
                },

                panCardNo: 'ABCDE1234F',
                pfCode: 'PF-TS-001',
                esicCode: 'ESIC-TS-001',
                gstCategory: 'Registered',

                billType: 'Muster',
                isGstApplicable: true,
                systemBilling: true
            },
            {
                unitName: 'Google - Bangalore Park',
                unitCode: 'UNT-GOOG-BLR',
                printName: 'Google India Pvt Ltd - BLR',
                shippingAddress: 'Bagmane Tech Park, Bangalore, Karnataka - 560093',
                billingAddress: 'Bagmane Tech Park, Bangalore, Karnataka - 560093',
                billingFromState: 'Karnataka',
                billingToState: 'Karnataka',
                gstin: '29AAAAA0000A1Z5',

                workOrderNo: 'WO-2023-002',
                workStartDate: new Date('2023-02-01'),
                noOfEmployees: 30,
                minAge: 18,
                maxAge: 50,

                operationDepartment: {
                    name: 'Anjali S.',
                    designation: 'Facility Manager',
                    email: 'anjali.s@google.com'
                },

                billType: 'Fixed',
                isGstApplicable: true
            }
        ]
    },
    {
        companyName: 'Microsoft Corporation',
        clientCode: 'CLI-MSFT',
        contactPerson: 'Satya N.',
        email: 'ops@microsoft.com',
        phone: '040-77777777',
        address: { street: 'Gachibowli', city: 'Hyderabad', state: 'Telangana', zipCode: '500032', country: 'India' },
        gstin: '36BBBBB0000B1Z5',
        status: 'Active',
        units: [
            {
                unitName: 'Microsoft - Mumbai Center',
                unitCode: 'UNT-MSFT-MUM',
                printName: 'Microsoft India (R&D) Pvt Ltd',
                shippingAddress: 'BKC, Bandra, Mumbai, Maharashtra - 400051',
                billingAddress: 'BKC, Bandra, Mumbai, Maharashtra - 400051',
                billingFromState: 'Maharashtra',
                billingToState: 'Maharashtra',
                gstin: '27BBBBB0000B1Z5',

                workOrderNo: 'WO-MSFT-MUM-01',
                workStartDate: new Date('2022-06-01'),
                agreementExpDate: new Date('2024-05-31'),

                noOfEmployees: 25,
                minAge: 20,
                maxAge: 55,

                accountsOfficer: {
                    name: 'Vikram Mehta',
                    designation: 'Accounts Mgr',
                    email: 'vikram.m@microsoft.com'
                },

                billType: 'Muster',
                isGstApplicable: true,
                systemBilling: false
            }
        ]
    },
    {
        companyName: 'Apollo Hospitals',
        clientCode: 'CLI-APOLLO',
        contactPerson: 'Dr. Pratap',
        email: 'admin@apollo.com',
        phone: '040-23607777',
        address: { street: 'Jubilee Hills', city: 'Hyderabad', state: 'Telangana', zipCode: '500033', country: 'India' },
        gstin: '36CCCCC0000C1Z5',
        status: 'Active',
        units: [
            {
                unitName: 'Apollo - Jubilee Hills',
                unitCode: 'UNT-APOLLO-JUB',
                printName: 'Apollo Hospitals Enterprise Ltd',
                shippingAddress: 'Road No 72, Jubilee Hills, Hyderabad - 500033',
                billingAddress: 'Road No 72, Jubilee Hills, Hyderabad - 500033',
                noOfEmployees: 100,
                workOrderNo: 'WO-APOLLO-001',

                operationDepartment: { name: 'Sister Mary', designation: 'Head Nurse' },
                billType: 'Muster',
                isGstApplicable: false // Example: Exempt services?
            },
            {
                unitName: 'Apollo - Indraprastha',
                unitCode: 'UNT-APOLLO-DEL',
                printName: 'Indraprastha Apollo Hospitals',
                shippingAddress: 'Sarita Vihar, New Delhi - 110076',
                billingAddress: 'Sarita Vihar, New Delhi - 110076',
                noOfEmployees: 80,

                operationDepartment: { name: 'Rajeev G.', designation: 'Admin Head' },
                billType: 'Fixed'
            }
        ]
    }
];

const seedClients = async () => {
    try {
        const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/orbit_hrm_db';
        await mongoose.connect(mongoUri);
        console.log('Connected to MongoDB');

        // Optional: Clear existing clients
        await Client.deleteMany({});
        console.log('Cleared existing clients');

        await Client.insertMany(mockClients);
        console.log(`Seeded ${mockClients.length} clients with their units`);

        mongoose.connection.close();
        console.log('Connection closed');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding clients:', error);
        process.exit(1);
    }
};

seedClients();

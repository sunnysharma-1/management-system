const mongoose = require('mongoose');
const Employee = require('./models/Employee');
require('dotenv').config();

const mockEmployees = [
    {
        employeeId: 'EMP-001',
        firstName: 'Sunny',
        lastName: 'Sharma',
        fatherName: 'Ramesh Sharma',
        dob: '1990-05-15',
        email: 'sunny@example.com',
        phone: '9876543210',
        department: 'Admin',
        designation: 'Manager',
        joiningDate: '2023-01-15',
        status: 'Active',
        unitName: 'Head Office',
        localAddress: '123, Green Park, New Delhi',
        permanentAddress: '456, Hometown Road, Varanasi, UP',
        statutory: {
            pf: 'PF123456789',
            esic: 'ESIC987654321',
            uan: 'UAN1122334455'
        },
        salaryDetails: {
            basic: 25000, da: 5000, hra: 10000,
            pfAmount: 1800, esicAmount: 500,
            grossSalary: 50000, netSalary: 45000
        }
    },
    {
        employeeId: 'EMP-002',
        firstName: 'Rahul',
        lastName: 'Verma',
        fatherName: 'Suresh Verma',
        dob: '1995-08-20',
        email: 'rahul@example.com',
        phone: '9876541234',
        department: 'Security',
        designation: 'Security Guard',
        joiningDate: '2023-02-01',
        status: 'Active',
        unitName: 'Site A',
        localAddress: '789, Sector 14, Gurgaon',
        statutory: {
            pf: 'PF2233445566',
            esic: 'ESIC8877665544',
            uan: 'UAN9988776655'
        },
        salaryDetails: {
            basic: 15000, da: 2000, hra: 3000,
            pfAmount: 1200, esicAmount: 200,
            grossSalary: 22000, netSalary: 20000
        }
    },
    {
        employeeId: 'EMP-003',
        firstName: 'Amit',
        lastName: 'Singh',
        fatherName: 'Vijay Singh',
        dob: '1988-12-10',
        email: 'amit@example.com',
        phone: '9876545678',
        department: 'Operations',
        designation: 'Supervisor',
        joiningDate: '2023-03-10',
        status: 'Active',
        unitName: 'Site B',
        localAddress: '456, Sector 62, Noida',
        statutory: {
            pf: 'PF3344556677',
            esic: 'ESIC7766554433',
            uan: 'UAN8877665544'
        }
    },
    {
        employeeId: 'EMP-004',
        firstName: 'Priya',
        lastName: 'Das',
        fatherName: 'Kunal Das',
        dob: '1996-03-25',
        email: 'priya@example.com',
        phone: '9876549876',
        department: 'HR',
        designation: 'HR Executive',
        joiningDate: '2023-04-05',
        status: 'Active',
        unitName: 'Head Office',
        localAddress: '789, Lajpat Nagar, New Delhi',
        statutory: {
            pf: 'PF4455667788',
            esic: 'ESIC6655443322',
            uan: 'UAN7766554433'
        }
    },
    {
        employeeId: 'EMP-005',
        firstName: 'Vikram',
        lastName: 'Malhotra',
        fatherName: 'Raj Malhotra',
        dob: '1992-07-15',
        email: 'vikram@example.com',
        phone: '9988776655',
        department: 'Security',
        designation: 'Security Guard',
        joiningDate: '2022-11-20',
        status: 'Inactive',
        unitName: 'Site C',
        localAddress: '321, NIT 5, Faridabad',
        exitDetails: {
            exitDate: '2023-12-01',
            reason: 'Resigned'
        },
        statutory: {
            pf: 'PF5566778899',
            esic: 'ESIC5544332211',
            uan: 'UAN6655443322'
        }
    },
    {
        employeeId: 'EMP-006',
        firstName: 'Rohan',
        lastName: 'Gupta',
        fatherName: 'Anil Gupta',
        dob: '1985-10-30',
        email: 'rohan@example.com',
        phone: '8877665544',
        department: 'Operations',
        designation: 'Site Incharge',
        joiningDate: '2023-01-20',
        status: 'On Leave',
        unitName: 'Site A',
        localAddress: '654, DLF Phase 3, Gurgaon',
        statutory: {
            pf: 'PF6677889900',
            esic: 'ESIC4433221100',
            uan: 'UAN5544332211'
        }
    },
    {
        employeeId: 'EMP-007',
        firstName: 'Sneha',
        lastName: 'Patel',
        fatherName: 'Mohit Patel',
        dob: '1994-02-14',
        email: 'sneha@example.com',
        phone: '7766554433',
        department: 'Accounts',
        designation: 'Accountant',
        joiningDate: '2023-05-15',
        status: 'Active',
        unitName: 'Head Office',
        localAddress: '987, Saket, New Delhi',
        statutory: {
            pf: 'PF7788990011',
            esic: 'ESIC3322110099',
            uan: 'UAN4433221100'
        }
    },
    {
        employeeId: 'EMP-008',
        firstName: 'Arjun',
        lastName: 'Kumar',
        fatherName: 'Bimal Kumar',
        dob: '1998-09-05',
        email: 'arjun@example.com',
        phone: '6655443322',
        department: 'Security',
        designation: 'Security Guard',
        joiningDate: '2023-02-10',
        status: 'Terminated',
        unitName: 'Site B',
        localAddress: '147, Sector 15, Noida',
        exitDetails: {
            exitDate: '2023-08-15',
            reason: 'Terminated due to misconduct'
        },
        statutory: {
            pf: 'PF8899001122',
            esic: 'ESIC2211009988',
            uan: 'UAN3322110099'
        }
    }
];

const seedDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        await Employee.deleteMany({});
        console.log('Cleared existing employees');

        await Employee.insertMany(mockEmployees);
        console.log(`Seeded ${mockEmployees.length} employees`);

        mongoose.connection.close();
        console.log('Connection closed');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
};

seedDB();

const mongoose = require('mongoose');

const EmployeeSchema = new mongoose.Schema({
    employeeId: { type: String, required: true, unique: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    fatherName: String,
    dob: Date,
    gender: String,
    maritalStatus: String,

    // Contact
    email: { type: String, required: true, unique: true },
    phone: String,
    altPhone: String,

    // Address
    localAddress: String,
    permanentAddress: String,

    // Professional
    department: { type: String, required: true },
    designation: { type: String, required: true },
    u_designation: String, // Unit Designation
    joiningDate: { type: Date, required: true },
    status: {
        type: String,
        enum: ['Active', 'Inactive', 'Terminated', 'On Leave'],
        default: 'Active'
    },
    unitName: String,

    // Statutory & Bank
    bankDetails: {
        accountNo: String,
        ifsc: String,
        bankName: String,
        branch: String
    },
    statutory: {
        aadhar: String,
        pan: String,
        uan: String,
        esic: String,
        pf: String
    },

    // Detailed Salary Structure
    salaryDetails: {
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

        // OT Rates
        otRate: { type: Number, default: 0 },
        otHrsRate: { type: Number, default: 0 },

        // Deductions
        pfPercent: { type: Number, default: 0 },
        pfAmount: { type: Number, default: 0 },
        esicPercent: { type: Number, default: 0 },
        esicAmount: { type: Number, default: 0 },
        tds: { type: Number, default: 0 },
        deathBenefit: { type: Number, default: 0 },
        otherDeduction: { type: Number, default: 0 },

        grossSalary: { type: Number, default: 0 },
        netSalary: { type: Number, default: 0 }
    },

    // Police Verification (Legacy support)
    policeVerification: {
        status: {
            type: String,
            enum: ['Pending', 'Submitted', 'Verified', 'Rejected'],
            default: 'Pending'
        },
        verificationNumber: String,
        submissionDate: Date,
        verifiedDate: Date,
        remarks: String
    },

    // Documents
    documents: [{
        title: String,
        type: { type: String, enum: ['Aadhar', 'PAN', 'PoliceReport', 'Resume', 'Other'] },
        fileUrl: String,
        uploadedAt: { type: Date, default: Date.now }
    }],

    // Exit & Rejoin
    exitDetails: {
        exitDate: Date,
        reason: String,
        remark: String,
        clearance: {
            idCard: Boolean,
            assets: Boolean,
            remark: String
        }
    },
    timeline: [{
        title: String,
        description: String,
        date: { type: Date, default: Date.now },
        icon: String
    }],

    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Employee', EmployeeSchema);

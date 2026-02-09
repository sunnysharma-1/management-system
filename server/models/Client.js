const mongoose = require('mongoose');

const ClientSchema = new mongoose.Schema({
    companyName: {
        type: String,
        required: true
    },
    clientCode: {
        type: String,
        required: true,
        unique: true
    },
    contactPerson: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phone: {
        type: String
    },
    address: {
        street: String,
        city: String,
        state: String,
        zipCode: String,
        country: String
    },
    gstin: {
        type: String
    },
    status: {
        type: String,
        enum: ['Active', 'Inactive'],
        default: 'Active'
    },
    units: [{
        // Identification
        unitName: { type: String, required: true }, // "Unit Name (Shipped To)"
        unitCode: { type: String, required: true }, // "Unit Code"
        oldUnitCode: String,
        printName: String, // "Print Name (Billed To)"
        billingName: String, // "Print Name (Billed To)" alias if needed, or stick to printName

        // Addresses
        shippingAddress: String, // "Address (Shipped To)" - Storing as full text to match textarea, or could be structured. Let's use String as per UI.
        billingAddress: String, // "Print Address (Billed To)"
        billingFromState: String,
        billingToState: String,
        placeOfSupply: String,
        placeOfSupplyAddress: String,
        district: String,
        pinCode: String,
        region: String,
        gstin: String, // "Billing GSTIN"
        stateOffice: String,
        fieldArea: String,

        // Contact & Communication
        attention: String,
        phone: String,
        fax: String,
        email: String,
        website: String,

        // Agreement & Work Order
        workOrderNo: String,
        workOrderDate: Date,
        workStartDate: Date,
        workCompletionDate: Date,
        agreementNo: String,
        agreementDate: Date,
        agreementExpDate: Date,
        renewalLetterDate: Date,

        // Employee Setup
        noOfEmployees: Number, // "No of Emp"
        minAge: Number,
        maxAge: Number,
        leaveOpening: Number,
        showLeaveOnPaySlip: { type: Boolean, default: false },
        isUniformFree: { type: Boolean, default: false },
        bonusPaidInMonth: String,

        // Department Contacts
        accountsOfficer: {
            name: String,
            designation: String,
            phone: String, // "Landline with Extn" or Mobile
            mobile: String,
            email: String
        },
        operationDepartment: {
            name: String,
            designation: String,
            phone: String,
            mobile: String,
            email: String
        },

        // Statutory & Compliance
        panCardNo: String,
        tanNo: String,
        tinNo: String,
        serviceTaxNo: String,
        pfCode: String,
        esicCode: String,
        professionalTaxRegNo: String,
        roc: String,
        wagesRevision: String,
        controller: String,
        salaryTransferredBy: String,
        gstCategory: String, // e.g. "Registered", "Unregistered"
        vendorCode: String,

        // Billing Configuration
        billType: String, // "Muster", "Fixed"
        billGenerateType: String, // "Invoice"
        printFormat: String, // "Std"
        bank: String,
        isGstApplicable: { type: Boolean, default: true },
        isIgstApplicable: { type: Boolean, default: false },
        isUnionTerritory: { type: Boolean, default: false },
        systemBilling: { type: Boolean, default: false },
        billingInDecimal: { type: Boolean, default: false },
        contractPeriodShown: String,

        // Legacy / Misc
        remarks: String, // "Remark(MIS)"
        natureOfService: String, // "Nature of Service" (from original schema, seemingly absent in screenshot explicitly but maybe "Client Service")
        rateStructure: String, // Kept from original, potentially "Supply Type Code"

        // Address structure for backward compatibility/API consistency if needed, 
        // but UI uses textareas. We can keep `address` as a structured object if we want to parse it, 
        // or just use `shippingAddress`. Let's keep `address` as a backup to avoid breaking existing code immediately.
        address: {
            street: String,
            city: String,
            state: String,
            zipCode: String,
            country: String
        },
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Client', ClientSchema);

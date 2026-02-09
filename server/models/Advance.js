const mongoose = require('mongoose');

const AdvanceSchema = new mongoose.Schema({
    employeeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employee', // Assuming Employee model is 'Employee' (it's actually 'Employee' string in export)
        // Note: The Employee model export typically uses model name 'Employee'.
        required: true
    },
    // Snapshot of where the employee was working when advance was given
    clientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Client',
        required: true
    },
    unitId: {
        type: mongoose.Schema.Types.ObjectId,
        required: false
    },
    amount: {
        type: Number,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    recoveryMonth: {
        type: String, // Format: "YYYY-MM"
        required: true
    },
    status: {
        type: String,
        enum: ['Pending', 'Approved', 'Recovered', 'Cancelled'],
        default: 'Pending'
    },
    remarks: String,

    // Audit
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    createdAt: { type: Date, default: Date.now }

}, { timestamps: true });

module.exports = mongoose.model('Advance', AdvanceSchema);

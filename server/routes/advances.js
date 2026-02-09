const express = require('express');
const router = express.Router();
const Advance = require('../models/Advance');
const Employee = require('../models/Employee');

// GET all advances (with filters)
router.get('/', async (req, res) => {
    try {
        const { employeeId, clientId, month } = req.query;
        const query = {};
        if (employeeId) query.employeeId = employeeId;
        if (clientId) query.clientId = clientId;
        if (month) query.recoveryMonth = month; // Filter by recovery month

        const advances = await Advance.find(query)
            .populate('clientId', 'companyName')
            // .populate('employeeId', 'firstName lastName') // If needed
            .sort({ date: -1 });
        res.json(advances);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// CREATE Advance
router.post('/', async (req, res) => {
    try {
        const { employeeId, amount, recoveryMonth, remarks, clientId, unitId } = req.body;

        // Validation
        if (!clientId) {
            // Try to fetch from employee if not provided? 
            // Ideally UI passes this based on current assignment, as requested by user ("history needed")
            return res.status(400).json({ message: "Client/Branch must be specified for billing history." });
        }

        const newAdvance = new Advance({
            employeeId,
            clientId,
            unitId,
            amount,
            recoveryMonth, // e.g., "2024-03"
            remarks,
            status: 'Approved' // Auto-approve for now or 'Pending'
        });

        const saved = await newAdvance.save();
        res.status(201).json(saved);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// UPDATE Status (Recover/Cancel)
router.patch('/:id', async (req, res) => {
    try {
        const { status } = req.body;
        const advance = await Advance.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        );
        res.json(advance);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

module.exports = router;

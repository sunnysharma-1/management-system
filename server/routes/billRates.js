const express = require('express');
const router = express.Router();
const BillRate = require('../models/BillRate');
const Client = require('../models/Client'); // To validate/populate if needed

// Get all Bill Rates (Clean list)
router.get('/', async (req, res) => {
    try {
        const { clientId, unitId } = req.query;
        const query = {};
        if (clientId) query.clientId = clientId;
        if (unitId) query.unitId = unitId;

        const billRates = await BillRate.find(query).populate('clientId', 'companyName');

        // We might want to populate unitName manually since Units are subdocs
        // For now, the frontend can handle mapping if it has the client loaded
        res.json(billRates);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get Single Bill Rate
router.get('/:id', async (req, res) => {
    try {
        const billRate = await BillRate.findById(req.params.id).populate('clientId', 'companyName');
        if (!billRate) return res.status(404).json({ message: 'Bill Rate not found' });
        res.json(billRate);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Create Bill Rate
router.post('/', async (req, res) => {
    const billRate = new BillRate(req.body);
    try {
        const newBillRate = await billRate.save();
        res.status(201).json(newBillRate);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Update Bill Rate
router.put('/:id', async (req, res) => {
    try {
        const updatedBillRate = await BillRate.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedBillRate) return res.status(404).json({ message: 'Bill Rate not found' });
        res.json(updatedBillRate);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Delete Bill Rate
router.delete('/:id', async (req, res) => {
    try {
        const result = await BillRate.findByIdAndDelete(req.params.id);
        if (!result) return res.status(404).json({ message: 'Bill Rate not found' });
        res.json({ message: 'Bill Rate deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;

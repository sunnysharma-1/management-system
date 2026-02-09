const express = require('express');
const router = express.Router();
const RateStructure = require('../models/RateStructure');

// GET all rates (optionally filtered by clientId)
router.get('/', async (req, res) => {
    try {
        const { clientId, unitId } = req.query;
        const query = {};
        if (clientId) query.clientId = clientId;
        if (unitId) query.unitId = unitId;

        const rates = await RateStructure.find(query)
            .populate('clientId', 'companyName')
            .sort({ createdAt: -1 });
        res.json(rates);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// GET single rate
router.get('/:id', async (req, res) => {
    try {
        const rate = await RateStructure.findById(req.params.id).populate('clientId', 'companyName');
        if (!rate) return res.status(404).json({ message: 'Rate Structure not found' });
        res.json(rate);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// CREATE a rate
router.post('/', async (req, res) => {
    const rate = new RateStructure(req.body);
    try {
        const newRate = await rate.save();
        res.status(201).json(newRate);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// UPDATE a rate
router.put('/:id', async (req, res) => {
    try {
        const rate = await RateStructure.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!rate) return res.status(404).json({ message: 'Rate Structure not found' });
        res.json(rate);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// DELETE a rate
router.delete('/:id', async (req, res) => {
    try {
        const rate = await RateStructure.findByIdAndDelete(req.params.id);
        if (!rate) return res.status(404).json({ message: 'Rate Structure not found' });
        res.json({ message: 'Rate Structure deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;

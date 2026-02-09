const express = require('express');
const router = express.Router();
const Invoice = require('../models/Invoice');

// Get all invoices
router.get('/', async (req, res) => {
    try {
        const filters = {};
        if (req.query.clientId) filters.clientId = req.query.clientId;
        if (req.query.status) filters.status = req.query.status;

        const invoices = await Invoice.find(filters).sort({ date: -1 });
        res.json(invoices);
    } catch (err) {
        res.status(500).json({ msg: err.message });
    }
});

// Get single invoice
router.get('/:id', async (req, res) => {
    try {
        const invoice = await Invoice.findById(req.params.id);
        if (!invoice) return res.status(404).json({ msg: 'Invoice not found' });
        res.json(invoice);
    } catch (err) {
        res.status(500).json({ msg: err.message });
    }
});

// Create invoice
router.post('/', async (req, res) => {
    try {
        const newInvoice = new Invoice(req.body);
        const savedInvoice = await newInvoice.save();
        res.status(201).json(savedInvoice);
    } catch (err) {
        res.status(400).json({ msg: err.message });
    }
});

// Update invoice
router.put('/:id', async (req, res) => {
    try {
        const invoice = await Invoice.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!invoice) return res.status(404).json({ msg: 'Invoice not found' });
        res.json(invoice);
    } catch (err) {
        res.status(400).json({ msg: err.message });
    }
});

// Delete invoice
router.delete('/:id', async (req, res) => {
    try {
        const invoice = await Invoice.findByIdAndDelete(req.params.id);
        if (!invoice) return res.status(404).json({ msg: 'Invoice not found' });
        res.json({ msg: 'Invoice deleted' });
    } catch (err) {
        res.status(500).json({ msg: err.message });
    }
});

module.exports = router;

const express = require('express');
const router = express.Router();
const Client = require('../models/Client');

// @route   GET /api/clients
// @desc    Get all clients
// @access  Private
router.get('/', async (req, res) => {
    try {
        const clients = await Client.find().sort({ createdAt: -1 });
        res.json(clients);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST /api/clients
// @desc    Add new client
// @access  Private
router.post('/', async (req, res) => {
    try {
        const newClient = new Client(req.body);
        const client = await newClient.save();
        res.json(client);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   PUT /api/clients/:id
// @desc    Update client
// @access  Private
router.put('/:id', async (req, res) => {
    try {
        let client = await Client.findById(req.params.id);
        if (!client) return res.status(404).json({ msg: 'Client not found' });

        client = await Client.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true }
        );

        res.json(client);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   DELETE /api/clients/:id
// @desc    Delete client
// @access  Private
router.delete('/:id', async (req, res) => {
    try {
        let client = await Client.findById(req.params.id);
        if (!client) return res.status(404).json({ msg: 'Client not found' });

        await Client.findByIdAndRemove(req.params.id);
        res.json({ msg: 'Client removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;

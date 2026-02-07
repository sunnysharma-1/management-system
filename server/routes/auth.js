const express = require('express');
const router = express.Router();
const User = require('../models/User');
// const jwt = require('jsonwebtoken'); // Assuming we will add JWT later, but for now basic structure

// In a real app, use bcrypt to hash passwords
// const bcrypt = require('bcrypt');

// @route   POST /api/auth/register
// @desc    Register a user
// @access  Public
router.post('/register', async (req, res) => {
    const { username, name, password, roleId } = req.body;

    try {
        let user = await User.findOne({ email: username });
        if (user) {
            return res.status(400).json({ msg: 'User already exists' });
        }

        user = new User({
            username, // Mapping email to username for consistency with frontend
            email: username,
            name,
            password, // Note: Hash this in production
            roleId
        });

        await user.save();
        res.json({ msg: 'User registered successfully', userId: user.id });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// @route   POST /api/auth/login
// @desc    Auth user & get token
// @access  Public
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        // Check for user
        const user = await User.findOne({ email: username });
        if (!user) {
            return res.status(400).json({ msg: 'Invalid Credentials' });
        }

        // Check Password (Plain text for initial demo, switch to bcrypt)
        if (password !== user.password) {
            return res.status(400).json({ msg: 'Invalid Credentials' });
        }

        // Return user info (Mocking a token for now)
        res.json({
            token: 'mock-jwt-token-xyz-123',
            user: {
                id: user.id,
                name: user.name,
                username: user.email,
                roleId: user.roleId
            }
        });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;

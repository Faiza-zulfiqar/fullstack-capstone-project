const express = require('express');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const connectToDatabase = require('../models/db');
const router = express.Router();
require('dotenv').config();
const JWT_SECRET = process.env.JWT_SECRET;

router.post('/register', async (req, res) => {
    try {
        const db = await connectToDatabase();
        const collection = db.collection("users");
        const existingUser = await collection.findOne({ email: req.body.email });
        if (existingUser) {
            return res.status(400).json({ error: 'User already exists' });
        }

        const salt = await bcryptjs.genSalt(10);
        const hash = await bcryptjs.hash(req.body.password, salt);
        const newUser = {
            email: req.body.email,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            password: hash,
            createdAt: new Date(),
        };
        const result = await collection.insertOne(newUser);
        const payload = { user: { id: result.insertedId } };
        const authtoken = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });
        res.json({ authtoken, email: req.body.email });
    } catch (e) {
        console.error(e);
        res.status(500).send('Internal server error');
    }
});

router.post('/login', async (req, res) => {
    try {
        const db = await connectToDatabase();
        const collection = db.collection("users");
        const theUser = await collection.findOne({ email: req.body.email });
        if (!theUser) {
            return res.status(404).json({ error: 'User not found' });
        }

        const isMatch = await bcryptjs.compare(req.body.password, theUser.password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Wrong password' });
        }

        const payload = { user: { id: theUser._id.toString() } };
        const authtoken = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });
        res.json({ authtoken, userName: theUser.firstName, userEmail: theUser.email });
    } catch (e) {
        console.error(e);
        res.status(500).send('Internal server error');
    }
});

router.put('/update', async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const email = req.headers.email;
        const db = await connectToDatabase();
        const collection = db.collection("users");
        const existingUser = await collection.findOne({ email });
        if (!existingUser) {
            return res.status(404).json({ error: 'User not found' });
        }

        existingUser.firstName = req.body.name;
        existingUser.updatedAt = new Date();

        await collection.findOneAndUpdate(
            { email },
            { $set: existingUser },
            { returnDocument: 'after' }
        );

        const payload = { user: { id: existingUser._id.toString() } };
        const authtoken = jwt.sign(payload, JWT_SECRET);
        res.json({ authtoken });
    } catch (e) {
        console.error(e);
        res.status(500).send('Internal server error');
    }
});

module.exports = router;

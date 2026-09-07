const express = require('express');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const connectToDatabase = require('../models/db');

const router = express.Router();

require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET;


// REGISTER
router.post('/register', async (req, res) => {
    try {
        const db = await connectToDatabase();
        const collection = db.collection("users");

        const existingUser = await collection.findOne({
            email: req.body.email
        });

        if (existingUser) {
            return res.status(400).json({
                error: 'User already exists'
            });
        }

        const salt = await bcryptjs.genSalt(10);
        const hash = await bcryptjs.hash(req.body.password, salt);

        const newUser = {
            email: req.body.email,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            password: hash,
            createdAt: new Date()
        };

        const result = await collection.insertOne(newUser);

        const payload = {
            user: {
                id: result.insertedId.toString()
            }
        };

        const authtoken = jwt.sign(payload, JWT_SECRET, {
            expiresIn: '1h'
        });

        res.json({
            authtoken,
            email: req.body.email
        });

    } catch (e) {
        console.error(e);
        res.status(500).json({
            error: 'Internal server error'
        });
    }
});


// LOGIN
router.post('/login', async (req, res) => {
    try {
        const db = await connectToDatabase();
        const collection = db.collection("users");

        const theUser = await collection.findOne({
            email: req.body.email
        });

        if (!theUser) {
            return res.status(404).json({
                error: 'User not found'
            });
        }

        const isMatch = await bcryptjs.compare(
            req.body.password,
            theUser.password
        );

        if (!isMatch) {
            return res.status(401).json({
                error: 'Wrong password'
            });
        }

        const payload = {
            user: {
                id: theUser._id.toString()
            }
        };

        const authtoken = jwt.sign(payload, JWT_SECRET, {
            expiresIn: '1h'
        });

        res.json({
            authtoken,
            userName: theUser.firstName,
            userEmail: theUser.email
        });

    } catch (e) {
        console.error(e);
        res.status(500).json({
            error: 'Internal server error'
        });
    }
});


// UPDATE PROFILE
router.put('/update', async (req, res) => {
    try {
        const email = req.headers.email;
        const name = req.body.name;

        if (!email) {
            return res.status(401).json({
                error: 'Please login first'
            });
        }

        if (!name || !name.trim()) {
            return res.status(400).json({
                error: 'Name is required'
            });
        }

        const db = await connectToDatabase();
        const collection = db.collection("users");

        const existingUser = await collection.findOne({
            email
        });

        if (!existingUser) {
            return res.status(404).json({
                error: 'User not found'
            });
        }

        await collection.updateOne(
            { email },
            {
                $set: {
                    firstName: name.trim(),
                    updatedAt: new Date()
                }
            }
        );

        const payload = {
            user: {
                id: existingUser._id.toString()
            }
        };

        const authtoken = jwt.sign(payload, JWT_SECRET, {
            expiresIn: '1h'
        });

        res.json({
            authtoken,
            message: 'Profile updated successfully!'
        });

    } catch (e) {
        console.error('Profile update error:', e);

        res.status(500).json({
            error: 'Internal server error'
        });
    }
});


module.exports = router;
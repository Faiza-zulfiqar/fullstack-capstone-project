const express = require('express');
const router = express.Router();
const connectToDatabase = require('../models/db');

// Get all gifts
router.get('/', async (req, res) => {
    try {
        const db = await connectToDatabase();
        const collection = db.collection("gifts");

        const gifts = await collection.find({}).toArray();

        res.json(gifts);
    } catch (e) {
        console.error('Error fetching gifts:', e);
        res.status(500).json({
            error: 'Error fetching gifts'
        });
    }
});

// Add a comment to a gift
router.post('/:id/comments', async (req, res) => {
    try {
        const { comment, email } = req.body;

        if (!comment || !comment.trim()) {
            return res.status(400).json({
                error: 'Comment is required'
            });
        }

        const db = await connectToDatabase();
        const collection = db.collection("gifts");

        const result = await collection.updateOne(
            { id: req.params.id },
            {
                $push: {
                    comments: {
                        email: email || 'Anonymous',
                        comment: comment.trim(),
                        createdAt: new Date()
                    }
                }
            }
        );

        if (result.matchedCount === 0) {
            return res.status(404).json({
                error: 'Gift not found'
            });
        }

        res.status(201).json({
            message: 'Comment added successfully'
        });

    } catch (e) {
        console.error('Error adding comment:', e);

        res.status(500).json({
            error: 'Error adding comment'
        });
    }
});

// Get a single gift by id
router.get('/:id', async (req, res) => {
    try {
        const db = await connectToDatabase();
        const collection = db.collection("gifts");

        const gift = await collection.findOne({
            id: req.params.id
        });

        if (!gift) {
            return res.status(404).json({
                error: 'Gift not found'
            });
        }

        res.json(gift);

    } catch (e) {
        console.error('Error fetching gift:', e);

        res.status(500).json({
            error: 'Error fetching gift'
        });
    }
});

module.exports = router;
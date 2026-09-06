require('dotenv').config();
const express = require('express');
const natural = require('natural');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3070;

app.use(cors());
app.use(express.json());

const tokenizer = new natural.WordTokenizer();
const analyzer = new natural.SentimentAnalyzer('English', natural.PorterStemmer, 'afinn');

app.post('/api/recommend', (req, res) => {
    try {
        const text = req.body.text || '';
        const tokens = tokenizer.tokenize(text);
        const sentimentScore = analyzer.getSentiment(tokens);

        res.json({
            tokens: tokens,
            sentimentScore: sentimentScore
        });
    } catch (e) {
        console.error('Error processing text:', e);
        res.status(500).send('Error processing text');
    }
});

app.listen(port, () => {
    console.log(`Recommendation service running on port ${port}`);
});

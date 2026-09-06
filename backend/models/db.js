require('dotenv').config();
const MongoClient = require('mongodb').MongoClient;

let dbInstance = null;
const url = process.env.MONGO_URL;

async function connectToDatabase() {
    if (dbInstance) {
        return dbInstance;
    }
    const client = new MongoClient(url);
    await client.connect();
    dbInstance = client.db();
    return dbInstance;
}

module.exports = connectToDatabase;

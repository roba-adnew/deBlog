require('dotenv').config();
const mongoose = require('mongoose');
const debug = require('debug')('db:empty')
mongoose.set('strictQuery', false);

const mongoDB = process.env.MONGODB_URI;
const collection = process.argv.slice(2)[0];

async function emptyDB(collectionName) {
    try {
        debug('Starting connection');
        await mongoose
            .connect(mongoDB)
            .catch((error) => {
                console.log(error);
                process.exit(0);
            });
        const collection = mongoose.connection.collection(collectionName);
        debug('No errors means we are connected');
        const result = await collection.deleteMany({});
        debug(`Deleted ${result.deletedCount} documents from ${collectionName}`);
    } catch (err) {
        debug('Error: %O', err)
    } finally {
        await mongoose.connection.close();
        debug('Connection closed')
    }

}

emptyDB(collection);
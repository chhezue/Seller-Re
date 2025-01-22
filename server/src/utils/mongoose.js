const mongoose = require('mongoose');
// const dotenv = require('dotenv');
// dotenv.config();
require('dotenv').config();

const connect = () => {
    mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
    mongoose.connection.on('connected', () => {
        console.log('MongoDB connected successfully');
    });
    mongoose.connection.on('error', (err) => {
        console.error('MongoDB connection error:', err);
    });
};

module.exports = connect;

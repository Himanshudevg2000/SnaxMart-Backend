const dotenv = require('dotenv');
const path = require('path');

dotenv.config({
    path: path.resolve(`${process.env.NODE_ENV}.env`),
});
module.exports = {
    PORT: process.env.PORT || 4000,
    MONGODB_URI: process.env.MONGODB_URI || 'mongodb+srv://himanshudevgade87:asQq2hB1jPVIanIi@cluster0.br7t0ij.mongodb.net/?retryWrites=true&w=majority',
    JWT_KEY: 'snaxmartjwtkey'
};
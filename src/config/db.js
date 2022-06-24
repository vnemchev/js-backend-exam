const mongoose = require('mongoose');

exports.connectDb = () => {
    mongoose.connect('mongodb://localhost:27017/art-gallery');
    mongoose.connection.on('open', () => console.log('Db connection established.'));
};

const mongoose = require('mongoose');

const cryptoSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required!'],
        minlength: [2, 'Should be at least 2 characters'],
    },
    imageUrl: {
        type: String,
        required: [true, 'Image is required!'],
    },
    price: {
        type: Number,
        required: [true, 'Price is required!'],
        min: [1, 'Must be positive!'],
    },
    description: {
        type: String,
        required: [true, 'Description is required!'],
        minlength: [10, 'Should be at least 10 characters'],
    },
    payment: {
        type: String,
        enum: ['crypto-wallet', 'credit-card', 'debit-card', 'paypal'],
        required: [true, 'Payment type is required!'],
    },
    buyACrypto: [
        {
            type: mongoose.Types.ObjectId,
            ref: 'User',
        },
    ],
    owner: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
    },
});

const Crypto = mongoose.model('Crypto', cryptoSchema);

module.exports = Crypto;

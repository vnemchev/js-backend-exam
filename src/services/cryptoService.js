const Crypto = require('../models/Crypto');
const User = require('../models/User');

exports.create = data => Crypto.create(data);

exports.getAll = () => Crypto.find();

exports.getOne = cryptoId => Crypto.findById(cryptoId);

exports.getOneWithBuyers = cryptoId => Crypto.findById(cryptoId).populate('buyACrypto');

exports.edit = (cryptoId, data) => Crypto.findByIdAndUpdate(cryptoId, data, { runValidators: true });

exports.delete = cryptoId => Crypto.findByIdAndDelete(cryptoId);

exports.buy = async (cryptoId, buyerId) => {
    const crypto = await Crypto.findById(cryptoId);
    const buyer = await User.findById(buyerId);

    crypto.buyACrypto.push(buyer);

    await crypto.save();
};

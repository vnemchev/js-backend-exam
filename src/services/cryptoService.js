const Crypto = require('../models/Crypto');

exports.create = data => Crypto.create(data);

exports.getAll = () => Crypto.find();

exports.getOne = cryptoId => Crypto.findById(cryptoId);

exports.edit = (cryptoId, data) => Crypto.findByIdAndUpdate(cryptoId, data, { runValidators: true });

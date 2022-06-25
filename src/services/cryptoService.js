const Crypto = require('../models/Crypto');

exports.create = data => Crypto.create(data);

exports.getAll = () => Crypto.find();

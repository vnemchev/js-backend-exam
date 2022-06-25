const User = require('../models/User');
const bcrypt = require('bcrypt');
const { SECRET } = require('../config/constants');
const { jwtSign } = require('../util');

exports.register = async (username, email, password) => {
    try {
        const hashedPass = await bcrypt.hash(password, 10);

        const createdUser = await User.create({ username, email, password: hashedPass });

        const token = await signToken(createdUser);

        return token;
    } catch (error) {
        return error;
    }
};

const signToken = user => {
    const token = jwtSign(
        {
            _id: user._id,
            username: user.username,
            email: user.email,
        },
        SECRET,
        { expiresIn: '2d' },
    );

    return token;
};

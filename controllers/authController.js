const User = require('../models/userModel');

exports.signUp = async (req, res, next) => {
    try {
        const newUser = await User.create(req.body);
        res.status(201).send({ newUser });
    } catch (e) {
        res.status(500).send({ message: e.message });
    }
};

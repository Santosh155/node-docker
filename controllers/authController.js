const bcrypt = require('bcryptjs');
const User = require('../models/userModel');

exports.signUp = async (req, res, next) => {
    try {
        const { username, password } = req.body;
        const hashpassword = await bcrypt.hash(password, 12);

        const newUser = await User.create({
            username,
            password: hashpassword,
        });
        req.session.user = newUser;
        res.status(201).send({ newUser });
    } catch (e) {
        res.status(500).send({ message: e.message });
    }
};

exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(404).json({
                message: 'user not found',
            });
        }
        const isCorrect = await bcrypt.compare(password, user.password);
        if (!isCorrect) {
            return res.status(404).json({
                message: 'password doesnt match',
            });
        }
        req.session.user = user;
        res.status(200).send({ message: 'success' });
    } catch (e) {
        res.status(500).send({ message: e.message });
    }
};

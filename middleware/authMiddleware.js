const protect = (req, res, next) => {
    const { user } = req.session;
    if (!user) {
        return res.status(401).send({ message: 'Unauthorized' });
    }
    req.user = user;

    next();
};

module.exports = protect;

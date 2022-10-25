const { User } = require('../models');
const { verifyToken } = require('../helpers/jwt');

const authentication = async (req, res, next) => {
    const authHeader = req.headers['token'];
    const token = authHeader;
    try {
        if (token == null)
        return res.status(401).json({
            name: 'Invalid Credential',
            message: `Token must be filled`,
        });

        const userDecoded = verifyToken(token);
        const user = await User.findOne({
            where: {
                id: userDecoded.id,
                email: userDecoded.email,
            },
        });
        if (!user) {
            return res.status(401).json({
                name: 'Authentication Error',
                message: `User with id ${userDecoded.id} not found in database`,
            });
        }
        res.locals.user = user;
        return next();
    } catch (err) {
        return res.status(500).json(err.message);
    }
};

module.exports = authentication;

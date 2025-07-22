// middleware/auth.js
const { checkTokenStatus } = require('../utils/jwtUtils');
const User = require('../models/User');

const auth = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];
  const result = checkTokenStatus(token);

  if (!result.valid) {
    return res.status(401).json({
      message: result.expired ? 'Token expired' : result.message,
    });
  }

  const user = await User.findById(result.decoded.id).select('-password');
  if (!user) {
    return res.status(401).json({ message: 'User not found' });
  }

  req.user = user;
  next();
};

module.exports = auth;

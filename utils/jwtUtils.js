const jwt = require('jsonwebtoken');

function checkTokenStatus(token) {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return {
      valid: true,
      expired: false,
      decoded,
    };
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return {
        valid: false,
        expired: true,
        message: 'Token has expired',
      };
    } else {
      return {
        valid: false,
        expired: false,
        message: 'Token is invalid: ' + err.message,
      };
    }
  }
}

module.exports = { checkTokenStatus };

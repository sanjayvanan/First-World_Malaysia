import jwt from 'jsonwebtoken';

// 1. Authenticate Token
export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization; // Express handles case-insensitivity

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }

  const token = authHeader.split(' ')[1];

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      // Distinct message for expiration, but SAME 401 status code
      if (err.name === 'TokenExpiredError') {
        return res.status(401).json({ error: 'Session expired. Please log in again.' });
      }
      return res.status(401).json({ error: 'Invalid authentication token.' });
    }

    req.user = user;
    next();
  });
};

// 2. Authorize Role
export const authorizeRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) return res.sendStatus(401);
    
    if (!allowedRoles.includes(req.user.role)) {
      // 403 is correct here: "I know who you are (AuthN), but you can't come in (AuthZ)"
      return res.status(403).json({ 
        error: `Access denied. Requires one of these roles: ${allowedRoles.join(', ')}` 
      });
    }
    next();
  };
};
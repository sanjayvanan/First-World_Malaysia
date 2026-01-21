import jwt from 'jsonwebtoken';

// 1. Authenticate Token
export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization; 

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }

  const token = authHeader.split(' ')[1];

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      if (err.name === 'TokenExpiredError') {
        return res.status(401).json({ error: 'Session expired. Please log in again.' });
      }
      return res.status(401).json({ error: 'Invalid authentication token.' });
    }

    req.user = user;
    next();
  });
};

// 2. Authorize Role (Generic)
export const authorizeRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) return res.sendStatus(401);
    
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ 
        error: `Access denied. Requires one of these roles: ${allowedRoles.join(', ')}` 
      });
    }
    next();
  };
};

// 3. Require SuperUser (The missing part)
// This reuses the logic above to create the specific middleware you need.
export const requireSuperUser = authorizeRole('SUPERUSER');
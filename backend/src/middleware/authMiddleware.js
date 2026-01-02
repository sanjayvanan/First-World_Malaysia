import jwt from 'jsonwebtoken';

// 1. Authenticate Token (Checks if user is logged in)
export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) return res.status(401).json({ error: 'Access denied. No token provided.' });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    // <--- FIX: Changed 403 to 401 so the frontend knows to log the user out
    if (err) return res.status(401).json({ error: 'Invalid or expired token.' });
    
    req.user = user; 
    next();
  });
};

// 2. Authorize Role (Checks if user has the right permission)
export const authorizeRole = (...allowedRoles) => {
  return (req, res, next) => {
    // Keep this as 403 because the user IS logged in, just not allowed here.
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ 
        error: `Access denied. Requires one of these roles: ${allowedRoles.join(', ')}` 
      });
    }
    next();
  };
};
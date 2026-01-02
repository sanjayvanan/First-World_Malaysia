import jwt from 'jsonwebtoken';

// 1. Authenticate Token
export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; 

  // Missing token -> 401
  if (!token) return res.status(401).json({ error: 'Access denied. No token provided.' });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    // FIX: Send 401 (Unauthorized) if the token is invalid/expired
    // This makes the behavior consistent for both apps.
    if (err) return res.status(401).json({ error: 'Invalid or expired token.' });
    
    req.user = user; 
    next();
  });
};

// 2. Authorize Role
export const authorizeRole = (...allowedRoles) => {
  return (req, res, next) => {
    // Keep this as 403 (Forbidden)
    // This protects Admin pages from regular users without logging them out.
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ 
        error: `Access denied. Requires one of these roles: ${allowedRoles.join(', ')}` 
      });
    }
    next();
  };
};
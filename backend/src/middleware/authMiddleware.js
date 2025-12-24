import jwt from 'jsonwebtoken';

export const authenticateToken = (req, res, next) => {
  // 1. Get the token from the header (Authorization: Bearer <TOKEN>)
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access denied. Please login.' });
  }

  // 2. Verify the token signature
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token.' });
    }
    
    // 3. Attach user info to the request so the next function can use it
    req.user = user;
    next();
  });
};
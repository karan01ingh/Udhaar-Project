import jwt from 'jsonwebtoken';

/**
 * Middleware to verify JWT token from cookie
 */
export function verifyToken(req, res, next) {
  const token = req.cookies?.access_token;

  if (!token) {
    return res.status(401).json({ message: 'Not authenticated' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attach user data to request
    next();
  }
  catch (err) {
    console.error('JWT verification error:', err);
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
}


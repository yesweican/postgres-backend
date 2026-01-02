// middleware/auth.js
import jwt from "jsonwebtoken";
const JWT_SECRET = process.env.JWT_SECRET||'your_jwt_secret';

export const authenticateToken = (req, res, next) => {

  const authHeader = req.headers['authorization']; // Get the Authorization header
  const token = authHeader && authHeader.startsWith('Bearer ') 
    ? authHeader.split(' ')[1] // Extract the token after "Bearer"
    : null;

  if (!token) return res.status(401).json({ message: 'Access denied' });

  jwt.verify(token, JWT_SECRET, (err, payload) => {
    if (err) return res.sendStatus(403);
    req.user = {
      id: payload.sub,
      email: payload.email
    };
    next();
  });
};

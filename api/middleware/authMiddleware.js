import jwt from 'jsonwebtoken';
import { errorHandler } from '../utils/error.js'; 

export const ensureAuth = (req, res, next) => {
    const token = req.cookies.access_token;
    
    if (!token)  return res.status(401).json({ error: 'Session expired' });
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        res.status(401).json({ message: 'Token is not valid' });
    }
};
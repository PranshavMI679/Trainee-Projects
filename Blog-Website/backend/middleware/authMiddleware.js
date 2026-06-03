const jwt = require('jsonwebtoken');

exports.authMiddleware = (req, res, next) => {
  const authHeader = req.header('Authorization');
  
  if (!authHeader) {
    return res.status(401).json({ success: false, message: 'Access denied. No token provided.' });
  }

  if (!authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'Invalid token format. Must be a Bearer token.' });
  }

  const token = authHeader.split(' ')[1];
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    req.user = {
      ...decoded,
      id: decoded.user_id, 
      name: decoded.name || 'user' 
    };
    
    next();
  } catch (error) {
    console.error('JWT Error:', error.message);
    res.status(401).json({ success: false, message: 'Invalid or expired token.' });
  }
};

exports.isAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ success: false, message: 'Access denied. Admins only.' });
    }
};

const jwt = require('jsonwebtoken');
const User = require('../models/User');

async function isAuthenticatedJWT(req, res, next) {
  const token = req.cookies.token;
  if (!token) return res.redirect('/users/login');

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // 🔥 Récupérer les infos complètes de l'utilisateur
    const userFromDb = await User.findById(decoded.userId);
    if (!userFromDb) {
      res.clearCookie('token');
      return res.redirect('/users/login');
    }

    req.user = userFromDb;
    next();
  } catch (err) {
    console.error("JWT invalide :", err);
    res.clearCookie('token');
    return res.redirect('/users/login');
  }
}

module.exports = isAuthenticatedJWT;

const jwt = require("jsonwebtoken");
const User = require("../models/User");

const authenticateToken = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ message: "Unauthorized" });

    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    const user = await User.findById(decoded.id);

    if (!user) res.status(403).json({ message: "user not found" });

    req.user = user;
    next();
  } catch (err) {
    res.status(401).json({ message: "invalid or expired token" });
  }
};

const checkAdmin = (req, res, next) => {
  if (!req.user.isAdmin) {
    return res.status(403).json({ message: "admin access required" });
  }
  next();
};

module.exports = { authenticateToken, checkAdmin };

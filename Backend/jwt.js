const jwt = require("jsonwebtoken");

// --------------------
// AUTH MIDDLEWARE
// --------------------
const jwtAuthMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    // 1. Check header
    if (!authHeader) {
      return res.status(401).json({ error: "Authorization header missing" });
    }

    // 2. Check format: "Bearer token"
    const parts = authHeader.split(" ");

    if (parts.length !== 2 || parts[0] !== "Bearer") {
      return res.status(401).json({ error: "Invalid auth format" });
    }

    const token = parts[1];

    if (!token) {
      return res.status(401).json({ error: "Token missing" });
    }

    // 3. Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 4. Attach user to request
    req.user = decoded;

    next();

  } catch (err) {
    console.log("JWT ERROR:", err.message);

    return res.status(401).json({
      error: "Invalid or expired token",
    });
  }
};


// --------------------
// TOKEN GENERATOR
// --------------------
const generateToken = (userData) => {
  return jwt.sign(userData, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
};

module.exports = {
  jwtAuthMiddleware,
  generateToken,
};
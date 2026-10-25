
const jwt = require("jsonwebtoken");

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      message: "Authentication required",
    });
  }

  const token = authHeader.split(" ")[1];
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    return res.status(500).json({
      message: "Server authentication is not configured",
    });
  }

  try {
    const decoded = jwt.verify(token, secret);

    if (!decoded.userId || decoded.role !== "admin") {
      return res.status(403).json({
        message: "Admin access required",
      });
    }

    req.user = decoded;
    next();
  } catch {
    return res.status(401).json({
      message: "Invalid or expired token",
    });
  }
}

module.exports = authMiddleware;

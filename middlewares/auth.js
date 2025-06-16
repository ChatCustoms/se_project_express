const jwt = require("jsonwebtoken");
const { JWT_SECRET = "default-secret-key" } = require("../utils/config");

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  // Check if authorization header exists and starts with "Bearer "
  if (!authorization || !authorization.startsWith("Bearer ")) {
    return res.status(401).send({ message: "Authorization required" });
  }

  const token = authorization.replace("Bearer ", "");

  let payload;

  try {
  payload = jwt.verify(token, JWT_SECRET);
  req.user = payload; // Always assign payload even if no DB check
  return next();
} catch (err) {
  console.error("JWT verification failed:", err.message);
  return res.status(401).send({ message: "Authorization required" });
  }
};

const jwt = require("jsonwebtoken");
require("dotenv").config();

const authMiddleware = (req) => {
  const token = req.headers["x-access-token"];
  let userId = null;

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.SECRET_WORD);
      userId = decoded.userId;
    } catch (err) {
      console.error("Invalid token:", err.message);
    }
  }

  return { userId };
};

module.exports = { authMiddleware };

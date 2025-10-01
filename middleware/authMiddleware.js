// middleware/authMiddleware.js
import jwt from "jsonwebtoken";

export default function authMiddleware(req, res, next) {
  try {
    const authHeader = req.headers["authorization"];
    if (!authHeader) return res.status(401).json({ error: "Token manquant" });

    const token = authHeader.split(" ")[1];
    if (!token) return res.status(401).json({ error: "Token manquant" });

    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = payload.id; // on met l'id de l'utilisateur sur req
    next();
  } catch (err) {
    return res.status(401).json({ error: "Token invalide ou expiré" });
  }
}

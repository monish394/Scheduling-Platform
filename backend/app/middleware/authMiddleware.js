import jwt from "jsonwebtoken";

export const AuthenticateUser = (req, res, next) => {
  try {
    const token = req.headers["authorization"];
    if (!token) {
      return res.status(401).json({ message: "Access denied. No token provided." });
    }

const actualToken = token.startsWith("Bearer ") ? token.split(" ")[1] : token;

    const tokendata = jwt.verify(actualToken, process.env.JWT_SECRET || 'secret123');

req.user = {
      _id: tokendata.userid,
      role: tokendata.role
    };

req.userid = tokendata.userid;
    req.role = tokendata.role;

    next();
  } catch (err) {
    console.log(err);
    res.status(403).json({ message: "Invalid or expired token" });
  }
};

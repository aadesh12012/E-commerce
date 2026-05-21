const jwt = require("jsonwebtoken");

const isUser = (req, res, next) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({ success: false, message: "Access Denied: Please login first" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET || "nahibatauga");
        req.user = decoded; // Contains email, userid, role
        next();
    } catch (err) {
        return res.status(403).json({ success: false, message: "Invalid or Expired Token" });
    }
};

const isSeller = (req, res, next) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({ success: false, message: "Access Denied: Please login first" });
        }

        // Sellers login with "secretkey" and the payload contains id, email
        const decoded = jwt.verify(token, process.env.JWT_SECRET_SELLER || "secretkey");
        req.seller = decoded;
        next();
    } catch (err) {
        return res.status(403).json({ success: false, message: "Access Denied: Seller authentication failed" });
    }
};

const isAdmin = (req, res, next) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({ success: false, message: "Access Denied: Please login first" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET || "nahibatauga");
        
        if (decoded.role !== "admin") {
            return res.status(403).json({ success: false, message: "Access Denied: Admin only" });
        }

        req.user = decoded;
        next();
    } catch (err) {
        return res.status(403).json({ success: false, message: "Invalid or Expired Token" });
    }
};

module.exports = {
    isUser,
    isSeller,
    isAdmin
};

// write auth admin middelware
// Path: server/middlewares/authAdmin.js
const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
module.exports = async(req, res, next) => {
    try {
        const token = req.cookies.token;
        if (!token) return res.status(401).json({ success: false, message: "Access Denied, Login to continue" });
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);
        if (!user) return res.status(404).json({ success: false, message: "User not found" });
        if (user.role !== 'admin') return res.status(403).json({ success: false, message: "Unauthorized, Access Denied" });
        req.user = user;
        next();
    } catch (error) {
        return res.status(401).json({ success: false, message: "Access Denied, Login to continue" });
    }
}

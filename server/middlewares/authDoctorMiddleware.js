const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
// write auth doctor middelware
// Path: server/middlewares/authDoctorMiddleware.js
module.exports = async(req, res, next) => {
    try {
        const token = req.cookies.token;
        if (!token) return res.status(401).json({ success: false, message: "Access Denied, Login to continue" });
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);
        if (!user) return res.status(404).json({ success: false, message: "User not found" });
        if (user.role !== 'doctor') return res.status(403).json({ success: false, message: "Unauthorized, Access Denied" });
        req.user = user;
        next();
    } catch (error) {
        return res.status(401).json({ success: false, message: "Access Denied, Login to continue" });
    }
}
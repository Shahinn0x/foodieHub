const jwt = require('jsonwebtoken');
const userModel = require('../models/user.model');
const foodPartnerModel = require('../models/foodpartner.model');

async function verifyToken(req, res, next) {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({ message: "Unauthorized - No token provided" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ message: "Unauthorized - Invalid token" });
    }
}

async function isFoodPartner(req, res, next) {
    try {
        const partner = await foodPartnerModel.findById(req.user.id);
        if (!partner) {
            return res.status(403).json({ message: "Access denied - Food partners only" });
        }
        req.foodPartner = partner;
        next();
    } catch (error) {
        return res.status(500).json({ message: "Server error", error: error.message });
    }
}

function isAdmin(req, res, next) {
    // Simple admin check — in production, use a role field or admin model
    if (req.user.email !== process.env.ADMIN_EMAIL) {
        return res.status(403).json({ message: "Access denied - Admin only" });
    }
    next();
}

module.exports = { verifyToken, isFoodPartner, isAdmin };

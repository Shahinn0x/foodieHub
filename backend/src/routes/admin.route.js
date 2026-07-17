const express = require('express');
const adminController = require('../controllers/admin.controller');
const { verifyToken, isAdmin } = require('../middleware/auth.middleware');

const router = express.Router();

router.get('/dashboard', verifyToken, isAdmin, adminController.getDashboard);
router.get('/orders', verifyToken, isAdmin, adminController.getAllOrders);
router.get('/users', verifyToken, isAdmin, adminController.getAllUsers);
router.get('/restaurants', verifyToken, isAdmin, adminController.getAllRestaurants);

module.exports = router;

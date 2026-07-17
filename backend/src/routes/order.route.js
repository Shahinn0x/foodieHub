const express = require('express');
const orderController = require('../controllers/order.controller');
const { verifyToken } = require('../middleware/auth.middleware');

const router = express.Router();

router.post('/create', verifyToken, orderController.createOrder);
router.get('/my-orders', verifyToken, orderController.getMyOrders);
router.get('/status/:id', verifyToken, orderController.getOrderStatus);
router.get('/:id', verifyToken, orderController.getOrderById);
router.put('/cancel/:id', verifyToken, orderController.cancelOrder);

module.exports = router;

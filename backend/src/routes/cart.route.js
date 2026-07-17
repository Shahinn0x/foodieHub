const express = require('express');
const cartController = require('../controllers/cart.controller');
const { verifyToken } = require('../middleware/auth.middleware');

const router = express.Router();

router.post('/add', verifyToken, cartController.addToCart);
router.get('/', verifyToken, cartController.getCart);
router.put('/update/:foodId', verifyToken, cartController.updateCartItem);
router.delete('/remove/:foodId', verifyToken, cartController.removeCartItem);
router.delete('/clear', verifyToken, cartController.clearCart);

module.exports = router;

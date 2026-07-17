const express = require('express');
const foodController = require('../controllers/food.controller');
const { verifyToken, isFoodPartner } = require('../middleware/auth.middleware');

const router = express.Router();

router.post('/add', verifyToken, isFoodPartner, foodController.addFoodItem);
router.get('/restaurant/:restaurantId', foodController.getMenuByRestaurant);
router.get('/:id', foodController.getFoodById);
router.put('/:id', verifyToken, isFoodPartner, foodController.updateFoodItem);
router.delete('/:id', verifyToken, isFoodPartner, foodController.deleteFoodItem);

module.exports = router;

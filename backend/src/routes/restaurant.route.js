const express = require('express');
const restaurantController = require('../controllers/restaurant.controller');
const { verifyToken, isFoodPartner } = require('../middleware/auth.middleware');

const router = express.Router();

router.post('/create', verifyToken, isFoodPartner, restaurantController.createRestaurant);
router.get('/all', restaurantController.getAllRestaurants);
router.get('/:id', restaurantController.getRestaurantById);
router.put('/:id', verifyToken, isFoodPartner, restaurantController.updateRestaurant);
router.delete('/:id', verifyToken, isFoodPartner, restaurantController.deleteRestaurant);

module.exports = router;

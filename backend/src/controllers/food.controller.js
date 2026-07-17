const foodItemModel = require('../models/fooditem.model');
const foodPartnerModel = require('../models/foodpartner.model');

// 1. Food Partner adds an item to their menu
async function addFoodItem(req, res) {
    try {
        const { name, description, price, category, isVeg, image } = req.body;
        const foodPartnerId = req.user.id; // From auth middleware

        const newItem = await foodItemModel.create({
            foodPartner: foodPartnerId,
            name,
            description,
            price,
            category,
            isVeg,
            image
        });

        res.status(201).json({ message: "Food item added successfully", item: newItem });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
}

// 2. Public: Get all restaurants (For User Screen #2 Home Page)
async function getAllRestaurants(req, res) {
    try {
        const restaurants = await foodPartnerModel.find({}, '-password');
        res.status(200).json(restaurants);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
}

// 3. Public: Get a specific restaurant's menu (For User Screen #3 Menu Page)
async function getRestaurantMenu(req, res) {
    try {
        const { restaurantId } = req.params;
        const menuItems = await foodItemModel.find({ foodPartner: restaurantId });
        res.status(200).json(menuItems);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
}

module.exports = { addFoodItem, getAllRestaurants, getRestaurantMenu };
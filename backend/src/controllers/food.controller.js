const foodModel = require('../models/food.model');
const restaurantModel = require('../models/restaurant.model');

async function addFoodItem(req, res) {
    try {
        const { name, description, price, category, isVeg, image } = req.body;
        const restaurant = await restaurantModel.findOne({ owner: req.foodPartner._id });

        if (!restaurant) {
            return res.status(404).json({ message: "Create a restaurant first" });
        }

        const food = await foodModel.create({
            restaurant: restaurant._id,
            name,
            description,
            price,
            category,
            isVeg,
            image
        });

        res.status(201).json({ message: "Food item added", food });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
}

async function getMenuByRestaurant(req, res) {
    try {
        const menu = await foodModel.find({ restaurant: req.params.restaurantId, available: true });
        res.status(200).json(menu);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
}

async function getFoodById(req, res) {
    try {
        const food = await foodModel.findById(req.params.id);
        if (!food) {
            return res.status(404).json({ message: "Food item not found" });
        }
        res.status(200).json(food);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
}

async function updateFoodItem(req, res) {
    try {
        const restaurant = await restaurantModel.findOne({ owner: req.foodPartner._id });
        if (!restaurant) {
            return res.status(404).json({ message: "Restaurant not found" });
        }

        const food = await foodModel.findOneAndUpdate(
            { _id: req.params.id, restaurant: restaurant._id },
            req.body,
            { new: true, runValidators: true }
        );

        if (!food) {
            return res.status(404).json({ message: "Food item not found" });
        }

        res.status(200).json({ message: "Food item updated", food });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
}

async function deleteFoodItem(req, res) {
    try {
        const restaurant = await restaurantModel.findOne({ owner: req.foodPartner._id });
        if (!restaurant) {
            return res.status(404).json({ message: "Restaurant not found" });
        }

        const food = await foodModel.findOneAndDelete({
            _id: req.params.id,
            restaurant: restaurant._id
        });

        if (!food) {
            return res.status(404).json({ message: "Food item not found" });
        }

        res.status(200).json({ message: "Food item deleted" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
}

module.exports = { addFoodItem, getMenuByRestaurant, getFoodById, updateFoodItem, deleteFoodItem };

const restaurantModel = require('../models/restaurant.model');

async function createRestaurant(req, res) {
    try {
        const { name, image, address, city, phone, category, openingTime, closingTime, deliveryTime } = req.body;
        const owner = req.foodPartner._id;

        const existing = await restaurantModel.findOne({ owner });
        if (existing) {
            return res.status(400).json({ message: "You already have a registered restaurant" });
        }

        const restaurant = await restaurantModel.create({
            name,
            owner,
            image,
            address,
            city,
            phone,
            category,
            openingTime,
            closingTime,
            deliveryTime
        });

        res.status(201).json({ message: "Restaurant created", restaurant });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
}

async function getAllRestaurants(req, res) {
    try {
        const { search, category, sort } = req.query;
        let filter = {};

        if (search) {
            filter.name = { $regex: search, $options: 'i' };
        }

        if (category) {
            filter.category = { $regex: category, $options: 'i' };
        }

        let sortOption = {};
        if (sort === 'rating') {
            sortOption.rating = -1;
        } else if (sort === 'deliveryTime') {
            sortOption.deliveryTime = 1;
        } else {
            sortOption.createdAt = -1;
        }

        const restaurants = await restaurantModel.find(filter, '-__v').sort(sortOption);

        res.status(200).json(restaurants);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
}

async function getRestaurantById(req, res) {
    try {
        const restaurant = await restaurantModel.findById(req.params.id, '-__v');
        if (!restaurant) {
            return res.status(404).json({ message: "Restaurant not found" });
        }
        res.status(200).json(restaurant);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
}

async function updateRestaurant(req, res) {
    try {
        const restaurant = await restaurantModel.findOne({ owner: req.foodPartner._id });
        if (!restaurant) {
            return res.status(404).json({ message: "Restaurant not found" });
        }

        const updated = await restaurantModel.findByIdAndUpdate(
            restaurant._id,
            req.body,
            { new: true, runValidators: true }
        );

        res.status(200).json({ message: "Restaurant updated", restaurant: updated });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
}

async function deleteRestaurant(req, res) {
    try {
        const restaurant = await restaurantModel.findOneAndDelete({ owner: req.foodPartner._id });
        if (!restaurant) {
            return res.status(404).json({ message: "Restaurant not found" });
        }
        res.status(200).json({ message: "Restaurant deleted" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
}

module.exports = { createRestaurant, getAllRestaurants, getRestaurantById, updateRestaurant, deleteRestaurant };

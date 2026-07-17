const orderModel = require('../models/order.model');
const userModel = require('../models/user.model');
const restaurantModel = require('../models/restaurant.model');
const foodModel = require('../models/food.model');

async function getDashboard(req, res) {
    try {
        const totalUsers = await userModel.countDocuments();
        const totalRestaurants = await restaurantModel.countDocuments();
        const totalOrders = await orderModel.countDocuments();

        const revenueData = await orderModel.aggregate([
            { $match: { status: { $ne: 'Cancelled' } } },
            { $group: { _id: null, total: { $sum: '$totalPrice' } } }
        ]);
        const totalRevenue = revenueData[0]?.total || 0;

        const recentOrders = await orderModel.find()
            .populate('user', 'fullName email')
            .populate('restaurant', 'name')
            .sort({ createdAt: -1 })
            .limit(10);

        const topSelling = await orderModel.aggregate([
            { $match: { status: { $ne: 'Cancelled' } } },
            { $unwind: '$items' },
            { $group: { _id: '$items.food', totalQuantity: { $sum: '$items.quantity' } } },
            { $sort: { totalQuantity: -1 } },
            { $limit: 5 },
            { $lookup: { from: 'foods', localField: '_id', foreignField: '_id', as: 'food' } },
            { $unwind: '$food' },
            { $project: { name: '$food.name', totalQuantity: 1 } }
        ]);

        res.status(200).json({
            totalUsers,
            totalRestaurants,
            totalOrders,
            totalRevenue,
            recentOrders,
            topSelling
        });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
}

async function getAllOrders(req, res) {
    try {
        const orders = await orderModel.find()
            .populate('user', 'fullName email')
            .populate('restaurant', 'name')
            .sort({ createdAt: -1 });

        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
}

async function getAllUsers(req, res) {
    try {
        const users = await userModel.find({}, '-password').sort({ createdAt: -1 });
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
}

async function getAllRestaurants(req, res) {
    try {
        const restaurants = await restaurantModel.find()
            .populate('owner', 'name email')
            .sort({ createdAt: -1 });

        res.status(200).json(restaurants);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
}

module.exports = { getDashboard, getAllOrders, getAllUsers, getAllRestaurants };

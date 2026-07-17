const orderModel = require('../models/order.model');
const restaurantModel = require('../models/restaurant.model');

async function getPartnerOrders(req, res) {
    try {
        const restaurant = await restaurantModel.findOne({ owner: req.foodPartner._id });
        if (!restaurant) {
            return res.status(404).json({ message: "Restaurant not found" });
        }

        const orders = await orderModel.find({ restaurant: restaurant._id })
            .populate('user', 'fullName email')
            .sort({ createdAt: -1 });

        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
}

async function updatePartnerOrder(req, res) {
    try {
        const restaurant = await restaurantModel.findOne({ owner: req.foodPartner._id });
        if (!restaurant) {
            return res.status(404).json({ message: "Restaurant not found" });
        }

        const order = await orderModel.findOne({
            _id: req.params.id,
            restaurant: restaurant._id
        });

        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        order.status = req.body.status;
        await order.save();

        res.status(200).json({ message: "Order status updated", order });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
}

module.exports = { getPartnerOrders, updatePartnerOrder };

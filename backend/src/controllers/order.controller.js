const orderModel = require('../models/order.model');
const cartModel = require('../models/cart.model');
const addressModel = require('../models/address.model');

async function createOrder(req, res) {
    try {
        const { addressId, paymentMethod } = req.body;

        const cart = await cartModel.findOne({ user: req.user.id }).populate('items.food');
        if (!cart || cart.items.length === 0) {
            return res.status(400).json({ message: "Cart is empty" });
        }

        const address = await addressModel.findOne({ _id: addressId, user: req.user.id });
        if (!address) {
            return res.status(404).json({ message: "Address not found" });
        }

        const restaurantId = cart.items[0].food.restaurant;

        const orderItems = cart.items.map(item => ({
            food: item.food._id,
            name: item.food.name,
            price: item.food.price,
            quantity: item.quantity
        }));

        const totalPrice = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

        const order = await orderModel.create({
            user: req.user.id,
            restaurant: restaurantId,
            items: orderItems,
            totalPrice,
            deliveryAddress: {
                name: address.name,
                phone: address.phone,
                address: address.address,
                city: address.city,
                state: address.state,
                pincode: address.pincode
            },
            paymentMethod,
            status: 'Placed'
        });

        await cartModel.findOneAndDelete({ user: req.user.id });

        res.status(201).json({ message: "Order placed successfully", order });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
}

async function getMyOrders(req, res) {
    try {
        const orders = await orderModel.find({ user: req.user.id })
            .populate('restaurant', 'name')
            .sort({ createdAt: -1 });

        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
}

async function getOrderById(req, res) {
    try {
        const order = await orderModel.findById(req.params.id)
            .populate('restaurant', 'name address phone');

        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        res.status(200).json(order);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
}

async function cancelOrder(req, res) {
    try {
        const order = await orderModel.findOne({
            _id: req.params.id,
            user: req.user.id,
            status: 'Placed'
        });

        if (!order) {
            return res.status(404).json({ message: "Order not found or cannot be cancelled" });
        }

        order.status = 'Cancelled';
        await order.save();

        res.status(200).json({ message: "Order cancelled", order });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
}

async function getOrderStatus(req, res) {
    try {
        const order = await orderModel.findById(req.params.id, 'status');
        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }
        res.status(200).json({ status: order.status });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
}

async function updateOrderStatus(req, res) {
    try {
        const { status } = req.body;
        const order = await orderModel.findById(req.params.id);

        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        order.status = status;
        await order.save();

        res.status(200).json({ message: "Order status updated", order });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
}

module.exports = { createOrder, getMyOrders, getOrderById, cancelOrder, getOrderStatus, updateOrderStatus };

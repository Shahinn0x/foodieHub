const cartModel = require('../models/cart.model');
const foodModel = require('../models/food.model');

async function addToCart(req, res) {
    try {
        const { foodId, quantity } = req.body;

        const food = await foodModel.findById(foodId);
        if (!food) {
            return res.status(404).json({ message: "Food item not found" });
        }

        let cart = await cartModel.findOne({ user: req.user.id });

        if (!cart) {
            cart = await cartModel.create({
                user: req.user.id,
                items: [{ food: foodId, quantity: quantity || 1 }]
            });
        } else {
            const existingItem = cart.items.find(item => item.food.toString() === foodId);

            if (existingItem) {
                existingItem.quantity += quantity || 1;
            } else {
                cart.items.push({ food: foodId, quantity: quantity || 1 });
            }

            await cart.save();
        }

        const populatedCart = await cartModel.findById(cart._id).populate('items.food');
        res.status(200).json({ message: "Item added to cart", cart: populatedCart });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
}

async function getCart(req, res) {
    try {
        const cart = await cartModel.findOne({ user: req.user.id }).populate('items.food');

        if (!cart || cart.items.length === 0) {
            return res.status(200).json({ items: [], totalPrice: 0 });
        }

        const totalPrice = cart.items.reduce((sum, item) => {
            return sum + (item.food.price * item.quantity);
        }, 0);

        res.status(200).json({ items: cart.items, totalPrice });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
}

async function updateCartItem(req, res) {
    try {
        const { quantity } = req.body;
        const cart = await cartModel.findOne({ user: req.user.id });

        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }

        const item = cart.items.find(item => item.food.toString() === req.params.foodId);
        if (!item) {
            return res.status(404).json({ message: "Item not found in cart" });
        }

        item.quantity = quantity;
        await cart.save();

        const populatedCart = await cartModel.findById(cart._id).populate('items.food');
        res.status(200).json({ message: "Cart updated", cart: populatedCart });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
}

async function removeCartItem(req, res) {
    try {
        const cart = await cartModel.findOne({ user: req.user.id });

        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }

        cart.items = cart.items.filter(item => item.food.toString() !== req.params.foodId);
        await cart.save();

        const populatedCart = await cartModel.findById(cart._id).populate('items.food');
        res.status(200).json({ message: "Item removed from cart", cart: populatedCart });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
}

async function clearCart(req, res) {
    try {
        await cartModel.findOneAndDelete({ user: req.user.id });
        res.status(200).json({ message: "Cart cleared" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
}

module.exports = { addToCart, getCart, updateCartItem, removeCartItem, clearCart };

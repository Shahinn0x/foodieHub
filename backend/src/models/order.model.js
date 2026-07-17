const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
    food: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'food',
        required: true
    },
    name: String,
    price: Number,
    quantity: {
        type: Number,
        required: true,
        min: 1
    }
});

const deliveryAddressSchema = new mongoose.Schema({
    name: String,
    phone: String,
    address: String,
    city: String,
    state: String,
    pincode: String
});

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    restaurant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'restaurant',
        required: true
    },
    items: [orderItemSchema],
    totalPrice: {
        type: Number,
        required: true
    },
    deliveryAddress: deliveryAddressSchema,
    paymentMethod: {
        type: String,
        enum: ['COD', 'UPI', 'CARD', 'NETBANKING'],
        required: true
    },
    status: {
        type: String,
        enum: ['Placed', 'Accepted', 'Preparing', 'Out For Delivery', 'Delivered', 'Cancelled'],
        default: 'Placed'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('order', orderSchema);

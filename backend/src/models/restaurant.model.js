const mongoose = require('mongoose');

const restaurantSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'foodpartner',
        required: true
    },
    image: {
        type: String,
        default: ''
    },
    address: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    category: {
        type: String,
        default: 'General'
    },
    openingTime: {
        type: String,
        default: '09:00'
    },
    closingTime: {
        type: String,
        default: '22:00'
    },
    rating: {
        type: Number,
        default: 0,
        min: 0,
        max: 5
    },
    deliveryTime: {
        type: String,
        default: '30-45 min'
    },
    isOpen: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('restaurant', restaurantSchema);

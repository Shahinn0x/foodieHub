const mongoose = require('mongoose');

const foodSchema = new mongoose.Schema({
    restaurant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'restaurant',
        required: true
    },
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        default: ''
    },
    price: {
        type: Number,
        required: true
    },
    category: {
        type: String,
        default: 'Main Course'
    },
    image: {
        type: String,
        default: ''
    },
    isVeg: {
        type: Boolean,
        default: true
    },
    available: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('food', foodSchema);

const express = require("express");
const cookieParser = require('cookie-parser');
const cors = require('cors');

const authRoutes = require('./routes/auth.route');
const restaurantRoutes = require('./routes/restaurant.route');
const foodRoutes = require('./routes/food.route');
const cartRoutes = require('./routes/cart.route');
const addressRoutes = require('./routes/address.route');
const orderRoutes = require('./routes/order.route');
const partnerRoutes = require('./routes/partner.route');
const adminRoutes = require('./routes/admin.route');

const app = express();

app.use(cors());
app.use(cookieParser());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Hello world..")
});

app.use('/api/auth', authRoutes);
app.use('/api/restaurant', restaurantRoutes);
app.use('/api/food', foodRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/address', addressRoutes);
app.use('/api/order', orderRoutes);
app.use('/api/partner', partnerRoutes);
app.use('/api/admin', adminRoutes);

module.exports = app;

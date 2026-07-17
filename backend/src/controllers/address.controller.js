const addressModel = require('../models/address.model');

async function addAddress(req, res) {
    try {
        const { name, phone, address, city, state, pincode } = req.body;

        const newAddress = await addressModel.create({
            user: req.user.id,
            name,
            phone,
            address,
            city,
            state,
            pincode
        });

        res.status(201).json({ message: "Address added", address: newAddress });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
}

async function getAddresses(req, res) {
    try {
        const addresses = await addressModel.find({ user: req.user.id });
        res.status(200).json(addresses);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
}

async function updateAddress(req, res) {
    try {
        const address = await addressModel.findOneAndUpdate(
            { _id: req.params.id, user: req.user.id },
            req.body,
            { new: true, runValidators: true }
        );

        if (!address) {
            return res.status(404).json({ message: "Address not found" });
        }

        res.status(200).json({ message: "Address updated", address });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
}

async function deleteAddress(req, res) {
    try {
        const address = await addressModel.findOneAndDelete({
            _id: req.params.id,
            user: req.user.id
        });

        if (!address) {
            return res.status(404).json({ message: "Address not found" });
        }

        res.status(200).json({ message: "Address deleted" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
}

module.exports = { addAddress, getAddresses, updateAddress, deleteAddress };

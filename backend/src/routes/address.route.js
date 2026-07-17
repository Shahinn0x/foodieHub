const express = require('express');
const addressController = require('../controllers/address.controller');
const { verifyToken } = require('../middleware/auth.middleware');

const router = express.Router();

router.post('/', verifyToken, addressController.addAddress);
router.get('/', verifyToken, addressController.getAddresses);
router.put('/:id', verifyToken, addressController.updateAddress);
router.delete('/:id', verifyToken, addressController.deleteAddress);

module.exports = router;

const express = require('express');
const partnerController = require('../controllers/partner.controller');
const { verifyToken, isFoodPartner } = require('../middleware/auth.middleware');

const router = express.Router();

router.get('/orders', verifyToken, isFoodPartner, partnerController.getPartnerOrders);
router.put('/order/:id', verifyToken, isFoodPartner, partnerController.updatePartnerOrder);

module.exports = router;

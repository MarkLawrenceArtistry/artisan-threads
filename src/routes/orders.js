const express = require('express')
const router = express.Router()

const orderController = require('../controllers/orderController');

router.post("/place", orderController.placeOrder);
router.get("/", orderController.getAllOrders);
router.get("/:id", orderController.getAllOrdersOneCustomer);
router.put("/:id", orderController.updateStatusOrder);

module.exports = router
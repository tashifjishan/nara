const express = require("express");
const { createOrder, verifyPayment, getOrderDetails } = require("../controllers/payment");
const router = express.Router()
router.post("/create", createOrder);
router.post("/verify", verifyPayment);
router.post("/details", getOrderDetails)

module.exports = router;
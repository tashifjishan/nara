const express = require("express");
const { addToCart, updateQuantity } = require("../controllers/cart");
const { protect } = require("../controllers/auth");

const router = express.Router();

router.use(protect)

router.post("/add", addToCart)
router.post("/update", updateQuantity)
module.exports = router;
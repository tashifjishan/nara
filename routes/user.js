const express = require("express");
const { signup, login, logout, protect } = require("../controllers/auth");
const { addAddress, deleteAddress, markAsDefault, getUserInfo } = require("../controllers/user");

const router = express.Router();

router.post("/signup", signup)  
router.post("/login", login)

router.use(protect)

router.get("/", getUserInfo)
router.get("/logout", logout)
router.route("/address").patch(addAddress).delete(deleteAddress)
router.patch("/address/markAsDefault", markAsDefault)
// localhost:8181/user/address/markAsDefault?id="addressId"

module.exports = router;
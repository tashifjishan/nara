const express = require("express");
const { addOne, getOne, getAll } = require("../controllers/Product");
const { protect } = require("../controllers/auth");
const router = express.Router();

router.get("/all", getAll)
router.get("/:productId", getOne)

router.use(protect)


router.use((req, res, next) => {
    const user = req.user;
    const role = user.role;
    if (role === "admin")
        next()
    else
        res.status(401).json({ status: "FAIL", message: "You are not authorized to perform this action!" })
})

router.post("/", addOne)


module.exports = router;
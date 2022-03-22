const router = require("express").Router();
const { getCategory, createCategory } = require("../controllers/categoryControllers");
const admin = require("../middlewares/admin");
const authorize = require("../middlewares/authorize");

router.route("/")
    .get(getCategory)
    .post([authorize, admin], createCategory)

module.exports = router;
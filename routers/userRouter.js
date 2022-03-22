const router = require("express").Router();
const { signUp, login } = require("../controllers/userControllers");


// ROUTERS
router.route("/signUp")
    .post(signUp)
router.route("/login")
    .post(login)

module.exports = router;
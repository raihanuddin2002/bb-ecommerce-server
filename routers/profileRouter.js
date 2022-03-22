const router = require("express").Router();
const authorize = require("../middlewares/authorize");
const { setProfile, getProfile } = require("../controllers/profileController");

router.route("/")
    .get(authorize, getProfile)
    .post(authorize, setProfile)

module.exports = router;

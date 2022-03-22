const router = require("express").Router();
const authorize = require("../middlewares/authorize");
const {
    getCartItems,
    addCartItems,
    updateCartItems,
    deleteCartItems
} = require("../controllers/cartItemController");

router.route("/")
    .get(authorize, getCartItems)
    .post(authorize, addCartItems)
    .put(authorize, updateCartItems)
    .delete(authorize, deleteCartItems);

module.exports = router;
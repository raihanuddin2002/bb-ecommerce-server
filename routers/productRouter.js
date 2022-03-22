const router = require("express").Router();
const {
    getProducts,
    addProduct,
    getProductById,
    updateProductById,
    deleteProductById,
    getPhoto,
    filterProducts
} = require("../controllers/productContollers");
const admin = require("../middlewares/admin");
const authorize = require("../middlewares/authorize");

router.route("/")
    .get(getProducts)
    .post([authorize, admin], addProduct)

router.route("/:_id")
    .get(getProductById)
    .put([authorize, admin], updateProductById)
    .delete([authorize, admin], deleteProductById)

router.route("/photo/:_id")
    .get(getPhoto)

router.route("/filterProducts")
    .post(filterProducts)

module.exports = router;
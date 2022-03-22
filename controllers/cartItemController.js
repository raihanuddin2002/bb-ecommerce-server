const { CartItem } = require("../models/cartItem");

// GET CART ITEMS
module.exports.getCartItems = async (req, res) => {
    const cartItems = await CartItem.find().populate("product", "name").populate("user", 'name');
    res.send(cartItems);
}

// ADD ITEMS TO CART
module.exports.addCartItems = async (req, res) => {
    const { product, price } = req.body;

    let cartItem = await CartItem.findOne({ user: req.user.id, product });
    if (cartItem) return res.status(400).send("Item already added to cart!");
    cartItem = new CartItem({ product, price, user: req.user.id });

    const result = await cartItem.save();
    res.send(201).send({ message: "Added to cart successfully!", result });
}

// UPDATE CART ITEM
module.exports.updateCartItems = async (req, res) => {
    const { _id, count } = req.body;
    const result = await CartItem.updateOne({ _id, user: req.user.id }, count, { upsert: true });
    return res.send("Item updated!");
}

// DELETE CART ITEM
module.exports.deleteCartItems = async (req, res) => {
    const result = await CartItem.deleteOne({ _id: req.body._id, user: req.user.id });
    res.send("Deleted Cart Item");
}
const { Category } = require("../models/category");

module.exports.createCategory = async (req, res) => {
    const categoryName = new Category(req.body);
    const { name } = await categoryName.save();

    return res.send({ message: "Category Inserted", name });

}

module.exports.getCategory = async (req, res) => {
    const categories = await Category.find().sort({ name: 1 });
    res.send(categories);
}
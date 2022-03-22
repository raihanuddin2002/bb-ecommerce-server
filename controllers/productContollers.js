const mongoose = require('mongoose');
const { Product } = require("../models/product");
const formidable = require("formidable");
const fs = require('fs');
const { options } = require("../routers/productRouter");

// ALL PRODUCTS
module.exports.getProducts = async (req, res) => {
    let { order, sortBy, limit } = req.query;
    order = order === 'desc' ? -1 : 1;
    sortBy = sortBy ? sortBy : '_id';
    limit = limit ? parseInt(limit) : 10;

    const products = await Product.find()
        .select({ photo: 0 })
        .sort({ [sortBy]: order })
        .limit(limit)
        .populate('category');
    return res.send(products);
}

// PRODUCTS BY ID
module.exports.getProductById = async (req, res) => {
    const { _id } = req.params;
    const product = await Product.findById(_id).select({ photo: 0 }).populate('category');

    if (!product) return res.status(404).send("Not found!");
    return res.send(product);
}

// ADD PRODUCT
module.exports.addProduct = async (req, res) => {
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;

    form.parse(req, (err, fields, files) => {
        if (err) return res.status(400).send("Something Went Wrong!");

        const product = new Product(fields);

        if (files.photo) {
            fs.readFile(files.photo.filepath, (err, data) => {
                if (err) return res.status(400).send("Problems in Image file!");

                product.photo.data = data;
                product.photo.contentType = files.photo.mimetype;

                product.save((err, result) => {
                    if (err) return res.status(500).send("Internal Server Error!");

                    const { name, description, price, quantity, category } = result;
                    res.send({ message: "Product Added!", name, description, price, quantity, category });
                });
            });
        }
        else return res.status(400).send("No Image File Provided!");

    });

}

// UPDATE PRODUCT
module.exports.updateProductById = async (req, res) => {
    const { _id } = req.params;
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;

    form.parse(req, async (err, fields, files) => {
        if (err) return res.status(400).send("Something Went Wrong!");


        if (files.photo) {
            fs.readFile(files.photo.filepath, async (err, data) => {
                if (err) return res.status(400).send("Problems in Image file!");

                const updateProduct = { ...fields, photo: { data, contentType: files.photo.mimetype } };

                const { name, description, price, quantity, category } = await Product.findByIdAndUpdate(_id, updateProduct, { new: true });
                return res.send({ message: "Updated Successful", _id, name, description, price, quantity, category });
            });
        } else {
            const { name, description, price, quantity, category } = await Product.findByIdAndUpdate(_id, fields, { new: true });
            return res.send({ message: "Updated Successful", _id, name, description, price, quantity, category });
        }

    });
}

// DELETE PRODUCT
module.exports.deleteProductById = async (req, res) => {
    const { _id } = await Product.findByIdAndDelete(req.params._id);
    return res.send({ _id, message: "Deleted Successfully" });
}

// GET PRODUCTS PHOTO
module.exports.getPhoto = async (req, res) => {
    const { _id } = req.params;
    const product = await Product.findById(_id).select({ photo: 1, _id: 0 });

    if (!product) return res.status(404).send("Not found!");

    res.set("Content-Type", product.photo.contentType);
    return res.send(product.photo.data);
}

// FILTERING PRODUCTS
module.exports.filterProducts = async (req, res) => {
    let { order, sortBy, limit, skip, filters } = req.body;
    order = order === 'desc' ? -1 : 1;
    sortBy = sortBy ? sortBy : '_id';
    limit = limit ? parseInt(limit) : 10;
    skip = skip ? parseInt(skip) : 0;

    let args = {};

    for (key in filters) {
        if (filters[key].length > 0) {
          if(key === "category") args["category"] =  { $in: filters["category"] };
          if(key === "price") args.price = { $gte: filters.price[0], $lte: filters.price[1]};
        }
    }
    const products = await Product.find(args)
        .select({ photo: 0 })
        .populate('category')
        .sort({ [sortBy]: order })
        .skip(skip)
        .limit(limit)

    return res.send(products);
}

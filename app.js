require("dotenv").config();
require("express-async-errors");
const express = require('express');
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const userRouter = require("./routers/userRouter");
const categoryRouter = require("./routers/categoryRouter");
const productRouter = require("./routers/productRouter");
const cartItemRouter = require("./routers/cartItemRouter");
const profileRouter = require("./routers/profileRouter");
const paymentRouter = require("./routers/paymentRouter");

// Base Dir
global.__basedir = __dirname;

// PORT
const port = process.env.port || 5000;

// COMMON MIDDLEWARES
app.use(cors());
app.use(express.urlencoded({ extended: true })) // Get payment Ipn link's Information
app.use(express.json());

// API MIDDLEWARES
app.use("/user", userRouter);
app.use("/category", categoryRouter);
app.use("/product", productRouter);
app.use("/cartItem", cartItemRouter);
app.use("/profile", profileRouter);
app.use("/payment", paymentRouter);

// ERROR HANDLING MIDDLEWARE
app.use((err, req, res, next) => {
    return res.status(500).send("Invalid Credintials!");
});


// DATABASE CONNECTION
mongoose.connect(process.env.MONGODB_URL)
    .then(() => console.log("Database Connected!"))
    .catch(err => console.log("Database Connection Failed!"))

// ROOT
app.use("/", (req, res) => res.send("WELCOME TO BB_ECOMMERCE SERVER..."));

app.listen(port, () => console.log("BB_ECOMMERCE server listhening on port:", port));

module.exports = app;
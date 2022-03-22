const Paymentsession = require("ssl-commerz-node").PaymentSession;
const { CartItem } = require('../models/cartItem');
const { Profile } = require('../models/profile');
const { Order } = require('../models/order');
const { Payment } = require('../models/payment');
const path = require(path);

/*  
Payment Steps:
    1.Request a session
    2. Payment Process,
    3. Recieve Ipn
    4. Create an order
 */

// IPN
module.exports.ipn = async (req, res) => {
    const payment = new Payment(req.body);
    const { tran_id, status } = payment;

    if (status === "VALID") {
        const order = await Order.updateOne({ tran_id }, { status: "Complete" }, { upsert: true });
        await CartItem.deleteMany(order.cartItems);
    } else {
        await Order.deleteOne({ tran_id });
    }
    await payment.save();
    res.send("IPN") // It won't Need Anywhere
}

// Init
module.exports.initPayment = async (req, res) => {
    const { id, name, email } = req.user;
    const cartItems = await CartItem.find({ user: id });
    const profile = await Profile.find({ user: id }).select({ user: 0 });

    const total_amount = cartItems.map(item => item.count * item.price).reduce((a, b) => a + b, 0)
    const total_item = cartItems.map(item => item.count).reduce((a, b) => a + b, 0)
    const tran_id = '-' + Math.random().toString(36).substring(2, 9) + new Date().getDate();

    const payment = new Paymentsession(true, process.env.STORE_ID, process.env.STORE_PASS);

    // Set the urls
    payment.setUrls({
        success: "yoursite.com/success", // If payment Succeed
        fail: "yoursite.com/fail", // If payment failed
        cancel: "yoursite.com/cancel", // If user cancel payment
        ipn: "yoursite.com/payment", // SSLCommerz will send http post request in this link
    });

    // Set order details
    payment.setOrderInfo({
        total_amount, // Number field
        currency: "BDT", // Must be three character string
        tran_id, // Unique Transaction id
        emi_option: 0, // 1 or 0
        multi_card_name: "internetbank", // Do not Use! If you do not customize the gateway list,
        allowed_bin: "371598,371599,376947,376948,376949", // Do not Use! If you do not control on transaction
        emi_max_inst_option: 3, // Max instalment Option
        emi_allow_only: 0, // Value is 1/0, if value is 1 then only EMI transaction is possible
    });

    // Set customer info
    payment.setCusInfo({
        name,
        email,
        ...profile,
        fax: email,
    });

    // Set shipping info
    payment.setShippingInfo({
        method: "Courier", //Shipping method of the order. Example: YES or NO or Courier
        num_item: total_item,
        ...profile
    });

    // Set Product Profile
    payment.setProductInfo({
        product_name: "BB E-Commerce",
        product_category: "general",
        product_profile: "general"
    });

    const response = await payment.paymentInit();

    if (response.status === 'SUCCESS') {
        let order = new Order({ cartItems, tran_id, user: id, sessionKey: response.sessionkey, ...profile });
        await order.save();
    }
    return res.send(response);
}

module.exports.paymentSuccess = (req, res) => {
    res.sendFile(path.join(__basedir + "public/success.html"))
}
const bcrypt = require('bcrypt');
const { User } = require("../models/user");

// SIGN UP
module.exports.signUp = async (req, res) => {
    let user = await User.findOne({ email: req.body.email });
    if (user) return res.status(400).send("User already exist!");
    user = new User(req.body);

    const genSalt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, genSalt);
    const token = user.genarateJwt();

    const { _id, name, email } = await user.save();
    return res.status(201).send({ _id, name, email, token, message: "Registration Successful" });
}

// LOGIN
module.exports.login = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).send("Invalid Email or Password!");

    const validUser = await bcrypt.compare(password, user.password);
    if (!validUser) return res.status(400).send("Invalid Email or Password!");

    const token = await user.genarateJwt();
    return res.status(200).send({ message: "Login Successful", name: user.name, email, token });
}
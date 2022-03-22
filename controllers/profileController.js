const { Profile } = require("../models/profile");

module.exports.getProfile = async (req, res) => {
    const result = await Profile.findOne({ user: req.user._id });
    return res.send(result);
}
module.exports.setProfile = async (req, res) => {
    const userProfile = { ...req.body, user: req.user.id };
    let profile = await Profile.findOne({ user: req.user.id });

    if (profile) {
        await Profile.updateOne({ user: req.user.id, userProfile });
    } else {
        profile = new Profile(userProfile);
        await profile.save();
    }
}
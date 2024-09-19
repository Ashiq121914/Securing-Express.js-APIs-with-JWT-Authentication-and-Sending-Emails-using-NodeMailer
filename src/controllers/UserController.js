let md5 = require("md5");
const UserModel = require("../models/UserModel");

//! Create user
exports.register = async (req, res) => {
  try {
    let reqBody = req.body;
    // md5 helps us to hash the credentials
    reqBody.password = md5(req.body.password); // 1234
    let user = await UserModel.find({ reqBody });
    if (user.length > 0) {
      res.status(200).json({ status: "error", msg: "have account" });
    } else {
      let data = await UserModel.create(reqBody);
      res.status(200).json({ status: "success", data: data });
    }
  } catch (e) {
    res.status(200).json({ status: "error", error: e });
  }
};

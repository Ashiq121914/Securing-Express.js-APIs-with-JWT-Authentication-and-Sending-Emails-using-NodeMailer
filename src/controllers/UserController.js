let md5 = require("md5");
const UserModel = require("../models/UserModel");
const { EncodeToken } = require("../utility/TokenHelper");
const EmailSend = require("../utility/EmailSend");

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

//! User Login
exports.login = async (req, res) => {
  try {
    let reqBody = req.body;
    reqBody.password = md5(req.body.password); // 1234
    let data = await UserModel.aggregate([
      { $match: reqBody },
      { $project: { _id: 1, email: 1 } },
    ]);

    if (data.length > 0) {
      let token = EncodeToken(data[0]["email"]);

      // Set cookie
      let options = {
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
        httpOnly: true,
        sameSite: "none",
        secure: true,
      };

      // - we will set the token in the cookie
      res.cookie("Token", token, options);
      res.status(200).json({ status: "success", token: token, data: data[0] });
    } else {
      res.status(200).json({ status: "unauthorized", data: data });
    }
  } catch (e) {
    res.status(200).json({ status: "error", error: e.toString() });
  }
};

//! user Logout
exports.logout = async (req, res) => {
  try {
    res.clearCookie("Token");
    res.status(200).json({ status: "success" });
  } catch (e) {
    res.status(200).json({ status: "error", error: e.toString() });
  }
};

//! get User
exports.profile_read = async (req, res) => {
  let email = req.headers.email;
  try {
    let MatchStage = {
      $match: {
        email,
      },
    };

    let project = {
      $project: {
        email: 1,
        firstName: 1,
        lastName: 1,
        img: 1,
        phone: 1,
      },
    };

    let data = await UserModel.aggregate([MatchStage, project]);

    res.status(200).json({ status: "success", data: data[0] });
  } catch (e) {
    res.status(200).json({ status: "error", error: e.toString() });
  }
};

//! Send Email
exports.send_Email = async (req, res) => {
  let reqBody = req.body;

  let emailTo = reqBody.email;
  let emailText = reqBody.emailText;
  let emailSubject = reqBody.emailSubject;
  try {
    let data = await EmailSend(emailTo, emailText, emailSubject);
    res.status(200).json({ status: "success", data: data });
  } catch (e) {
    res.status(200).json({ status: "error", error: e.toString() });
  }
};

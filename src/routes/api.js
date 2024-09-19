const express = require("express");
const router = express.Router();

const UserController = require("../controllers/UserController");
const AuthVerification = require("../middlewares/AuthVerification");

//! User
router.post("/register", UserController.register);
router.post("/login", UserController.login);
router.get("/logout", UserController.logout);
router.get("/profile-read", AuthVerification, UserController.profile_read);

module.exports = router;

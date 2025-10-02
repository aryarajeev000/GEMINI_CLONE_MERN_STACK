const express = require("express");
const {
  registerController,
  loginController,
  logoutController,
} = require("../controllers/authController");

const router = express.Router();

//routes
//REGISTER
router.post("/resister", registerController);

//LOGIN
router.post("/login", loginController);

//LOGOUT
router.post("/logout", logoutController);

module.exports=router;
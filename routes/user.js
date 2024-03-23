const express = require("express");
const router = express.Router();
const wrapAsync = require("../utilis/wrapAsync.js")
const passport = require("passport");

const userController = require("../controllers/user.js")

//render Signup Page
router.get("/signup", userController.signupRender);

//post for signup 
router.post("/signup", wrapAsync(userController.postInfo));

//render login page
router.get("/login", userController.loginRender)

//post for login
router.post("/login", passport.authenticate("local", {failureRedirect: "/login", failureFlash: true}), userController.postLogin);


//for logout
router.get("/logout", userController.logout)

module.exports = router;
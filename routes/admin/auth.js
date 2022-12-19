const express = require("express");
const { check, validationResult } = require("express-validator");

const { handleErrors } = require("./ midlewares");
const Urepos = require("../../repos/users");
const Router = express.Router();
const signupTmplt = require("../../views/admin/auth/signup");
const signinTmplt = require("../../views/admin/auth/signin");
const {
  checkEmail,
  checkPassword,
  confirmPassword,
  checkLoginEmail,
  checkLoginPassword,
} = require("./validators");

Router.get("/signup", (req, res) => {
  res.send(signupTmplt({}));
});

//sanitization comes first then validation
Router.post(
  "/signup",
  [checkEmail, checkPassword, confirmPassword],
  handleErrors(signupTmplt),
  async (req, res) => {
    const { email, password } = req.body;
    const user = await Urepos.create({ email, password });
    //save userId in cookie session for authentication purposes
    req.session.userId = user.id;
    res.redirect("/admin/products");
  }
);
Router.get("/signout", (req, res) => {
  req.session = null;
  res.send("You are logged out");
});

Router.get("/signin", (req, res) => {
  res.send(signinTmplt({}));
});
Router.post(
  "/signin",
  [checkLoginEmail, checkLoginPassword],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.send(signinTmplt({ errors }));
    }
    const user = await Urepos.getOneBy({ email: req.body.email });

    // if (user.password !== password) { //not anymore like this
    //   return res.send("Incorect password");
    // }
    // here everthing is fine
    req.session.userId = user.id;
    res.redirect("/admin/products");
  }
);

module.exports = Router;

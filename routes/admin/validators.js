const { check, checkSchema } = require("express-validator");
const Urepos = require("../../repos/users");

module.exports = {
  checkTitle: check("title")
    .trim()
    .isLength({ min: 3, max: 50 })
    .withMessage("title must be at lest 5 characters "),
  checkPrice: check("price")
    .trim()
    .toFloat()
    .isFloat()
    .withMessage("price must be a number"),
  checkEmail: check("email")
    .trim()
    .normalizeEmail()
    .isEmail()
    .withMessage("Email must be a valide one")
    .bail()
    .custom(async (email) => {
      const existingUser = await Urepos.getOneBy({ email });
      if (existingUser) {
        throw new Error("Email already in use");
      }
    })
    .bail(),
  checkPassword: check("password")
    .trim()
    .isLength({ min: 8, max: 20 })
    .withMessage("Password must be between 8 and 20 characters")
    .bail(),

  confirmPassword: check("passwordConfirmation")
    .trim()
    .isLength({ min: 8, max: 20 })
    .withMessage("Password must be between 8 and 20 characters")
    .custom((passwordConfirmation, { req }) => {
      if (passwordConfirmation !== req.body.password) {
        throw new Error("Password not matched");
      }
      return true;
    }),

  checkLoginEmail: check("email")
    .trim()
    .normalizeEmail()
    .isEmail()
    .withMessage("Email must be a valide one")
    .bail()
    .custom(async (email) => {
      const user = await Urepos.getOneBy({ email });
      if (!user) {
        throw new Error("Acount does not exist");
      }
    }),
  checkLoginPassword: check("password")
    .trim()
    .custom(async (password, { req }) => {
      const user = await Urepos.getOneBy({ email: req.body.email });
      if (!user) {
        throw new Error("Email not found in password checher");
      }
      const validePassword = await Urepos.comparePasswords(
        user.password,
        password
      );

      if (!validePassword) {
        throw new Error("Invalid password");
      }
    }),
};

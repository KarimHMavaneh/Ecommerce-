const { validationResult } = require("express-validator");

module.exports = {
  handleErrors(tmpltFunc, dataCallback) {
    return async (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        let product;
        if (dataCallback) {
          product = await dataCallback(req);
        }
        return res.send(tmpltFunc({ errors, ...product }));
      }
      next();
    };
  },
  requireAuth(req, res, next) {
    if (!req.session.userId) {
      return res.redirect("/signin");
    }
    next();
  },
};

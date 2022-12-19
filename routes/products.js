//  indecx or landing page for all products shoping cart
const express = require("express");
const router = express.Router();
const productsRepos = require("../repos/products");
const productsIdxTmplt = require("../views/products/index");

router.get("/", async (req, res) => {
  const products = await productsRepos.getAll();
  res.send(productsIdxTmplt({ products }));
});

module.exports = router;

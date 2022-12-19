const { renderFile } = require("ejs");
const express = require("express");
const router = express.Router();
const cartRepos = require("../repos/carts");
const productRepos = require("../repos/products");
const cartShowTmplt = require("../views/carts/cartShow");
//receive a post req to add a product to a cart
router.post("/cart/products", async (req, res) => {
  //here we need to watch for a post and chech
  //either we have a cart or not.
  let cart;
  if (!req.session.cartId) {
    // we need to create one
    cart = await cartRepos.create({ items: [] });

    //save cartId into the req.session
    req.session.cartId = cart.id;
  } else {
    cart = await cartRepos.getOneBy({ id: req.session.cartId });
  }

  //we chech the items if the product id is already there we increment it
  const existingItem = cart.items.find(
    (item) => item.id === req.body.productId
  );

  if (existingItem) {
    existingItem.quantity++;
  } else {
    // otherwise add the product to the items
    cart.items.push({ id: req.body.productId, quantity: 1 });
  }
  // console.log(cart);
  //save the record
  await cartRepos.update(cart.id, { items: cart.items });

  res.redirect("/cart");
});

// Receive a GET request to show all itemms in cart
router.get("/cart", async (req, res) => {
  if (!req.session.cartId) {
    return res.redirect("/");
  }
  try {
    const cart = await cartRepos.getOne(req.session.cartId);
    for (let item of cart.items) {
      //get the corsponding product
      const product = await productRepos.getOne(item.id);
      item.product = product;
    }

    res.send(cartShowTmplt({ items: cart.items }));
  } catch (err) {
    console.log(err);
  }
});
// Recieve a post req to delete an item
router.post("/cart/products/delete", async (req, res) => {
  const { itemId } = req.body;
  const cart = await cartRepos.getOne(req.session.cartId);
  const items = cart.items.filter((item) => item.id !== itemId);
  await cartRepos.update(req.session.cartId, { items });
  res.redirect("/cart");
});
module.exports = router;

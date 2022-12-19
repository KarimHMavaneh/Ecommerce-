// admin routes related
const express = require("express");
const multer = require("multer");

const { handleErrors, requireAuth } = require("./ midlewares");
const productsRepos = require("../../repos/products");
const newProdutsTmplt = require("../../views/admin/products/new");
const productsIdxTmplt = require("../../views/admin/products/index");
const prodEditTmplt = require("../../views/admin/products/edit");

const { checkTitle, checkPrice } = require("./validators");
const products = require("../../repos/products");

const router = express.Router();
//midleware for multipart/form-data
const upload = multer({ storage: multer.memoryStorage() });

router.get("/admin/products", requireAuth, async (req, res) => {
  const products = await productsRepos.getAll();
  res.send(productsIdxTmplt({ products }));
});

router.get("/admin/products/new", requireAuth, (req, res) => {
  res.send(newProdutsTmplt({}));
});
//the midleware's order matters
router.post(
  "/admin/products/new",
  upload.single("image"),
  [checkTitle, checkPrice],
  handleErrors(newProdutsTmplt),
  async (req, res) => {
    // const errors = validationResult(req);
    // if (!errors.isEmpty()) {
    //   return res.send(newProdutsTmplt({ errors }));
    // }

    // write to db
    const image = req.file.buffer.toString("base64");
    const { title, price } = req.body;
    await productsRepos.create({ title, price, image });

    res.redirect("/admin/products");
  }
);

router.get(
  "/admin/products/:id/edit",

  async (req, res) => {
    // console.log(req.params.id);
    // search by Id
    const product = await productsRepos.getOne(req.params.id);
    if (!product) {
      return res.send("product not found");
    }

    res.send(prodEditTmplt({ product }));
  }
);

router.post(
  "/admin/products/:id/edit",
  requireAuth,
  upload.single("image"),
  [checkTitle, checkPrice],
  handleErrors(prodEditTmplt, async (req) => {
    const product = await productsRepos.getOne(req.params.id);
    return { product };
  }),
  async (req, res) => {
    const changes = req.body;
    if (req.file) {
      //new image
      changes.image = req.file.buffer.toString("base64");
    }

    try {
      await productsRepos.update(req.params.id, changes);
    } catch (err) {
      return res.send("product not found");
    }
    res.redirect("/admin/products");
  }
);

router.post("/admin/products/:id/delete", requireAuth, async (req, res) => {
  await productsRepos.delete(req.params.id);
  res.redirect("/admin/products");
});
module.exports = router;

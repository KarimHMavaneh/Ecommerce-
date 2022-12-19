const express = require("express");
const bodyParser = require("body-parser");
const cookieSess = require("cookie-session");
const authRouter = require("./routes/admin/auth");
const adminProductsRouter = require("./routes/admin/products");
const productsRouter = require("./routes/products");
const cartRouter = require("./routes/carts");

const app = express();
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  cookieSess({
    keys: ["AnyRandomstring"],
  })
);

app.use(authRouter);
app.use(productsRouter);
app.use(adminProductsRouter);
app.use(cartRouter);
const port = 3000 || process.env.PORT;
app.listen(port, () => {
  console.log(`Server has started on port ${port}`);
});

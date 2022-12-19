const Repository = require("./repository");

class ProductsRepos extends Repository {}

module.exports = new ProductsRepos("products.json");

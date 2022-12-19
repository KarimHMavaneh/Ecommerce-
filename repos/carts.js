const Repository = require("./repository");

class CarteRepos extends Repository {}

module.exports = new CarteRepos("carts.json");

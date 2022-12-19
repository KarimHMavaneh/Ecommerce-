const fs = require("fs");
const crypto = require("crypto");
const util = require("util");
const Repository = require("./repository");

//convertin a callback based fuction to async/await based
const scrypt = util.promisify(crypto.scrypt);

class UsersRepos extends Repository {
  async create(record) {
    const records = await this.getAll();
    const salt = crypto.randomBytes(8).toString("hex");
    record.id = this.randomId();
    const password = await scrypt(record.password, salt, 64);
    const rec = { ...record, password: `${password.toString("hex")}.${salt}` };
    records.push(rec);
    await this.writeAll(records);

    return rec;
  }

  async comparePasswords(saved, provided) {
    const [hashed, salt] = saved.split(".");

    const hashprovided_Buf = await scrypt(provided, salt, 64);
    return hashed === hashprovided_Buf.toString("hex");
  }
}

module.exports = new UsersRepos("users.json");

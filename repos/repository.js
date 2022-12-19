const fs = require("fs");
const crypto = require("crypto");

module.exports = class Repository {
  constructor(filename) {
    if (!filename) {
      throw new Error("Name of the file must be provided");
    }
    this.filename = filename;
    try {
      fs.accessSync(this.filename);
    } catch {
      fs.writeFileSync(this.filename, "[]");
    }
  }

  async create(attrs) {
    attrs.id = this.randomId();
    const records = await this.getAll();
    records.push(attrs);
    await this.writeAll(records);
    return attrs;
  }
  //getAll takes time so async/ await it
  async getAll() {
    //Open this.filename, read the content and rturn it
    return JSON.parse(
      await fs.promises.readFile(this.filename, {
        encoding: "utf8",
      })
    );
  }

  async writeAll(records) {
    await fs.promises.writeFile(
      this.filename,
      JSON.stringify(records, null, 2),
      {
        encoding: "utf8",
      }
    );
  }
  async getOne(id) {
    const records = await this.getAll();
    return records.find((record) => record.id === id);
  }
  async delete(id) {
    const records = await this.getAll();
    const filtered = records.filter((record) => record.id !== id);
    await this.writeAll(filtered);
  }

  async update(id, attrs) {
    const records = await this.getAll();
    const record = records.find((record) => record.id === id);
    if (!record) {
      throw new Error(`Record with in ${id} not found`);
    }
    Object.assign(record, attrs); //copy into it
    await this.writeAll(records);
  }
  async getOneBy(filters) {
    const records = await this.getAll();
    for (let record of records) {
      // let exist = flase;
      for (let key in record) {
        if (record[key] === filters[key]) {
          return record;
        }
      }
    }
  }
  randomId() {
    return crypto.randomBytes(4).toString("hex");
  }
};

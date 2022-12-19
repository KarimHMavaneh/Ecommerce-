module.exports = {
  getError({ errors, property }) {
    try {
      // console.log(errors);
      return errors.mapped()[property].msg;
    } catch (err) {
      return "";
    }
  },
};

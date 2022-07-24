const bcrypt = require('bcrypt');
const saltRounds = 8;

module.exports = {
  encodePassword: (password) => {
    return bcrypt.hash(password, saltRounds);
  },

  matchPassword: (plaintext, hashed) => {
    return bcrypt.compare(plaintext, hashed);
  },
};

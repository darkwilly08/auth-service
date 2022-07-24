const { auth } = require('../configs/firebase');
const userRepository = require('../repositories/userRepository');

module.exports = {
  getUser: async (username) => {
    console.log(`getting user ${username}`);
    return await userRepository.findUser(username);
  },
  getUserById: async (userId) => {
    console.log(`getting user ${userId}`);
    return await userRepository.findUserById(userId);
  },
  createUser: async (username, hashedPassword) => {
    try {
      const user = await userRepository.findUser(username);
      if (user === null) {
        return userRepository.addUser(username, hashedPassword);
      }

      throw new Error(`username ${username} is not available`);
    } catch (err) {
      throw err;
    }
  },
  generateCustomToken: async (user) => {
    let claims = {};
    if (user.roles && user.roles.length > 0) {
      user.roles.forEach((role) => {
        claims[role] = true;
      });
    }
    return auth.createCustomToken(user.id, claims);
  },
  refreshClaims: async (userId, roles) => {
    let claims = {};
    if (roles && roles.length > 0) {
      roles.forEach((role) => {
        claims[role] = true;
      });
    }
    return auth.setCustomUserClaims(userId, claims);
  },
  disableUser: async (userId) => {
    await auth.revokeRefreshTokens(userId);
    await auth.updateUser(userId, {
      disabled: true,
    });
  },
  enableUser: async (userId) => {
    await auth.updateUser(userId, {
      disabled: false,
    });
  },
};

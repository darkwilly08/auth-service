const { db } = require('../configs/firebase');
const { v4: uuidv4 } = require('uuid');

module.exports = {
  findUser: async (username) => {
    let userSnapshot = await db.ref('users').orderByChild('username').equalTo(username).limitToFirst(1).once('value');
    if (!userSnapshot.exists()) {
      return null;
    }
    let user = null;
    userSnapshot.forEach((child) => {
      user = child.val();
    });
    return user;
  },
  findUsers: async () => {
    let usersSnapshot = await db.ref('users').once('value');
    if (!usersSnapshot.exists()) {
      return [];
    }

    let userList = [];
    usersSnapshot.forEach((childSnapshot) => {
      let user = childSnapshot.val();
      if (user.roles === undefined) {
        user.roles = [];
      }
      userList.push(user);
    });

    return userList;
  },
  findUserById: async (userId) => {
    let userSnapshot = await db.ref('users').child(userId).once('value');
    if (!userSnapshot.exists()) {
      return null;
    }
    let user = userSnapshot.val();
    if (user.roles === undefined) {
      user.roles = [];
    }
    return user;
  },
  addUser: async (username, hashedPassword) => {
    try {
      db.ref('users');
      const user = {
        id: uuidv4(),
        username: username,
        password: hashedPassword,
        roles: ['ANONYMOUS_ROLE'],
      };
      await db.ref('users').child(user.id).set({
        id: user.id,
        username: user.username,
        password: user.password,
        roles: user.roles,
        createdAt: Date.now(),
      });
      return user;
    } catch (err) {
      throw err;
    }
  },
  addProfile: async (userId, firstname, lastname, email) => {
    return db.ref('users').child(userId).update({
      firstname: firstname,
      lastname: lastname,
      email: email,
    });
  },
  setProfile: async (modifiedBy, userId, profile) => {
    return db.ref('users').child(userId).update({
      username: profile.username,
      firstname: profile.firstname,
      lastname: profile.lastname,
      email: profile.email,
      updatedAt: Date.now(),
      updatedBy: modifiedBy,
    });
  },
  updateRoles: async (modifiedBy, userId, roles) => {
    return db.ref('users').child(userId).update({
      roles: roles,
      updatedAt: Date.now(),
      updatedBy: modifiedBy,
    });
  },
  updatePasswordByUserId: async (modifiedBy, userId, hashedPassword) => {
    return db.ref('users').child(userId).update({
      password: hashedPassword,
      updatedAt: Date.now(),
      updatedBy: modifiedBy,
    });
  },
  setSoftDelete: async (modifiedBy, userId) => {
    return db.ref('users').child(userId).update({
      deleted: true,
      updatedAt: Date.now(),
      updatedBy: modifiedBy,
    });
  },
  undoSoftDelete: async (modifiedBy, userId) => {
    return db.ref('users').child(userId).update({
      deleted: null,
      updatedAt: Date.now(),
      updatedBy: modifiedBy,
    });
  },
};

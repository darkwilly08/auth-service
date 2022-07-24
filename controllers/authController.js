const express = require('express');

const router = express.Router();

const { isAuthenticated, isSameUser } = require('../middlewares/authMiddleware');
const authService = require('../services/authService');
const bcryptService = require('../services/bcryptService');

router.get('/me', isAuthenticated);

router.post('/register', async (req, res, next) => {
  const payload = req.body;
  const username = payload.username;
  const password = payload.password;

  const hashedPassword = await bcryptService.encodePassword(password);

  authService
    .createUser(username, hashedPassword)
    .then((user) => {
      authService
        .generateCustomToken(user)
        .then((customToken) => {
          res.status(200).send({ customToken });
        })
        .catch((error) => {
          return next(error.message);
        });
    })
    .catch((err) => {
      return next(err);
    });
});

router.post('/login', async (req, res, next) => {
  console.log('logging user', req.body);
  const payload = req.body;
  const username = payload.username;
  const password = payload.password;

  authService
    .getUser(username)
    .then(async (user) => {
      if (user === null) {
        return next(new Error('username or password are invalid'));
      }
      console.log(`user ${user.username} found it!`);
      const isValid = await bcryptService.matchPassword(password, user.password);
      if (!isValid) {
        return next(new Error('username or password are invalid'));
      }

      authService
        .generateCustomToken(user)
        .then((customToken) => {
          res.status(200).send({ customToken });
        })
        .catch((error) => {
          return next(error.message);
        });
    })
    .catch((err) => {
      return next(err);
    });
});

router.get('/me', async (_, res) => {
  console.log('executing me ');
  const userId = res.locals.userId;

  authService
    .getUserById(userId)
    .then((user) => {
      res.status(200).send(user);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send({ error: { message: err.message } });
    });
});

module.exports = router;

const { auth } = require('../configs/firebase');

const isAuthenticated = (req, res, next) => {
  const token = req.header('AUTH');
  if (!token) {
    return next(new Error('Missing authorization header'));
  }

  auth
    .verifyIdToken(token)
    .then((result) => {
      const resultAsArray = Object.entries(result).map(([k]) => k);
      const uid = result.uid;

      res.locals.userId = uid;
      res.locals.roles = resultAsArray.filter((o) => o.endsWith('ROLE'));

      return next();
    })
    .catch((err) => {
      return next(err);
    });
};

const isSameUser = () => {
  return (req, res, next) => {
    if (req.params.userId === res.locals.userId) {
      return next();
    }

    return next(new Error('You are not authorized'));
  };
};

module.exports = { isAuthenticated, isSameUser };

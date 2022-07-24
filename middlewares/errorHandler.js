const logError = (error, _, res, next) => {
  let message;
  if (error instanceof Error) {
    console.error(error.stack);
    message = error.message;
  } else {
    console.error(error);
    message = error;
  }
  next(message);
};

const errorHandler = (errorMsg, _, res, __) => {
  res.status(500).send({ status: 500, message: errorMsg });
};

module.exports = { logError, errorHandler };

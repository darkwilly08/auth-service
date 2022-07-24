require('dotenv').config({ path: `.env.${process.env.NODE_ENV}` });

console.log(process.env.NODE_ENV);

const authController = require('./controllers/authController');
const { logError, errorHandler } = require('./middlewares/errorHandler');

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT;

app.use(cors());
app.use(bodyParser.json());
app.use('/api/auth', authController);

// Error handle
app.use(logError);
app.use(errorHandler);

// Start app
app.listen(PORT, () => console.log('auth-service started on port ' + PORT));

const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

const app = express();

//settings
app.set('port', process.env.PORT || 3001);

//middlewares
app.use(morgan('dev'));
app.use(express.json());
app.use(cors());

//routes
app.use(require('./routes/crear'));

module.exports = app;
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
var bodyParser = require('body-parser');

const app = express();

//settings
app.set('port', process.env.PORT || 3010);

//middlewares
app.use(morgan('dev'));
app.use(cors());
app.use(express.json({ limit: '100mb' }))
app.use(express.urlencoded({limit: '100mb'}));


app.use( bodyParser.json({limit: '50mb'}) );
app.use(bodyParser.urlencoded({
  limit: '50mb',
  extended: true,
  parameterLimit:100000000
}));

app.use(require('./functions/mid'));

module.exports = app;


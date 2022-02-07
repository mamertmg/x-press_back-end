// deprecated const bodyParser = require('body-parser');
const cors = require('cors');
const errorhandler = require('errorhandler');
const express = require('express');

// Instance of Express
const app = express();

// Define PORT
const PORT = process.env.PORT || 4000;

app.use(express.json());
app.use(cors());

// Mount the API router
const apiRouter = require('./api/api');
app.use('/api', apiRouter);

app.use(errorhandler());

app.listen(PORT, () => {
  console.log('Listening on port: ' + PORT);
});

module.exports = app;
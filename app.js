'use strict';

const dotenv = require('dotenv');

dotenv.config({ silent: true });

const errorHandler = require('./lib/errors/errorHandler');
const ErrStrategies = require('./lib/errors/strategies');
const defaultRouter = require('./lib/routers/default');
const authenticatedRouter = require('./lib/routers/authenticated');
const express = require('express');
const validate = require('express-validation');
const logger = require('./lib/utils/logger').Logger;
const path = require('path');

const app = express();
const appErrorHandler = errorHandler([ErrStrategies.defaultStrategy]);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

//app.use('/', require('./lib/routes/index')(defaultRouter()));
app.use('/ready', require('./lib/routes/ready').ready((defaultRouter())));
app.use('/', require('./lib/routes/url')(defaultRouter()));

// error handling middleware
appErrorHandler(app);

const PORT = process.env.PORT;

app.listen(PORT, () => {
  logger.info(`Server listening on port: ${PORT}`);
});
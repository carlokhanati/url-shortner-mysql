'use strict';

const dotenv = require('dotenv');

dotenv.config({ silent: true });

const errorHandler = require('./lib/errors/errorHandler');
const ErrStrategies = require('./lib/errors/strategies');
const defaultRouter = require('./lib/routers/default');
const authenticatedRouter = require('./lib/routers/authenticated');
const express = require('express');
const session = require('express-session');
const validate = require('express-validation');
const logger = require('./lib/utils/logger').Logger;
const jwt = require('./lib/utils/jwt');
const path = require('path');

const app = express();
const appErrorHandler = errorHandler([ErrStrategies.defaultStrategy]);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.static(`${__dirname}/public`));
app.set('trust proxy', 1);
app.use(session({
  secret: 'shortnerSecret',
  resave: false,
  saveUninitialized: true,
}));
//app.use('/', require('./lib/routes/index')(defaultRouter()));
app.use('/ready', require('./lib/routes/ready').ready((defaultRouter())));
app.use('/url', require('./lib/routes/url')(authenticatedRouter()));
app.use('/users', require('./lib/routes/user')(authenticatedRouter()));
app.use('/', require('./lib/routes/urlredirect')(defaultRouter()));
// error handling middleware
appErrorHandler(app);

const PORT = process.env.PORT;

app.listen(PORT, () => {
  logger.info(`Server listening on port: ${PORT}`);
});
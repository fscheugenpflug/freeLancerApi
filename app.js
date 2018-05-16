'use strict'

require("dotenv").config();
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
const mongoose = require('mongoose');
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);

// -- routes

const index = require('./routes/index');
const auth = require('./routes/auth');
const customer = require('./routes/customer');
const deals = require('./routes/deals');

const app = express();

// -- DB
mongoose.Promise = Promise;
mongoose.connect(process.env.MONGODB_URI, {
  keepAlive: true,
  reconnectTries: Number.MAX_VALUE
});

// -- middlewares

app.use(
  cors({
    credentials: true,
    origin: [process.env.CLIENT_URL]
  })
);

app.use(
  session({
    store: new MongoStore({
      mongooseConnection: mongoose.connection,
      ttl: 24 * 60 * 60 // 1 day
    }),
    secret: "some-string",
    resave: true,
    saveUninitialized: true,
    cookie: {
      maxAge: 24 * 60 * 60 * 1000
    }
  })
);


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/', index);
app.use('/auth', auth);
app.use('/customer', customer);
app.use('/deals', deals);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  res.status(404).json({ cdoe: 'not-found' });
});

app.use((err, req, res, next) => {
  // always log the error
  console.error('ERROR', req.method, req.path, err);

  // only render if the error ocurred before sending the response
  if (!res.headersSent) {
    res.status(500).json({ code: 'unexpected' });
  }
});

module.exports = app;
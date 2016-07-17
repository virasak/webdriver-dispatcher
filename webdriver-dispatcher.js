#!/usr/bin/env node

var express = require('express');
var webdriverRouter = require('./routers/webdriver-router');
var requestLogger = require('./middlewares/request-logger');
var config = require('./config');

var app = express();
var port = config.dispatcher.port;



// log request method and url
app.use(requestLogger());

app.use(webdriverRouter);

app.listen(port, () => {
    console.log('started on port: ' + port);
});


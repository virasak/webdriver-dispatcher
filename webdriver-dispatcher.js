#!/usr/bin/env node

var express = require('express');
var webdriverRouter = require('./routers/webdriver-router');
var requestLogger = require('./middlewares/request-logger');
//var chromeRouter = require('./routers/chrome-router');
var config = require('./config');

var app = express();
var port = config.dispatcher.port;



// log request method and url
app.use(requestLogger());

// selenium webdriver proxy
app.use('/webdriver', webdriverRouter(config));

//app.use('/local-webdriver', chromeRouter(config.chromeDriver));

app.all('*', (req, res) => res.sendStatus(404));

app.listen(port, () => console.log('started on port: ' + port));


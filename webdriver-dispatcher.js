var express = require('express');
var webdriverRouter = require('./routers/webdriver-router');
var app = express();

// log request method and url
app.use((req, res, next) => {
    console.log(req.method + ' ' + req.url);
    next();
});

app.use('/session', webdriverRouter);

app.listen(5555, () => {
    console.log('started');
});


/*
 * WebDriver Dispatcher router
 * Register to express:
 *    app.use('/session', this_module);
 */
var process = require('process');
var Router = require('express').Router;
var request = require('request');
var util    = require('util');
var os      = require('os');

module.exports = (config) => {
    var router = Router();
    var localWebDriverUrl = 'http://localhost:' + config.chromeDriver.port;
    var remoteWebDriverUrl = 'http://%s:' + config.dispatcher.port;
    var hostname = os.hostname();

    router.param('sessionId', (req, res, next, sessionId) => {
        var parts = sessionId.split('-');
        req.webDriverUrl = parts[0] === hostname ? localWebDriverUrl + req.url.replace(sessionId, parts[1])
                                                 : util.format(remoteWebDriverUrl, parts[0]) +  req.originalUrl;

        console.log('webDriverUrl', req.webDriverUrl);

        next();
    });


    /*
     * Handle session creation
     */
    router.post('/session', (req, res) => {
        var target = request.post(localWebDriverUrl + '/session');
        var response = req.pipe(target);
        var data = '';
        response.on('data', d => data += d);
        response.on('end', () => {
            data = JSON.parse(data);
            data.sessionId = hostname + '-' + data.sessionId;
            res.send(data);
        });

        response.on('error', (err) => res.status(500).json(err));
    });

    // delete session
    router.route('/session/:sessionId')
        // get session status
        .get((req, res)  => request.get(req.webDriverUrl).pipe(res))
        // delete session
        .delete((req, res) => request.delete(req.webDriverUrl).pipe(res))

    router.route('/session/:sessionId/*')
        .get((req, res)  => request.get(req.webDriverUrl).pipe(res))
        .delete((req, res) => request.delete(req.webDriverUrl).pipe(res))
        .post((req, res) => req.pipe(request.post(req.webDriverUrl)).pipe(res));


    return router;

};


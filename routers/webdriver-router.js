/*
 * WebDriver Dispatcher router
 * Register to express:
 *    app.use('/session', this_module);
 */
var process = require('process');
var express = require('express');
var request = require('request');
var util    = require('util');
var os      = require('os');

var driverProcess = require('../lib/webdriver-process');
var config        = require('../config');



var router = module.exports = express.Router();
var localWebDriverUrl = 'http://localhost:' + config.chromeDriver.port;
var remoteWebDriverUrl = 'http://%s:' + config.dispatcher.port;
var hostname = os.hostname();

driverProcess.start();

router.post('/', (req, res) => {
    if (req.query.restart) {
        try {
            driverProcess.restart()
            res.json({ status: 'OK'});
        } catch (e) {
            res.status(500).json({ status: 'ERROR', message: e.message});
        }
    } else {
        res.status(404).end();
    }
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
router.route('/session/:target-:sessionId')
    // get session status
    .get((req, res)  => request.get(req.webDriverUrl).pipe(res))
    // delete session
    .delete((req, res) => request.delete(req.webDriverUrl).pipe(res))

router.route('/session/:target-:sessionId/*')
    .get((req, res)  => request.get(req.webDriverUrl).pipe(res))
    .delete((req, res) => request.delete(req.webDriverUrl).pipe(res))
    .post((req, res) => req.pipe(request.post(req.webDriverUrl)).pipe(res));


router.param('sessionId', (req, res, next, sessionId) => {
    var parts = sessionId.split('-');
    req.webDriverUrl = parts[0] === hostname ? localWebDriverUrl + req.url.replace(sessionId, parts[1])
                                             : util.format(remoteWebDriverUrl, hostname, req.url);

    next();
});


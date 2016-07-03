/*
 * WebDriver Dispatcher router
 * Register to express:
 *    app.use('/session', this_module);
 */
var process = require('process');
var express = require('express');
var request = require('request');

var router = module.exports = express.Router();
var localWebDriverUrl = 'http://localhost:4444/session';

/*
 * Handle session creation
 */
router.post('/', (req, res) => {
    var target = request.post(localWebDriverUrl);
    var response = req.pipe(target);
    var data = '';
    response.on('data', d => data += d);
    response.on('end', () => {
        data = JSON.parse(data);
        data.sessionId = process.env.hostname + '-' + data.sessionId;
        res.send(data);
    });

    response.on('error', (err) => res.end(JSON.stringify(err)));
});

// delete session
router.delete('/:sessionId', (req, res) => {
    var remoteUrl = composeUrl(req.params.sessionId, req.url);
    var target = request.delete(remoteUrl);
    req.pipe(target).pipe(res);
});

router.post('/:sessionId/*', (req, res) => {
    var remoteUrl = composeUrl(req.params.sessionId, req.url);
    var target = request.post(remoteUrl);
    req.pipe(target).pipe(res);
});

router.get('/:sessionId/*', (req, res) => {
    var remoteUrl = composeUrl(req.params.sessionId, req.url);
    request.get(remoteUrl).pipe(res);
});

// expect: url = /{hostname}-{localsessionid}/**
// return: http://{hostname}:4444/session/{localsessionid}/**
function _composeUrl(sessionId, url) {
    var parts = sessionId.split('-');
    var hostname = parts[0]
    var localSessionId = parts[1];

    url = url.replace(sessionId, localSessionId);

    return 'http://' + hostname + ':4444/session' + url;
}

function composeUrl(sessionId, url) {
    var parts = sessionId.split('-');
    var hostname = parts[0]
    var localSessionId = parts[1];

    url = url.replace(sessionId, localSessionId);

    console.log('hostname', hostname)
    if (hostname === process.env.hostname) {
        return localWebDriverUrl + url;
    } else {
        return 'http://' + hostname + ':5555/session' + url;
    }
}

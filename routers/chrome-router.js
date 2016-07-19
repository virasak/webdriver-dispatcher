var Router = require('express').Router;
var driverProcess = require('../lib/webdriver-process');

module.exports = (config) => {
    driverProcess.start(config);

    var router = Router();
    // local chrome remote webdriver

    router.route('/')
        .get((req, res) => res.send('.'))
        .post((req, res, next) => {
            if (req.query.restart) {
                try {
                    driverProcess.restart()
                    res.json({ status: 'OK'});
                } catch (e) {
                    res.status(500).json({ status: 'ERROR', message: e.message});
                }
            } else {
                next();
            }
        });

    return router;
};

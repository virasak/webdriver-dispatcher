var defaultConfig = require('./config.json');

var envConfig = module.exports = Object.assign({}, defaultConfig);

if (process.env.DISPATCHER_PORT) {
    envConfig.dispatcher.port = +process.env.DISPATCHER_PORT || defaultConfig.dispatcher.port;
}

if (process.env.CHROMEDRIVER_PORT) {
    envConfig.chromeDriver.port = +process.env.CHROMEDRIVER_PORT || defaultConfig.chromeDriver.port;
}

if (process.env.CHROMEDRIVER_PATH) {
    envConfig.chromeDriver.path = process.env.CHROMEDRIVER_PATH || defaultConfig.chromeDriver.path;
}
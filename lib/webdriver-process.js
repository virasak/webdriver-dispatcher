var spawn = require('child_process').spawn;

var ps;
var forever = (config) => {
    ps = spawn(config.path, ['--port=' + config.port]);
    ps.on('exit', (code, signal) => {
        ps = undefined;
        console.log('restart chromedriver')
        forever();
    });
    ps.stdout.on('data', (data) => console.log('OUT> ' + data));
    ps.stderr.on('data', (data) => console.error('ERR> ' + data));
};


module.exports = {
    start: (config) => ps || forever(config),
    restart: () => ps.kill(),
};


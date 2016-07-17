// Log HTTP request

module.exports = () => {
    return (req, res, next) => {
        console.log(req.method + ' ' + req.url);
        next();
    };
}

const fs = require('fs')
const path = require('path')
const jwt = require('jsonwebtoken')

module.exports = (req, res, next) => {
    var cert_pub = fs.readFileSync(path.dirname(__dirname) + '/rsa-pub.pem');
    const bearerHeader = req.headers.authorization
    const headerSplit = bearerHeader.split(" ")
    const token = headerSplit[1]

    // TODO: How to use local strategy on this
    jwt.verify(token, cert_pub, (err, decoded) => {
        if (err) {
            res.status(403).send(err)
        } else {
            console.log(decoded);
            next()
        }
    });
}
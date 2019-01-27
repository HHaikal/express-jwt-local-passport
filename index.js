const express = require('express')
const app = express()
const port = 5000;

const jwt = require('jsonwebtoken')
const passport = require('passport')
const passportJwt = require('passport-jwt')

var ExtractJwt = passportJwt.ExtractJwt;
var JwtStrategy = passportJwt.Strategy;

const _ = require('lodash')
const bodyParser = require('body-parser')

const cors = require('cors')

/* --- PART: initialize */
app.use(passport.initialize())
app.use(cors())

// parse application/x-www-form-urlencoded
// for easier testing with Postman or plain HTML forms
app.use(bodyParser.urlencoded({
    extended: true
}));

// parse application/json
app.use(bodyParser.json())
/* --- */

/* --- PART: Strategy */
const jwtOptions = {}
jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
jwtOptions.secretOrKey = '8shots'


const strategy = new JwtStrategy(jwtOptions, function (jwt_payload, next) {
    console.log('payload received', jwt_payload);
    // usually this would be a database call:
    var user = users[_.findIndex(users, { id: jwt_payload.id })];
    if (user) {
        next(null, user);
    } else {
        next(null, false);
    }
});

passport.use(strategy);

passport.use(strategy)
/* --- */

/* ---- PART: Fake Users */
const users = [
    {
        id: 1,
        name: 'Some Name 1',
        email: 'someemail1@gmail.com',
        password: 'magnificentSamarinda'
    },
    {
        id: 2,
        name: 'Some Name 2',
        email: 'someemail2@gmail.com',
        password: 'magnificentSamarinda'
    }
]
/* ---- */


/* --- PART: route */

app.get('/', (req, res) => {
    res.json({
        message: 'express is up'
    })
})

app.post('/login', (req, res, next) => {
    const email = req.body.email
    const password = req.body.password

    const user = users[_.findIndex(users, { email: email })]
    if (!user) {
        res.sendStatus(403)
    }

    if (user.password === password) {
        // from now on we'll identify the user by the id and the id is the only personalized value that goes into our token
        var payload = { id: user.id };
        var token = jwt.sign(payload, jwtOptions.secretOrKey);
        res.json({ message: "ok", token: token });
    } else {
        res.sendStatus(403)
    }
})

app.get("/secret", passport.authenticate('jwt', { session: false }), function (req, res) {
    res.json({ message: "Success! You can not see this without a token" });
});

app.get("/secretDebug",
    function (req, res, next) {
        console.log(req.get('Authorization'));
        next();
    }, function (req, res) {
        res.json("debugging");
    });

/* --- */

app.listen(port, () => console.log(`express running in port ${port}`))

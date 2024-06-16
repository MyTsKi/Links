const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const pool = require('..//database');
const helpers = require('../lib/helpers');

passport.use('local.signin', new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true
}, async (req, username, password, done) => {
    //console.log(req.body)
    //console.log(username)
    //console.log(password)
    const rows = await pool.query('SELECT * FROM users WHERE username = ?', [username]);
    if (rows.length > 0) {
        const user = rows[0];
        const validPassword = await helpers.matchPassword(password, user.password);
        if (validPassword) {
            return done(null, user, req.flash('message', 'Welcome' + user.username));
        } else {
            return done(null, false, req.flash('message', 'Contraseña Incorrecta'));
        }
    } else {
        return done(null, false, req.flash('message', 'El Usuario no Existe '));
    }
}));

passport.use('local.signup', new LocalStrategy({
    //lo que vamos a recibir

    usernameFiled: 'username',
    passwordField: 'password',
    //para poder pasar mas datos mas que el user name y la contraseña
    passReqToCallback: true
}, async (req, username, password, done) => {
    const { fullname } = req.body;
    const newUser = {
        username,
        password,
        fullname
    };
    newUser.password = await helpers.encryPassword(password);
    const result = await pool.query('INSERT INTO users SET ?', [newUser]);
    //console.log(req.body);
    //console.log(result);
    newUser.id = result.insertId;
    return done(null, newUser);
}));

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    const rows = await pool.query('SELECT * FROM users WHERE id = ?', [id]);
    done(null, rows[0]);
});
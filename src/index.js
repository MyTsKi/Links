const express = require('express');

const morgan = require('morgan');

const exphbs = require('express-handlebars');

const path = require('path');

const flash = require('connect-flash');

const session = require('express-session');

const MySQLStore = require('express-mysql-session')(session);

const passport = require('passport');

const { database } = require('./keys.js');

const {PORT} = require('./routes/config.js')


//inicializaciones 
const app = express();
require('./lib/passtport.js');

//configuraciones
app.set('port', PORT);
app.set('views', path.join(__dirname, 'views'));
app.engine('.hbs', exphbs.engine({//app.engine
    defaultLayout: 'main',
    layoutsDir: path.join(app.get('views'), 'layouts'),
    partialsDir: path.join(app.get('views'), 'partials'),
    extname: '.hbs',
    helpers: require('./lib/handlebars'),
}));
app.set('view engine', '.hbs');

//Middlewares
app.use(session({
    secret: 'conexiondemysqldeangel',
    resave: false,
    saveUninitialized: false,
    store: new MySQLStore(database)
    //ERRRO AQUI TENGO QUE INVESTIGAR 
    //VIDEO 2:01:45
}));
app.use(flash());
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
//inicializacion de passport
app.use(passport.initialize());
app.use(passport.session());

//Variables Globales
app.use((req, res, next) => {
    app.locals.completado = req.flash('completado');
    app.locals.message = req.flash('message');
    app.locals.user = req.user;
    next();
});

//Rutas
app.use(require('./routes/index.js'));
app.use(require('./routes/authentication.js'));
app.use('/links', require('./routes/links.js'));

//Archivos Pulicos
app.use(express.static(path.join(__dirname, 'public')));

//Starting the server
app.listen(PORT, () => {
    console.log('server on port', PORT);
});
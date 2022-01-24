//gracias a estas dos lineas de codigo y una más en la 25 puedo acceder a la base de datos, buscar porqué
const Handlebars = require('handlebars')
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access')
//modulos
const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const methodOverride = require('method-override');
const session = require('express-session');
const passport = require('passport');

//este modulo sirve para comunicar las vistas entre sí, buscar más info.
const flash = require('connect-flash');

//inicializaciones
const app = express();

//inicializamos la base de datos
require('./database');
require('./config/passport');
//Settings
//process.env.PORT || 3000 = si hay algun puerto libre usa ese si no usa el 3000
app.set('port', process.env.PORT || 3000);
//con este script le decimos a nuestro programa donde estan las vistas 
app.set('views', path.join(__dirname,'views'));
//trabajando con motor de plantillas, configurandola
app.engine('.hbs', exphbs.engine({
    defaultLayout: 'main',
    layoutsDir: path.join(app.get('views'), 'layouts'),
    partialsDir: path.join(app.get('views'), 'partials'),
    handlebars: allowInsecurePrototypeAccess(Handlebars),
    extname: '.hbs'
}));
app.set('view engine', '.hbs');


//middlewares / funciones que seran ejecutadas antes de llegar al servidor
//con esta linea podemos leer los datos que nos envia el usuario al logearse
app.use(express.urlencoded({extended: false}));
//este modulo se eencarga de validar las peticiones put que tengamos en el programa ver en edit-notes
app.use(methodOverride('_method'));
app.use(session({
    secret: 'mysecretapp',
    resave: true,
    saveUninitialized: true
}));
app.use(flash());

//aqui vamos a usar la logica de passport para autenticar a los usuarios, importante que vaya bajo seesion.
app.use(passport.initialize());
//este sesion se refiere a la sesion de arriba, las conectamos.
app.use(passport.session());
app.use(flash());
//global variables
app.use((req, res, next)=>{
    //almacenamos nuestros mensajes de confirmaciones y  errores  de esta manera, 
res.locals.success_msg = req.flash('success_msg');
res.locals.error_msg = req.flash('error_msg');
res.locals.error_msg = req.flash('error');


//este next sirve para no parar los procesos y que siga avanzando
next();
});

//routes
app.use(require('./routes/index'));
app.use(require('./routes/notes'));
app.use(require('./routes/users'));

//Static files
//le decimos a nuestro programa donde esta la carpeta public
app.use(express.static(path.join(__dirname, 'public')))

//server is litenning
app.listen(app.get('port'), ()=>{
    console.log('server on port', app.get('port'));
});
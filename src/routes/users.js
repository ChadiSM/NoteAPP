const { response } = require('express');
const express = require('express');
const User = require('../models/User');
const { rawListeners } = require('../models/User');
const router = express.Router();
const passport = require('passport');


router.get('/users/signin', (req, res)=>{
    res.render('users/signin');
});
//aqui usamos toda la logica que tenemos en config/passport para autenticar a nuestros
//usuarios, local es por defecto el nombre que le pone passport a la logica antes hecha
router.post('/users/signin', passport.authenticate('local', {
//enviamos mensajes en funcion de lo que ocurra y los redirigimos,

    successRedirect: '/notes',
    failureRedirect: '/users/signin',
//esta linea es para poder usar esos mensajes de flash que configuramos
    failureFlash: true

}));


router.get('/users/signup', (req, res)=>{
   

   
   
    res.render('users/signup');
});

//ruta para recibir los datos del formulario de registro de cuenta, signup 
router.post('/users/signup', async (req, res)=>{
    const {name, email, password, confirm_pass} = req.body;
    const errors = [];
    if(name.length <= 0){
        errors.push({text: 'Insert your name'});
    }
    if(password != confirm_pass){
        errors.push({text: 'Pass do not match'});
    }
    if(password.length < 4){
        errors.push({text: 'The pass is too short'});
    }
    if(errors.length > 0){
        res.render('users/signup', {
            errors, name, email, pass, confirm_pass
        });
    }else{//si no hay erorres en el formulario, creamos el usuario con las siguientes datas
        //primer paso comprobar si el email ya existe en nuestra base de datos, creamos email user 
        //y con el metodo findOne nos busca una similtud con los parametros que le pasamos
        //if (emailuser) = si existe (el email introducido) enviamos un mensaje de error
        const emailUser = await User.findOne({email: email});
        if(emailUser){
            req.flash('error_msg', 'Email already in use'),
            res.redirect('/users/signup');
        }

        const newUser = new User({name, email, password});
        //aqui ciframos la contraseña del usuario creado
        //creamos newUser con los datos dentro incluida password, en la siguiente linea le decimos 
        // dentro de newUser.(cogespassword)password y la encriptas con la funciones que creamos en models/users
        newUser.password = await newUser.encryptPassword(password);
        //y asi guardamos el usuario
        await newUser.save();
        //asi devolvemos los mensajes de satisfaccion y error
        req.flash('success_msg', 'You are registred, ggss');
        res.redirect('/users/signin');
    }

   
});

//vamo a crear usuarios unicos que puedan ver sus notas unicamente




module.exports = router;
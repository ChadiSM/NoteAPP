//passport sirve para autenticar nuestros usuarios de manera más sencilla
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/User');

passport.use(new LocalStrategy({

    usernameField: 'email',


}, async (email, password, done)=>{

    const user = await User.findOne({email: email});
    if(!user){
        //si nos devulve null quiere decir que no ha habido ningun error, buscar más info de esto.
        //si devuelve false quiere decir que no hay ningun usuario
        return done(null, false, {message: 'Not user found'});
    }else{
       const match =  await user.matchPassword(password);
        if(match){
            //done lo usamos para devolver mensaje o valores de vuelta,, en este caso devolvemos el usuario
            return done(null, user);
        }else{
            return done(null, false, {message: 'incorrect password'});
        }
    }

}));
//la logica que va aquí funciona de manera que el usuairo que ya se haya logeado en nuestra app
//no tenga que darnos todos los datos de nuevo y tengamos retenidos nosotros sus datos para poder
//verificar cuando queramos.
passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done)=>{
 //buscamos por id y dentro del () seran las respuestas que pueda recibir, un error o un usuario
    User.findById(id, (err, user)=>{
      //devolvemos un mensaje done con lo que encontremos, un error o un usuario
        done(err, user);
    })
})
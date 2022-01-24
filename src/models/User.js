//para encriptar contraseñas
const bcrypt = require('bcryptjs/dist/bcrypt');

const mongoose = require('mongoose');
const { Schema } = mongoose;
const crypt = require('bcryptjs');

const UserSchema = new Schema({

    name: {type: String, required:true},
    email: {type: String, required:true},
    password: {type: String, required:true},
    date: {type: Date, default:Date.now}

});

//metodos 
//este metodo sirve para escriptar las contraseñas de los usuarios, no me entero ni del clima
//so buscar más información al respecto
UserSchema.methods.encryptPassword = async (password) =>{

   const salt = await bcrypt.genSalt(10);
   const hash =  bcrypt.hash(password, salt);
    return hash;

};
//este metodo hace match entre la contraseña del usuario que acabamos de cifrar arriba 
//con su contraseña sin cifrar, así podriamos saber si es el usuario logeado o no
UserSchema.methods.matchPassword = async function (password){
    //comparamos password que es la que nos da el usuario a la hora de logearse y 
    //this password que es la contraseña que nos dio al registrarse, this.password hace referencia a array de arriba
    return  await bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('User', UserSchema);
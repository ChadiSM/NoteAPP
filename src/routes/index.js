//este script no ayudará a escribrir las routes de forma más sencilla
const express = require('express');
const router = express.Router();
//lo hemos configurado de manera que no sea necesario poner la extension .hbs pero de no configurarlo tendriamos que añadirlo
router.get('/', (req, res)=>{
    res.render('index');
    //res.render = res = responde con, render = renderiza index.hbs 
});

router.get('/about', (req, res)=>{
    res.render('about');
});
module.exports = router;
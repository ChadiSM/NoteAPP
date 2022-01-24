//este script no ayudará a escribrir las routes de forma más sencilla
const express = require('express');
const router = express.Router();

const Note = require('../models/Note');
//ruta para crear nuevas notas


router.get('/notes/newNotes',  (req, res)=>{
    res.render('notes/newNotes');
});



//poner notas
//con async le decimos que dentro de la ruta se usarán accesos asincronos que se identificaran con la palabra clave await
router.post('/notes/newNotes', async(req, res)=>{
//gracias al req.body obtenemos los datos que queramos de la base de datos
 const {title, description} = req.body;
 const errors = [];
 if(!title){
     errors.push({text: 'Please write a title'});
 }  //!variable = si no existe x manda mensaje de error escrito
 if(!description){
     errors.push({text: 'please write a description'});
 }
 //si existe algun error le redigirimos de nuevo al formulario con los errores que haya tenido
if(errors.length > 0){
    res.render('notes/newNotes', {
        errors,
        title,
        description
    });
}else{
    /* con esta sintaxis más la que se encuentra en el model creamos una nueva nota */
   const newNote =  new Note({title, description});
   await newNote.save();
   req.flash('success_msg', 'Note added successfully');
   res.redirect('/notes');
}
});

router.get('/notes', async (req, res)=>{
    //para que busque dentro de nuestra coleccion Note nuestras notas
    //gracias a lean() nos aparecen los datos en pantalla, esto fue un error, buscar el porqué
     const notes = await Note.find().lean().sort({date: 'desc'});
    //aqui nos devuelve la vista all notes además de la varibale notes que contiene todas nuestras notas de la base de datos
     res.render('notes/all-notes', {notes});
});

router.get('/notes/edit/:id', async (req, res)=>{
   //con esta linea de codigo lo que hacemos es coger el id del la url de arriba 
    //y buscar la nota que queramos editar por el id que recuperamos
 const note =   await  Note.findById(req.params.id);
    res.render('notes/edit-notes', {note} );
});

router.put('/notes/edit-notes/:id', async (req, res) => {
   const {title, description} = req.body;
   await Note.findByIdAndUpdate(req.params.id, {title, description});
   req.flash('success_msg', 'Note updated successfully');
   res.redirect('/notes');
});

router.delete('/notes/delete/:id', async (req, res)=>{
   //en la url al eliminar me aparece el id de la nota en cuestión
   //con este script lo eliminamos, req.params.id sirve para recuperar el id y eliminar
    await  Note.findByIdAndDelete(req.params.id);
    req.flash('success_msg', 'Note delete successfully');
    res.redirect('/notes');
});

module.exports = router;

const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/notes-db-app', {
    
})
.then(db => console.log('db connect'))
.catch(err=>console.error(err));
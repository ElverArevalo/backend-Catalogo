// Requires
var express = require('express');
var mongoose = require('mongoose'); // con esto tengo la refrencia de mongoose

// Inicalizar variables

var app = express(); //estoy definiendo mi servidor express

// Conexion a la base de datos 
mongoose.connection.openUri('mongodb://localhost:27017/catalogoBD', (err, res) => {
if (err) throw err; // si hay un error el throw no hace seguir mas alla
console.log('Base de datos: online');
})


// rutas
app.get('/', (req, res, next ) => {

    res.status(200).json({
         ok: true,
         mensaje: 'Peticion realizada correctamente'
    })

} );


// Escuchar el express - peticiones

app.listen(3000, () => {
    console.log('express server puerto 3000 online');
}); // escuchando en el puerto 
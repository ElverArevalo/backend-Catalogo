
// rutas principal 

var express =  require('express'); // esto es para que funcione hay que exportar el exopress
var app = express(); // levantar la app 


app.get('/', (req, res, next ) => {

    res.status(200).json({
         ok: true,
         mensaje: 'Peticion realizada correctamente'
    })

} );

module.exports = app;
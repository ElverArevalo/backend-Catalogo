// Requires
var express = require('express');
var mongoose = require('mongoose'); // con esto tengo la refrencia de mongoose
var  bodyParser  = require ('body-parser') ;
// Inicalizar variables

var app = express(); //estoy definiendo mi servidor express


// Body parser
//  analizar aplicación / x-www-form-urlencoded
app.use(bodyParser.urlencoded ( {  extended : false } )   )
 
//  analizar aplicación / json
app.use( bodyParser.json ( ))


// importar rutas
appRoutes = require('./routes/app');
usuarioRoutes = require('./routes/usuario');
loginRoutes = require('./routes/login');
lineaRoutes= require('./routes/linea');
categoriaRoutes = require('./routes/categoria');
productoRoutes= require('./routes/producto');


// Conexion a la base de datos 
mongoose.connection.openUri('mongodb://localhost:27017/catalogoBD', (err, res) => {
if (err) throw err; // si hay un error el throw no hace seguir mas alla
console.log('Base de datos: online mongodb://localhost:27017/catalogoBD');
})


// rutas
app.use('/producto', productoRoutes);
app.use('/categoria', categoriaRoutes);
app.use('/linea',lineaRoutes);
app.use('/login', loginRoutes);
app.use('/usuario', usuarioRoutes);
app.use('/', appRoutes);


// Escuchar el express - peticiones

app.listen(3000, () => {
    console.log('express server puerto 3000 online');
}); // escuchando en el puerto 
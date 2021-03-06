// Requires
var express = require('express');
var mongoose = require('mongoose'); // con esto tengo la refrencia de mongoose
var  bodyParser  = require ('body-parser') ;



var path = require('path');





// Inicalizar variables

var app = express(); //estoy definiendo mi servidor express

//CORS
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, token");
    res.header("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE, OPTIONS");
    next();
  });


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
uploadRoutes= require('./routes/upload');
imagenRoutes = require('./routes/imagenes');
uploadArchivoRoutes = require('./routes/uploadArchivo');
linePageRoutes = require('./routes/lineapage');
categoriaPageRoutes = require('./routes/categoriapage');
productoPageRoutes = require('./routes/productopage');
productosRoutes = require('./routes/productos');



// Conexion a la base de datos 
mongoose.connection.openUri('mongodb://ezequiel:Samuel1to11@ds143707.mlab.com:43707/heroku_fz3c0hh7', (err, res) => {
if (err) throw err; // si hay un error el throw no hace seguir mas alla

})


// rutas
app.use('/productos',productosRoutes);
app.use('/producto/page',productoPageRoutes);
app.use('/categoria/page',categoriaPageRoutes);
app.use('/linea/page',linePageRoutes);
app.use('/archivo', uploadArchivoRoutes);
app.use('/img', imagenRoutes);
app.use('/upload', uploadRoutes);
app.use('/producto', productoRoutes);
app.use('/categoria', categoriaRoutes);
app.use('/linea',lineaRoutes);
app.use('/login', loginRoutes);
app.use('/usuario', usuarioRoutes);
app.use('/', appRoutes);


//escuchar peticiones

app.use(express.static(__dirname+'/backend-serve'));
app.get('/',function(req,res){
    res.sendFile(path.join(__dirname+'/backend-serve/app.js'));
});

app.listen(process.env.PORT || 8080);
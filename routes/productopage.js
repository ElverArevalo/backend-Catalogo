
var express =  require('express'); // esto es para que funcione hay que exportar el exopress.

var app = express(); // levantar la app.



var Producto = require('../models/producto');
var Categoria = require('../models/categorias');
var Linea = require('../models/linea');


//========================================
// Obtener Productos pages
//========================================

app.get('/:id', (req, res, next ) => {
   
    var id= req.params.id
    var desde = req.query.desde || 0;
    desde = Number(desde);
    Linea.find({estado:true})
    Categoria.find({estado: true})
    Producto.find({estado: true , categoria: id})
    .skip(desde)
    .limit(12)
    .exec(
        
        (err, productoweb) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error  cargando productos web',
                errors: err
           });
        }
        Producto.count({}, (err, conteo)=>{
            
            res.status(200).json({
                ok: true,
                productoweb: productoweb,
                total: conteo

           });
        });

        

    });
});



//====================================================
//    BUSCADOR DE PRODUCTOS 
//===================================================

app.get('/web/:busqueda/:id', (req, res, next) => {
    var busqueda = req.params.busqueda
    var id= req.params.id;
    var desde = req.query.desde || 0;
    desde = Number(desde);
  
    var regex = new RegExp(busqueda, 'i');

    Producto.find({estado: true, nombre: regex, categoria:id }, (err, productoweb)=> {
        res.status(200).json({
            ok: true,
            productoweb: productoweb,
         
           
        });
    });
        
    });


module.exports = app;
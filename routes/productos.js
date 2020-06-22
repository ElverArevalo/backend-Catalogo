var express =  require('express'); // esto es para que funcione hay que exportar el exopress.

var app = express(); // levantar la app.



var Producto = require('../models/producto');
var Linea = require('../models/linea');
var Categoria = require('../models/categorias');

app.get('/', (req, res, next) => {

    
    var desde = req.query.desde || 0;
    desde = Number(desde);
  
    Producto.find({estado: true})
    .skip(desde)
    .limit(12)
    .exec((err,  productosWeb) => {
        if(err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar el producto',
                errors: err
            });
        }
    
        if(productosWeb ) {
            Producto.count({}, (err, conteo)=>{
                res.status(200).json({
                    ok: true,
                    productosWeb: productosWeb,
                    total: conteo
    
               });
            });
        }
    
      
    });
    
    });

    
//====================================================
//    BUSCADOR DE PRODUCTOS 
//===================================================

app.get('/:busqueda/', (req, res, next) => {
    var busqueda = req.params.busqueda
   
    var desde = req.query.desde || 0;
    desde = Number(desde);
  
    var regex = new RegExp(busqueda, 'i');

    Producto.find({estado: true, nombre: regex }, (err, productosWeb)=> {
        res.status(200).json({
            ok: true,
            productosWeb: productosWeb,
         
           
        });
    });
        
    });
    module.exports = app;
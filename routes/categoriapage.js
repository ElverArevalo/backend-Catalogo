
var express =  require('express'); // esto es para que funcione hay que exportar el exopress.

var app = express(); // levantar la app.



var Categoria = require('../models/categorias');
var Linea = require('../models/linea');
var Producto = require('../models/producto');

//========================================
// Obtener categorias pages
//========================================

app.get('/:id', (req, res, next ) => {
    var desde = req.query.desde || 0;
    desde = Number(desde);
    var id= req.params.id
    
    Categoria.find({estado: true , linea: id})
   
    .skip(desde)
    .limit(12)
    .exec(
        
        (err, categoriaweb) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error  cargando Categorias web',
                errors: err
           });
        }
        Categoria.count({}, (err, conteo)=>{
            
            res.status(200).json({
                ok: true,
                categoriaweb: categoriaweb,
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

    Categoria.find({estado: true, nombre: regex, linea:id }, (err, categoriaweb)=> {
        res.status(200).json({
            ok: true,
            categoriaweb: categoriaweb,
         
           
        });
    });
        
    });


module.exports = app;
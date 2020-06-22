
var express =  require('express'); // esto es para que funcione hay que exportar el exopress.

var app = express(); // levantar la app.



var Linea = require('../models/linea');


//========================================
// Obtener lineas pages
//========================================

app.get('/', (req, res, next ) => {
    var desde = req.query.desde || 0;
    desde = Number(desde);
    Linea.find({estado: true})
  
    .skip(desde)
    .limit(12)
    .exec(
        
        (err, lineaweb) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error  sdsdscargando Lineas',
                errors: err
           });
        }
        Linea.count({}, (err, conteo)=>{
            
            res.status(200).json({
                ok: true,
                lineaweb: lineaweb,
                total: conteo

           });
        });

        

    });
});



//====================================================
//    BUSCADOR DE PRODUCTOS 
//===================================================

app.get('/web/:busqueda/', (req, res, next) => {
    var busqueda = req.params.busqueda
   
    var desde = req.query.desde || 0;
    desde = Number(desde);
  
    var regex = new RegExp(busqueda, 'i');

    Linea.find({estado: true, nombre: regex }, (err, lineaweb)=> {
        res.status(200).json({
            ok: true,
            lineaweb: lineaweb,
         
           
        });
    });
        
    });


module.exports = app;
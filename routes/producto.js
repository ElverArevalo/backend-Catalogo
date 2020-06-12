var express =  require('express'); // esto es para que funcione hay que exportar el exopress.
var mdAutenticacion = require('../middlewares/autenticacion');
var app = express(); // levantar la app.

var Producto = require('../models/producto');
/// para subir la imagen
const path = require('path');
const fs = require('fs');


//====================================================
//    BUSCADOR DE PRODUCTOS POR  CATEGORIAS  ID GET
//===================================================

app.get('/todo/:busqueda/:id', (req, res, next) => {
    var busqueda = req.params.busqueda
    var id= req.params.id
    var desde = req.query.desde || 0;
    desde = Number(desde);
  
    var regex = new RegExp(busqueda, 'i');

    Producto.find({ nombre: regex, categoria:id }, (err, productos)=> {
        res.status(200).json({
            ok: true,
            productos: productos,
         
           
        });
    });
        
    });



//====================================================
//                BUSCAR  CATEGORIAS POR ID GET
//===================================================

app.get('/:id', (req, res, next) => {

    var id = req.params.id;
    var desde = req.query.desde || 0;
    desde = Number(desde);
 
    Producto.find({categoria: id})
    .skip(desde)
     .limit(12)
    .exec((err,  producto) => {
        if(err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar el producto',
                errors: err
            });
        }
    
        if(producto ) {
            Producto.count({}, (err, conteo)=>{
                res.status(200).json({
                    ok: true,
                    producto: producto,
                    total: conteo
    
               });
            });
        }
    
      
    });
    
    });


//========================================
// Actulizar producto put
//========================================
app.put('/:id', mdAutenticacion.verificaToken , (req, res) =>{

    var id = req.params.id;
    var body = req.body;

    Producto.findById(id, (err, producto) =>{ /// buscar en todos los productos el id que recibo como parametro.

        if(err){
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar producto',
                errors: err
           });
        }

        if(!producto){
            return res.status(400).json({
                ok: false,
                mensaje: 'Error, el prodcuto con el id ' + id + 'no existe',
                errors: {message: 'No existe el  producto con ese ID'}
           });

          
        }
       producto.nombre = body.nombre;
       producto.descripcion = body.descripcion;
       producto.credito = body.credito;
       producto.display = body.display;
       producto.unidad = body.unidad
       
     
    
       producto.save((err, productoActulizado) =>{
        if(err){
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al actulizar producto',
                errors: err
           });
        }
   
        res.status(200).json({
            ok: true,
            producto: productoActulizado
        });
       });
    });
});
//========================================
// Crear producto 
//========================================
app.post( '/:id', mdAutenticacion.verificaToken , (req, res) => {

    var body = req.body;
    var producto = new Producto({
        categoria: req.params.id,
        nombre: body.nombre,
        descripcion: body.descripcion,
       credito: body.credito,
        display: body.display,
        unidad: body.unidad,
        estado: true,
        refinv: body.refinv,
        img: body.img
        
    });
    
    producto.save((err, productoGuardado) => {
        if(err){
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al crear categoria',
                errors: err
           });
        }
        res.status(201).json({
            ok: true,
            producto: productoGuardado
        });
    });
    });

  
 //========================================
// Eliminar producto  por Id
//========================================
app.delete('/:id', mdAutenticacion.verificaToken , (req, res) =>{

    var id = req.params.id;
    Producto.findByIdAndRemove(id, (err, productoEliminado)=>{
        if(err){
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al eliminar producto',
                errors: err
           });
        }
        res.status(200).json({
            ok: true,
            producto: productoEliminado
        });

    });

});

//========================================
// Cambiar estado producto  por Id
//========================================
app.put('/estado/:id', mdAutenticacion.verificaToken , (req, res) =>{

    var id = req.params.id;
    var estado = req.body.estado;
   ///   findOneAndUpdate lo utlizamos para actulizar dato 

   Producto.findOneAndUpdate({_id : id}, { estado: estado }, (err, productoEstado)=>{
        if(err){
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al cambiar estado Producto',
                errors: err
        });
        }
        res.status(200).json({
            ok: true,
            producto: productoEstado
        });

    });

});
//========================================
// Subir imagen de producto
//=======================================






module.exports = app;
var express =  require('express'); // esto es para que funcione hay que exportar el exopress.

var app = express(); // levantar la app.

var Producto = require('../models/producto');



//====================================================
//                OBTENER  CATEGORIAS POR ID GET
//===================================================

app.get('/:id', (req, res, next) => {

    var id = req.params.id;
 
    Producto.find({categoria: id})
    .exec((err,  producto) => {
        if(err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar el producto',
                errors: err
            });
        }
    
        if(producto ) {
            res.status(200).json({
                ok: true,
                producto: producto,
              
                });
        }
    
      
    });
    
    });


//========================================
// Obtener productos
//========================================

app.get('/', (req, res, next ) => {

    Producto.find({}, (err, producto) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error cargando producto',
                errors: err
           });
        }
        res.status(200).json({
            ok: true,
            producto: producto
       });

    });
});
//========================================
// Actulizar producto put
//========================================
app.put('/:id', (req, res) =>{

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
       producto.estado = body.estado;
       producto.valorUnitario = body.valorUnitario;
       producto.valorCaja = body.valorCaja
       
     
    
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
app.post( '/:id', (req, res) => {

    var body = req.body;
    var producto = new Producto({
        categoria: req.params.id,
        nombre: body.nombre,
        descripcion: body.descripcion,
       credito: body.credito,
        display: body.display,
        unidad: body.unidad,
        estado: body.estado,
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
app.delete('/:id', (req, res) =>{

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
app.put('/estado/:id', (req, res) =>{

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


module.exports = app;
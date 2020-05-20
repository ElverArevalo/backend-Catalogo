var express =  require('express'); // esto es para que funcione hay que exportar el exopress.

var app = express(); // levantar la app.

var Producto = require('../models/producto');


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
app.post( '/', (req, res) => {

    var body = req.body;
    var producto = new Producto({
    
        nombre: body.nombre,
        descripcion: body.descripcion,
        valorUnitario: body.valorUnitario,
        valorCaja: body.valorCaja,
        estado: body.estado
        
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

module.exports = app;
var express =  require('express'); // esto es para que funcione hay que exportar el exopress.
var  bcrypt  =  require ( 'bcryptjs' ) ;  // encriptar la contraseña en una sola via
var app = express(); // levantar la app.



var Linea = require('../models/linea');



//========================================
// Obtener lineas
//========================================

app.get('/', (req, res, next ) => {

    Linea.find({}, (err, linea) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error cargando Lineas',
                errors: err
           });
        }
        res.status(200).json({
            ok: true,
            linea: linea
       });

    });
});
//========================================
// Actulizar linea put
//========================================
app.put('/:id', (req, res) =>{

    var id = req.params.id;
    var body = req.body;

    Linea.findById(id, (err, linea) =>{ /// buscar en todos las lineas el id que recibo como parametro.

        if(err){
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar linea',
                errors: err
           });
        }

        if(!linea){
            return res.status(400).json({
                ok: false,
                mensaje: 'Error, la linea con el id ' + id + 'no existe',
                errors: {message: 'No existe la linea con ese ID'}
           });

          
        }
       linea.nombre = body.nombre;
       linea.descripcion = body.descripcion;
       linea.estado = body.estado;
       linea.img = body.img
    
       linea.save((err, lineaActulizado) =>{
        if(err){
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al actulizar Linea',
                errors: err
           });
        }
   
        res.status(200).json({
            ok: true,
            linea: lineaActulizado
        });
       });
    });
});
//========================================
// Crear linea 
//========================================
app.post( '/', (req, res) => {

    var body = req.body;
    var linea = new Linea({
    
        nombre: body.nombre,
        descripcion: body.descripcion,
        img: body.img  ,
        estado: body.estado
        
    });
    
    linea.save((err, lineaGuardado) => {
        if(err){
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al crear Linea',
                errors: err
           });
        }
        res.status(201).json({
            ok: true,
            linea: lineaGuardado
        });
    });
    });
//========================================
// Cambiar estado Linea  por Id
//========================================
app.put('/estado/:id', (req, res) =>{

    var id = req.params.id;
    var estado = req.body.estado;
   ///   findOneAndUpdate lo utlizamos para actulizar dato 

   Linea.findOneAndUpdate({_id : id}, { estado: estado }, (err, lineaEstado)=>{
        if(err){
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al cambiar estado linea',
                errors: err
        });
        }
        res.status(200).json({
            ok: true,
            linea: lineaEstado
        });

    });

});

module.exports = app;
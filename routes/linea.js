var express =  require('express'); // esto es para que funcione hay que exportar el exopress.

var app = express(); // levantar la app.



var Linea = require('../models/linea');


var mdAutenticacion = require('../middlewares/autenticacion');


//====================================================
//    BUSCADOR DE PRODUCTOS 
//===================================================

app.get('/todo/:busqueda/', (req, res, next) => {
    var busqueda = req.params.busqueda
   
    var desde = req.query.desde || 0;
    desde = Number(desde);
  
    var regex = new RegExp(busqueda, 'i');

    Linea.find({ nombre: regex }, (err, lineas)=> {
        res.status(200).json({
            ok: true,
            lineas: lineas,
         
           
        });
    });
        
    });


//======================================
// Obtener linea por Id
//======================================
app.get(('/:id'), (req, res) =>{
    var id = req.params.id;
    Linea.findById(id)
   
    .exec((err, linea) => {
        if(err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar el linea',
                errors: err
            });
        }
    
        if(!linea) {
            return res.status(400).json({
                ok: false,
                mensaje: 'La linea con el Id ' + id + 'no existe',
                errors: 'No existe la linea con el Id'
            });
        }
    
        res.status(200).json({
            ok: true,
            linea: linea,
          
            });
    });
    
    });

    

//========================================
// Obtener lineas admin
//========================================

app.get('/', (req, res, next ) => {
    var desde = req.query.desde || 0;
    desde = Number(desde);
    Linea.find({})
    .skip(desde)
    .limit(12)
    .exec(
        
        (err, linea) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error cargando Lineas',
                errors: err
           });
        }
        Linea.count({}, (err, conteo)=>{
            
            res.status(200).json({
                ok: true,
                linea: linea,
                total: conteo

           });
        });

        

    });
});


//========================================
// Actulizar linea put
//========================================
app.put('/:id', mdAutenticacion.verificaToken , (req, res) =>{

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
app.post( '/', mdAutenticacion.verificaToken , (req, res) => {

    var body = req.body;
    var linea = new Linea({
    
        nombre: body.nombre,
        descripcion: body.descripcion,
        img: body.img  ,
        estado: true,
        
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
app.put('/estado/:id', mdAutenticacion.verificaToken , (req, res) =>{

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
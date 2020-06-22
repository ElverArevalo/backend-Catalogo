var express =  require('express'); // esto es para que funcione hay que exportar el exopress.

var app = express(); // levantar la app.

var mdAutenticacion = require('../middlewares/autenticacion');

var Categoria = require('../models/categorias');




//====================================================
//    BUSCADOR DE PRODUCTOS POR  CATEGORIAS  ID GET
//===================================================

app.get('/todo/:busqueda/:id', (req, res, next) => {
    var busqueda = req.params.busqueda
    var id= req.params.id
    var desde = req.query.desde || 0;
    desde = Number(desde);
  
    var regex = new RegExp(busqueda, 'i');

    Categoria.find({ nombre: regex, linea:id }, (err, categorias)=> {
        res.status(200).json({
            ok: true,
            categorias: categorias,
         
           
        });
    });
        
    });


//====================================================
//                OBTENER  CATEGORIAS POR ID DE LINEA  GET
//===================================================

app.get('/:id', (req, res, next) => {

    var id = req.params.id;

    var desde = req.query.desde || 0;
    desde = Number(desde);
 
     Categoria.find({linea: id})
     .skip(desde)
     .limit(12)
     .exec((err,  categoria) => {
        if(err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar la Categoria',
                errors: err
            });
        }
    
        if(categoria ) {
            
            Categoria.count({}, (err, conteo)=>{
                res.status(200).json({
                    ok: true,
                    categoria: categoria,
                    total: conteo
    
               });
            });
        }
    
      
    });
    
    });

    //======================================
// Obtener categoria por Id
//======================================
app.get(('/nombre/:id'), (req, res) =>{
    var id = req.params.id;
    Categoria.findById(id)
   
    .exec((err, categoria) => {
        if(err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar la categroria',
                errors: err
            });
        }
    
        if(!categoria) {
            return res.status(400).json({
                ok: false,
                mensaje: 'La categoria con el Id ' + id + 'no existe',
                errors: 'No existe la categoria con el Id'
            });
        }
    
        res.status(200).json({
            ok: true,
            categoria: categoria,
          
            });
    });
    
    });



//========================================
// Actulizar categoria put
//========================================
app.put('/:id',mdAutenticacion.verificaToken , (req, res) =>{

    var id = req.params.id;

    var body = req.body;

    Categoria.findById(id, (err, categoria) =>{ /// buscar en todos las categorias el id que recibo como parametro.

        if(err){
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar categoria',
                errors: err
           });
        }

        if(!categoria){
            return res.status(400).json({
                ok: false,
                mensaje: 'Error, la categoria con el id ' + id + 'no existe',
                errors: {message: 'No existe la categoria con ese ID'}
           });

          
        }
       categoria.nombre = body.nombre;
       categoria.descripcion = body.descripcion;
       
       
     
    
       categoria.save((err, categoriaActulizado) =>{
        if(err){
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al actulizar Linea',
                errors: err
           });
        }
   
        res.status(200).json({
            ok: true,
            categoria: categoriaActulizado
        });
       });
    });
});
//========================================
// Crear categoria 
//========================================
app.post( '/:id', mdAutenticacion.verificaToken , (req, res) => {

    var body = req.body;
    var categoria = new Categoria({
        
    
        nombre: body.nombre,
        linea: req.params.id,
        descripcion: body.descripcion,
        estado:true
        
    });
    
    categoria.save((err, categoriaGuardado) => {
        if(err){
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al crear categoria',
                errors: err,
               
           });
        }
        res.status(201).json({
            ok: true,
            categoria: categoriaGuardado,
            
        });
    });
    });

    
 //========================================
// Cambiar estado categoria  por Id
//========================================
app.put('/estado/:id', mdAutenticacion.verificaToken , (req, res) =>{

    var id = req.params.id;
    var estado = req.body.estado;
   ///   findOneAndUpdate lo utlizamos para actulizar dato 

   Categoria.findOneAndUpdate({_id : id}, { estado: estado }, (err, catgoriaEliminado)=>{
        if(err){
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al eliminar categoria',
                errors: err
        });
        }
        res.status(200).json({
            ok: true,
            categoria: catgoriaEliminado
        });

    });

});

module.exports = app;
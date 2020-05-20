var express =  require('express'); // esto es para que funcione hay que exportar el exopress.

var app = express(); // levantar la app.



var Categoria = require('../models/categorias');


//========================================
// Obtener categorias
//========================================

app.get('/', (req, res, next ) => {

    Categoria.find({}, (err, categoria) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error cargando Categorias',
                errors: err
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
app.put('/:id', (req, res) =>{

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
       categoria.estado = body.estado;
       
     
    
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
app.post( '/', (req, res) => {

    var body = req.body;
    var categoria = new Categoria({
        
    
        nombre: body.nombre,
       // linea: req.linea._id,
        descripcion: body.descripcion,
       
        estado: body.estado
        
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
// Eliminar linea  por Id
//========================================
app.delete('/:id', (req, res) =>{

    var id = req.params.id;
    Categoria.findByIdAndRemove(id, (err, catgoriaEliminado)=>{
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
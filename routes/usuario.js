var express =  require('express'); // esto es para que funcione hay que exportar el exopress.
var  bcrypt  =  require ( 'bcryptjs' ) ;  // encriptar la contraseña en una sola via
var app = express(); // levantar la app.



var Usuario = require('../models/usuario');

//========================================
// Obtener usuario ya creado como admin
//========================================

app.get('/', (req, res, next ) => {

    Usuario.find({}, (err, usuario) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error cargando Usuario',
                errors: err
           });
        }
        res.status(200).json({
            ok: true,
            usuario: usuario
       });

    });
//========================================
// Atualizar Usuario 
//========================================
app.put('/:id', (req, res) =>{

    var id = req.params.id;
    var body = req.body;

    Usuario.findById(id, (err, usuario) =>{ /// buscar en todos los usuarios el id que recibo como parametro.

        if(err){
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar Usuario',
                errors: err
           });
        }

        if(!usuario){
            return res.status(400).json({
                ok: false,
                mensaje: 'Error, el usuario con el id ' + id + 'no existe',
                errors: {message: 'No existe el usuario con ese ID'}
           });

          
        }
       usuario.nombre = body.nombre;
       usuario.email = body.email;
    
       usuario.save((err, usuarioActulizado) =>{
        if(err){
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al actulizar Usuario',
                errors: err
           });
        }
        usuarioActulizado.password = ':)' //para cuando actulice no regrese la contrseña
        res.status(200).json({
            ok: true,
            usuario: usuarioActulizado
        });
       });
    });
});


//========================================
// Crear Usuario 
//========================================
app.post( '/', (req, res) => {

var body = req.body;
var usuario = new Usuario({

    nombre: body.nombre,
    email: body.email,
    password: bcrypt.hashSync(body.password,10)  ,
    role: body.role
});

usuario.save((err, usuarioGuardado) => {
    if(err){
        return res.status(500).json({
            ok: false,
            mensaje: 'Error al crear Usuario',
            errors: err
       });
    }
    res.status(201).json({
        ok: true,
        usuario: usuarioGuardado
    });
});
});
 });
 //========================================
// eliminar  Usuario  por id
//========================================
app.delete('/:id', (req, res) =>{

    var id = req.params.id;
    Usuario.findByIdAndRemove(id, (err, usuarioEliminado)=>{
        if(err){
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al eliminar Usuario',
                errors: err
           });
        }
        res.status(200).json({
            ok: true,
            usuario: usuarioEliminado
        });

    });

});

module.exports = app;
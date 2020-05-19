var express =  require('express'); // esto es para que funcione hay que exportar el exopress.
var  bcrypt  =  require ( 'bcryptjs' ) ;  // encriptar la contraseña en una sola via
var app = express(); // levantar la app.



var Usuario = require('../models/usuario');

app.post( '/', (req, res) =>{

    var body = req.body; // tomo los valores del usuario
 Usuario.findOne({ email: body.email}, (err, usuarioDB) =>{

    if(err){
        return res.status(500).json({
            ok: false,
            mensaje: 'Error al buscar Usuario',
            errors: err
       });
    }
    if(!usuarioDB){
        return res.status(400).json({
            ok: false,
            mensaje: 'credenciales incorrectas',
            errors: err
       });
    }
    if (!bcrypt.compareSync(body.password, usuarioDB.password)){
        return res.status(400).json({
            ok: false,
            mensaje: 'credenciales incorrectas - password',
            errors: err
       });
    }
    res.status(200).json({
        ok: true,
       usuario: usuarioDB,
       id: usuarioDB._id
       
    });

 });

 

});


module.exports = app;
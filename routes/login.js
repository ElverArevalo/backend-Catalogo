var express = require('express'); // esto es para que funcione hay que exportar el exopress.
var bcrypt = require('bcryptjs');  // encriptar la contraseña en una sola via
var jwt = require('jsonwebtoken')
var app = express(); // levantar la app.

var SEED = require('../config/config').SEED;

var Usuario = require('../models/usuario');

app.post('/', (req, res) => {

    var body = req.body; // tomo los valores del usuario
    Usuario.findOne({ email: body.email }, (err, usuarioDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar Usuario',
                errors: err
            });
        }
        if (!usuarioDB) {
            return res.status(400).json({
                ok: false,
                mensaje: 'credenciales incorrectas',
                errors: err
            });
        }
        if (!bcrypt.compareSync(body.password, usuarioDB.password)) {
            return res.status(400).json({
                ok: false,
                mensaje: 'credenciales incorrectas - password',
                errors: err
            });
        }
      
        usuarioDB.password = ':)';
          ///crear token
        var token = jwt.sign({ usuario: usuarioDB },SEED, { expiresIn: 14400 })/// esto equivale a 4 horas

        res.status(200).json({
            ok: true,
            usuario: usuarioDB,
            id: usuarioDB._id,
            token: token
        });

    });



});


module.exports = app;
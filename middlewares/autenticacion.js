var jwt = require('jsonwebtoken');

var SEED = require('../config/config').SEED;


//====================================================
//               ENVIAR TOKEN
//===================================================

    exports.verificaToken = function(req, res, next ) {
        var token = req.headers.token;

        jwt.verify(token, SEED, (err, decode) => {
            if (err) {
                return res.status(401).json({
                    ok: false,
                    mensaje: 'Token incorrecto',
                    errors: err
                });
            }
            req.usuario = decode.usuario;
            next();
        });
    
    }


//====================================================
//               VERIFICAR ADMIN_ROLE
//===================================================

exports.verificaADMIN_ROLE = function(req, res, next ) {
    

    var usuario = req.usuario;

    if (usuario.role === 'ROL_ADMIN') {
        next();
        return;
    }else {
        if (err) {
            return res.status(401).json({
                ok: false,
                mensaje: 'Token incorrecto',
                errors: {message: 'no es administrador'}
            });
        }
    }
}
    
//====================================================
//               VERIFICAR ADMIN O MISMO USUARIO
//===================================================

exports.verificaADMIN_O_MISMO_USUARIO = function(req, res, next ) {
    

    var usuario = req.usuario;
    var id = req.params.id

    if (usuario.role === 'ROL_ADMIN' || usuario._id === id) {
        next();
        return;
    }else {
        if (err) {
            return res.status(401).json({
                ok: false,
                mensaje: 'Token incorrecto',
                errors: {message: 'no es administrador'}
            });
        }
    }
}
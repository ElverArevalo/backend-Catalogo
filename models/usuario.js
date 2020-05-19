
// creacion de esquema 

var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

var Schema = mongoose.Schema;

var rolesValidos = {
    values: ['ROL_ADMIN'],
    message: '{VALUE} no es un rol permitido'
};

var usuarioSchema = new Schema({

    nombre: {type: String, required:false},
    email: {type: String, unique:true, required:[true, 'El correo es necesario'] },
    password: {type: String, required:[true, 'El password es necesario'] },
    role: {type: String, required: true, default:'ROL_ADMIN', enum: rolesValidos }


}); 

usuarioSchema.plugin(uniqueValidator, {message: '{PATH} debe ser unico'})

module.exports = mongoose.model('Usuario', usuarioSchema); // para exportarlo para poder manejarlo en otro lado.
var mongoose =	require('mongoose');
var Schema =	mongoose.Schema;
var lineaSchema =	new Schema({
                nombre: {	type: String,	required: [true,	'El	nombre	es	necesario']	},
                descripcion: {	type: String,	required: [true,	'La descripcion es necesaria']	},
                img: {	type: String,	required: false },
                estado: {	type: Boolean,	required: false },
			},	{	collection: 'lineas' });
module.exports =	mongoose.model('Linea',	lineaSchema);
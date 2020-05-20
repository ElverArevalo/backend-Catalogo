var mongoose =	require('mongoose');
var Schema =	mongoose.Schema;
var productoSchema =	new Schema({
                nombre: {	type: String,	required: [true,	'El	nombre	es	necesario']	},
                descripcion: {	type: String,	required: [true,	'La descripcion es necesaria']	},
                valorUnitario: {type: Number, required:false},
                valorCaja: {type: Number, required:false},
                estado: {	type: Boolean,	required: false },
                img: {type: String, required:false},
                linea: {	type: Schema.Types.ObjectId,	ref: 'Linea',	required: true },
                categoria: {	type: Schema.Types.ObjectId,	ref: 'Categoria',	required: true },
                
			},	{	collection: 'producto' });
module.exports =	mongoose.model('Producto',	productoSchema);
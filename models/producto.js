var mongoose =	require('mongoose');
var Schema =	mongoose.Schema;
var productoSchema =	new Schema({
                nombre: {	type: String,	required: [true,	'El	nombre	es	necesario']	},
                descripcion: {	type: String,	required: [true,	'La descripcion es necesaria']	},
                credito: {type: Number, required:false},
                display: {type: Number, required:false},
                unidad: {type: Number, required:false},
                refinv: {type: String, required:[true, 'la referencia inventario es necesaria']},
                estado: {	type: Boolean,	required: false },
                img: {type: String, required:false},
              
                categoria: {	type: Schema.Types.ObjectId,	ref: 'Categoria' },
                
			},	{	collection: 'producto' });
module.exports =	mongoose.model('Producto',	productoSchema);
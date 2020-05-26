var mongoose =	require('mongoose');
var Schema =	mongoose.Schema;
var categoriaSchema =	new Schema({
                nombre: {	type: String,	required: [true,	'El	nombre	es	necesario']	},
                descripcion: {	type: String,	required: [true,	'La descripcion es necesaria']	},
               
                estado: {	type: Boolean,	required: false },
                linea: {	type: Schema.Types.ObjectId,	ref: 'Linea' },
              
			
                
			},	{	collection: 'categorias' });
module.exports =	mongoose.model('Categoria',	categoriaSchema);



var express = require('express');

var fileUpload = require('express-fileupload');

var fs = require('fs');

var app = express();

//var Usuario = require('../models/usuario');
var Linea = require('../models/linea');
var Producto = require('../models/producto');

var cloudinary = require('cloudinary').v2
cloudinary.config( {
    cloud_name: 'earevalo',
    api_key: '841621733329825',
    api_secret: 'AP6sIG3fjavFEvSMDqAakYHwSv8'
})

// default options
app.use(fileUpload());




app.put('/:tipo/:id', (req, res, next) => {

    var tipo = req.params.tipo;
    var id = req.params.id;

    // TIPOS DE COLECCION 

    var tiposValidos = ['lineas', 'productos'] ;
    if( tiposValidos.indexOf(tipo) < 0){
        return res.status(400).json({
            ok: false,
            mensaje: 'Tipo de coleccion no es valida ',
            errors: { message: 'Tipo de coleccion no es valida' }
        });
    }

    if (!req.files) {
        return res.status(400).json({
            ok: false,
            mensaje: 'No selecciono nada ',
            errors: { message: 'Debe sellecionar una Imagen' }
        });
    }


    /// OBTENER EL NOBRE DEL ARCHIVO 

    var archivo = req.files.img;

    var nombreCortado = archivo.name.split('.');
    var extensionArchivo = nombreCortado[nombreCortado.length - 1];


    /// SOLO ESTAS EXTENSIONES ACEPTAMOS

    var extesencionesValidas = ['png', 'jpg', 'gif', 'jpeg'];


    if (extesencionesValidas.indexOf(extensionArchivo) < 0) {
        return res.status(400).json({
            ok: false,
            mensaje: 'Extension no valida',
            errors: { message: 'Debe seleccionar una extension valida, las extensiones validas son:' + extesencionesValidas.join(', ') }
        });
    }


    /// NOMBRE DE ARCHIVO PERSONALIZADO
    /// 1214554-123.png

    var nombreArchivo = `${ id }-${new Date().getMilliseconds()}.${extensionArchivo}`;


    /// MOVER EL ARCHIVO DEL TEMPORAL A UN PATH 

    var path = `./uploads/${ tipo }/${ nombreArchivo}`;
    archivo.mv( path, err =>{
       if(err){
        return res.status(500).json({
            ok: false,
            errors: err,
    
        });
       }

       subirPorTipo(tipo, id, nombreArchivo, res);
    
    });
});

function subirPorTipo(tipo, id, nombreArchivo, res){
   

    if(tipo === 'lineas'){

        Linea.findById(id, async (err, linea) => {

            await cloudinary.v2.uploads.lineas(req.files.path)
                
           // var  pathViejo = './uploads/lineas/'+ linea.img;
            
           

            /// si existe, elimina la imagen anterior
            if(fs.existsSync(pathViejo)){
                fs.unlinkSync(pathViejo);
            }
            linea.img = nombreArchivo;

            linea.save((err, lineaActualizado)=>{
                return res.status(200).json({
                    ok: true,
                    mensaje: 'Imagen de linea actualizada',
                    linea: lineaActualizado

                });

            });

        });
    }
    if (tipo === 'productos'){
        Producto.findById(id, (err, producto) => {

            var pathViejo = './uploads/productos/'+ producto.img;

            // si existe, elimina la imagen anterior
            if (fs.existsSync(pathViejo)){
                fs.unlinkSync(pathViejo);

            }
            producto.img = nombreArchivo;
            
            producto.save((err, productoActualizado) => {
                return res.status(200).json({
                    ok: true,
                    mensaje: 'Imagen de medico actualizada',
                    producto: productoActualizado
                });
            });

        });

    }
   
}



module.exports = app;
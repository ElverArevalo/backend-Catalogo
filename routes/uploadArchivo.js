var express = require('express');
var fileUpload = require('express-fileupload');
var fs = require('fs');
var app = express();

// default options
app.use(fileUpload());

var Linea = require('../models/linea');
var Categoria = require('../models/categorias');


app.post('/:tipo', async (req, res, next) => {

    var tipo = req.params.tipo;
  
  


    // TIPOS DE COLECCION 

    var tiposValidos = ['archivos'] ;
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
            errors: { message: 'Debe sellecionar un archivo' }
        });
    }


    /// OBTENER EL NOBRE DEL ARCHIVO 

    var archivo = req.files.arch;

    var nombreCortado = archivo.name.split('.');
    var extensionArchivo = nombreCortado[nombreCortado.length - 1];


    /// SOLO ESTAS EXTENSIONES ACEPTAMOS

    var extesencionesValidas = ['csv'];


    if (extesencionesValidas.indexOf(extensionArchivo) < 0) {
        return res.status(400).json({
            ok: false,
            mensaje: 'Extension no valida',
            errors: { message: 'Debe seleccionar una extension valida, las extensiones validas son:' + extesencionesValidas.join(', ') }
        });
    }


    /// NOMBRE DE ARCHIVO PERSONALIZADO
    /// 1214554-123.png

    var nombreArchivo = `${ tipo }-${new Date().getMilliseconds()}.${extensionArchivo}`;


    /// MOVER EL ARCHIVO DEL TEMPORAL A UN PATH 

    let promesas = [];

    var path = `./uploadArchivos/archivos/${ nombreArchivo}`;
    archivo.mv(path, err =>{

        if(err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al cargar el archivo',
                errors: err
           });
        }

      let documento = fs.readFileSync(path, 'utf-8');
        
      // split the contents by new line
      const registros = documento.split(/\r?\n/);
  
      const registrosArreglo = [];
      // print all lines
      registros.forEach((linea) => {
          const registro = linea.split(";");
  
          if(registro[1] != undefined) {
              registrosArreglo.push(registro);
          }
      });
  
      const distintoLinea = Array.from(new Set(registrosArreglo.map(x => x[1])))
      .map(nombre => {
          return new Linea({
              nombre: nombre,
              descripcion: nombre,
              img: null,
              estado: true
          })
      });
  
      lineaBuscar = [];
  
      distintoLinea.forEach(x => {
          lineaBuscar.push(x.nombre);
      });


      promise = new Promise((resolve, reject) => {

        Linea.find({nombre: {$in: lineaBuscar}}, (err, resultado) => {
            resolve(resultado);
        });

      });

      promesas.push(promise);


      const distintoCategoria = Array.from(new Set(registrosArreglo.map(x => x[2])))
      .map(nombre => {
          return {
              nombre: nombre,
              descripcion: nombre,
              estado: true,
              strLinea : registrosArreglo.find(x => x[2] === nombre)[1]
          }
      });

      categoriaBuscar = [];

      distintoCategoria.forEach(x => {
          categoriaBuscar.push(x.nombre);
      });


      promise = new Promise((resolve, reject) => {

        Categoria.find({nombre: {$in: categoriaBuscar}}, (err, resultado) => {
            resolve(resultado);
        });

      });

      promesas.push(promise);

      Promise.all(promesas).then(function(results) {

            let promesasLinea = [];

            distintoLinea.forEach(async x => {
                var encontrado = results[0].find(e => e.nombre == x.nombre);
        
                if (!encontrado) {
                    let promiseLinea = new Promise((resolve, reject) => {

                        x.save((err, lineaGuardado) => {
                            resolve(lineaGuardado);
                        });
                      });
                   

                      promesasLinea.push(promiseLinea);
                } else {
                    let promiseLinea = new Promise((resolve, reject) => {
                        resolve(x);
                      });
                   
                      promesasLinea.push(promiseLinea);
                }
            });

            Promise.all(promesasLinea).then(function(resultsLinea) {
                
                distintoCategoria.forEach(async x => {
                    var encontrado = results[1].find(e => e.nombre == x.nombre);
    
                    if (!encontrado) {

                        let cate = new Categoria({
                            nombre: x.nombre,
                            descripcion: x.nombre,
                            estado: true,
                            linea : resultsLinea.find(l => l.nombre === x.strLinea)._id
                        });

                        cate.save();
                    }
                });

                return res.status(200).json({
                    ok: true,
                    mensaje: 'Archivo subido correctamente',
                    producto: "ok"
                });
            });
            
            
        }).catch(function(err) {
            res.send(err);
        });

    });



    


});


module.exports = app;
const base = require('../firebase/config');
const fetch = require('node-fetch');

async function usuarios(req, res, next){
    if (req.query.api == "usuarios") {
        let hoy = new Date();
        let fecha = hoy.getDate() + '/' + ( hoy.getMonth() + 1 ) + '/' + hoy.getFullYear();
        fecha += " " + hoy.getHours() + ':' + hoy.getMinutes() + ':' + hoy.getSeconds();

        let insercion = {
            entrada: {},
            salida: {},
            fecha: fecha,
            error: "",
            metodo: ""
        }

        if (req.query.id == "crear"){
            let ruta = req.body.ruta;
            delete req.body.ruta
            let respuesta 

            await fetch(ruta, { 
                method: 'POST', 
                body: JSON.stringify(req.body),
                headers: { 'Content-Type': 'application/json' } 
            })
            .then(response => response.json())
            .then(json => respuesta = json)

            insercion.metodo = "/crearUsuario"
            insercion.entrada = req.body
            insercion.salida = respuesta
            respuesta.estado == 0 ? insercion.error = "Si" : insercion.error = "No" 

            await base.collection('logs').add(insercion)

            res.send(respuesta)
            next();
        }else if(req.query.id == "login"){
            let ruta = req.body.ruta;
            delete req.body.ruta;
            let respuesta

            await fetch(ruta, { 
                method: 'POST', 
                body: JSON.stringify(req.body),
                headers: { 'Content-Type': 'application/json' } 
            })
            .then(response => response.json())
            .then(json => respuesta = json)

            insercion.metodo = "/login"
            insercion.entrada = req.body
            insercion.salida = respuesta
            respuesta.estado == 0 ? insercion.error = "Si" : insercion.error = "No" 

            await base.collection('logs').add(insercion)

            res.send(respuesta)
            next();
        }else if(req.query.id == "actualizar"){
            let ruta = req.body.ruta;
            delete req.body.ruta;
            let respuesta

            await fetch(ruta, { 
                method: 'PUT', 
                body: JSON.stringify(req.body),
                headers: { 'Content-Type': 'application/json' } 
            })
            .then(response => response.json())
            .then(json => respuesta = json)

            insercion.metodo = "/actualizarPerfil"
            insercion.entrada = req.body
            insercion.salida = respuesta
            respuesta.estado == 0 ? insercion.error = "Si" : insercion.error = "No" 

            await base.collection('logs').add(insercion)

            res.send(respuesta)
            next();
        }else if(req.query.id == "generar") {
            let ruta = req.body.ruta;
            delete req.body.ruta
            let respuesta 

            await fetch(ruta)
            .then(response => response.json())
            .then(json => respuesta = json)

            insercion.metodo = "/generarCodigo"
            insercion.entrada = req.body
            insercion.salida = respuesta
            respuesta.estado == 0 ? insercion.error = "Si" : insercion.error = "No" 

            await base.collection('logs').add(insercion)

            res.send(respuesta)
            next();
        }else if(req.query.id == "verificar") {
            let ruta = req.body.ruta;
            delete req.body.ruta
            let respuesta 

            await fetch(ruta, { 
                method: 'POST', 
                body: JSON.stringify(req.body),
                headers: { 'Content-Type': 'application/json' } 
            })
            .then(response => response.json())
            .then(json => respuesta = json)

            insercion.metodo = "/verificarCodigo"
            insercion.entrada = req.body
            insercion.salida = respuesta
            if (respuesta.estado == 0 || respuesta.estado == 2) { insercion.error = "Si" }
            else { insercion.error = "No" }

            await base.collection('logs').add(insercion)

            res.send(respuesta)
            next();
        }
    } else if (req.query.api == "carpetas") {
        let hoy = new Date();
        let fecha = hoy.getDate() + '/' + ( hoy.getMonth() + 1 ) + '/' + hoy.getFullYear();
        fecha += " " + hoy.getHours() + ':' + hoy.getMinutes() + ':' + hoy.getSeconds();

        let insercion = {
            entrada: {},
            salida: {},
            fecha: fecha,
            error: "",
            metodo: ""
        }
        if (req.query.id == "crear"){
            let ruta = req.body.ruta;
            delete req.body.ruta
            let respuesta 

            await fetch(ruta, { 
                method: 'POST', 
                body: JSON.stringify(req.body),
                headers: { 'Content-Type': 'application/json' } 
            })
            .then(response => response.json())
            .then(json => respuesta = json)

            insercion.metodo = "/crearCarpeta"
            insercion.entrada = req.body
            insercion.salida = respuesta
            respuesta.estado == 0 ? insercion.error = "Si" : insercion.error = "No" 

            await base.collection('logs').add(insercion)

            res.send(respuesta)
            next();
        }else if(req.query.id == "datos"){
            let ruta = req.body.ruta;

            let respuesta

            await fetch(ruta)
            .then(response => response.json())
            .then(json => respuesta = json)

            insercion.metodo = "/datosCarpeta"
            insercion.entrada = ruta
            insercion.salida = respuesta
            respuesta.estado == 0 ? insercion.error = "Si" : insercion.error = "No" 

            await base.collection('logs').add(insercion)

            res.send(respuesta)
            next();
        }else if(req.query.id == "editar"){
            let ruta = req.body.ruta;
            delete req.body.ruta;
            let respuesta

            await fetch(ruta, { 
                method: 'PUT', 
                body: JSON.stringify(req.body),
                headers: { 'Content-Type': 'application/json' } 
            })
            .then(response => response.json())
            .then(json => respuesta = json)

            insercion.metodo = "/editarCarpeta"
            insercion.entrada = req.body
            insercion.salida = respuesta
            respuesta.estado == 0 ? insercion.error = "Si" : insercion.error = "No" 

            await base.collection('logs').add(insercion)

            res.send(respuesta)
            next();
        }else if(req.query.id == "obtener"){
            let ruta = req.body.ruta;
            delete req.body.ruta;
            let respuesta

            await fetch(ruta)
            .then(response => response.json())
            .then(json => respuesta = json)

            insercion.metodo = "/obtenerCarpetas"
            insercion.entrada = req.body
            insercion.salida = respuesta
            respuesta.estado == 0 ? insercion.error = "Si" : insercion.error = "No" 

            await base.collection('logs').add(insercion)

            res.send(respuesta)
            next();
        }else if(req.query.id == "eliminar"){
            let ruta = req.body.ruta;
            delete req.body.ruta;
            let respuesta

            await fetch(ruta, { method: 'DELETE' })
            .then(response => response.json())
            .then(json => respuesta = json)

            insercion.metodo = "/eliminarCarpeta"
            insercion.entrada = req.body
            insercion.salida = respuesta
            respuesta.estado == 0 ? insercion.error = "Si" : insercion.error = "No" 

            await base.collection('logs').add(insercion)

            res.send(respuesta)
            next();
        }
    } else if (req.query.api == "archivos") {
        let hoy = new Date();
        let fecha = hoy.getDate() + '/' + ( hoy.getMonth() + 1 ) + '/' + hoy.getFullYear();
        fecha += " " + hoy.getHours() + ':' + hoy.getMinutes() + ':' + hoy.getSeconds();

        let insercion = {
            entrada: {},
            salida: {},
            fecha: fecha,
            error: "",
            metodo: ""
        }
        if (req.query.id == "subir"){
            let ruta = req.body.ruta;
            delete req.body.ruta
            let respuesta 
            console.log("llego a subir");
            await fetch(ruta, { 
                method: 'POST', 
                body: JSON.stringify(req.body),
                headers: { 'Content-Type': 'application/json' } 
            })
            .then(response => response.json())
            .then(json => respuesta = json)

            insercion.metodo = "/subirArchivoABucket"
            insercion.entrada = req.body
            insercion.salida = respuesta
            respuesta.error = "No se pudo convertir el archivo" ? insercion.error = "Si" : insercion.error = "No" 

            await base.collection('logs').add(insercion)

            res.send(respuesta)
            next();
        }else if(req.query.id == "crear"){
            let ruta = req.body.ruta;
            delete req.body.ruta;

            let respuesta
            console.log("Mnado a crear");
            await fetch(ruta, { 
                method: 'POST', 
                body: JSON.stringify(req.body),
                headers: { 'Content-Type': 'application/json' } 
            })
            .then(response => response.json())
            .then(json => respuesta = json)

            insercion.metodo = "/crearRegistroArchivo"
            insercion.entrada = ruta
            insercion.salida = respuesta
            if(respuesta.hasOwnProperty('prop')){
                respuesta.mensaje == "Ya existe un archivo con ese nombre, vuelva a intentar con otro nombre" ? insercion.error = "Si" : insercion.error = "No" 
            }
            await base.collection('logs').add(insercion)

            res.send(respuesta)
            next();
        }else if(req.query.id == "listado"){
            let ruta = req.body.ruta;
            delete req.body.ruta;
            let respuesta

            await fetch(ruta, { 
                method: 'POST', 
                body: JSON.stringify(req.body),
                headers: { 'Content-Type': 'application/json' } 
            })
            .then(response => response.json())
            .then(json => respuesta = json)

            insercion.metodo = "/listadoArchivos"
            insercion.entrada = req.body
            insercion.salida = respuesta
            insercion.error = "No"

            await base.collection('logs').add(insercion)

            res.send(respuesta)
            next();
        }else if(req.query.id == "especifico"){
            let ruta = req.body.ruta;
            delete req.body.ruta;
            let respuesta

            await fetch(ruta, { 
                method: 'POST', 
                body: JSON.stringify(req.body),
                headers: { 'Content-Type': 'application/json' } 
            })
            .then(response => response.json())
            .then(json => respuesta = json)

            insercion.metodo = "/archivoEspecifico"
            insercion.entrada = req.body
            insercion.salida = respuesta
            insercion.error = "No" 

            await base.collection('logs').add(insercion)

            res.send(respuesta)
            next();
        }else if(req.query.id == "eliminar"){
            let ruta = req.body.ruta;
            delete req.body.ruta;
            let respuesta

            await fetch(ruta, { 
                method: 'POST', 
                body: JSON.stringify(req.body),
                headers: { 'Content-Type': 'application/json' } 
            })
            .then(response => response.json())
            .then(json => respuesta = json)

            insercion.metodo = "/eliminarArchivo"
            insercion.entrada = req.body
            insercion.salida = respuesta
            insercion.error = "No" 

            await base.collection('logs').add(insercion)

            res.send(respuesta)
            next();
        }else if(req.query.id == "mover"){
            let ruta = req.body.ruta;
            delete req.body.ruta;
            let respuesta
            await fetch(ruta, { 
                method: 'PUT', 
                body: JSON.stringify(req.body),
                headers: { 'Content-Type': 'application/json' } 
            })
            .then(response => response.json())
            .then(json => respuesta = json)

            insercion.metodo = "/moverArchivo"
            insercion.entrada = req.body
            insercion.salida = respuesta
            respuesta.error = "No existe el archivo" ? insercion.error = "Si" : insercion.error = "No" 

            await base.collection('logs').add(insercion)

            res.send(respuesta)
            next();
        }else if(req.query.id == "enviar"){
            let ruta = req.body.ruta;
            delete req.body.ruta;
            let respuesta
            await fetch(ruta, { 
                method: 'PUT', 
                body: JSON.stringify(req.body),
                headers: { 'Content-Type': 'application/json' } 
            })
            .then(response => response.json())
            .then(json => respuesta = json)

            insercion.metodo = "/enviarContenido"
            insercion.entrada = req.body
            insercion.salida = respuesta
            respuesta.error = 0 ? insercion.error = "Si" : insercion.error = "No" 

            await base.collection('logs').add(insercion)

            res.send(respuesta)
            next();
        }
    } else if (req.query.api == "papelera") {
        let hoy = new Date();
        let fecha = hoy.getDate() + '/' + ( hoy.getMonth() + 1 ) + '/' + hoy.getFullYear();
        fecha += " " + hoy.getHours() + ':' + hoy.getMinutes() + ':' + hoy.getSeconds();

        let insercion = {
            entrada: {},
            salida: {},
            fecha: fecha,
            metodo: "",
            error: ""
        }

        if (req.query.id == "mover"){
            let ruta = req.body.ruta;
            delete req.body.ruta
            let respuesta 

            await fetch(ruta, { 
                method: 'DELETE', 
                body: JSON.stringify(req.body),
                headers: { 'Content-Type': 'application/json' } 
            })
            .then(response => response.json())
            .then(json => respuesta = json)

            insercion.metodo = "/moverAPapelera"
            insercion.entrada = req.body
            insercion.salida = respuesta
            respuesta.estado == 0 ? insercion.error = "Si" : insercion.error = "No" 

            await base.collection('logs').add(insercion)

            res.send(respuesta)
            next();
        } else if(req.query.id == "eliminar"){
            let ruta = req.body.ruta;
            delete req.body.ruta;
            let respuesta

            await fetch(ruta, { 
                method: 'DELETE', 
                body: JSON.stringify(req.body),
                headers: { 'Content-Type': 'application/json' } 
            })
            .then(response => response.json())
            .then(json => respuesta = json)

            insercion.metodo = "/eliminarCompleto"
            insercion.entrada = req.body
            insercion.salida = respuesta
            respuesta.estado == 0 ? insercion.error = "Si" : insercion.error = "No" 

            await base.collection('logs').add(insercion)

            res.send(respuesta)
            next();
        } else if(req.query.id == "restaurar"){
            let ruta = req.body.ruta;
            delete req.body.ruta;
            let respuesta

            await fetch(ruta, { 
                method: 'PUT', 
                body: JSON.stringify(req.body),
                headers: { 'Content-Type': 'application/json' } 
            })
            .then(response => response.json())
            .then(json => respuesta = json)

            insercion.metodo = "/restaurarArchivo"
            insercion.entrada = req.body
            insercion.salida = respuesta
            respuesta.estado == 0 ? insercion.error = "Si" : insercion.error = "No" 

            await base.collection('logs').add(insercion)

            res.send(respuesta)
            next();
        } else if(req.query.id == "obtener") {
            let ruta = req.body.ruta;
            delete req.body.ruta;
            let respuesta

            await fetch(ruta)
            .then(response => response.json())
            .then(json => respuesta = json)

            insercion.metodo = "/obtenerPapelera"
            insercion.entrada = req.body
            insercion.salida = respuesta
            insercion.error = "No" 

            await base.collection('logs').add(insercion)

            res.send(respuesta)
            next()
        }
    }
} 

module.exports = usuarios
const base = require('../firebase/config');
const { Router } = require('express');
const getStream = require('get-stream')
const fetch = require('node-fetch');
const router = Router();
const { configuracionCorreo } = require('./envios')


/*
{
    "BASE64" : "",
    "CONTENIDO" : "image/jpeg",
    "NOMBRE": "test (1).jpg"
}

*/

router.post('/subirArchivo',async(req, res) => {    
    //PATH completa del archivo, tipo de contenido de archivo, nombre del archivo
    //Ejemplo
    //Subir Archivo  
    let  fechaString;
    let fecha = new Date();
    fechaString = fecha.getDate() + "-" + (fecha.getMonth() + 1) + "-" + fecha.getFullYear();
    fechaString += " " + fecha.getHours() + ":" + fecha.getMinutes() + ":" + fecha.getSeconds();
    
    let base64Archivo = req.body.BASE64;
    let readData;
    try {
        readData = Buffer.from(base64Archivo, 'base64');
    } catch (error) {
    console.error(error);
    res.json({
        error: "No se pudo convertir el archivo"
    })
    }
    var downloaduRL;
    const newName =  req.body.NOMBRE + fechaString;
    var metadata = {
        contentType: req.body.CONTENIDO
      };

    // Crear referencia
    var storageRef = base.storage().ref('upload/'+newName);
    
    storageRef.put(readData,metadata).then(function(snapshot) {
    console.log('Uploaded an File!'); 
    storageRef.getDownloadURL()
        .then(function(result) {
            res.json({
                ruta: newName,
                downloadURL : result
            })
        });
    });
});

//Subir Archivo Completo a firebaseDatabase
/*
{
    "NOMBRE" : "test (1).jpg",
    "ID_CARPETA" : "DNCLFaR67zE1DjM1qCCg",
    "URL": "https://firebasestorage.googleapis.com/v0/b/analisis2-f19a0.appspot.com/o/upload%2Ftest%20(1).jpg?alt=media&token=917424aa-b921-491c-833a-d286c9672869"
}

*/
router.post('/createArchivo',async(req, res) => { 
    let idArchivo;   
    let banderaDuplicado = false;
    let archivos = await validarArchivo('ID_CARPETA', req.body.ID_CARPETA);
    for (let i = 0; i < archivos.length; i++) {
        if (archivos[i].NOMBRE == req.body.NOMBRE) {
            banderaDuplicado = true;
            break;
        }
    }
    if (!banderaDuplicado) {     
        let data = req.body;
        let fecha = new Date();
        data.FECHA_CREACION = fecha.getDate() + "-" + (fecha.getMonth() + 1) + "-" + fecha.getFullYear();
        data.FECHA_CREACION += " " + fecha.getHours() + ":" + fecha.getMinutes();

        await base.firestore().collection('Archivos').add(data)
        .then(response => {
            idArchivo = response.id 
        });

        res.json({
            mensaje: "Archivo Creado Correctamente",
            nombreArchivo: data.NOMBRE,
            IdArchivo : idArchivo
        })
    }else{
        res.json({
            mensaje: "Ya existe un archivo con ese nombre, vuelva a intentar con otro nombre",
            nombreArchivo: req.body.NOMBRE
        })
    }
});

//Devolver todos los archivos dentro de una carpeta
/*
{
    "ID_CARPETA" : "DNCLFaR67zE1DjM1qCCg"
}

*/
router.post('/ListadoArchivos',async(req, res) => {    
    
    let query = base.firestore().collection('Archivos')
    let filtro = await query.where("ID_CARPETA", '==', req.body.ID_CARPETA).get();

    let listado = []
    filtro.forEach( doc => {
        let actual = doc.data();
        actual.id = doc.id;
        listado.push(actual);
    });
    res.json({
        listadoArchivos: listado
    })
});
//Devolver los datos de un archivo en especifico
/*
{
    "ID_CARPETA" : "DNCLFaR67zE1DjM1qCCg",
    "ID_ARCHIVO" : "7lgZ7G9Non0gFABGxlnY"
}

*/
router.post('/archivoEspecifico',async(req, res) => {    
    let query = base.firestore().collection('Archivos')
    let filtro = await query.where("ID_CARPETA", "==", req.body.ID_CARPETA).get();

    let listado = []
    filtro.forEach( doc => {
        let actual = doc.data();
        actual.id = doc.id;
        if(actual.id == req.body.ID_ARCHIVO){
            listado.push(actual);
        }
    });
    res.json({
        mensaje: "Datos del Archivo",
        Datos: listado
    })
});
//Funcion para validarArchivos
async function validarArchivo(campo, valor) {
    let query = base.firestore().collection('Archivos')
    let filtro = await query.where(campo, '==', valor).get();

    let listado = []
    filtro.forEach( doc => {
        let actual = doc.data();
        actual.id = doc.id;
        listado.push(actual);
    });

    return listado
}
//Eliminar Archivo de una Carpeta
/*
    {
    
    "ID_ARCHIVO" : "Bbsbfzhu3mWKJHR31S2Y",
    "URL" : "https://firebasestorage.googleapis.com/v0/b/analisis2-f19a0.appspot.com/o/upload%2Ftest%20(1).jpg21-8-2021%2022%3A5%3A58?alt=media&token=af5a6e12-45db-48ca-85a3-ef92e8d47ad1"
    }

*/
router.post('/borrarArchivo',async(req, res) => {    
    //Eliminar Archivo
    const idArchivo = req.body.ID_ARCHIVO;
    const urlFile = req.body.URL;
    const storage = base.storage();
    storage.refFromURL(urlFile).delete()
    base.firestore().collection("Archivos").doc(idArchivo).delete().then(() => {
        console.log("Document successfully deleted!");
    }).catch((error) => {
        console.error("Error removing document: ", error);
    });
    res.json({
        mensaje: "Eliminado",
        Datos: urlFile
    })
});
//Mover Archivo a otra Carpeta
/*
    {
    
    "ID_CARPETA_DESTINO" : "S2sG7cT290h3xhTYLQbY",
    "ID_ARCHIVO" : "gF4xjx4mb1eouwjePkQG"
    }

*/
//Devuleve toda la collecion de archivos
async function getArchivos() {
    const snapshot = await base.firestore().collection('Archivos').get()
    let listado = []
    snapshot.forEach( doc => {
        let actual = doc.data();
        actual.id = doc.id;
        listado.push(actual);
    });

    return listado
}
router.put('/MoverArchivo',async(req, res) => {    
    let idCarpeta = req.body.ID_CARPETA_DESTINO;
    let idArchivo = req.body.ID_ARCHIVO;
    let existeArchivo = false;
    //Buscar si existe Archivo
    let archivos = await getArchivos();
    for (let i = 0; i < archivos.length; i++) {
        if (archivos[i].id == idArchivo) {
            existeArchivo = true;
            break;
        }
    }
    
    //Si existe el Archivo
    if(existeArchivo == true){
        let query = base.firestore().collection('Archivos').doc(idArchivo);
        await query.update({ID_CARPETA: idCarpeta});

        res.json({
            mensaje: "Archivo Movido Correctamentes",
            Datos: idArchivo
        })
    }else{
        res.json({
            mensaje: "No existe el archivo",
            Datos: idArchivo
        })
    }
    
});

/*{
    idArchivo: '',
    idUsuario: ''
}

estado: 1 -> enviado
estado: 2 -> sin correo
estado: 3 -> no es txt
*/
router.put('/enviarContenido', async(req, res) => {
    
    let estado = 0

    let archivo = await base.firestore().collection('Archivos').doc(req.body.idArchivo).get();
    let usuario = await base.firestore().collection('usuarios').doc(req.body.idUsuario).get();
    usuario = usuario.data()
    archivo = archivo.data()

    console.log(archivo)
    console.log(usuario)

    if(archivo.NOMBRE.includes(".txt")){
        if (usuario.correo != ""){
            let respuesta
            await fetch(archivo.URL)
            .then(response => response.text())
            .then(html => respuesta = html)
    
            await configuracionCorreo.sendMail({
                from: '"AyDrive" <josecarlosalonz@gmail.com>',
                to: usuario.correo,
                subject: `Contenido del archivo ${archivo.NOMBRE}`,
                text: respuesta
            })
    
            console.log(respuesta)
            estado = 1
        }else { estado = 2 }
    }else{ estado = 3 }

    res.json({ estado: estado })
})
module.exports = router;
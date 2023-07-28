const { Router } = require('express');
const base = require('../firebase/config');

const router = Router();

//id del archivo en la carpeta
router.delete('/moverAPapelera/:id', async(req, res) => {
    let salida, usuario;

    let archivo = await base.firestore().collection('Archivos').doc(req.params.id).get();
    archivo = archivo.data();

    await base.firestore().collection('Archivos').doc(req.params.id).delete();

    let carpeta = await base.firestore().collection('carpetas').doc(archivo.ID_CARPETA).get();
    carpeta = carpeta.data();

    if (carpeta == undefined) { usuario = archivo.ID_CARPETA; }
    else { usuario = carpeta.propietario; }

    salida = {usuario: usuario, archivo: archivo}
    await base.firestore().collection('papelera').add(salida);

    res.json({estado: 1})
})

//id del archivo en la papelera
router.delete('/eliminarCompleto/:id', async(req, res) => {
    try{
        let limbo = await base.firestore().collection('papelera').doc(req.params.id).get();
        limbo = limbo.data();

        await base.storage().refFromURL(limbo.archivo.URL).delete();
        await base.firestore().collection('papelera').doc(req.params.id).delete();

        res.json({estado: 1})
    }catch(error){
        res.json({estado: 2})
    }
    
})

//id del usuario
router.get('/obtenerPapelera/:id', async(req, res) => {
    let query = base.firestore().collection('papelera')
    let filtro = await query.where('usuario', '==', req.params.id).get();
    
    let listado = []
    filtro.forEach( doc => {
        let actual = doc.data();
        actual.id = doc.id;
        delete actual.usuario;
        listado.push(actual);
    });

    res.json({listado})
})

//id del archivo en la papelera
router.put('/restaurarArchivo/:id', async(req, res) => {
    let limbo = await base.firestore().collection('papelera').doc(req.params.id).get();
    limbo = limbo.data();

    await base.firestore().collection('Archivos').add(limbo.archivo);
    await base.firestore().collection('papelera').doc(req.params.id).delete();

    res.json({estado: 1})
})

module.exports = router;
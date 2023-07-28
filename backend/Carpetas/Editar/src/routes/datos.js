const { Router } = require('express');
const base = require('../firebase/config');

const router = Router();

/*
    {
        nombre: '',
        propietario: '' -> id de la carpeta padre
    }
*/
router.get('/datosCarpeta/:propietario/:nombre', async(req, res) => {
    let estado = 0, carpeta = null, noArchivos = 0;

    let carpetas = await validarCarpeta('propietario', req.params.propietario);

    for (let i = 0; i < carpetas.length; i++) {
        if (carpetas[i].nombre == req.params.nombre) {
            carpeta = carpetas[i];
            estado = 1
            break;
        }
    }

    //llamar a la api para contar archivos

    if (estado == 1){
        res.json({
            estado: estado,
            nombre: carpeta.nombre,
            fechaCreacion: carpeta.fechaCreacion,
            noArchivos: noArchivos
        })
    }else{
        res.json({
            estado: estado,
            nombre: "",
            fechaCreacion: "",
            noArchivos: 0
        })
    }

})

/* 
    {
        nuevo: '',
        viejo: '',
        propietario: '' -> id de la carpeta padre
    }
*/
router.put('/editarCarpeta', async(req, res) => {
    let estado = 0, carpeta = null, banderaRepetido = false;

    let carpetas = await validarCarpeta('propietario', req.body.propietario)

    for (let i = 0; i < carpetas.length; i++) {
        if (carpetas[i].nombre == req.body.viejo) {
            carpeta = carpetas[i];
            break;
        }
    }

    for (let i = 0; i < carpetas.length; i++) {
        if (carpetas[i].nombre == req.body.nuevo) {
            banderaRepetido = true
            break;
        }
    }

    if (carpeta != null && !banderaRepetido) {
        let query = base.collection('carpetas').doc(carpeta.id);
        await query.update({nombre: req.body.nuevo});
        estado = 1;
    }

    res.json({estado: estado})
})


//propietario -> id de la carpeta padre
router.get('/obtenerCarpetas/:propietario', async(req, res) => {
    let carpetas = await validarCarpeta('propietario', req.params.propietario);

    res.json({
        estado: 1,
        carpetas: carpetas
    })
})


async function validarCarpeta(campo, valor) {
    let query = base.collection('carpetas')
    let filtro = await query.where(campo, '==', valor).get();

    let listado = []
    filtro.forEach( doc => {
        let actual = doc.data();
        actual.id = doc.id;
        listado.push(actual);
    });

    return listado
}


module.exports = router;
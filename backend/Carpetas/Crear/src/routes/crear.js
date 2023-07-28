const { Router } = require('express');
const base = require('../firebase/config');

const router = Router();

/*
    {
        nombre: '',
        fechaCreacion: '',
        propietario: '', -> id de la carpeta padre
    }
*/
router.post('/crearCarpeta', async(req, res) => {
    let estado = 0, banderaDuplicado = false, idCarpeta = '';

    let carpetas = await validarCarpeta('propietario', req.body.propietario);

    for (let i = 0; i < carpetas.length; i++) {
        if (carpetas[i].nombre == req.body.nombre) {
            banderaDuplicado = true;
            break;
        }
    }

    if (!banderaDuplicado) {
        estado = 1;

        let data = req.body;
        let fecha = new Date();
        data.fechaCreacion = fecha.getDate() + "-" + (fecha.getMonth() + 1) + "-" + fecha.getFullYear();
        data.fechaCreacion += " " + fecha.getHours() + ":" + fecha.getMinutes();
        
        await base.collection('carpetas').add(data)
        .then(response => {
            idCarpeta = response.id 
        });
    }

    res.json({
        estado: estado,
        idCarpeta: idCarpeta
    })
});

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
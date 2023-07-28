const { Router } = require('express');
const { validarUsuario } = require('./comunes');
const base = require('../firebase/config');

const router = Router();

/*
    {
        usuario: '',
        contra: '',
        correo: '',
        fechaNac: '',
        autenticacion: true = con autenticaion | false = sin autenticacion,
        telefono: numero = numero ingresado | 0 = sin numero, el numero mandarlo sin extension
        correo: correo = correo ingresado | '' = sin correo
    }
*/
router.post('/crearUsuario', async(req, res) => {
    let estado = 0, idUsuario = '';

    let { vacio: banderaUsuario } = await validarUsuario('usuario', req.body.usuario);
    let { vacio: banderaCorreo } = await validarUsuario('correo', req.body.correo);

    if (!banderaCorreo || !banderaUsuario) { estado = 0; }
    else{
        estado = 1;
        let usuario = req.body
        usuario.codigoTelefono = ""
        usuario.codigoCorreo = ""
        usuario.tiempo = ""
        await base.collection('usuarios').add(usuario)
        .then(response => {
            idUsuario = response.id 
        });
    }

    res.json({
        estado: estado,
        idUsuario: idUsuario
    })
});

module.exports = router;
const { Router } = require('express');
const { validarUsuario } = require('./comunes');
const base = require('../firebase/config');

const router = Router();

/*
    {
        usuario: '',
        contra: ''
    }
*/
router.post('/login', async(req, res) => {
    let { vacio: banderaUsuario, listado: usuarios } = await validarUsuario('usuario', req.body.usuario);
    let usuario = null, estado = 0;

    //Si retorna algo la consulta significa que encontro al usuario
    if (!banderaUsuario && usuarios[0].contra == req.body.contra) { 
        estado = 1; 
        usuario = usuarios[0];
    }

    //eliminando informacion de la autenticacion doble
    if (usuario != null){
        delete usuario.codigoTelefono
        delete usuario.codigoCorreo
        delete usuario.tiempo
    } 
    res.json({
        estado: estado,
        idUsuario: usuario,
    })

});

/*
a recibir:
    {
        id: id del usuario,
        codigoTelefono: codigo enviado al telefono, si no existe enviar ""
        codigoCorreo: codigo enviado al correo, si no existe enviar ""
    }

a retornar:
    estado = 0 -> codigo o codigos fallidos
    estado = 1 -> codigo o codigos son correctos
    estado = 2 -> tiempo superado
*/
router.post('/verificarCodigo', async(req, res) => {
    let usuario = await base.collection('usuarios').doc(req.body.id).get();
    usuario = usuario.data();

    let estado = 0, banderaCorreo = false, banderaTelefono = false
    let tiempoGenerado = new Date(usuario.tiempo)
    let tiempoActual = new Date()

    let resta = tiempoActual - tiempoGenerado
    var segundos = parseInt(Math.abs(resta / 1000));
    var dias = Math.floor(segundos / (3600 * 24));

    if (dias == 0) {
        if (segundos <= 180) {
            let codigoC = req.body.codigoCorreo, codigoT = req.body.codigoTelefono

            if (codigoC != "") { if (codigoC == usuario.codigoCorreo) { banderaCorreo = true } }
            if (codigoT != "") { if (codigoT == usuario.codigoTelefono) { banderaTelefono = true } }

            let condicion1 = banderaCorreo && codigoT == "" //autenticado unicamente en correo
            let condicion2 = banderaTelefono && codigoC == "" //autenticado unicamente en telefono
            let condicion3 = banderaTelefono && banderaCorreo //autenticado en ambos medios
            if (condicion1 || condicion2 || condicion3) { estado = 1 }
        } else { estado = 2 }
    } else { estado = 2 }

    res.json({ estado: estado })
});

module.exports = router;
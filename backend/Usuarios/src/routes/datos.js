const { Router } = require('express');
const { configuracionCorreo, client } = require('./envios')
const base = require('../firebase/config');

const router = Router();

router.put('/actualizarPerfil/:id', async(req, res) => {   
    let modificable = req.body.modificable;
    delete req.body.modificable;
    //Main
    let respose = await edituser(req, modificable, await iseditable(req, modificable));
    res.json(respose);
})

async function edituser(key ,descriptor, Decorator) {

    let query = await base.collection('usuarios').doc(key.params.id);
    
    //Decorator
    let modificable = Decorator;
    if(!modificable){ return {estado:0} }
    
    await query.update(key.body);

    return {estado:1}
    
}

async function iseditable(key ,descriptor) {
    return descriptor == "si" ? true : false;
}

 
//id del usuario, obtenido despues del login exitoso
router.get('/generarCodigo/:id', async(req, res) => {
    let usuario = await base.collection('usuarios').doc(req.params.id).get();
    usuario = usuario.data()

    let claves = { codigoTelefono: "", codigoCorreo: "", tiempo: "" }
    if (usuario.telefono != 0) { 
        claves.codigoTelefono = generarCodigo() 
        client.messages 
        .create({ 
            body: `Tu codigo de verificacion de AyDrive es: ${claves.codigoTelefono}`,  
            messagingServiceSid: 'MG3b3954daf701ea9da98ff80d5049d756',      
            to: `+502${usuario.telefono}` 
        }) 
        .then(message => console.log(message.sid)) 
        .done();
    }

    if (usuario.correo != "") { 
        claves.codigoCorreo = generarCodigo() 
        await configuracionCorreo.sendMail({
            from: '"AyDrive" <josecarlosalonz@gmail.com>',
            to: usuario.correo,
            subject: 'Codigo de verificacion',
            html: `<table class="x_body" width="100%" bgcolor="#f1f1f1" style="background-color: rgb(241, 241, 241); min-width: 600px; transform: scale(0.596667, 0.596667); transform-origin: left top;" min-scale="0.5966666666666667">
                <tbody>
                <tr>
                <td class="x_body" align="center" valign="top" width="100%" style="min-width:600px">
                <center>
                <table width="100%" border="0" cellpadding="0" cellspacing="0" class="x_body" bgcolor="#f1f1f1" style="min-width:500px">
                <tbody>
                <tr>
                <td align="center">
                <table>
                <tbody>
                <tr> <td align="center">&nbsp;</td> </tr>
                </tbody>
                </table>
                <table width="100%" border="0" cellpadding="0" cellspacing="0" class="x_body" style="min-width:500px">
                <tbody>
                <tr><td align="center">
                <table width="500" class="x_panel" border="0" cellpadding="0" cellspacing="0" style="min-width:500px">
                <tbody>
                <tr>
                <td width="100%" height="50" style="line-height:1px; font-size:1px">
                <div style="font-family: sans-serif, serif, EmojiFont; color: rgb(32, 32, 32); text-align: center; font-size: 26px; line-height: 100%; letter-spacing: 2px;">
                Tu código de inicio de sesión de dos factores: 
                </div>
                </td>
                </tr>
                <tr>
                <td width="100%" height="50" style="line-height:1px; font-size:1px">
                <div style="font-family: sans-serif, serif, EmojiFont; color: rgb(32, 32, 32); text-align: center; font-size: 26px; line-height: 100%; letter-spacing: 2px;">
                ${claves.codigoCorreo} 
                </div>
                </td>
                </tr>
                </tbody>
                </table>
                <table width="100%" border="0" cellpadding="0" cellspacing="0" class="x_body" style="min-width:500px">
                <tbody>
                <tr height="40">
                <td align="center">&nbsp;</td>
                </tr>
                </tbody>
                </table>
                </td>
                </tr>
                </tbody>
                </table>
                </td>
                </tr>
                </tbody>
                </table>
                <table width="500" class="x_panel-padded" border="0" cellpadding="0" cellspacing="0" style="background-color:#fff; margin:0 auto">
                <tbody>
                <tr height="50">
                <td width="50">&nbsp;</td>
                <td height="50" style="line-height:1px; font-size:1px">&nbsp;</td>
                <td width="50">&nbsp;</td>
                </tr>
                <tr>
                <td width="50">&nbsp;</td>
                <td align="left" style="font-family:arial,helvetica,sans-serif; font-size:14px; color:#202020; line-height:19px; line-height:134%; letter-spacing:.5px">
                Hola, ${usuario.usuario}: <br><br>
                </td>
                <td width="50">&nbsp;</td>
                </tr>
                <tr>
                <td width="50">&nbsp;</td>
                <td align="left" style="font-family:arial,helvetica,sans-serif; font-size:14px; color:#202020; line-height:19px; line-height:134%; letter-spacing:.5px">
                Recientemente intentaste iniciar sesión y tienes activado la auteticación. 
                Para completar tu inicio de sesión, usa el código anterior.
                <br><br>
                </td>
                <td width="50">&nbsp;</td>
                </tr>
                </tbody>
                </table>
                <table width="500" class="x_panel-padded" border="0" cellpadding="0" cellspacing="0" style="min-width:400px; background-color:#fff">
                <tbody>
                <tr>
                <td width="50">&nbsp;</td>
                <td align="left" style="font-family:arial,helvetica,sans-serif; font-size:14px; color:#202020; line-height:19px; line-height:134%">
                <div style="font-family: arial, helvetica, sans-serif, serif, EmojiFont; font-size: 14px; color: rgb(32, 32, 32); line-height: 19px; letter-spacing: 0.5px;">
                Si no fuiste tú, cambia tu contraseña. 
                <br><br>Gracias,<br>El equipo de AyDrive
                </div>
                </td>
                <td width="50">&nbsp;</td>
                </tr>
                <tr height="50">
                <td width="50">&nbsp;</td>
                <td height="50" style="line-height:1px; font-size:1px">&nbsp;</td>
                <td width="50">&nbsp;</td>
                </tr>
                </tbody>
                </table>
                <table width="100%" border="0" cellpadding="0" cellspacing="0" class="x_body" style="min-width:500px">
                <tbody>
                <tr>
                <td align="center">
                <table width="500" class="x_panel" border="0" cellpadding="0" cellspacing="0" style="min-width:500px">
                <tbody>
                <tr height="50">
                <td width="100%" height="20" style="line-height:1px; font-size:1px">&nbsp;</td>
                </tr>
                <tr>
                <td align="center" class="x_panel-padded">
                <div style="font-family: arial, helvetica, sans-serif, serif, EmojiFont; font-size: 10px; color: rgb(32, 32, 32); text-align: center; line-height: 12px;">
                <p>
                © 2021, AyDrive, Inc. Todos los derechos reservados. 
                </p>
                </div>
                </td>
                </tr>
                </tbody>
                </table>
                </td>
                </tr>
                </tbody>
                </table>
                </center>
                </td>
                </tr>
                </tbody>
                </table>`
        })
    }

    let ahora = new Date()
    claves.tiempo = ahora.toString()

    let query = await base.collection('usuarios').doc(req.params.id);
    await query.update(claves)

    res.json({estado: 1}) //clave generada
})


function generarCodigo() {
    let codigo = "", maximo = 0, minimo = 0, eleccion = 0, indice = 0

    for (let i = 0; i < 6; i++) {
        eleccion = Math.floor(Math.random() * 3); //0 = numeros, 1 = minusculas, 2 = mayusculas
        if (eleccion == 0) { 
            minimo = 48
            maximo = 58
        } else if(eleccion == 1) {
            minimo = 97
            maximo = 123
        } else {
            minimo = 65
            maximo = 91
        }

        indice = Math.floor(Math.random() * (maximo - minimo)) + minimo
        codigo += String.fromCharCode(indice)
    }
    return codigo
}

module.exports = router;
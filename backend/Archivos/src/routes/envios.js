const nodemailer = require('nodemailer');

const configuracionCorreo = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: 'josecarlosalonz@gmail.com',
        pass: 'xdinedeyrroqudfi'
    }
});

configuracionCorreo.verify().then(() => {
    console.log("listo para enviar correos c:")
})

module.exports = { configuracionCorreo }
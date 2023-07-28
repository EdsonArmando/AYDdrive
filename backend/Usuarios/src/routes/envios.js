const nodemailer = require('nodemailer');
const accountSid = 'ACf3f3c64e7d06b86422ea832aa077a662'; 
const authToken = '38f1b0fddd46bb0ce5e070470184a56f'; 
const client = require('twilio')(accountSid, authToken); 

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

module.exports = { configuracionCorreo, client }
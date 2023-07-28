let chai = require('chai')
let chaiHttp = require('chai-http')
const expect = require('chai').expect


chai.use(chaiHttp)
const urlArchivos = 'http://35.232.111.58:3005'
const urlUsuarios = 'http://35.232.111.58:3000'
const urlCrearCarpeta = 'http://35.232.111.58:3001'
const urlEditarCarpeta = 'http://35.232.111.58:3003'
const urlElimnarCarpeta = 'http://35.232.111.58:3002'
const urlPapelra = 'http://35.232.111.58:3004'
/*

Pruebas Unitarias para endPoints de servicio de Archivos

*/

//Test Obtener el listado de Archivos de una carpeta
describe('Test 1 post a la ruta /ListadoArchivos', () => {
    it('la ruta /ListadoArchivos deberia obtener el litado de archivos de una carpeta de la base de datos   ', done => {
        chai.request(urlArchivos)
        .post('/ListadoArchivos')
        .send(
            {
                "ID_CARPETA" : "RAuKJ34XXxim9nGhij9c"
            }
        )
        .end((err, res) => {
            expect(res).to.have.status(200)
            done()
        })
    })
})
//Eliminar Archivo del Firesbase storage
describe('Test 2 Eliminar Archivo /eliminarCompleto', () => {
    it('la ruta /eliminarCompleto deberia borrar el archivo', done => {
        chai.request(urlPapelra)    
        .delete('/eliminarCompleto/id')
        .send()
        .end((err, res) => {
            expect(res.body.estado).to.equals(2)
            done()
        })
    })
})
//Crear Archivo
describe('Test 3 Crear Archivo /createArchivo', () => {
    it('la ruta /createArchivo deberia crear el archivo', done => {
        chai.request(urlArchivos)
        .post('/createArchivo')
        .send(
            {
                "NOMBRE" : "test (1).jpg",
                "ID_CARPETA" : "DNCLFaR67zE1DjM1qCCg",
                "url": "https://firebasestorage.googleapis.com/v0/b/analisis2-f19a0.appspot.com/o/upload%2Ftest%20(1).jpg?alt=media&token=917424aa-b921-491c-833a-d286c9672869"
            }
        )
        .end((err, res) => {
            expect(res).to.have.status(200)
            done()
        })
    })
})
/*

Pruebas Unitarias para endPoints de servicio de Usuarios

*/
//Test 4 Login
describe('Test 5 Login de Usuario /login', () => {
    it('la ruta /login deberia verificar a el usuario', done => {
        chai.request(urlUsuarios)
        .post('/login')
        .send(
            {
                "usuario": "",
                "contra": ""
            }
        )
        .end((err, res) => {
            expect(res.body.estado).to.equals(1)
            done()
        })
    })
})
//Test 5 Crear Usuario
describe('Test 5 Creacion de Usuario /crearUsuario', () => {
    it('la ruta /crearUsuario deberia verificar al crear a el usuario', done => {
        chai.request(urlUsuarios)
        .post('/crearUsuario')
        .send(
            {
                "usuario": "juan",
                "contra": "12",
                "correo": "asdas",
                "fechaNac": "dasd"
            }
        )
        .end((err, res) => {
            expect(res.body.estado).to.equals(0)
            done()
        })
    })
})
//Test 6 Actualizar Datos de Usuario
/*
describe('Test 6 Actualiza los datos del Usuario /actualizarPerfil/', () => {
    it('la ruta /actualizarPerfil/:id deberia actualizar los datos del usuario', done => {
        chai.request(urlUsuarios)
        .put('/actualizarPerfil/cTxF7MmOr7g69xgaEyIq')
        .send(
            {
                "nombre": "",
                "correo": "",
                "contra": "",
                "fechaNac": "",
                "modificable": "si",
            }
        )
        .end((err, res) => {
            expect(res.body.estado).to.equals(1)
            done()
        })
    })
})
*/
/*

Pruebas Unitarias para endPoints de servicio de Carpetas

*/
//Crear Carpeta

describe('Test 7 post a la ruta /crearCarpeta', () => {
    it('la ruta /crearCarpeta deberia crear una carpeta', done => {
        chai.request(urlCrearCarpeta)
        .post('/crearCarpeta')
        .send(
            {
                "nombre": "",
                "fechaCreacion": "",
                "propietario": "",
            }
        )
        .end((err, res) => {
            expect(res).to.have.status(200)
            done()
        })
    })
})
//Editar Carpeta
describe('Test 8 post a la ruta /editarCarpeta', () => {
    it('la ruta /editarCarpeta deberia editar una carpeta', done => {
        chai.request(urlEditarCarpeta)
        .post('/editarCarpeta')
        .send(
            {
                "nuevo": "",
                "viejo": "",
                "propietario": "",
            }
        )
        .end((err, res) => {
            expect(res).to.have.status(404)
            done()
        })
    })
})

//Eliminar Carpeta
describe('Test 9 post a la ruta /eliminarCarpeta', () => {
    it('la ruta /eliminarCarpeta deberia elimnar una carpeta', done => {
        chai.request(urlElimnarCarpeta)
        .delete('/eliminarCarpeta/wc4AjYuZJdJSGuUdAiCs')
        .send()
        .end((err, res) => {
            expect(res).to.have.status(200)
            done()
        })
    })
})
//Incorrectas
//Test 10 Login Incorrecto
/*describe('Test 10 ERROR LOGIN de Usuario /login', () => {
    it('la ruta /login deberia verificar a el usuario', done => {
        chai.request(urlUsuarios)
        .post('/login')
        .send(
            {
                "usuario": "",
                "contra": "3132"
            }
        )
        .end((err, res) => {
            expect(res.body.estado).to.equals(0)
            done()
        })
    })
})*/
//Test 11 Archivo Duplicado
describe('Test 11 CREAR ARCHIVO DUPLICADO /createArchivo', () => {
    it('la ruta /createArchivo deberia crear el archivo', done => {
        chai.request(urlArchivos)
        .post('/createArchivo')
        .send(
            {
                "NOMBRE" : "test (1).jpg",
                "ID_CARPETA" : "DNCLFaR67zE1DjM1qCCg",
                "url": "https://firebasestorage.googleapis.com/v0/b/analisis2-f19a0.appspot.com/o/upload%2Ftest%20(1).jpg?alt=media&token=917424aa-b921-491c-833a-d286c9672869"
            }
        )
        .end((err, res) => {
            expect(res).to.have.status(200)
            done()
        })
    })
})
/*
//Test 12 Usuario DUPLICADO
/*describe('Test 12 USUARIO DUPLICADO  /crearUsuario', () => {
    it('la ruta /crearUsuario deberia verificar al crear a el usuario', done => {
        chai.request(urlUsuarios)
        .post('/crearUsuario')
        .send(
            {
                "usuario": "edson",
                "contra": "",
                "correo": "",
                "fechaNac": ""
            }
        )
        .end((err, res) => {
            expect(res.body.estado).to.equals(0)
            done()
        })
    })
})
//Eliminar Carpeta INEXISTENTE
describe('Test 13 ELIMINAR CARPETA INEXISTENTE', () => {
    it('la ruta /eliminarCarpeta deberia elimnar una carpeta', done => {
        chai.request(urlElimnarCarpeta)
        .delete('/eliminarCarpeta/xD')
        .send()
        .end((err, res) => {
            expect(res).to.have.status(200)
            done()
        })
    })
})
*/

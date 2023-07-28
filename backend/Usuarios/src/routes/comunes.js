const base = require('../firebase/config');

//Decorator
async function validarUsuario(campo, valor) {
    let query = base.collection('usuarios')
    let filtro = await query.where(campo, '==', valor).get();

    let listado = []
    filtro.forEach( doc => {
        let actual = doc.data();
        actual.id = doc.id;
        listado.push(actual);
    });

    return { vacio: filtro.empty, listado: listado}
}

module.exports = { validarUsuario }
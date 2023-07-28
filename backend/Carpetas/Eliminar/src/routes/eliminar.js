const { Router } = require('express');
const base = require('../firebase/config');

const router = Router();

router.delete('/eliminarCarpeta/:id', async(req, res) => {
    let query = await base.collection('carpetas').doc(req.params.id).delete();

    //aqui deberian de borrarse los archivos asociados

    res.json({estado: 1})
})

module.exports = router;
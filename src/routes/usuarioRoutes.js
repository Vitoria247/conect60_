const express = require('express');
const usuarioController = require('../controllers/usuarioController');

const router = express.Router();

router.post('/usuarios', usuarioController.cadastrar);
router.get('/usuarios', usuarioController.listar);

module.exports = router;

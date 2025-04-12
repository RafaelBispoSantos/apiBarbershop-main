const express = require('express');
const servicoController = require('../controllers/servicoController');

const router = express.Router();

router.post('/', servicoController.criarServico);
router.get('/', servicoController.listarServicos);
router.get('/:id', servicoController.obterServico);
router.patch('/:id', servicoController.atualizarServico);
router.delete('/:id', servicoController.excluirServico);
module.exports = router;

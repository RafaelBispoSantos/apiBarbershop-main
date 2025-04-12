const express = require('express');
const barbeiroController = require('../controllers/barbeiroController');

const router = express.Router();

router.post('/', barbeiroController.criarBarbeiro);
router.get('/', barbeiroController.listarBarbeiros);
router.get('/horarios-disponiveis', barbeiroController.obterHorariosDisponiveis);
router.get('/:id', barbeiroController.obterBarbeiro);
router.patch('/:id', barbeiroController.atualizarBarbeiro);
router.delete('/:id', barbeiroController.deletarBarbeiro);

module.exports = router;
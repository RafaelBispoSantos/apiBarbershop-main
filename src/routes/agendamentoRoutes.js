const express = require('express');
const agendamentoController = require('../controllers/agendamentoController');

const router = express.Router();

router.post('/', agendamentoController.criarAgendamento);
router.get('/', agendamentoController.listarAgendamentos);
router.get('/:id', agendamentoController.obterAgendamento);
router.patch('/:id/status', agendamentoController.atualizarStatusAgendamento);
router.patch('/:id/avaliacao', agendamentoController.adicionarAvaliacao);

module.exports = router;
const express = require('express');
const barbeiroRoutes = require('./barbeiroRoutes');
const servicoRoutes = require('./servicoRoutes');
const clienteRoutes = require('./clienteRoutes');
const agendamentoRoutes = require('./agendamentoRoutes');
const authRoutes = require('./authRoutes'); // Adicione esta linha

const router = express.Router();

router.use('/auth', authRoutes); // Adicione esta linha
router.use('/barbeiros', barbeiroRoutes);
router.use('/servicos', servicoRoutes);
router.use('/clientes', clienteRoutes);
router.use('/agendamentos', agendamentoRoutes);

module.exports = router;
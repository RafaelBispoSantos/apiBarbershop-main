const express = require('express');
const adminController = require('../controllers/adminController');
const { adminMiddleware } = require('../middleware/authMiddleware');

const router = express.Router();

// Todas as rotas aqui exigem permissão de administrador
router.use(adminMiddleware);

router.get('/stats', adminController.getStats);
// Outras rotas administrativas...

module.exports = router;
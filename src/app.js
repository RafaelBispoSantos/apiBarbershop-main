const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const routes = require('./routes');
require('dotenv').config();

const app = express();
const adminRoutes = require('./routes/adminRoutes');

// Configuração CORS para permitir apenas http://localhost:3000
const corsOptions = {
  origin: ['http://localhost:3000', 'exp://192.168.1.115:8081', 'http://192.168.1.115:8081', "https://barbershop-six-psi.vercel.app"],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}
// Middlewares
app.use(cors(corsOptions));
app.use(express.json());

// Conexão com MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB conectado'))
.catch(err => console.error('Erro na conexão com MongoDB:', err));

// Rotas
app.use('/api', routes);
app.use('/api/admin', adminRoutes);

// Tratamento de erros
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    status: 'error',
    message: 'Erro interno do servidor'
  });
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

module.exports = app;
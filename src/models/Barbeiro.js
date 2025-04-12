const mongoose = require('mongoose');

const barbeiroSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  telefone: {
    type: String
  },
  especialidades: [{
    type: String
  }],
  fotoPerfil: {
    type: String
  },
  horarioTrabalho: {
    inicio: String,
    fim: String,
    diasDisponiveis: [Number] // 0-6 (domingo-sábado)
  },
  ativo: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Barbeiro', barbeiroSchema);
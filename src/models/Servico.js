const mongoose = require('mongoose');

const servicoSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: true
  },
  descricao: {
    type: String
  },
  preco: {
    type: Number,
    required: true
  },
  duracao: {
    type: Number, // duração em minutos
    required: true
  },
  imagem: {
    type: String
  },
  categoria: {
    type: String
  },
  ativo: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Servico', servicoSchema);
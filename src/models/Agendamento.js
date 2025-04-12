const mongoose = require('mongoose');

const agendamentoSchema = new mongoose.Schema({
  cliente: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Cliente',
    required: true
  },
  barbeiro: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Barbeiro',
    required: true
  },
  servicos: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Servico',
    required: true
  }],
  data: {
    type: Date,
    required: true
  },
  horario: {
    type: String,
    required: true
  },
  duracao: {
    type: Number, // duração total em minutos
    required: true
  },
  precoTotal: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['agendado', 'confirmado', 'cancelado', 'concluido'],
    default: 'agendado'
  },
  notasCliente: {
    type: String
  },
  notasBarbeiro: {
    type: String
  },
  avaliacao: {
    nota: Number, // 1-5
    comentario: String
  }
}, { timestamps: true });

module.exports = mongoose.model('Agendamento', agendamentoSchema);
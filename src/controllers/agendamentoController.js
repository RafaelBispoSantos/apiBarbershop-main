const Agendamento = require('../models/Agendamento');
const Cliente = require('../models/Cliente');
const Servico = require('../models/Servico');

exports.criarAgendamento = async (req, res) => {
  try {
    const { cliente: clienteId, barbeiro, servicos, data, horario } = req.body;
    
    // Verificar se os serviços existem e calcular preço total e duração
    const servicosEncontrados = await Servico.find({
      _id: { $in: servicos },
      ativo: true
    });
    
    if (servicosEncontrados.length !== servicos.length) {
      return res.status(400).json({
        status: 'error',
        message: 'Um ou mais serviços não foram encontrados ou estão inativos'
      });
    }
    
    const precoTotal = servicosEncontrados.reduce((total, servico) => total + servico.preco, 0);
    const duracaoTotal = servicosEncontrados.reduce((total, servico) => total + servico.duracao, 0);
    
    // Criar o agendamento
    const novoAgendamento = new Agendamento({
      cliente: clienteId,
      barbeiro,
      servicos,
      data,
      horario,
      duracao: duracaoTotal,
      precoTotal
    });
    
    const agendamento = await novoAgendamento.save();
    
    // Adicionar o agendamento ao histórico do cliente
    await Cliente.findByIdAndUpdate(
      clienteId,
      { $push: { historicoAgendamentos: agendamento._id } }
    );
    
    res.status(201).json({
      status: 'success',
      data: agendamento
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};

exports.listarAgendamentos = async (req, res) => {
  try {
    const { barbeiro, cliente, data, status } = req.query;
    const filtro = {};
    
    if (barbeiro) filtro.barbeiro = barbeiro;
    if (cliente) filtro.cliente = cliente;
    if (status) filtro.status = status;
    
    if (data) {
      // Filtrar por data específica
      filtro.data = {
        $gte: new Date(new Date(data).setHours(0, 0, 0)),
        $lt: new Date(new Date(data).setHours(23, 59, 59))
      };
    }
    
    const agendamentos = await Agendamento.find(filtro)
      .populate('cliente', 'nome email telefone fotoPerfil')
      .populate('barbeiro', 'nome especialidades fotoPerfil')
      .populate('servicos', 'nome preco duracao');
    
    res.status(200).json({
      status: 'success',
      results: agendamentos.length,
      data: agendamentos
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

exports.obterAgendamento = async (req, res) => {
  try {
    const agendamento = await Agendamento.findById(req.params.id)
      .populate('cliente', 'nome email telefone fotoPerfil')
      .populate('barbeiro', 'nome especialidades fotoPerfil')
      .populate('servicos', 'nome preco duracao');
    
    if (!agendamento) {
      return res.status(404).json({
        status: 'error',
        message: 'Agendamento não encontrado'
      });
    }
    
    res.status(200).json({
      status: 'success',
      data: agendamento
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

exports.atualizarStatusAgendamento = async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!['agendado', 'confirmado', 'cancelado', 'concluido'].includes(status)) {
      return res.status(400).json({
        status: 'error',
        message: 'Status inválido'
      });
    }
    
    const agendamento = await Agendamento.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );
    
    if (!agendamento) {
      return res.status(404).json({
        status: 'error',
        message: 'Agendamento não encontrado'
      });
    }
    
    res.status(200).json({
      status: 'success',
      data: agendamento
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};

exports.adicionarAvaliacao = async (req, res) => {
  try {
    const { nota, comentario } = req.body;
    
    if (nota < 1 || nota > 5) {
      return res.status(400).json({
        status: 'error',
        message: 'A nota deve estar entre 1 e 5'
      });
    }
    
    const agendamento = await Agendamento.findByIdAndUpdate(
      req.params.id,
      { avaliacao: { nota, comentario } },
      { new: true, runValidators: true }
    );
    
    if (!agendamento) {
      return res.status(404).json({
        status: 'error',
        message: 'Agendamento não encontrado'
      });
    }
    
    res.status(200).json({
      status: 'success',
      data: agendamento
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};
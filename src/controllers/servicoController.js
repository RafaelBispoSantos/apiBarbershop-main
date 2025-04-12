const Servico = require('../models/Servico');

exports.criarServico = async (req, res) => {
  try {
    const novoServico = new Servico(req.body);
    const servico = await novoServico.save();
    res.status(201).json({
      status: 'success',
      data: servico
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};

exports.listarServicos = async (req, res) => {
  try {
    const servicos = await Servico.find({ ativo: true });
    res.status(200).json({
      status: 'success',
      results: servicos.length,
      data: servicos
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

exports.obterServico = async (req, res) => {
  try {
    const servico = await Servico.findById(req.params.id);
    if (!servico) {
      return res.status(404).json({
        status: 'error',
        message: 'Serviço não encontrado'
      });
    }
    res.status(200).json({
      status: 'success',
      data: servico
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

exports.atualizarServico = async (req, res) => {
  try {
    const servico = await Servico.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!servico) {
      return res.status(404).json({
        status: 'error',
        message: 'Serviço não encontrado'
      });
    }
    
    res.status(200).json({
      status: 'success',
      data: servico
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};

exports.excluirServico = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Encontrar e excluir o serviço
    const servico = await Servico.findByIdAndDelete(id);
    
    if (!servico) {
      return res.status(404).json({ 
        status: 'error',
        message: 'Serviço não encontrado'
      });
    }
    
    res.status(200).json({ 
      status: 'success',
      message: 'Serviço excluído com sucesso' 
    });
  } catch (error) {
    console.error('Erro ao excluir serviço:', error);
    res.status(500).json({
      status: 'error',
      message: 'Erro ao excluir serviço',
      error: error.message
    });
  }
};
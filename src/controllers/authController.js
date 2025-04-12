const Cliente = require('../models/Cliente');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Buscar usuário pelo email
    const cliente = await Cliente.findOne({ email });
    
    if (!cliente) {
      return res.status(401).json({
        status: 'error',
        message: 'Email ou senha incorretos'
      });
    }
    
    // Verificar a senha (assumindo que você armazena senhas com hash)
    const senhaCorreta = await bcrypt.compare(password, cliente.password);
    
    if (!senhaCorreta) {
      return res.status(401).json({
        status: 'error',
        message: 'Email ou senha incorretos'
      });
    }
    
    // Gerar token JWT
    const token = jwt.sign(
      { id: cliente._id }, 
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );
    
    // Remover a senha antes de enviar a resposta
    const clienteSemSenha = { ...cliente.toObject() };
    delete clienteSemSenha.password;
    
    res.status(200).json({
        status: 'success',
        token,
        user: {
          ...clienteSemSenha,
          isAdmin: cliente.isAdmin || false
        }
      });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

exports.register = async (req, res) => {
  try {
    // Verificar se este email já está em uso
    const existeEmail = await Cliente.findOne({ email: req.body.email });
    if (existeEmail) {
      return res.status(400).json({
        status: 'error',
        message: 'Este email já está em uso'
      });
    }
    
    // Hash da senha antes de salvar
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    
    // Criar novo cliente com senha hasheada
    const novoCliente = new Cliente({
      ...req.body,
      password: hashedPassword
    });
    
    const cliente = await novoCliente.save();
    
    // Remover a senha antes de enviar a resposta
    const clienteSemSenha = { ...cliente.toObject() };
    delete clienteSemSenha.password;
    
    // Gerar token JWT
    const token = jwt.sign(
      { id: cliente._id }, 
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );
    
    res.status(201).json({
      status: 'success',
      token,
      user: clienteSemSenha
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};
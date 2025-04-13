const Usuario = require('../models/Usuario');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

exports.login = async (req, res) => {
  try {
    const { email, password, estabelecimentoUrl } = req.body;
    
    // Buscar usuário pelo email
    const usuario = await Usuario.findOne({ email });
    
    if (!usuario) {
      return res.status(401).json({
        status: 'error',
        message: 'Email ou senha incorretos'
      });
    }
    
    // Verificar a senha
    const senhaCorreta = await usuario.verificarSenha(password);
    
    if (!senhaCorreta) {
      return res.status(401).json({
        status: 'error',
        message: 'Email ou senha incorretos'
      });
    }

    // Se tem url de estabelecimento, verificar se o usuário pertence a esse estabelecimento
    if (estabelecimentoUrl) {
      const Estabelecimento = require('../models/Estabelecimento');
      const estabelecimento = await Estabelecimento.findOne({ urlPersonalizada: estabelecimentoUrl });
      
      if (!estabelecimento) {
        return res.status(404).json({
          status: 'error',
          message: 'Estabelecimento não encontrado'
        });
      }
      
      // Verificar relação do usuário com o estabelecimento
      if (usuario.tipo === 'cliente') {
        // Clientes podem acessar qualquer estabelecimento
      } else if (!usuario.estabelecimento || usuario.estabelecimento.toString() !== estabelecimento._id.toString()) {
        return res.status(403).json({
          status: 'error',
          message: 'Você não tem permissão para acessar este estabelecimento'
        });
      }
    }
    
    // Atualizar último login
    usuario.ultimoLogin = new Date();
    await usuario.save();
    
    // Gerar token JWT
    const token = jwt.sign(
      { 
        id: usuario._id,
        tipo: usuario.tipo,
        estabelecimento: usuario.estabelecimento 
      }, 
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );
    
    // Remover a senha antes de enviar a resposta
    const usuarioSemSenha = { ...usuario.toObject() };
    delete usuarioSemSenha.password;
    
    res.status(200).json({
      status: 'success',
      token,
      user: usuarioSemSenha
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
    const { email, password, nome, telefone, tipo, estabelecimentoUrl } = req.body;
    
    // Verificar se este email já está em uso
    const existeEmail = await Usuario.findOne({ email });
    if (existeEmail) {
      return res.status(400).json({
        status: 'error',
        message: 'Este email já está em uso'
      });
    }
    
    // Se estiver criando um barbeiro ou cliente para um estabelecimento específico
    let estabelecimentoId = null;
    if (estabelecimentoUrl) {
      const Estabelecimento = require('../models/Estabelecimento');
      const estabelecimento = await Estabelecimento.findOne({ urlPersonalizada: estabelecimentoUrl });
      
      if (!estabelecimento) {
        return res.status(404).json({
          status: 'error',
          message: 'Estabelecimento não encontrado'
        });
      }
      
      estabelecimentoId = estabelecimento._id;
    }
    
    // Hash da senha antes de salvar
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    // Criar novo usuário com senha hasheada
    const novoUsuario = new Usuario({
      nome,
      email,
      password: hashedPassword,
      telefone,
      tipo,
      estabelecimento: estabelecimentoId
    });
    
    const usuario = await novoUsuario.save();
    
    // Remover a senha antes de enviar a resposta
    const usuarioSemSenha = { ...usuario.toObject() };
    delete usuarioSemSenha.password;
    
    // Gerar token JWT
    const token = jwt.sign(
      { 
        id: usuario._id,
        tipo: usuario.tipo,
        estabelecimento: usuario.estabelecimento 
      }, 
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );
    
    res.status(201).json({
      status: 'success',
      token,
      user: usuarioSemSenha
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};

exports.registerEstabelecimento = async (req, res) => {
  try {
    const { 
      nomeEstabelecimento, 
      urlPersonalizada,
      email,
      password,
      nome,
      telefone
    } = req.body;
    
    // Verificar se este email já está em uso
    const existeEmail = await Usuario.findOne({ email });
    if (existeEmail) {
      return res.status(400).json({
        status: 'error',
        message: 'Este email já está em uso'
      });
    }
    
    // Verificar se a URL já está em uso
    const Estabelecimento = require('../models/Estabelecimento');
    const existeUrl = await Estabelecimento.findOne({ urlPersonalizada });
    if (existeUrl) {
      return res.status(400).json({
        status: 'error',
        message: 'Esta URL personalizada já está em uso'
      });
    }
    
    // Hash da senha antes de salvar
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    // 1. Criar o proprietário
    const novoProprietario = new Usuario({
      nome,
      email,
      password: hashedPassword,
      telefone,
      tipo: 'proprietario'
    });
    
    const proprietario = await novoProprietario.save();
    
    // 2. Criar o estabelecimento
    const novoEstabelecimento = new Estabelecimento({
      nome: nomeEstabelecimento,
      urlPersonalizada,
      proprietario: proprietario._id,
      contato: {
        telefone,
        email
      },
      assinatura: {
        plano: 'basico',
        status: 'trial',
        dataInicio: new Date(),
        dataRenovacao: new Date(new Date().setDate(new Date().getDate() + 15)) // 15 dias de trial
      }
    });
    
    const estabelecimento = await novoEstabelecimento.save();
    
    // 3. Atualizar o proprietário com a referência ao estabelecimento
    proprietario.estabelecimento = estabelecimento._id;
    await proprietario.save();
    
    // Remover a senha antes de enviar a resposta
    const proprietarioSemSenha = { ...proprietario.toObject() };
    delete proprietarioSemSenha.password;
    
    // Gerar token JWT
    const token = jwt.sign(
      { 
        id: proprietario._id,
        tipo: proprietario.tipo,
        estabelecimento: estabelecimento._id 
      }, 
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );
    
    res.status(201).json({
      status: 'success',
      token,
      user: proprietarioSemSenha,
      estabelecimento
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};
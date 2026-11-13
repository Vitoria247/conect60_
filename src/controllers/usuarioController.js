const prisma = require('../models/prismaClient');

// POST /api/usuarios
const cadastrar = async (req, res) => {
  try {
    // Só os campos permitidos entram (evita que alguém envie googleId ou pro pelo corpo)
    const { nome, email, telefone } = req.body;

    if (!nome || !String(nome).trim()) return res.status(400).json({ erro: 'O nome é obrigatório.' });
    if (!email || !String(email).trim()) return res.status(400).json({ erro: 'O e-mail é obrigatório.' });

    const novoUsuario = await prisma.usuario.create({
      data: {
        nome: String(nome).trim(),
        email: String(email).trim().toLowerCase(),
        telefone: telefone ? String(telefone).replace(/\D/g, '') : null
      }
    });
    return res.status(201).json(novoUsuario);
  } catch (error) {
    if (error.code === 'P2002') {
      return res.status(409).json({ erro: 'Já existe um usuário com este e-mail ou telefone.' });
    }
    console.error(error);
    return res.status(500).json({ erro: 'Erro ao cadastrar usuário.' });
  }
};

// GET /api/usuarios
const listar = async (req, res) => {
  try {
    const usuarios = await prisma.usuario.findMany({ omit: { googleId: true } });
    return res.status(200).json(usuarios);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ erro: 'Erro ao listar usuários.' });
  }
};

module.exports = { cadastrar, listar };

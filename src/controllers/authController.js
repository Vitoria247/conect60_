const { OAuth2Client } = require('google-auth-library');
const prisma = require('../models/prismaClient');

let oauth;
const cliente = () => (oauth = oauth || new OAuth2Client(process.env.GOOGLE_CLIENT_ID));

// GET /api/auth/config  -> o front pega o ID do cliente daqui (fica só no .env)
const config = (req, res) => {
  return res.status(200).json({ clientId: process.env.GOOGLE_CLIENT_ID || null });
};

// POST /api/auth/google
// 1) { credential }                         -> entra (200) ou pede para completar o cadastro (200, precisaCompletar)
// 2) { credential, telefone, perfil, ... }  -> cria a conta (201)
const google = async (req, res) => {
  try {
    const { credential, nome, telefone, perfil, crefito } = req.body;
    if (!credential) return res.status(400).json({ erro: 'Credencial do Google ausente.' });
    if (!process.env.GOOGLE_CLIENT_ID) return res.status(500).json({ erro: 'GOOGLE_CLIENT_ID não configurado no .env do servidor.' });

    // O servidor confere a assinatura do token com o Google (não confia no que o navegador diz)
    let p;
    try {
      const ticket = await cliente().verifyIdToken({ idToken: credential, audience: process.env.GOOGLE_CLIENT_ID });
      p = ticket.getPayload();
    } catch {
      return res.status(401).json({ erro: 'Login do Google inválido ou expirado. Tente de novo.' });
    }
    if (!p.email || !p.email_verified) return res.status(401).json({ erro: 'Sua conta Google precisa ter um e-mail verificado.' });

    // Já cadastrado com este Google: entra direto
    const existente = await prisma.usuario.findUnique({ where: { googleId: p.sub } });
    if (existente) return res.status(200).json({ usuario: existente });

    const email = p.email.toLowerCase();
    if (await prisma.usuario.findUnique({ where: { email } })) {
      return res.status(409).json({ erro: 'Já existe uma conta com este e-mail. Entre com telefone e senha.' });
    }

    const foto = /^https:\/\//.test(p.picture || '') ? p.picture.replace(/=s\d+-c$/, '=s256-c') : null;

    // Conta nova: falta o telefone e o tipo de perfil
    if (!telefone) {
      return res.status(200).json({ precisaCompletar: true, perfil: { nome: p.name || '', email: p.email, foto } });
    }

    const tel = String(telefone).replace(/\D/g, '');
    if (tel.length < 10 || tel.length > 13) return res.status(400).json({ erro: 'Digite um telefone válido, com DDD.' });
    if (await prisma.usuario.findUnique({ where: { telefone: tel } })) return res.status(409).json({ erro: 'Este telefone já tem cadastro.' });

    const pro = perfil === 'pro';
    if (pro && !String(crefito || '').trim()) return res.status(400).json({ erro: 'Informe o número do Crefito.' });

    const usuario = await prisma.usuario.create({
      data: {
        nome: String(nome || p.name || '').trim() || p.email,
        email,
        telefone: tel,
        googleId: p.sub,
        foto,
        pro,
        crefito: pro ? String(crefito).trim() : null
      }
    });
    return res.status(201).json({ usuario });
  } catch (error) {
    if (error.code === 'P2002') return res.status(409).json({ erro: 'Esta conta já está cadastrada.' });
    console.error(error);
    return res.status(500).json({ erro: 'Erro ao entrar com o Google.' });
  }
};

module.exports = { config, google };

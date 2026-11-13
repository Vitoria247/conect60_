require('dotenv').config();
const app = require('./app');
const prisma = require('./models/prismaClient');

const PORT = process.env.PORT || 3000;

prisma.$connect()
  .then(() => {
    console.log('MySQL conectado (Prisma)');
    app.listen(PORT, () => {
      console.log(`Servidor rodando na porta ${PORT}`);
    });
  })
  .catch(error => {
    console.error('Não foi possível conectar ao MySQL:', error.message);
    process.exit(1);
  });

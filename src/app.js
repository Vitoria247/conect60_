const path = require('path');
const express = require('express');
const usuarioRoutes = require('./routes/usuarioRoutes');
const authRoutes = require('./routes/authRoutes');

const app = express();

app.use(express.json());
app.use('/api', usuarioRoutes);
app.use('/api', authRoutes);

// Site (front-end) servido pelo mesmo servidor: http://localhost:3000
// Só estes arquivos são públicos (src/, .env e package.json NÃO ficam expostos)
const raiz = path.join(__dirname, '..');
app.get('/', (req, res) => res.sendFile(path.join(raiz, 'index.html')));
['index.html', 'script.js', 'style.css'].forEach(arq =>
  app.get('/' + arq, (req, res) => res.sendFile(path.join(raiz, arq)))
);
app.use('/imagens', express.static(path.join(raiz, 'imagens')));

module.exports = app;

const express = require('express');
const agentesRoutes = require('./routes/agentesRoutes');
const casosRoutes = require('./routes/casosRoutes');
const setupSwagger = require('./docs/swagger');

const app = express();
const PORT = 3000;

app.use(express.json());

setupSwagger(app);

app.use('/agentes', agentesRoutes);
app.use('/casos', casosRoutes);

app.get('/', (req, res) => {
    res.send('API do Departamento de Polícia está no ar! Acesse /docs para ver a documentação.');
});

app.listen(PORT, () => {
    console.log(`Servidor do Departamento de Polícia rodando em http://localhost:${PORT}`);
});

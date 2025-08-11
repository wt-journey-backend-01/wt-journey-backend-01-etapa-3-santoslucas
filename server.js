const express = require('express');
require('dotenv').config();

const agentesRoutes = require('./routes/agentesRoutes');
const casosRoutes = require('./routes/casosRoutes');
const { globalErrorHandler } = require('./utils/errorHandler');
const swaggerDocs = require('./docs/swagger');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use('/agentes', agentesRoutes);
app.use('/casos', casosRoutes);

swaggerDocs(app);

app.use(globalErrorHandler);

app.listen(PORT, () => {
    console.log(`Servidor do Departamento de Polícia rodando em http://localhost:${PORT}`);
});
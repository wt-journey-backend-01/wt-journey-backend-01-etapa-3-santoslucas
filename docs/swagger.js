const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'API do Departamento de Polícia',
    version: '1.0.0',
    description: 'Documentação da API RESTful para gerenciamento de casos e agentes da polícia.',
  },
  servers: [
    {
      url: 'http://localhost:3000',
      description: 'Servidor de Desenvolvimento',
    },
  ],
  tags: [
    {
      name: 'Agentes',
      description: 'API para gerenciamento de agentes'
    },
    {
      name: 'Casos',
      description: 'API para gerenciamento de casos policiais'
    }
  ],
  components: {
    schemas: {
      Agente: {
        type: 'object',
        required: ['nome', 'dataDeIncorporacao', 'cargo'],
        properties: {
          id: {
            type: 'string',
            description: 'The auto-generated ID for the agent.',
          },
          nome: {
            type: 'string',
            description: 'The name of the agent.',
          },
          dataDeIncorporacao: {
            type: 'string',
            format: 'date',
            description: 'The date the agent joined the force (YYYY-MM-DD).',
          },
          cargo: {
            type: 'string',
            description: 'The agent\'s position (e.g., inspector, delegate).',
          },
        },
        example: {
          id: "401bccf5-cf9e-489d-8412-446cd169a0f1",
          nome: "Rommel Carneiro",
          dataDeIncorporacao: "1992-10-04",
          cargo: "delegado"
        }
      },
      Caso: {
        type: 'object',
        required: ['titulo', 'descricao', 'status', 'agente_id'],
        properties: {
          id: {
            type: 'string',
            description: 'The auto-generated ID for the case.',
          },
          titulo: {
            type: 'string',
            description: 'The title of the case.',
          },
          descricao: {
            type: 'string',
            description: 'A detailed description of the case.',
          },
          status: {
            type: 'string',
            description: 'The status of the case.',
            enum: ['aberto', 'solucionado'],
          },
          agente_id: {
            type: 'string',
            description: 'The ID of the agent responsible for the case.',
          },
        },
        example: {
          id: "f5fb2ad5-22a8-4cb4-90f2-8733517a0d46",
          titulo: "homicidio na avenida principal",
          descricao: "Disparos foram reportados às 22:33...",
          status: "aberto",
          agente_id: "401bccf5-cf9e-489d-8412-446cd169a0f1"
        }
      }
    }
  }
};

const options = {
  swaggerDefinition,
  apis: ['./routes/*.js'],
};

const swaggerSpec = swaggerJSDoc(options);

const setupSwagger = (app) => {
  app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};

module.exports = setupSwagger;

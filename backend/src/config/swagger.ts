import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'SAIL - Sui AI Liquidity API',
      version: '1.0.0',
      description: 'API pour la plateforme SAIL - DeFi workflow builder avec encryption Walrus et gestion des données utilisateur on-chain',
      contact: {
        name: 'SAIL Team',
      },
    },
    servers: [
      {
        url: 'http://localhost:8000',
        description: 'Development server',
      },
    ],
    tags: [
      {
        name: 'Health',
        description: 'Health check endpoints',
      },
      {
        name: 'Simulation',
        description: 'Workflow simulation endpoints',
      },
      {
        name: 'Validation',
        description: 'Strategy validation endpoints',
      },
      {
        name: 'Build',
        description: 'Transaction building endpoints',
      },
      {
        name: 'Workflows',
        description: 'Marketplace workflow management (upload, list, purchase)',
      },
      {
        name: 'Seal',
        description: 'File encryption/decryption with Walrus storage',
      },
      {
        name: 'User Data',
        description: 'On-chain user data management (strategies, execution history)',
      },
      {
        name: 'Tokens',
        description: 'Supported tokens information',
      },
    ],
    components: {
      schemas: {
        Strategy: {
          type: 'object',
          properties: {
            id: { type: 'string', description: 'Strategy unique identifier' },
            meta: {
              type: 'object',
              properties: {
                name: { type: 'string' },
                description: { type: 'string' },
              },
            },
            nodes: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: { type: 'string' },
                  type: { type: 'string', enum: ['defi', 'condition', 'loop'] },
                  data: { type: 'object' },
                },
              },
            },
            edges: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  source: { type: 'string' },
                  target: { type: 'string' },
                },
              },
            },
          },
        },
        SavedStrategy: {
          type: 'object',
          properties: {
            id: { type: 'number' },
            name: { type: 'string' },
            description: { type: 'string' },
            strategyJson: { type: 'object' },
            createdAt: { type: 'number' },
            updatedAt: { type: 'number' },
          },
        },
        ExecutionEntry: {
          type: 'object',
          properties: {
            id: { type: 'number' },
            workflowName: { type: 'string' },
            workflowId: { type: 'string' },
            status: { type: 'string', enum: ['success', 'failed', 'pending'] },
            txDigest: { type: 'string' },
            timestamp: { type: 'number' },
            gasUsed: { type: 'number' },
            resultData: { type: 'object' },
          },
        },
        Error: {
          type: 'object',
          properties: {
            error: { type: 'string' },
            message: { type: 'string' },
          },
        },
      },
    },
  },
  apis: ['./src/api/routes/swagger-annotations.ts', './src/api/server.ts'],
};

export const swaggerSpec = swaggerJsdoc(options);

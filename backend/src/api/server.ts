
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from '../config/swagger';
import simulationRoutes from './routes/simulation';
import validateRoutes from './routes/validate';
import sealRoutes from './routes/seal';
import workflowsRoutes from './routes/workflows';
import buildRoutes from './routes/build';
import userdataRoutes from './routes/userdata';

const app = express();
const port = process.env.PORT || 8000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Swagger Documentation
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'SAIL API Documentation',
}));

// Swagger JSON
app.get('/docs.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

// Routes
app.use('/api', simulationRoutes);
app.use('/api', validateRoutes);
app.use('/api', sealRoutes);
app.use('/api', workflowsRoutes);
app.use('/api', buildRoutes);
app.use('/api/userdata', userdataRoutes);

/**
 * @swagger
 * /api/health:
 *   get:
 *     tags: [Health]
 *     summary: Health check endpoint
 *     description: Returns the health status of the API
 *     responses:
 *       200:
 *         description: API is healthy
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: ok
 */
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Get Supported Tokens (Testnet for now)
import { getAddresses, PoolConfig } from '../config/addresses';

/**
 * @swagger
 * /api/tokens:
 *   get:
 *     tags: [Tokens]
 *     summary: Get supported tokens
 *     description: Returns a list of all supported tokens from NAVI protocol
 *     responses:
 *       200:
 *         description: List of supported tokens
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               additionalProperties:
 *                 type: string
 *               example:
 *                 SUI: "0x..."
 *                 USDC: "0x..."
 */
app.get('/api/tokens', (req, res) => {
  const tokens: Record<string, string> = {};

  // Extract tokens from NAVI Pools config
  const addresses = getAddresses();
  Object.entries(addresses.NAVI.POOLS).forEach(([address, pool]) => {
    const poolConfig = pool as PoolConfig;
    tokens[poolConfig.name] = address;
  });

  console.log(`[API] Returning ${Object.keys(tokens).length} tokens:`, Object.keys(tokens));
  res.json(tokens);
});

// Start server
app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
});


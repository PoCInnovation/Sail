
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import simulationRoutes from './routes/simulation';
import validateRoutes from './routes/validate';
import sealRoutes from './routes/seal';

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use('/api', simulationRoutes);
app.use('/api', validateRoutes);
app.use('/api', sealRoutes);

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Start server
app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
});


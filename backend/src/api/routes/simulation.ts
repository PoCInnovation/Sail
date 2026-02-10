
import { Router, Request, Response } from 'express';
import { Simulator } from '../../core/simulator';
import { Strategy } from '../../types/strategy';

const router: Router = Router();

// Initialize simulator with Mainnet (default)
// Can be overridden per request via query param
const defaultSimulator = new Simulator('mainnet');

router.post('/simulate', async (req: Request, res: Response): Promise<void> => {
  try {
    const { strategy, sender } = req.body;

    if (!strategy || !sender) {
      res.status(400).json({ 
        success: false, 
        error: 'Missing strategy or sender in request body' 
      });
      return;
    }

    // Get network from query param or env, default to mainnet
    const network = (req.query.network as string) || process.env.SUI_NETWORK || 'mainnet';
    const simulator = network === 'testnet' ? new Simulator('testnet') : defaultSimulator;

    // Run simulation
    const result = await simulator.simulate(strategy as Strategy, sender);

    res.json(result);
  } catch (error: any) {
    console.error('Simulation error:', error);
    res.status(500).json({
      success: false,
      estimated_gas: 0,
      estimated_profit_loss: [],
      errors: [{
        rule_id: 'api_error',
        severity: 'ERROR',
        message: error.message || 'Internal server error'
      }]
    });
  }
});

export default router;

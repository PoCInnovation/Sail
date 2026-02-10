import express, { Request, Response, Router } from 'express';
import { UserDataService } from '../../services/UserDataService';
import { getSuiClient } from '../../services/SuiClientService';

const router: Router = express.Router();
const suiClient = getSuiClient();
const userDataService = new UserDataService(suiClient);

/**
 * POST /api/userdata/create-storage
 * Build transaction to create UserDataStorage object
 */
router.post('/create-storage', async (req: Request, res: Response) => {
  try {
    const { userAddress } = req.body;

    if (!userAddress) {
      return res.status(400).json({ error: 'userAddress is required' });
    }

    const txBytes = await userDataService.buildCreateStorageTransaction(userAddress);
    const serializedTx = Array.from(txBytes);

    res.json({ transactionBytes: serializedTx });
  } catch (error: any) {
    console.error('Error building create storage transaction:', error);
    res.status(500).json({ error: error.message || 'Failed to build transaction' });
  }
});

/**
 * GET /api/userdata/storage/:address
 * Get user's storage object ID
 */
router.get('/storage/:address', async (req: Request, res: Response) => {
  try {
    const { address } = req.params;
    const storageObjectId = await userDataService.getUserStorageObjectId(address);

    if (!storageObjectId) {
      return res.json({ storageObjectId: null, exists: false });
    }

    res.json({ storageObjectId, exists: true });
  } catch (error: any) {
    console.error('Error getting storage object:', error);
    res.status(500).json({ error: error.message || 'Failed to get storage object' });
  }
});

/**
 * POST /api/userdata/save-strategy
 * Build transaction to save a new strategy
 */
router.post('/save-strategy', async (req: Request, res: Response) => {
  try {
    const { userAddress, storageObjectId, name, description, strategyJson } = req.body;

    if (!userAddress || !storageObjectId || !name || !strategyJson) {
      return res.status(400).json({
        error: 'userAddress, storageObjectId, name, and strategyJson are required',
      });
    }

    const txBytes = await userDataService.buildSaveStrategyTransaction(
      userAddress,
      storageObjectId,
      name,
      description || '',
      JSON.stringify(strategyJson)
    );

    const serializedTx = Array.from(txBytes);
    res.json({ transactionBytes: serializedTx });
  } catch (error: any) {
    console.error('Error building save strategy transaction:', error);
    res.status(500).json({ error: error.message || 'Failed to build transaction' });
  }
});

/**
 * POST /api/userdata/update-strategy
 * Build transaction to update existing strategy
 */
router.post('/update-strategy', async (req: Request, res: Response) => {
  try {
    const { userAddress, storageObjectId, strategyId, name, description, strategyJson } = req.body;

    if (!userAddress || !storageObjectId || strategyId === undefined || !name || !strategyJson) {
      return res.status(400).json({
        error: 'userAddress, storageObjectId, strategyId, name, and strategyJson are required',
      });
    }

    const txBytes = await userDataService.buildUpdateStrategyTransaction(
      userAddress,
      storageObjectId,
      strategyId,
      name,
      description || '',
      JSON.stringify(strategyJson)
    );

    const serializedTx = Array.from(txBytes);
    res.json({ transactionBytes: serializedTx });
  } catch (error: any) {
    console.error('Error building update strategy transaction:', error);
    res.status(500).json({ error: error.message || 'Failed to build transaction' });
  }
});

/**
 * POST /api/userdata/delete-strategy
 * Build transaction to delete a strategy
 */
router.post('/delete-strategy', async (req: Request, res: Response) => {
  try {
    const { userAddress, storageObjectId, strategyId } = req.body;

    if (!userAddress || !storageObjectId || strategyId === undefined) {
      return res.status(400).json({
        error: 'userAddress, storageObjectId, and strategyId are required',
      });
    }

    const txBytes = await userDataService.buildDeleteStrategyTransaction(
      userAddress,
      storageObjectId,
      strategyId
    );

    const serializedTx = Array.from(txBytes);
    res.json({ transactionBytes: serializedTx });
  } catch (error: any) {
    console.error('Error building delete strategy transaction:', error);
    res.status(500).json({ error: error.message || 'Failed to build transaction' });
  }
});

/**
 * POST /api/userdata/record-execution
 * Build transaction to record a workflow execution
 */
router.post('/record-execution', async (req: Request, res: Response) => {
  try {
    const {
      userAddress,
      storageObjectId,
      workflowName,
      workflowId,
      status,
      txDigest,
      gasUsed,
      resultData,
    } = req.body;

    if (!userAddress || !storageObjectId || !workflowName || !status || !txDigest) {
      return res.status(400).json({
        error: 'userAddress, storageObjectId, workflowName, status, and txDigest are required',
      });
    }

    const txBytes = await userDataService.buildRecordExecutionTransaction(
      userAddress,
      storageObjectId,
      workflowName,
      workflowId || '',
      status,
      txDigest,
      gasUsed || 0,
      JSON.stringify(resultData || {})
    );

    const serializedTx = Array.from(txBytes);
    res.json({ transactionBytes: serializedTx });
  } catch (error: any) {
    console.error('Error building record execution transaction:', error);
    res.status(500).json({ error: error.message || 'Failed to build transaction' });
  }
});

/**
 * POST /api/userdata/clear-history
 * Build transaction to clear execution history
 */
router.post('/clear-history', async (req: Request, res: Response) => {
  try {
    const { userAddress, storageObjectId } = req.body;

    if (!userAddress || !storageObjectId) {
      return res.status(400).json({
        error: 'userAddress and storageObjectId are required',
      });
    }

    const txBytes = await userDataService.buildClearHistoryTransaction(userAddress, storageObjectId);

    const serializedTx = Array.from(txBytes);
    res.json({ transactionBytes: serializedTx });
  } catch (error: any) {
    console.error('Error building clear history transaction:', error);
    res.status(500).json({ error: error.message || 'Failed to build transaction' });
  }
});

/**
 * GET /api/userdata/strategies/:storageObjectId
 * Get all saved strategies for a user
 */
router.get('/strategies/:storageObjectId', async (req: Request, res: Response) => {
  try {
    const { storageObjectId } = req.params;
    const strategies = await userDataService.getUserStrategies(storageObjectId);

    res.json({ strategies });
  } catch (error: any) {
    console.error('Error getting strategies:', error);
    res.status(500).json({ error: error.message || 'Failed to get strategies' });
  }
});

/**
 * GET /api/userdata/strategy/:storageObjectId/:strategyId
 * Get a specific strategy by ID
 */
router.get('/strategy/:storageObjectId/:strategyId', async (req: Request, res: Response) => {
  try {
    const { storageObjectId, strategyId } = req.params;
    const strategy = await userDataService.getStrategy(storageObjectId, parseInt(strategyId));

    if (!strategy) {
      return res.status(404).json({ error: 'Strategy not found' });
    }

    res.json({ strategy });
  } catch (error: any) {
    console.error('Error getting strategy:', error);
    res.status(500).json({ error: error.message || 'Failed to get strategy' });
  }
});

/**
 * GET /api/userdata/history/:storageObjectId
 * Get execution history for a user
 */
router.get('/history/:storageObjectId', async (req: Request, res: Response) => {
  try {
    const { storageObjectId } = req.params;
    const history = await userDataService.getUserExecutionHistory(storageObjectId);

    res.json({ history });
  } catch (error: any) {
    console.error('Error getting execution history:', error);
    res.status(500).json({ error: error.message || 'Failed to get execution history' });
  }
});

export default router;

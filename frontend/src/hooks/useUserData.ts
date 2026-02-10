import { useState, useCallback, useEffect } from 'react';
import { useCurrentAccount, useSignTransaction, useSuiClient } from '@mysten/dapp-kit';
import { Transaction } from '@mysten/sui/transactions';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

interface SavedStrategy {
  id: number;
  name: string;
  description: string;
  strategyJson: any;
  createdAt: number;
  updatedAt: number;
}

interface ExecutionEntry {
  id: number;
  workflowName: string;
  workflowId: string;
  status: string;
  txDigest: string;
  timestamp: number;
  gasUsed: number;
  resultData: any;
}

/**
 * Hook to interact with the user_data smart contract
 * Replaces localStorage usage for decentralized data storage
 */
export function useUserData() {
  const account = useCurrentAccount();
  const { mutateAsync: signTransaction } = useSignTransaction();
  const suiClient = useSuiClient();

  const [storageObjectId, setStorageObjectId] = useState<string | null>(null);
  const [isLoadingStorage, setIsLoadingStorage] = useState(false);
  const [strategies, setStrategies] = useState<SavedStrategy[]>([]);
  const [executionHistory, setExecutionHistory] = useState<ExecutionEntry[]>([]);

  /**
   * Check if user has a storage object and get its ID
   */
  const checkUserStorage = useCallback(async () => {
    if (!account?.address) return null;

    setIsLoadingStorage(true);
    try {
      const response = await fetch(`${API_URL}/api/userdata/storage/${account.address}`);
      const data = await response.json();

      if (data.exists && data.storageObjectId) {
        setStorageObjectId(data.storageObjectId);
        return data.storageObjectId;
      }
      return null;
    } catch (error) {
      console.error('Error checking user storage:', error);
      return null;
    } finally {
      setIsLoadingStorage(false);
    }
  }, [account?.address]);

  /**
   * Create a new storage object for the user
   */
  const createStorage = useCallback(async () => {
    if (!account?.address) {
      throw new Error('No wallet connected');
    }

    try {
      // 1. Build transaction
      const response = await fetch(`${API_URL}/api/userdata/create-storage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userAddress: account.address }),
      });

      if (!response.ok) {
        throw new Error('Failed to build transaction');
      }

      const { transactionBytes } = await response.json();
      const txBytes = new Uint8Array(transactionBytes);

      // 2. Sign transaction
      const transaction = Transaction.from(txBytes);
      const signedTx = await signTransaction({ transaction });

      // 3. Execute transaction
      const result = await suiClient.executeTransactionBlock({
        transactionBlock: signedTx.bytes,
        signature: signedTx.signature,
        options: {
          showEffects: true,
          showObjectChanges: true,
        },
      });

      // 4. Extract storage object ID from created objects
      const createdObjects = result.objectChanges?.filter(
        (change: any) => change.type === 'created'
      );
      const storageObject = createdObjects?.find((obj: any) =>
        obj.objectType?.includes('::user_data::UserDataStorage')
      );

      if (storageObject && 'objectId' in storageObject) {
        setStorageObjectId(storageObject.objectId);
        return storageObject.objectId;
      }

      throw new Error('Failed to create storage object');
    } catch (error) {
      console.error('Error creating storage:', error);
      throw error;
    }
  }, [account?.address, signTransaction, suiClient]);

  /**
   * Ensure storage exists, create if not
   */
  const ensureStorage = useCallback(async () => {
    let objectId = storageObjectId;

    if (!objectId) {
      objectId = await checkUserStorage();
    }

    if (!objectId) {
      objectId = await createStorage();
    }

    return objectId;
  }, [storageObjectId, checkUserStorage, createStorage]);

  /**
   * Save a new strategy
   */
  const saveStrategy = useCallback(
    async (name: string, description: string, strategyJson: any) => {
      if (!account?.address) {
        throw new Error('No wallet connected');
      }

      const objectId = await ensureStorage();

      try {
        // 1. Build transaction
        const response = await fetch(`${API_URL}/api/userdata/save-strategy`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userAddress: account.address,
            storageObjectId: objectId,
            name,
            description,
            strategyJson,
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to build transaction');
        }

        const { transactionBytes } = await response.json();
        const txBytes = new Uint8Array(transactionBytes);

        // 2. Sign transaction
        const transaction = Transaction.from(txBytes);
        const signedTx = await signTransaction({ transaction });

        // 3. Execute transaction
        const result = await suiClient.executeTransactionBlock({
          transactionBlock: signedTx.bytes,
          signature: signedTx.signature,
          options: {
            showEffects: true,
            showEvents: true,
          },
        });

        // Refresh strategies list
        await loadStrategies();

        return result.digest;
      } catch (error) {
        console.error('Error saving strategy:', error);
        throw error;
      }
    },
    [account?.address, ensureStorage, signTransaction, suiClient]
  );

  /**
   * Delete a strategy
   */
  const deleteStrategy = useCallback(
    async (strategyId: number) => {
      if (!account?.address || !storageObjectId) {
        throw new Error('No wallet connected or storage not initialized');
      }

      try {
        // 1. Build transaction
        const response = await fetch(`${API_URL}/api/userdata/delete-strategy`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userAddress: account.address,
            storageObjectId,
            strategyId,
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to build transaction');
        }

        const { transactionBytes } = await response.json();
        const txBytes = new Uint8Array(transactionBytes);

        // 2. Sign transaction
        const transaction = Transaction.from(txBytes);
        const signedTx = await signTransaction({ transaction });

        // 3. Execute transaction
        const result = await suiClient.executeTransactionBlock({
          transactionBlock: signedTx.bytes,
          signature: signedTx.signature,
          options: {
            showEffects: true,
          },
        });

        // Refresh strategies list
        await loadStrategies();

        return result.digest;
      } catch (error) {
        console.error('Error deleting strategy:', error);
        throw error;
      }
    },
    [account?.address, storageObjectId, signTransaction, suiClient]
  );

  /**
   * Record a workflow execution
   */
  const recordExecution = useCallback(
    async (
      workflowName: string,
      workflowId: string,
      status: string,
      txDigest: string,
      gasUsed: number,
      resultData: any
    ) => {
      if (!account?.address) {
        throw new Error('No wallet connected');
      }

      const objectId = await ensureStorage();

      try {
        // 1. Build transaction
        const response = await fetch(`${API_URL}/api/userdata/record-execution`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userAddress: account.address,
            storageObjectId: objectId,
            workflowName,
            workflowId,
            status,
            txDigest,
            gasUsed,
            resultData,
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to build transaction');
        }

        const { transactionBytes } = await response.json();
        const txBytes = new Uint8Array(transactionBytes);

        // 2. Sign transaction
        const transaction = Transaction.from(txBytes);
        const signedTx = await signTransaction({ transaction });

        // 3. Execute transaction
        const result = await suiClient.executeTransactionBlock({
          transactionBlock: signedTx.bytes,
          signature: signedTx.signature,
          options: {
            showEffects: true,
          },
        });

        // Refresh history
        await loadExecutionHistory();

        return result.digest;
      } catch (error) {
        console.error('Error recording execution:', error);
        throw error;
      }
    },
    [account?.address, ensureStorage, signTransaction, suiClient]
  );

  /**
   * Clear execution history
   */
  const clearExecutionHistory = useCallback(async () => {
    if (!account?.address || !storageObjectId) {
      throw new Error('No wallet connected or storage not initialized');
    }

    try {
      // 1. Build transaction
      const response = await fetch(`${API_URL}/api/userdata/clear-history`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userAddress: account.address,
          storageObjectId,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to build transaction');
      }

      const { transactionBytes } = await response.json();
      const txBytes = new Uint8Array(transactionBytes);

      // 2. Sign transaction
      const transaction = Transaction.from(txBytes);
      const signedTx = await signTransaction({ transaction });

      // 3. Execute transaction
      const result = await suiClient.executeTransactionBlock({
        transactionBlock: signedTx.bytes,
        signature: signedTx.signature,
        options: {
          showEffects: true,
        },
      });

      // Clear local state
      setExecutionHistory([]);

      return result.digest;
    } catch (error) {
      console.error('Error clearing history:', error);
      throw error;
    }
  }, [account?.address, storageObjectId, signTransaction, suiClient]);

  /**
   * Load all strategies from smart contract
   */
  const loadStrategies = useCallback(async () => {
    if (!storageObjectId) return;

    try {
      const response = await fetch(`${API_URL}/api/userdata/strategies/${storageObjectId}`);
      const data = await response.json();
      setStrategies(data.strategies || []);
    } catch (error) {
      console.error('Error loading strategies:', error);
    }
  }, [storageObjectId]);

  /**
   * Load execution history from smart contract
   */
  const loadExecutionHistory = useCallback(async () => {
    if (!storageObjectId) return;

    try {
      const response = await fetch(`${API_URL}/api/userdata/history/${storageObjectId}`);
      const data = await response.json();
      setExecutionHistory(data.history || []);
    } catch (error) {
      console.error('Error loading execution history:', error);
    }
  }, [storageObjectId]);

  // Auto-check storage on mount and account change
  useEffect(() => {
    if (account?.address) {
      checkUserStorage();
    } else {
      setStorageObjectId(null);
      setStrategies([]);
      setExecutionHistory([]);
    }
  }, [account?.address, checkUserStorage]);

  // Auto-load data when storage is available
  useEffect(() => {
    if (storageObjectId) {
      loadStrategies();
      loadExecutionHistory();
    }
  }, [storageObjectId, loadStrategies, loadExecutionHistory]);

  return {
    // State
    storageObjectId,
    isLoadingStorage,
    strategies,
    executionHistory,

    // Actions
    createStorage,
    ensureStorage,
    saveStrategy,
    deleteStrategy,
    recordExecution,
    clearExecutionHistory,
    loadStrategies,
    loadExecutionHistory,
  };
}

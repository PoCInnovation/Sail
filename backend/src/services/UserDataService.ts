import { SuiClient } from '@mysten/sui/client';
import { Transaction } from '@mysten/sui/transactions';
import { getAdminSigner, PACKAGE_ID } from '../config/admin';

/**
 * Service to interact with the user_data smart contract
 * Replaces localStorage usage for decentralized data storage
 */
export class UserDataService {
  private suiClient: SuiClient;

  constructor(suiClient: SuiClient) {
    this.suiClient = suiClient;
  }

  /**
   * Build transaction to create a new UserDataStorage object for a user
   */
  async buildCreateStorageTransaction(userAddress: string): Promise<Uint8Array> {
    const tx = new Transaction();
    tx.setSender(userAddress);

    tx.moveCall({
      target: `${PACKAGE_ID}::user_data::create_storage`,
      arguments: [],
    });

    const txBytes = await tx.build({ client: this.suiClient });
    return txBytes;
  }

  /**
   * Build transaction to save a new strategy
   */
  async buildSaveStrategyTransaction(
    userAddress: string,
    storageObjectId: string,
    name: string,
    description: string,
    strategyJson: string
  ): Promise<Uint8Array> {
    const tx = new Transaction();
    tx.setSender(userAddress);

    tx.moveCall({
      target: `${PACKAGE_ID}::user_data::save_strategy`,
      arguments: [
        tx.object(storageObjectId),
        tx.pure.string(name),
        tx.pure.string(description),
        tx.pure.string(strategyJson),
      ],
    });

    const txBytes = await tx.build({ client: this.suiClient });
    return txBytes;
  }

  /**
   * Build transaction to update existing strategy
   */
  async buildUpdateStrategyTransaction(
    userAddress: string,
    storageObjectId: string,
    strategyId: number,
    name: string,
    description: string,
    strategyJson: string
  ): Promise<Uint8Array> {
    const tx = new Transaction();
    tx.setSender(userAddress);

    tx.moveCall({
      target: `${PACKAGE_ID}::user_data::update_strategy`,
      arguments: [
        tx.object(storageObjectId),
        tx.pure.u64(strategyId),
        tx.pure.string(name),
        tx.pure.string(description),
        tx.pure.string(strategyJson),
      ],
    });

    const txBytes = await tx.build({ client: this.suiClient });
    return txBytes;
  }

  /**
   * Build transaction to delete a strategy
   */
  async buildDeleteStrategyTransaction(
    userAddress: string,
    storageObjectId: string,
    strategyId: number
  ): Promise<Uint8Array> {
    const tx = new Transaction();
    tx.setSender(userAddress);

    tx.moveCall({
      target: `${PACKAGE_ID}::user_data::delete_strategy`,
      arguments: [
        tx.object(storageObjectId),
        tx.pure.u64(strategyId),
      ],
    });

    const txBytes = await tx.build({ client: this.suiClient });
    return txBytes;
  }

  /**
   * Build transaction to record a workflow execution
   */
  async buildRecordExecutionTransaction(
    userAddress: string,
    storageObjectId: string,
    workflowName: string,
    workflowId: string,
    status: string,
    txDigest: string,
    gasUsed: number,
    resultData: string
  ): Promise<Uint8Array> {
    const tx = new Transaction();
    tx.setSender(userAddress);

    tx.moveCall({
      target: `${PACKAGE_ID}::user_data::record_execution`,
      arguments: [
        tx.object(storageObjectId),
        tx.pure.string(workflowName),
        tx.pure.string(workflowId),
        tx.pure.string(status),
        tx.pure.string(txDigest),
        tx.pure.u64(gasUsed),
        tx.pure.string(resultData),
      ],
    });

    const txBytes = await tx.build({ client: this.suiClient });
    return txBytes;
  }

  /**
   * Build transaction to clear execution history
   */
  async buildClearHistoryTransaction(
    userAddress: string,
    storageObjectId: string
  ): Promise<Uint8Array> {
    const tx = new Transaction();
    tx.setSender(userAddress);

    tx.moveCall({
      target: `${PACKAGE_ID}::user_data::clear_execution_history`,
      arguments: [tx.object(storageObjectId)],
    });

    const txBytes = await tx.build({ client: this.suiClient });
    return txBytes;
  }

  /**
   * Get user's storage object ID by querying owned objects
   */
  async getUserStorageObjectId(userAddress: string): Promise<string | null> {
    try {
      const ownedObjects = await this.suiClient.getOwnedObjects({
        owner: userAddress,
        filter: {
          StructType: `${PACKAGE_ID}::user_data::UserDataStorage`,
        },
        options: {
          showContent: true,
          showType: true,
        },
      });

      if (ownedObjects.data.length === 0) {
        return null;
      }

      // Return the first storage object (users should only have one)
      return ownedObjects.data[0].data?.objectId || null;
    } catch (error) {
      console.error('Error getting user storage object:', error);
      return null;
    }
  }

  /**
   * Get all saved strategies for a user
   */
  async getUserStrategies(storageObjectId: string): Promise<any[]> {
    try {
      const storageObject = await this.suiClient.getObject({
        id: storageObjectId,
        options: {
          showContent: true,
        },
      });

      if (storageObject.data?.content?.dataType !== 'moveObject') {
        return [];
      }

      const fields = (storageObject.data.content as any).fields;
      const strategyCounter = parseInt(fields.strategy_counter || '0');
      const savedStrategiesTableId = fields.saved_strategies?.fields?.id?.id;

      if (!savedStrategiesTableId) {
        return [];
      }

      // Query all strategies from the table
      const strategies: any[] = [];
      for (let i = 0; i < strategyCounter; i++) {
        try {
          const dynamicField = await this.suiClient.getDynamicFieldObject({
            parentId: savedStrategiesTableId,
            name: {
              type: 'u64',
              value: i.toString(),
            },
          });

          if (dynamicField.data?.content?.dataType === 'moveObject') {
            const strategyFields = (dynamicField.data.content as any).fields.value.fields;
            strategies.push({
              id: parseInt(strategyFields.id),
              name: strategyFields.name,
              description: strategyFields.description,
              strategyJson: JSON.parse(strategyFields.strategy_json),
              createdAt: parseInt(strategyFields.created_at),
              updatedAt: parseInt(strategyFields.updated_at),
            });
          }
        } catch (error) {
          // Strategy might have been deleted, skip
          continue;
        }
      }

      return strategies;
    } catch (error) {
      console.error('Error getting user strategies:', error);
      return [];
    }
  }

  /**
   * Get execution history for a user
   */
  async getUserExecutionHistory(storageObjectId: string): Promise<any[]> {
    try {
      const storageObject = await this.suiClient.getObject({
        id: storageObjectId,
        options: {
          showContent: true,
        },
      });

      if (storageObject.data?.content?.dataType !== 'moveObject') {
        return [];
      }

      const fields = (storageObject.data.content as any).fields;
      const executionCounter = parseInt(fields.execution_counter || '0');
      const executionHistoryTableId = fields.execution_history?.fields?.id?.id;

      if (!executionHistoryTableId) {
        return [];
      }

      // Query all executions from the table
      const executions: any[] = [];
      for (let i = 0; i < executionCounter; i++) {
        try {
          const dynamicField = await this.suiClient.getDynamicFieldObject({
            parentId: executionHistoryTableId,
            name: {
              type: 'u64',
              value: i.toString(),
            },
          });

          if (dynamicField.data?.content?.dataType === 'moveObject') {
            const executionFields = (dynamicField.data.content as any).fields.value.fields;
            executions.push({
              id: parseInt(executionFields.id),
              workflowName: executionFields.workflow_name,
              workflowId: executionFields.workflow_id,
              status: executionFields.status,
              txDigest: executionFields.tx_digest,
              timestamp: parseInt(executionFields.timestamp),
              gasUsed: parseInt(executionFields.gas_used),
              resultData: JSON.parse(executionFields.result_data || '{}'),
            });
          }
        } catch (error) {
          // Execution might have been deleted, skip
          continue;
        }
      }

      return executions.sort((a, b) => b.timestamp - a.timestamp);
    } catch (error) {
      console.error('Error getting execution history:', error);
      return [];
    }
  }

  /**
   * Get a specific strategy by ID
   */
  async getStrategy(storageObjectId: string, strategyId: number): Promise<any | null> {
    try {
      const storageObject = await this.suiClient.getObject({
        id: storageObjectId,
        options: {
          showContent: true,
        },
      });

      if (storageObject.data?.content?.dataType !== 'moveObject') {
        return null;
      }

      const fields = (storageObject.data.content as any).fields;
      const savedStrategiesTableId = fields.saved_strategies?.fields?.id?.id;

      if (!savedStrategiesTableId) {
        return null;
      }

      const dynamicField = await this.suiClient.getDynamicFieldObject({
        parentId: savedStrategiesTableId,
        name: {
          type: 'u64',
          value: strategyId.toString(),
        },
      });

      if (dynamicField.data?.content?.dataType !== 'moveObject') {
        return null;
      }

      const strategyFields = (dynamicField.data.content as any).fields.value.fields;
      return {
        id: parseInt(strategyFields.id),
        name: strategyFields.name,
        description: strategyFields.description,
        strategyJson: JSON.parse(strategyFields.strategy_json),
        createdAt: parseInt(strategyFields.created_at),
        updatedAt: parseInt(strategyFields.updated_at),
      };
    } catch (error) {
      console.error('Error getting strategy:', error);
      return null;
    }
  }
}

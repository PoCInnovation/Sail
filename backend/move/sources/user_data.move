// Copyright (c), Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0

/// Module to store user data (strategies, execution history) on-chain
/// Replaces localStorage usage for decentralized data storage
module startHack::user_data {
    use sui::table::{Self, Table};
    use std::string::String;

    // Error codes
    const ENotOwner: u64 = 1;
    const EStrategyNotFound: u64 = 2;
    const EHistoryNotFound: u64 = 3;

    // Events
    public struct StrategySaved has copy, drop {
        user: address,
        strategy_id: u64,
        timestamp: u64,
    }

    public struct StrategyDeleted has copy, drop {
        user: address,
        strategy_id: u64,
    }

    public struct ExecutionRecorded has copy, drop {
        user: address,
        execution_id: u64,
        timestamp: u64,
    }

    public struct ExecutionHistoryCleared has copy, drop {
        user: address,
    }

    // Saved strategy data structure
    public struct SavedStrategy has store, drop, copy {
        id: u64,
        name: String,
        description: String,
        strategy_json: String,  // JSON stringified strategy
        created_at: u64,
        updated_at: u64,
    }

    // Execution history entry
    public struct ExecutionEntry has store, drop, copy {
        id: u64,
        workflow_name: String,
        workflow_id: String,
        status: String,  // "success", "failed", "pending"
        tx_digest: String,
        timestamp: u64,
        gas_used: u64,
        result_data: String,  // JSON stringified result
    }

    // User data storage object
    public struct UserDataStorage has key {
        id: UID,
        owner: address,
        saved_strategies: Table<u64, SavedStrategy>,
        strategy_counter: u64,
        execution_history: Table<u64, ExecutionEntry>,
        execution_counter: u64,
    }

    // Create a new user data storage
    public entry fun create_storage(ctx: &mut TxContext) {
        let storage = UserDataStorage {
            id: object::new(ctx),
            owner: ctx.sender(),
            saved_strategies: table::new(ctx),
            strategy_counter: 0,
            execution_history: table::new(ctx),
            execution_counter: 0,
        };
        transfer::transfer(storage, ctx.sender());
    }

    // Save a new strategy
    public entry fun save_strategy(
        storage: &mut UserDataStorage,
        name: String,
        description: String,
        strategy_json: String,
        ctx: &mut TxContext
    ) {
        assert!(storage.owner == ctx.sender(), ENotOwner);

        let timestamp = ctx.epoch_timestamp_ms();
        let strategy_id = storage.strategy_counter;

        let strategy = SavedStrategy {
            id: strategy_id,
            name,
            description,
            strategy_json,
            created_at: timestamp,
            updated_at: timestamp,
        };

        storage.saved_strategies.add(strategy_id, strategy);
        storage.strategy_counter = storage.strategy_counter + 1;

        sui::event::emit(StrategySaved {
            user: ctx.sender(),
            strategy_id,
            timestamp,
        });
    }

    // Update existing strategy
    public entry fun update_strategy(
        storage: &mut UserDataStorage,
        strategy_id: u64,
        name: String,
        description: String,
        strategy_json: String,
        ctx: &mut TxContext
    ) {
        assert!(storage.owner == ctx.sender(), ENotOwner);
        assert!(storage.saved_strategies.contains(strategy_id), EStrategyNotFound);

        let strategy = &mut storage.saved_strategies[strategy_id];
        strategy.name = name;
        strategy.description = description;
        strategy.strategy_json = strategy_json;
        strategy.updated_at = ctx.epoch_timestamp_ms();
    }

    // Delete a strategy
    public entry fun delete_strategy(
        storage: &mut UserDataStorage,
        strategy_id: u64,
        ctx: &mut TxContext
    ) {
        assert!(storage.owner == ctx.sender(), ENotOwner);
        assert!(storage.saved_strategies.contains(strategy_id), EStrategyNotFound);

        storage.saved_strategies.remove(strategy_id);

        sui::event::emit(StrategyDeleted {
            user: ctx.sender(),
            strategy_id,
        });
    }

    // Record a workflow execution
    public entry fun record_execution(
        storage: &mut UserDataStorage,
        workflow_name: String,
        workflow_id: String,
        status: String,
        tx_digest: String,
        gas_used: u64,
        result_data: String,
        ctx: &mut TxContext
    ) {
        assert!(storage.owner == ctx.sender(), ENotOwner);

        let timestamp = ctx.epoch_timestamp_ms();
        let execution_id = storage.execution_counter;

        let entry = ExecutionEntry {
            id: execution_id,
            workflow_name,
            workflow_id,
            status,
            tx_digest,
            timestamp,
            gas_used,
            result_data,
        };

        storage.execution_history.add(execution_id, entry);
        storage.execution_counter = storage.execution_counter + 1;

        sui::event::emit(ExecutionRecorded {
            user: ctx.sender(),
            execution_id,
            timestamp,
        });
    }

    // Clear execution history
    public entry fun clear_execution_history(
        storage: &mut UserDataStorage,
        ctx: &mut TxContext
    ) {
        assert!(storage.owner == ctx.sender(), ENotOwner);

        // Remove all entries from the table
        let mut i = 0;
        while (i < storage.execution_counter) {
            if (storage.execution_history.contains(i)) {
                storage.execution_history.remove(i);
            };
            i = i + 1;
        };
        storage.execution_counter = 0;

        sui::event::emit(ExecutionHistoryCleared {
            user: ctx.sender(),
        });
    }

    // View functions
    public fun get_strategy_count(storage: &UserDataStorage): u64 {
        storage.strategy_counter
    }

    public fun get_execution_count(storage: &UserDataStorage): u64 {
        storage.execution_counter
    }

    public fun has_strategy(storage: &UserDataStorage, strategy_id: u64): bool {
        storage.saved_strategies.contains(strategy_id)
    }

    public fun has_execution(storage: &UserDataStorage, execution_id: u64): bool {
        storage.execution_history.contains(execution_id)
    }

    // Get strategy by ID (read-only access)
    public fun get_strategy(storage: &UserDataStorage, strategy_id: u64): &SavedStrategy {
        assert!(storage.saved_strategies.contains(strategy_id), EStrategyNotFound);
        &storage.saved_strategies[strategy_id]
    }

    // Get execution by ID (read-only access)
    public fun get_execution(storage: &UserDataStorage, execution_id: u64): &ExecutionEntry {
        assert!(storage.execution_history.contains(execution_id), EHistoryNotFound);
        &storage.execution_history[execution_id]
    }
}

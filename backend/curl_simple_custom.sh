#!/bin/bash
# Strategy demonstrating CUSTOM blocks with SIMPLE Move functions that work
# Uses only verified, simple Move stdlib functions

curl -X POST http://localhost:8000/api/simulate \
  -H "Content-Type: application/json" \
  -d '{
  "sender": "0xd025128a33db4f04148eddfd994795e38bfb13d1c5f2cb2a2327be92246c13d0",
  "strategy": {
    "id": "123e4567-e89b-12d3-a456-426614174010",
    "version": "1.0.0",
    "meta": {
      "name": "CUSTOM Blocks Demo - Simple Move Operations",
      "author": "0xd025128a33db4f04148eddfd994795e38bfb13d1c5f2cb2a2327be92246c13d0",
      "description": "Demonstrates CUSTOM blocks with verified Move stdlib functions",
      "created_at": 1700000000000,
      "updated_at": 1700000000000,
      "tags": ["custom", "demo", "stdlib"]
    },
    "nodes": [
      {
        "id": "borrow_1",
        "type": "FLASH_BORROW",
        "protocol": "NAVI",
        "params": {
          "asset": "0x2::sui::SUI",
          "amount": "100000000"
        },
        "outputs": [
          { "id": "coin_borrowed", "type": "Coin<0x2::sui::SUI>", "output_type": "COIN" },
          { "id": "receipt", "type": "FlashLoanReceipt", "output_type": "RECEIPT" }
        ]
      },
      {
        "id": "custom_split",
        "type": "CUSTOM",
        "protocol": "CUSTOM",
        "label": "Custom Coin Split",
        "params": {
          "target": "0x2::coin::split",
          "description": "Split 10 SUI using CUSTOM block (stdlib function)",
          "arguments": [
            {
              "type": "input",
              "input_ref": "borrow_1.coin_borrowed",
              "comment": "Coin to split from"
            },
            {
              "type": "pure",
              "value": "10000000",
              "value_type": "u64",
              "comment": "Amount to split (10 SUI)"
            }
          ],
          "type_arguments": ["0x2::sui::SUI"]
        },
        "inputs": {
          "coin_in": "borrow_1.coin_borrowed"
        },
        "outputs": [
          { "id": "split_coin", "type": "Coin<0x2::sui::SUI>", "output_type": "COIN" }
        ]
      },
      {
        "id": "custom_join",
        "type": "CUSTOM",
        "protocol": "CUSTOM",
        "label": "Custom Coin Join",
        "params": {
          "target": "0x2::coin::join",
          "description": "Join coins back together using CUSTOM block",
          "arguments": [
            {
              "type": "input",
              "input_ref": "borrow_1.coin_borrowed",
              "comment": "Target coin to join into"
            },
            {
              "type": "input",
              "input_ref": "custom_split.split_coin",
              "comment": "Coin to merge"
            }
          ],
          "type_arguments": ["0x2::sui::SUI"]
        },
        "inputs": {
          "target": "borrow_1.coin_borrowed",
          "to_merge": "custom_split.split_coin"
        },
        "outputs": []
      },
      {
        "id": "split_gas",
        "type": "COIN_SPLIT",
        "protocol": "NATIVE",
        "params": {
          "amounts": ["10000000"]
        },
        "inputs": { "coin": "GAS" },
        "outputs": [
          { "id": "fee_coin", "type": "Coin<0x2::sui::SUI>", "output_type": "COIN" }
        ]
      },
      {
        "id": "merge_for_repay",
        "type": "COIN_MERGE",
        "protocol": "NATIVE",
        "params": {},
        "inputs": {
          "target_coin": "borrow_1.coin_borrowed",
          "merge_coins": ["split_gas.fee_coin"]
        },
        "outputs": [
          { "id": "final_coin", "type": "Coin<0x2::sui::SUI>", "output_type": "COIN" }
        ]
      },
      {
        "id": "repay_1",
        "type": "FLASH_REPAY",
        "protocol": "NAVI",
        "params": { "asset": "0x2::sui::SUI" },
        "inputs": {
          "coin_repay": "merge_for_repay.final_coin",
          "receipt": "borrow_1.receipt"
        }
      }
    ],
    "edges": [
      {
        "id": "e1",
        "source": "borrow_1",
        "source_output": "coin_borrowed",
        "target": "custom_split",
        "target_input": "coin_in",
        "edge_type": "COIN",
        "coin_type": "0x2::sui::SUI"
      },
      {
        "id": "e2",
        "source": "custom_split",
        "source_output": "split_coin",
        "target": "custom_join",
        "target_input": "to_merge",
        "edge_type": "COIN",
        "coin_type": "0x2::sui::SUI"
      },
      {
        "id": "e3",
        "source": "borrow_1",
        "source_output": "coin_borrowed",
        "target": "custom_join",
        "target_input": "target",
        "edge_type": "COIN",
        "coin_type": "0x2::sui::SUI"
      },
      {
        "id": "e4",
        "source": "borrow_1",
        "source_output": "coin_borrowed",
        "target": "merge_for_repay",
        "target_input": "target_coin",
        "edge_type": "COIN",
        "coin_type": "0x2::sui::SUI"
      },
      {
        "id": "e5",
        "source": "split_gas",
        "source_output": "fee_coin",
        "target": "merge_for_repay",
        "target_input": "merge_coins",
        "edge_type": "COIN",
        "coin_type": "0x2::sui::SUI"
      },
      {
        "id": "e6",
        "source": "merge_for_repay",
        "source_output": "final_coin",
        "target": "repay_1",
        "target_input": "coin_repay",
        "edge_type": "COIN",
        "coin_type": "0x2::sui::SUI"
      },
      {
        "id": "e7",
        "source": "borrow_1",
        "source_output": "receipt",
        "target": "repay_1",
        "target_input": "receipt",
        "edge_type": "RECEIPT"
      }
    ]
  }
}'

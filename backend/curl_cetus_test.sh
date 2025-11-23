#!/bin/bash
# Cetus Swap Test using Universal Block
# Target: 0xb2db7142fa83210a7d78d9c12ac49c043b3cbbd482224fea6e3da00aa5a5ae2d::router::swap

curl -X POST http://localhost:8000/api/simulate \
  -H "Content-Type: application/json" \
  -d '{
  "sender": "0xd025128a33db4f04148eddfd994795e38bfb13d1c5f2cb2a2327be92246c13d0",
  "strategy": {
    "id": "123e4567-e89b-12d3-a456-426614174001",
    "version": "1.0.0",
    "meta": {
      "name": "Cetus Universal Block Test",
      "author": "0xd025128a33db4f04148eddfd994795e38bfb13d1c5f2cb2a2327be92246c13d0",
      "description": "Test Cetus swap using universal block",
      "created_at": 1700000000000,
      "updated_at": 1700000000000,
      "tags": ["test", "cetus", "universal"]
    },
    "nodes": [
      {
        "id": "borrow_1",
        "type": "FLASH_BORROW",
        "protocol": "NAVI",
        "params": { "asset": "0x2::sui::SUI", "amount": "10000000" },
        "outputs": [
          { "id": "coin_borrowed", "type": "Coin<0x2::sui::SUI>", "output_type": "COIN" },
          { "id": "receipt", "type": "FlashLoanReceipt", "output_type": "RECEIPT" }
        ]
      },
      {
        "id": "create_zero_usdc",
        "type": "CUSTOM",
        "protocol": "CUSTOM",
        "label": "Create Zero USDC",
        "params": {
          "target": "0x2::coin::zero",
          "arguments": [],
          "type_arguments": ["0x5d4b302506645c37ff133b98c4b50a5ae14841659738d6d733d59d0d217a93bf::coin::COIN"]
        },
        "inputs": {},
        "outputs": [
          { "id": "zero_usdc", "type": "Coin<USDC>", "output_type": "COIN" }
        ]
      },
      {
        "id": "cetus_swap",
        "type": "CUSTOM",
        "protocol": "CUSTOM",
        "label": "Cetus Router Swap",
        "params": {
          "target": "0xb2db7142fa83210a7d78d9c12ac49c043b3cbbd482224fea6e3da00aa5a5ae2d::router::swap",
          "arguments": [
            { "type": "shared_object", "value": "0xdaa46292632c3c4d8f31f23ea0f9b36a28ff3677e9684980e4438403a67a3d8f", "mutable": true },
            { "type": "shared_object", "value": "0xa02a98f9c88db51c6f5efaaf2261c81f34dd56d86073387e0ef1805ca22e39c8", "mutable": true },
            { "type": "input", "input_ref": "borrow_1.coin_borrowed" },
            { "type": "input", "input_ref": "create_zero_usdc.zero_usdc" },
            { "type": "pure", "value": true, "value_type": "bool" },
            { "type": "pure", "value": true, "value_type": "bool" },
            { "type": "pure", "value": "10000000", "value_type": "u64" },
            { "type": "pure", "value": "4295048016", "value_type": "u128" },
            { "type": "pure", "value": false, "value_type": "bool" },
            { "type": "shared_object", "value": "0x0000000000000000000000000000000000000000000000000000000000000006", "mutable": false }
          ],
          "type_arguments": [
            "0x2::sui::SUI",
            "0x5d4b302506645c37ff133b98c4b50a5ae14841659738d6d733d59d0d217a93bf::coin::COIN"
          ]
        },
        "inputs": {
          "coin_in": "borrow_1.coin_borrowed",
          "zero_coin": "create_zero_usdc.zero_usdc"
        },
        "outputs": [
          { "id": "sui_remainder", "type": "Coin<SUI>", "output_type": "COIN" },
          { "id": "usdc_out", "type": "Coin<USDC>", "output_type": "COIN" }
        ]
      },
      {
        "id": "split_gas",
        "type": "COIN_SPLIT",
        "protocol": "NATIVE",
        "params": { "amounts": ["1000000"] },
        "inputs": { "coin": "GAS" },
        "outputs": [
          { "id": "fee_coin", "type": "Coin<SUI>", "output_type": "COIN" }
        ]
      },
      {
        "id": "merge_funds",
        "type": "COIN_MERGE",
        "protocol": "NATIVE",
        "params": {},
        "inputs": {
          "target_coin": "cetus_swap.sui_remainder",
          "merge_coins": ["split_gas.fee_coin"]
        },
        "outputs": [
          { "id": "merged_coin", "type": "Coin<SUI>", "output_type": "COIN" }
        ]
      },
      {
        "id": "repay_1",
        "type": "FLASH_REPAY",
        "protocol": "NAVI",
        "params": { "asset": "0x2::sui::SUI" },
        "inputs": {
          "coin_repay": "merge_funds.merged_coin",
          "receipt": "borrow_1.receipt"
        }
      }
    ],
    "edges": [
      { "id": "e1", "source": "borrow_1", "source_output": "coin_borrowed", "target": "cetus_swap", "target_input": "coin_in", "edge_type": "COIN", "coin_type": "0x2::sui::SUI" },
      { "id": "e2", "source": "create_zero_usdc", "source_output": "zero_usdc", "target": "cetus_swap", "target_input": "zero_coin", "edge_type": "COIN", "coin_type": "0x5d4b302506645c37ff133b98c4b50a5ae14841659738d6d733d59d0d217a93bf::coin::COIN" },
      { "id": "e3", "source": "cetus_swap", "source_output": "sui_remainder", "target": "merge_funds", "target_input": "target_coin", "edge_type": "COIN", "coin_type": "0x2::sui::SUI" },
      { "id": "e4", "source": "split_gas", "source_output": "fee_coin", "target": "merge_funds", "target_input": "merge_coins", "edge_type": "COIN", "coin_type": "0x2::sui::SUI" },
      { "id": "e5", "source": "merge_funds", "source_output": "merged_coin", "target": "repay_1", "target_input": "coin_repay", "edge_type": "COIN", "coin_type": "0x2::sui::SUI" },
      { "id": "e6", "source": "borrow_1", "source_output": "receipt", "target": "repay_1", "target_input": "receipt", "edge_type": "RECEIPT" }
    ]
  }
}'

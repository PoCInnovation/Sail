#!/bin/bash
# Solution A: Using DEX_SWAP instead of CUSTOM block
# This is the RECOMMENDED approach as it uses the tested Cetus adapter

curl -X POST http://localhost:8000/api/simulate \
  -H "Content-Type: application/json" \
  -d '{
  "sender": "0xd025128a33db4f04148eddfd994795e38bfb13d1c5f2cb2a2327be92246c13d0",
  "strategy": {
    "id": "123e4567-e89b-12d3-a456-426614174003",
    "version": "1.0.0",
    "meta": {
      "name": "Flash Loan with Cetus Swap (DEX_SWAP)",
      "author": "0xd025128a33db4f04148eddfd994795e38bfb13d1c5f2cb2a2327be92246c13d0",
      "description": "Flash loan with Cetus swap using DEX_SWAP node",
      "created_at": 1700000000000,
      "updated_at": 1700000000000,
      "tags": ["test", "mainnet", "cetus", "swap"]
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
        "id": "swap_sui_usdc",
        "type": "DEX_SWAP",
        "protocol": "CETUS",
        "params": {
          "pool_id": "0xcf994611fd4c48e277ce3ffd4d4364c914af2c3cbb05f7bf6facd371de688630",
          "coin_type_a": "0x2::sui::SUI",
          "coin_type_b": "0x5d4b302506645c37ff133b98c4b50a5ae14841659738d6d733d59d0d217a93bf::coin::COIN",
          "direction": "A_TO_B",
          "amount_mode": "EXACT_IN",
          "amount": "10000000",
          "slippage_tolerance": "0.01"
        },
        "inputs": { "coin_in": "borrow_1.coin_borrowed" },
        "outputs": [
          { "id": "usdc_out", "type": "Coin<0x5d4b302506645c37ff133b98c4b50a5ae14841659738d6d733d59d0d217a93bf::coin::COIN>", "output_type": "COIN" }
        ]
      },
      {
        "id": "swap_usdc_sui",
        "type": "DEX_SWAP",
        "protocol": "CETUS",
        "params": {
          "pool_id": "0xcf994611fd4c48e277ce3ffd4d4364c914af2c3cbb05f7bf6facd371de688630",
          "coin_type_a": "0x2::sui::SUI",
          "coin_type_b": "0x5d4b302506645c37ff133b98c4b50a5ae14841659738d6d733d59d0d217a93bf::coin::COIN",
          "direction": "B_TO_A",
          "amount_mode": "EXACT_IN",
          "amount": "ALL",
          "slippage_tolerance": "0.01"
        },
        "inputs": { "coin_in": "swap_sui_usdc.usdc_out" },
        "outputs": [
          { "id": "sui_out", "type": "Coin<0x2::sui::SUI>", "output_type": "COIN" }
        ]
      },
      {
        "id": "split_gas",
        "type": "COIN_SPLIT",
        "protocol": "NATIVE",
        "params": {
          "amounts": ["1000000"]
        },
        "inputs": { "coin": "GAS" },
        "outputs": [
          { "id": "fee_coin", "type": "Coin<0x2::sui::SUI>", "output_type": "COIN" }
        ]
      },
      {
        "id": "merge_funds",
        "type": "COIN_MERGE",
        "protocol": "NATIVE",
        "params": {},
        "inputs": {
          "target_coin": "swap_usdc_sui.sui_out",
          "merge_coins": ["split_gas.fee_coin"]
        },
        "outputs": [
          { "id": "merged_coin", "type": "Coin<0x2::sui::SUI>", "output_type": "COIN" }
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
      {
        "id": "e1",
        "source": "borrow_1",
        "source_output": "coin_borrowed",
        "target": "swap_sui_usdc",
        "target_input": "coin_in",
        "edge_type": "COIN",
        "coin_type": "0x2::sui::SUI"
      },
      {
        "id": "e2",
        "source": "swap_sui_usdc",
        "source_output": "usdc_out",
        "target": "swap_usdc_sui",
        "target_input": "coin_in",
        "edge_type": "COIN",
        "coin_type": "0x5d4b302506645c37ff133b98c4b50a5ae14841659738d6d733d59d0d217a93bf::coin::COIN"
      },
      {
        "id": "e3",
        "source": "swap_usdc_sui",
        "source_output": "sui_out",
        "target": "merge_funds",
        "target_input": "target_coin",
        "edge_type": "COIN",
        "coin_type": "0x2::sui::SUI"
      },
      {
        "id": "e4",
        "source": "split_gas",
        "source_output": "fee_coin",
        "target": "merge_funds",
        "target_input": "merge_coins",
        "edge_type": "COIN",
        "coin_type": "0x2::sui::SUI"
      },
      {
        "id": "e5",
        "source": "merge_funds",
        "source_output": "merged_coin",
        "target": "repay_1",
        "target_input": "coin_repay",
        "edge_type": "COIN",
        "coin_type": "0x2::sui::SUI"
      },
      {
        "id": "e6",
        "source": "borrow_1",
        "source_output": "receipt",
        "target": "repay_1",
        "target_input": "receipt",
        "edge_type": "RECEIPT"
      }
    ]
  }
}'

#!/bin/bash
# Turbos Finance with DEX_SWAP - Using TurbosAdapter

curl -X POST http://localhost:8000/api/simulate \
  -H "Content-Type: application/json" \
  -d '{
  "sender": "0xd025128a33db4f04148eddfd994795e38bfb13d1c5f2cb2a2327be92246c13d0",
  "strategy": {
    "id": "123e4567-e89b-12d3-a456-426614174012",
    "version": "1.0.0",
    "meta": {
      "name": "Turbos Flash Arbitrage (DEX_SWAP)",
      "author": "0xd025128a33db4f04148eddfd994795e38bfb13d1c5f2cb2a2327be92246c13d0",
      "description": "Flash loan with Turbos swap using DEX_SWAP node",
      "created_at": 1700000000000,
      "updated_at": 1700000000000,
      "tags": ["turbos", "dex_swap", "mainnet"]
    },
    "nodes": [
      {
        "id": "borrow_1",
        "type": "FLASH_BORROW",
        "protocol": "NAVI",
        "params": {
          "asset": "0x2::sui::SUI",
          "amount": "5000000"
        },
        "outputs": [
          { "id": "coin_borrowed", "type": "Coin<0x2::sui::SUI>", "output_type": "COIN" },
          { "id": "receipt", "type": "FlashLoanReceipt", "output_type": "RECEIPT" }
        ]
      },
      {
        "id": "swap_1",
        "type": "DEX_SWAP",
        "protocol": "TURBOS",
        "params": {
          "pool_id": "0x5eb2dfcdd1b15d2021328258f6d5ec081e9a0cdcfa9e13a0eaeb9b5f7505ca78",
          "coin_type_a": "0x2::sui::SUI",
          "coin_type_b": "0x5d4b302506645c37ff133b98c4b50a5ae14841659738d6d733d59d0d217a93bf::coin::COIN",
          "direction": "A_TO_B",
          "amount": "5000000",
          "slippage_tolerance": "0.01",
          "fee_type": "0xa5a0c25c79e428eba04fb98b3fb2a34db45ab26d4c8faf0d7e39d66a63891e64::fee::FeeThreeThousandth"
        },
        "inputs": { "coin_in": "borrow_1.coin_borrowed" },
        "outputs": [
          { "id": "usdc_out", "type": "Coin<wUSDC>", "output_type": "COIN" }
        ]
      },
      {
        "id": "split_gas",
        "type": "COIN_SPLIT",
        "protocol": "NATIVE",
        "params": {
          "amounts": ["6000000"]
        },
        "inputs": { "coin": "GAS" },
        "outputs": [
          { "id": "fee_coin", "type": "Coin<0x2::sui::SUI>", "output_type": "COIN" }
        ]
      },
      {
        "id": "repay_1",
        "type": "FLASH_REPAY",
        "protocol": "NAVI",
        "params": { "asset": "0x2::sui::SUI" },
        "inputs": {
          "coin_repay": "split_gas.fee_coin",
          "receipt": "borrow_1.receipt"
        }
      }
    ],
    "edges": [
      {
        "id": "e1",
        "source": "borrow_1",
        "source_output": "coin_borrowed",
        "target": "swap_1",
        "target_input": "coin_in",
        "edge_type": "COIN",
        "coin_type": "0x2::sui::SUI"
      },
      {
        "id": "e2",
        "source": "split_gas",
        "source_output": "fee_coin",
        "target": "repay_1",
        "target_input": "coin_repay",
        "edge_type": "COIN",
        "coin_type": "0x2::sui::SUI"
      },
      {
        "id": "e3",
        "source": "borrow_1",
        "source_output": "receipt",
        "target": "repay_1",
        "target_input": "receipt",
        "edge_type": "RECEIPT"
      }
    ]
  }
}'

#!/bin/bash
# Turbos Swap Test using Universal Block
# Target: 0xa5a0c25c79e428eba04fb98b3fb2a34db45ab26d4c8faf0d7e39d66a63891e64::swap_router::swap_a_b

curl -X POST http://localhost:8000/api/simulate \
  -H "Content-Type: application/json" \
  -d '{
  "sender": "0xd025128a33db4f04148eddfd994795e38bfb13d1c5f2cb2a2327be92246c13d0",
  "strategy": {
    "id": "123e4567-e89b-12d3-a456-426614174002",
    "version": "1.0.0",
    "meta": {
      "name": "Turbos Universal Block Test",
      "author": "0xd025128a33db4f04148eddfd994795e38bfb13d1c5f2cb2a2327be92246c13d0",
      "description": "Test Turbos swap using universal block",
      "created_at": 1700000000000,
      "updated_at": 1700000000000,
      "tags": ["test", "turbos", "universal"]
    },
    "nodes": [
      {
        "id": "borrow_1",
        "type": "FLASH_BORROW",
        "protocol": "NAVI",
        "params": { "asset": "0x2::sui::SUI", "amount": "5000000" },
        "outputs": [
          { "id": "coin_borrowed", "type": "Coin<0x2::sui::SUI>", "output_type": "COIN" },
          { "id": "receipt", "type": "FlashLoanReceipt", "output_type": "RECEIPT" }
        ]
      },
      {
        "id": "turbos_swap",
        "type": "CUSTOM",
        "protocol": "CUSTOM",
        "label": "Turbos Swap",
        "params": {
          "target": "0xa5a0c25c79e428eba04fb98b3fb2a34db45ab26d4c8faf0d7e39d66a63891e64::swap_router::swap_a_b",
          "arguments": [
            { "type": "object", "object_id": "0x5eb2dfcdd1b15d2021328258f6d5ec081e9a0cdcfa9e13a0eaeb9b5f7505ca78" },
            { "type": "make_vec", "input_ref": "borrow_1.coin_borrowed", "value_type": "0x2::coin::Coin<0x2::sui::SUI>" },
            { "type": "pure", "value": "5000000", "value_type": "u64" },
            { "type": "pure", "value": "0", "value_type": "u64" },
            { "type": "pure", "value": "79226673515401279992447579055", "value_type": "u128" },
            { "type": "pure", "value": true, "value_type": "bool" },
            { "type": "pure", "value": "0xd025128a33db4f04148eddfd994795e38bfb13d1c5f2cb2a2327be92246c13d0", "value_type": "address" },
            { "type": "pure", "value": "9999999999999", "value_type": "u64" },
            { "type": "object", "object_id": "0x6" },
            { "type": "object", "object_id": "0xf1cf0e81048df168ebeb1b8030fad24b3e0b53ae827c25053fff0779c1445b6f" }
          ],
          "type_arguments": [
            "0x2::sui::SUI",
            "0x5d4b302506645c37ff133b98c4b50a5ae14841659738d6d733d59d0d217a93bf::coin::COIN",
            "0xa5a0c25c79e428eba04fb98b3fb2a34db45ab26d4c8faf0d7e39d66a63891e64::fee::FeeThreeThousandth"
          ]
        },
        "inputs": { "coin_in": "borrow_1.coin_borrowed" },
        "outputs": [
          { "id": "usdc_out", "type": "Coin<USDC>", "output_type": "COIN" }
        ]
      },
      {
        "id": "split_gas",
        "type": "COIN_SPLIT",
        "protocol": "NATIVE",
        "params": { "amounts": ["6000000"] },
        "inputs": { "coin": "GAS" },
        "outputs": [
          { "id": "fee_coin", "type": "Coin<SUI>", "output_type": "COIN" }
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
      { "id": "e1", "source": "borrow_1", "source_output": "coin_borrowed", "target": "turbos_swap", "target_input": "coin_in", "edge_type": "COIN", "coin_type": "0x2::sui::SUI" },
      { "id": "e2", "source": "split_gas", "source_output": "fee_coin", "target": "repay_1", "target_input": "coin_repay", "edge_type": "COIN", "coin_type": "0x2::sui::SUI" },
      { "id": "e3", "source": "borrow_1", "source_output": "receipt", "target": "repay_1", "target_input": "receipt", "edge_type": "RECEIPT" }
    ]
  }
}'

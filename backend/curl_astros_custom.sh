#!/bin/bash
# Demonstrates the Astros custom block (swap SUI → USDC) via the simulation API.

curl -X POST http://localhost:8000/api/simulate \
  -H "Content-Type: application/json" \
  -d '{
    "sender": "0xd025128a33db4f04148eddfd994795e38bfb13d1c5f2cb2a2327be92246c13d0",
    "strategy": {
      "id": "123e4567-e89b-12d3-a456-426614174003",
      "version": "1.0.0",
      "meta": {
        "name": "Astros Swap Custom Block",
        "author": "0xd025128a33db4f04148eddfd994795e38bfb13d1c5f2cb2a2327be92246c13d0",
        "description": "Swap SUI → USDC using the Astros DEX aggregator.",
        "created_at": 1700000000000,
        "updated_at": 1700000000000,
        "tags": ["custom","astros","swap"]
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
          "id": "astros_swap",
          "type": "CUSTOM",
          "protocol": "CUSTOM",
          "label": "Astros Swap SUI → USDC",
          "params": {
            "target": "0xA5A0C25C79E428EBA04FB98B3FB2A34DB45AB26D4C8FAF0D7E39D66A63891E64::swap_router::swap_a_b",
            "description": "Swap SUI for USDC using Astros aggregator.",
            "arguments": [
              { "type": "object", "object_id": "0x5eb2dfcdd1b15d2021328258f6d5ec081e9a0cdcfa9e13a0eaeb9b5f7505ca78" },
              { "type": "make_vec", "input_ref": "borrow_1.coin_borrowed", "value_type": "0x2::coin::Coin<0x2::sui::SUI>" },
              { "type": "pure", "value": "5000000", "value_type": "u64" },
              { "type": "pure", "value": "0", "value_type": "u64" },
              { "type": "pure", "value": "79226673515401279992447579055", "value_type": "u128" },
              { "type": "pure", "value": true, "value_type": "bool" },
              { "type": "pure", "value": "0xd025128a33db4f04148eddfd994795e38bfb13d1c5f2cb2a2327be92246c13d0", "value_type": "address" },
              { "type": "pure", "value": "9999999999", "value_type": "u64" },
              { "type": "object", "object_id": "0x6" },
              { "type": "object", "object_id": "0xf1cf0e81048df168ebeb1b8030fad24b3e0b53ae827c25053fff0779c1445b6f" }
            ],
            "type_arguments": [ "0x2::sui::SUI", "0xdba34672e30cb065b1f93e3ab55318768fd6fef66c15942c9f7cb846e2f900e7::usdc::USDC" ]
          },
          "inputs": { "coin_in": "borrow_1.coin_borrowed" },
          "outputs": [
            { "id": "usdc_out", "type": "Coin<0xdba34672e30cb065b1f93e3ab55318768fd6fef66c15942c9f7cb846e2f900e7::usdc::USDC>", "output_type": "COIN" }
          ]
        },
        {
          "id": "repay_1",
          "type": "FLASH_REPAY",
          "protocol": "NAVI",
          "params": { "asset": "0x2::sui::SUI" },
          "inputs": {
            "coin_repay": "borrow_1.coin_borrowed",
            "receipt": "borrow_1.receipt"
          }
        }
      ],
      "edges": [
        { "id": "e1", "source": "borrow_1", "source_output": "coin_borrowed", "target": "astros_swap", "target_input": "coin_in", "edge_type": "COIN", "coin_type": "0x2::sui::SUI" },
        { "id": "e2", "source": "borrow_1", "source_output": "receipt", "target": "repay_1", "target_input": "receipt", "edge_type": "RECEIPT" }
      ]
    }
  }'
#!/bin/bash
# Typus Deposit Test using Universal Block
# Target: 0x91235d393df2d32482897c6c7fef19e81f8a2918229f16d7711a4ad18367d0cf::tds_user_entry::public_raise_fund

curl -X POST http://localhost:8000/api/simulate \
  -H "Content-Type: application/json" \
  -d '{
  "sender": "0xd025128a33db4f04148eddfd994795e38bfb13d1c5f2cb2a2327be92246c13d0",
  "strategy": {
    "id": "123e4567-e89b-12d3-a456-426614174004",
    "version": "1.0.0",
    "meta": {
      "name": "Typus Universal Block Test",
      "author": "0xd025128a33db4f04148eddfd994795e38bfb13d1c5f2cb2a2327be92246c13d0",
      "description": "Test Typus deposit using universal block",
      "created_at": 1700000000000,
      "updated_at": 1700000000000,
      "tags": ["test", "typus", "universal"]
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
        "id": "convert_balance",
        "type": "CUSTOM",
        "protocol": "CUSTOM",
        "label": "Convert Coin to Balance",
        "params": {
          "target": "0x2::coin::into_balance",
          "arguments": [
            { "type": "input", "input_ref": "borrow_1.coin_borrowed" }
          ],
          "type_arguments": ["0x2::sui::SUI"]
        },
        "inputs": { "coin_in": "borrow_1.coin_borrowed" },
        "outputs": [
          { "id": "balance_out", "type": "Balance<SUI>", "output_type": "OTHER" }
        ]
      },
      {
        "id": "typus_deposit",
        "type": "CUSTOM",
        "protocol": "CUSTOM",
        "label": "Typus Deposit",
        "params": {
          "target": "0x91235d393df2d32482897c6c7fef19e81f8a2918229f16d7711a4ad18367d0cf::tds_user_entry::public_raise_fund",
          "arguments": [
            { "type": "shared_object", "value": "0xd2882b992e986250b3304b59530700bc3850939f9a77e9e9dfa9cf1656f84b3d", "mutable": false },
            { "type": "shared_object", "value": "0xb1b16eb4845b5ee1a29432b1f2bcfe8cbb33c234492baf31a706d82e28e18bce", "mutable": true },
            { "type": "shared_object", "value": "0xc515a3e7fd12ba902f7f1ebe52c676136e1b34cb614ae9c79a46b257ca7d5534", "mutable": true },
            { "type": "shared_object", "value": "0x3d70b09359e3ca8301ae0abeda4f2fdf72ce313ba58c919ce568e5f535fd2ea8", "mutable": true },
            { "type": "pure", "value": "0", "value_type": "u64" },
            { "type": "make_vec", "value_type": "0x91235d393df2d32482897c6c7fef19e81f8a2918229f16d7711a4ad18367d0cf::vault::TypusDepositReceipt", "input_refs": [] },
            { "type": "input", "input_ref": "convert_balance.balance_out" },
            { "type": "pure", "value": false, "value_type": "bool" },
            { "type": "pure", "value": false, "value_type": "bool" },
            { "type": "shared_object", "value": "0x6", "mutable": false }
          ],
          "type_arguments": ["0x2::sui::SUI", "0x5d4b302506645c37ff133b98c4b50a5ae14841659738d6d733d59d0d217a93bf::coin::COIN"]
        },
        "inputs": { "balance_in": "convert_balance.balance_out" },
        "outputs": [
          { "id": "deposit_receipt", "type": "TypusDepositReceipt", "output_type": "OTHER" },
          { "id": "u64_vec", "type": "vector<u64>", "output_type": "OTHER" }
        ]
      }
    ],
    "edges": [
      { "id": "e1", "source": "borrow_1", "source_output": "coin_borrowed", "target": "convert_balance", "target_input": "coin_in", "edge_type": "COIN", "coin_type": "0x2::sui::SUI" },
      { "id": "e2", "source": "convert_balance", "source_output": "balance_out", "target": "typus_deposit", "target_input": "balance_in", "edge_type": "OTHER", "coin_type": "Balance<SUI>" }
    ]
  }
}'

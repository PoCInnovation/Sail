// Copyright (c), Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0

module startHack::whitelist {
    use sui::table;
    use sui::coin::{Self, Coin};
    use sui::sui::SUI;
    use sui::balance::{Self, Balance};
    use sui::event;

    use std::string::String;
    // use std::vector; // Implicitly available

    const ENoAccess: u64 = 1;
    const EInvalidCap: u64 = 2;
    const EDuplicate: u64 = 3;
    const ENotInWhitelist: u64 = 4;
    const EWrongVersion: u64 = 5;
    const EInsufficientPayment: u64 = 6;

    const VERSION: u64 = 1;
    const WHITELIST_PRICE: u64 = 500_000_000; // 0.5 SUI in MIST

    // Event emitted when a template is created
    public struct TemplateCreated has copy, drop {
        template_id: ID,
        name: String,
        author: address,
        price: u64,
    }

    public struct Template has store, drop {
        id: ID,
        name: String,
        author: address,
        description: String,
        price: u64,
        metadata_blob_id: String,
        data_blob_id: String,
    }

    public struct Whitelist has key {
        id: UID,
        version: u64,
        addresses: table::Table<address, bool>, // Global whitelist (deprecated, for backwards compatibility)
        template_access: table::Table<ID, table::Table<address, bool>>, // Template ID -> addresses with access
        balance: Balance<SUI>,
        beneficiary: address,
        templates: vector<Template>,
    }

    public struct Cap has key, store {
        id: UID,
        wl_id: ID,
    }

    public fun create_whitelist(beneficiary: address, ctx: &mut TxContext): (Cap, Whitelist) {
        let wl = Whitelist {
            id: object::new(ctx),
            version: VERSION,
            addresses: table::new(ctx),
            template_access: table::new(ctx),
            balance: balance::zero(),
            beneficiary,
            templates: vector::empty(),
        };
        let cap = Cap {
            id: object::new(ctx),
            wl_id: object::id(&wl),
        };
        (cap, wl)
    }

    public fun share_whitelist(wl: Whitelist) {
        transfer::share_object(wl);
    }

    entry fun create_whitelist_entry(beneficiary: address, ctx: &mut TxContext) {
        let (cap, wl) = create_whitelist(beneficiary, ctx);
        share_whitelist(wl);
        transfer::public_transfer(cap, ctx.sender());
    }

    public fun add(wl: &mut Whitelist, cap: &Cap, account: address) {
        assert!(cap.wl_id == object::id(wl), EInvalidCap);
        assert!(!wl.addresses.contains(account), EDuplicate);
        wl.addresses.add(account, true);
    }

    /// Allow anyone to add themselves to the whitelist with payment (DEPRECATED - use buy_template_access)
    public entry fun add_self_with_payment(wl: &mut Whitelist, payment: Coin<SUI>, ctx: &TxContext) {
        let sender = ctx.sender();
        assert!(!wl.addresses.contains(sender), EDuplicate);

        // Verify payment amount
        assert!(coin::value(&payment) >= WHITELIST_PRICE, EInsufficientPayment);

        // Add payment to balance
        coin::put(&mut wl.balance, payment);

        // Add to whitelist
        wl.addresses.add(sender, true);
    }

    /// Buy access to a specific template
    public entry fun buy_template_access(
        wl: &mut Whitelist,
        template_index: u64,
        payment: Coin<SUI>,
        ctx: &mut TxContext
    ) {
        let sender = ctx.sender();

        // Get the template
        assert!(template_index < wl.templates.length(), ENotInWhitelist);
        let template = &wl.templates[template_index];

        // Verify payment amount matches template price
        assert!(coin::value(&payment) >= template.price, EInsufficientPayment);

        // Add payment to balance
        coin::put(&mut wl.balance, payment);

        // Get or create the access table for this template
        let template_id = template.id;
        if (!wl.template_access.contains(template_id)) {
            wl.template_access.add(template_id, table::new(ctx));
        };

        let access_table = &mut wl.template_access[template_id];

        // Check if user already has access
        assert!(!access_table.contains(sender), EDuplicate);

        // Grant access
        access_table.add(sender, true);
    }

    /// Admin can add users for free (with cap)
    public entry fun add_with_cap(wl: &mut Whitelist, cap: &Cap, account: address) {
        assert!(cap.wl_id == object::id(wl), EInvalidCap);
        assert!(!wl.addresses.contains(account), EDuplicate);
        wl.addresses.add(account, true);
    }

    /// Add a template to the marketplace (admin only for now, or anyone?)
    /// For now, let's restrict to admin via Cap to prevent spam, or allow anyone?
    /// The user said "saving it in a list in the contract", usually implies the uploader does it.
    /// But the backend currently uploads. The backend has the admin key (maybe).
    /// Let's make it admin-only for now as per the current architecture where backend manages uploads.
    public entry fun add_template(
        wl: &mut Whitelist,
        cap: &Cap,
        name: String,
        author: address,
        description: String,
        price: u64,
        metadata_blob_id: String,
        data_blob_id: String,
        ctx: &mut TxContext
    ) {
        assert!(cap.wl_id == object::id(wl), EInvalidCap);

        let uid = object::new(ctx);
        let id = object::uid_to_inner(&uid);
        object::delete(uid);

        let template = Template {
            id,
            name,
            author,
            description,
            price,
            metadata_blob_id,
            data_blob_id,
        };

        wl.templates.push_back(template);
    }

    /// Create a placeholder template and return its ID (for encryption)
    /// The blob IDs will be empty and updated later
    public fun create_template_placeholder(
        wl: &mut Whitelist,
        cap: &Cap,
        name: String,
        author: address,
        description: String,
        price: u64,
        ctx: &mut TxContext
    ): ID {
        assert!(cap.wl_id == object::id(wl), EInvalidCap);

        let uid = object::new(ctx);
        let id = object::uid_to_inner(&uid);
        object::delete(uid);

        let template = Template {
            id,
            name,
            author,
            description,
            price,
            metadata_blob_id: std::string::utf8(b""),
            data_blob_id: std::string::utf8(b""),
        };

        wl.templates.push_back(template);

        // Emit event for easier ID extraction
        event::emit(TemplateCreated {
            template_id: id,
            name,
            author,
            price,
        });

        id
    }

    /// Update template blob IDs (admin only)
    public entry fun update_template_blobs(
        wl: &mut Whitelist,
        cap: &Cap,
        template_id: ID,
        metadata_blob_id: String,
        data_blob_id: String,
    ) {
        assert!(cap.wl_id == object::id(wl), EInvalidCap);

        // Find template by ID
        let mut i = 0;
        let len = wl.templates.length();
        let mut found = false;

        while (i < len) {
            if (wl.templates[i].id == template_id) {
                wl.templates[i].metadata_blob_id = metadata_blob_id;
                wl.templates[i].data_blob_id = data_blob_id;
                found = true;
                break
            };
            i = i + 1;
        };

        assert!(found, ENotInWhitelist);
    }

    /// Withdraw collected funds (admin only)
    public entry fun withdraw_funds(wl: &mut Whitelist, cap: &Cap, amount: u64, ctx: &mut TxContext) {
        assert!(cap.wl_id == object::id(wl), EInvalidCap);
        let withdrawn = coin::take(&mut wl.balance, amount, ctx);
        transfer::public_transfer(withdrawn, wl.beneficiary);
    }

    /// Withdraw all funds (admin only)
    public entry fun withdraw_all(wl: &mut Whitelist, cap: &Cap, ctx: &mut TxContext) {
        assert!(cap.wl_id == object::id(wl), EInvalidCap);
        let total = balance::value(&wl.balance);
        if (total > 0) {
            let withdrawn = coin::take(&mut wl.balance, total, ctx);
            transfer::public_transfer(withdrawn, wl.beneficiary);
        };
    }

    // View functions
    public fun get_price(): u64 {
        WHITELIST_PRICE
    }

    public fun get_balance(wl: &Whitelist): u64 {
        balance::value(&wl.balance)
    }

    /// Get template ID by index
    public fun get_template_id(wl: &Whitelist, index: u64): ID {
        assert!(index < wl.templates.length(), ENotInWhitelist);
        wl.templates[index].id
    }

    /// Check if user has access to a specific template
    public fun has_template_access(wl: &Whitelist, template_id: ID, user: address): bool {
        if (!wl.template_access.contains(template_id)) {
            return false
        };
        let access_table = &wl.template_access[template_id];
        access_table.contains(user)
    }

    public fun remove(wl: &mut Whitelist, cap: &Cap, account: address) {
        assert!(cap.wl_id == object::id(wl), EInvalidCap);
        assert!(wl.addresses.contains(account), ENotInWhitelist);
        wl.addresses.remove(account);
    }

    fun check_policy(caller: address, id: vector<u8>, wl: &Whitelist): bool {
        assert!(wl.version == VERSION, EWrongVersion);

        // Expected ID format: [whitelistObjectId][templateId][nonce]
        // First, check if ID starts with whitelistId
        let whitelist_prefix = wl.id.to_bytes();
        let mut i = 0;
        if (whitelist_prefix.length() > id.length()) {
            return false
        };
        while (i < whitelist_prefix.length()) {
            if (whitelist_prefix[i] != id[i]) {
                return false
            };
            i = i + 1;
        };

        // Extract template ID (next 32 bytes after whitelist ID)
        let template_id_start = whitelist_prefix.length();
        let template_id_end = template_id_start + 32;

        if (id.length() < template_id_end) {
            // Fallback to global whitelist for backwards compatibility
            return wl.addresses.contains(caller)
        };

        // Extract template ID bytes
        let mut template_id_bytes = vector::empty<u8>();
        let mut j = template_id_start;
        while (j < template_id_end) {
            template_id_bytes.push_back(id[j]);
            j = j + 1;
        };

        // Convert bytes to ID
        let template_id = object::id_from_bytes(template_id_bytes);

        // Check if template-specific access table exists
        if (!wl.template_access.contains(template_id)) {
            return false
        };

        // Check if caller has access to this specific template
        let access_table = &wl.template_access[template_id];
        access_table.contains(caller)
    }

    entry fun seal_approve(id: vector<u8>, wl: &Whitelist, ctx: &TxContext) {
        assert!(check_policy(ctx.sender(), id, wl), ENoAccess);
    }
}

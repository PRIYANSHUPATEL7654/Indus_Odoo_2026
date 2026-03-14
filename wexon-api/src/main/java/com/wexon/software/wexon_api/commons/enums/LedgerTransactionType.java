package com.wexon.software.wexon_api.commons.enums;

public enum LedgerTransactionType {
    VENDOR_BILL,           // Sale bill generated to vendor
    VENDOR_PAYMENT,        // Payment received from vendor
    VENDOR_ADVANCE,        // Advance received from vendor
    VENDOR_ADJUSTMENT,     // Manual adjustment

    STORAGE_RENT_BILL,     // Cold storage rent billed
    STORAGE_RENT_PAYMENT, // Rent payment received

    COMMISSION_INCOME,    // Commission earned by warehouse
    EXPENSE,              // Loading, electricity, labor etc.

    TRANSFER_ADJUSTMENT,  // Inter-warehouse balance adjustment

    OPENING_BALANCE,
    INVENTORY_SALE, INVENTORY_PURCHASE, REVERSAL               // Auto reverse wrong entry

}

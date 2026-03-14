package com.wexon.software.wexon_api.commons.exceptions;

public enum ErrorCode {

    AUTH_INVALID_TOKEN("AUTH_1001", "Invalid authentication token"),
    AUTH_MISSING_HEADER("AUTH_1002", "Missing header"),
    AUTH_ACCOUNT_LOCKED("AUTH_1003", "Account locked"),
    AUTH_INVALID_CREDENTIALS("AUTH_1004", "Invalid credentials"),


    USER_NOT_FOUND("USER_1001", "User not found"),
    USER_ALREADY_EXISTS("USER_1002", "User already exists with this email"),
    USER_MOBILE_EXISTS("USER_1003", "User already exists with this mobile number"),
    ROLE_NOT_FOUND("USER_1004", "One or more roles not found"),

    VENDOR_NOT_FOUND("VENDOR_1001", "Vendor record not found"),
    VENDOR_ALREADY_EXISTS("VENDOR_1002", "Vendor already exists"),

    PRODUCT_NOT_FOUND("PRODUCT_1001", "Product not found"),
    PRODUCT_ALREADY_EXISTS("PRODUCT_1002", "Product with this SKU already exists"),

    WAREHOUSE_NOT_FOUND("WAREHOUSE_1001", "Warehouse not found"),
    WAREHOUSE_ALREADY_EXISTS("WAREHOUSE_1002", "Warehouse already exists"),
    WAREHOUSE_CAPACITY_UPDATE_FAIL("WAREHOUSE_1003", "Warehouse capacity update failed"),
    WAREHOUSE_CAPACITY_EXCEEDED("WAREHOUSE_1003", "Warehouse capacity exceeded"),
    WAREHOUSE_INSUFFICIENT_STOCK("WAREHOUSE_1004", "Insufficient warehouse stock"),

    LOCATION_NOT_FOUND("WAREHOUSE_LOCATION_1011", "Location not found"),
    LOCATION_ALREADY_EXISTS("WAREHOUSE_LOCATION_1012", "Location already exists"),

    INVENTORY_BATCH_NOT_FOUND("INVENTORY_1001", "Provided BatchNo not valid"),
    INVENTORY_NOT_FOUND("INVENTORY_1002", "Inventory not found"),
    INVENTORY_QUANTITY_INSUFFICIENT("INVENTORY_1003", "Insufficient inventory quantity available"),
    TRANSECTION_NATURE_NOT_VALID("INVENTORY_1004", "Invalid inventory transaction nature."),
    INVENTORY_TRANSECTION_NOT_FOUND("INVENTORY_1011", "Inventory Transaction not found"),
    INVENTORY_TYPE_NOT_VALID("INVENTORY_1005", "Inventory type not supported"),
    DUPLICATE_INVENTORY_TRANSACTION_HANDLER("INVENTORY_1012","Duplicate handler found for transaction type"),
    INVENTORY_DELETE_NOT_ALLOWED("INVENTORY_1005", "Inventory cannot be deleted. Transactions already processed."),
    INVENTORY_TRANSACTION_APPROVE_NOT_ALLOWED("INVENTORY_1006", "Inventory Transaction Approved not allowed"),
    INVENTORY_TRANSECTION_DETAIL_NOT_FOUND("INVENTORY_TRANSACTION_DETAILS_1001", "Inventory Transaction details not found"),
    UPDATE_INVENTORY_TRANSACTION_DETAILS_NOT_ALLOWED("INVENTORY_TRANSACTION_DETAILS_1002", "Inventory Can not be updated because transaction already processed"),
    INVENTORY_ALREADY_DELETED("INVENTORY_1006", "Inventory Already Deleted");

//    INVENTORY_NOT_FOUND("INV_4001", "Inventory item not found"),
//    INVENTORY_LOW_STOCK("INV_4002", "Insufficient stock"),
//    INVENTORY_TRANSFER_FAIL("INV_4003", "Inventory transfer failed"),
//    INVENTORY_BATCH_FOUND("INV_4004", "Inventory batch found"),
//    INVENTORY_SAVE_EXCEPTION("INV_4005", "Inventory Add Not Successful. Found some errors.."),
//    INVENTORY_TRANSACTION_TYPE_NOT_FOUND("INV_4006", "Inventory transaction type not found"),
//
//    PARTY_TYPE_NOT_FOUND("PARTY_5001", "Party not found"),
//    QUANTITY_EXCEEDS_WAREHOUSE_CAPACITY("QUANTITY_6001", "Quantity exceeds available warehouse capacity"),
//
//    BAD_REQUEST("GEN_9001", "Bad request"),
//    BUSINESS_ERROR("GEN_9002", "Business rule violated"),
//    RESOURCE_NOT_FOUND("GEN_9003", "Resource not found"),
//    INTERNAL_SERVER_ERROR("GEN_9004", "Something went wrong");

    private final String code;
    private final String message;

    ErrorCode(String code, String message) {
        this.code = code;
        this.message = message;
    }

    public String code() {
        return code;
    }

    public String message() {
        return message;
    }
}

package com.wexon.software.wexon_api.modules.inventory.inventory_transaction.dto;

import com.wexon.software.wexon_api.commons.enums.*;
import lombok.Data;

import java.time.LocalDate;

@Data
public class TransactionDTO {

    private String id;
    private String transactionNo;
    private LocalDate transactionDate;

    private String productId;
    private String productName;

    private TransactionNature transactionNature;
    private TransactionDirection transactionDirection;

    private Boolean affectsWarehouseQuantity;
    private String warehouseId;
    private String warehouseName;

    private PartyType partyType;
    private String partyId;
    private String partyName;

    private TransactionStatus status;
    private String remarks;

    private Double netQuantity;
    private Double netUnitPrice;

}


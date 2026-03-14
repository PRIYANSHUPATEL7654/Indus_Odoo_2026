package com.wexon.software.wexon_api.modules.inventory.inventory_transaction.dto;

import com.wexon.software.wexon_api.commons.enums.PartyType;
import com.wexon.software.wexon_api.commons.enums.TransactionDirection;
import com.wexon.software.wexon_api.commons.enums.TransactionNature;
import lombok.Data;

import java.time.LocalDate;

@Data
public class TransactionCreateDTO {

    // Common For All Transaction
    private LocalDate transactionDate;
    private TransactionNature transactionNature;
    private TransactionDirection transactionDirection;
    private String productId;
    private Boolean affectsWarehouseQuantity;
    private String warehouseId;
    private PartyType partyType;
    private String partyId;
    private String remarks;

    // Hackathon / UI single-step fields (optional)
    private Boolean autoApprove;
    private String batchNo;
    private String vehicleNumber;
    private String locationId;
    private Double quantity;
    private Integer bagQuantity;
    private Double unitPrice;

}

package com.wexon.software.wexon_api.modules.inventory.batch_inventory.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class BatchInventoryDTO {

    private String id;
    private String batchNo;
    private String transactionNo;

    private String productId;
    private String productName;

    private Double availableQuantity;
    private Double totalQuantity;
    private Double rentalQuantity;

    private Boolean affectsWarehouseQuantity;
    private String warehouseId;
}
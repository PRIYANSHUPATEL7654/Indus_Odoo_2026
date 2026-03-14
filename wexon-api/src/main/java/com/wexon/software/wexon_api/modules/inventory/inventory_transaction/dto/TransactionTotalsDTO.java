package com.wexon.software.wexon_api.modules.inventory.inventory_transaction.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class TransactionTotalsDTO {
    private Double totalNetQuantity;
    private Double totalNetAmountPrice;
}


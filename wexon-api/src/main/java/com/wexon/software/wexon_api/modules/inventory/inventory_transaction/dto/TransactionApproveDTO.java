package com.wexon.software.wexon_api.modules.inventory.inventory_transaction.dto;

import com.wexon.software.wexon_api.commons.enums.TransactionNature;
import lombok.Data;

@Data
public class TransactionApproveDTO {
    private TransactionNature transactionNature;
}

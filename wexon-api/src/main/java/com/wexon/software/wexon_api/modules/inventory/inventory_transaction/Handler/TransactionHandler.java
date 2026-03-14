package com.wexon.software.wexon_api.modules.inventory.inventory_transaction.Handler;

import com.wexon.software.wexon_api.commons.enums.TransactionNature;
import com.wexon.software.wexon_api.modules.inventory.inventory_transaction.dto.TransactionApproveDTO;
import com.wexon.software.wexon_api.modules.inventory.inventory_transaction.dto.TransactionCreateDTO;

public interface TransactionHandler {

    TransactionNature getTransactionNature();
    String handleCreate(TransactionCreateDTO dto);
    String handleApproved(String id, TransactionApproveDTO dto);
    void handlePosted();
    void handleCanceled();

}

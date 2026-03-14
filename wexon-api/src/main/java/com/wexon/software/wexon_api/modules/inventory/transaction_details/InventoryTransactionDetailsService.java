package com.wexon.software.wexon_api.modules.inventory.transaction_details;

import com.wexon.software.wexon_api.modules.inventory.transaction_details.dto.TransactionDetailRequestDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Map;

public interface InventoryTransactionDetailsService {

    InventoryTransactionDetails createTransactionDetails(String transactionId, TransactionDetailRequestDTO dto);

    InventoryTransactionDetails updateTransactionDetails(String id, TransactionDetailRequestDTO dto);

    String deleteTransactionDetails(String id);

    InventoryTransactionDetails getTransactionDetail(String id);

    List<InventoryTransactionDetails> getTransactionDetailListWithFilter(
            Map<String, Object> filters
    );

    Page<InventoryTransactionDetails> getTransactionDetailWithPaginationAndFilter(
            Map<String, Object> filters,
            Pageable pageable
    );

}

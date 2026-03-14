package com.wexon.software.wexon_api.modules.inventory.batch_inventory;

import com.wexon.software.wexon_api.modules.inventory.batch_inventory.dto.BatchInventoryDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Map;

public interface BatchInventoryService {

    void createBatchInventory(
             String batchNo,
             String transactionNo,
             String productId,
             Double availableQuantity,
             Double totalQuantity,
             Double rentalQuantity,
             Boolean affectsWarehouseQuantity,
             String warehouseId
    );

    void createBatchInventory(
            String batchNo,
            String transactionNo,
            String productId,
            Double availableQuantity,
            Double totalQuantity,
            Double rentalQuantity,
            Boolean affectsWarehouseQuantity
    );

    BatchInventory reduceQuantity(
            String batchNo,
            Double quantity
    );

    List<BatchInventoryDTO> getBatchInventoryListWithFilter(
            Map<String, Object> filters,
            String searchText
    );

    Page<BatchInventoryDTO> getBatchInventoryListWithPaginationAndFilter(
            Map<String, Object> filters,
            String searchText,
            Pageable pageable
    );


}

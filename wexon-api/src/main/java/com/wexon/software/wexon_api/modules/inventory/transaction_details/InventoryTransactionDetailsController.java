package com.wexon.software.wexon_api.modules.inventory.transaction_details;

import com.wexon.software.wexon_api.commons.responses.successResponse.ApiResult;
import com.wexon.software.wexon_api.modules.inventory.transaction_details.dto.TransactionDetailRequestDTO;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/inventory/transactions/details")
@RequiredArgsConstructor
@Tag(name = "Inventory Transaction Details APIs", description = "Inventory Stock In, Stock Out & Transactions")
public class InventoryTransactionDetailsController {
    
    private final InventoryTransactionDetailsService inventoryTransactionDetailsService;

    @PostMapping("/create/{transactionId}")
    public ApiResult<InventoryTransactionDetails> createProduct(
            @PathVariable String transactionId,
            @Valid @RequestBody TransactionDetailRequestDTO dto
    ) {
        var data = inventoryTransactionDetailsService.createTransactionDetails(transactionId, dto);
        return new ApiResult<>(
                HttpStatus.CREATED,
                "Inventory Transaction Details created successfully",
                data);

    }

    @PutMapping("/update/{id}")
    public ApiResult<InventoryTransactionDetails> updateTransactionDetail(
            @PathVariable String id,
            @Valid @RequestBody TransactionDetailRequestDTO dto
    ) {

        var data = inventoryTransactionDetailsService.updateTransactionDetails(id, dto);
        return new ApiResult<>(
                HttpStatus.OK,
                "Inventory Transaction Details updated successfully",
                data);

    }

    @DeleteMapping("/delete/{id}")
    public ApiResult<String> deleteTransactionDetail(@PathVariable String id) {

        var data = inventoryTransactionDetailsService.deleteTransactionDetails(id);
        return new ApiResult<>(
                HttpStatus.OK,
                "Inventory Transaction Details deleted successfully",
                data);

    }

    @GetMapping("/getTransactionDetail/{id}")
    public ApiResult<InventoryTransactionDetails> getTransactionDetail(@PathVariable String id) {

        var data = inventoryTransactionDetailsService.getTransactionDetail(id);
        return new ApiResult<>(
                HttpStatus.OK,
                "Inventory Transaction Details fetched successfully",
                data);

    }

    @PostMapping("/getTransactionDetailListWithFilter")
    public ApiResult<List<InventoryTransactionDetails>> getTransactionDetailListWithFilter(
            @RequestBody(required = false)
            Map<String, Object> filters
    ) {

        var data = inventoryTransactionDetailsService.getTransactionDetailListWithFilter(filters);

        return new ApiResult<>(
                HttpStatus.OK,
                "Inventory Transaction Details list fetched successfully",
                data);

    }

    @PostMapping("/getTransactionDetailWithPaginationAndFilter")
    public ApiResult<Page<InventoryTransactionDetails>> getTransactionDetailWithPaginationAndFilter(
            @RequestBody(required = false)
            Map<String, Object> filters,
            @PageableDefault(
                    size = 20,
                    sort = "createdAt",
                    direction = Sort.Direction.DESC
            )
            Pageable pageable
    ) {

        var data = inventoryTransactionDetailsService.getTransactionDetailWithPaginationAndFilter(
                filters,
                pageable
        );

        return new ApiResult<>(
                HttpStatus.OK,
                "Inventory Transaction Details list fetched successfully with pagination",
                data
        );

    }
    
}

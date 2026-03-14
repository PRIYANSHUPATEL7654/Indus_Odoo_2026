package com.wexon.software.wexon_api.modules.inventory.inventory_transaction;

import com.wexon.software.wexon_api.commons.responses.successResponse.ApiResult;
import com.wexon.software.wexon_api.modules.inventory.inventory_transaction.dto.TransactionApproveDTO;
import com.wexon.software.wexon_api.modules.inventory.inventory_transaction.dto.TransactionCreateDTO;
import com.wexon.software.wexon_api.modules.inventory.inventory_transaction.dto.TransactionDTO;
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
@RequestMapping("/api/v1/inventory/transactions")
@RequiredArgsConstructor
@Tag(name = "Inventory Transaction APIs", description = "Inventory Stock In, Stock Out & Transactions")
public class InventoryTransactionController {

    private final InventoryTransactionService inventoryTransactionService;

    @PostMapping("/processCreate")
    public ApiResult<String> processCreate(
            @Valid
            @RequestBody TransactionCreateDTO dto
    ) {

        var data = inventoryTransactionService.processCreate(dto);

        return new ApiResult<>(
                HttpStatus.CREATED,
                "Your stock transaction has been created successfully",
                data
        );

    }

    @PostMapping("/processApproval/{id}")
    public ApiResult<String> processApproval(
            @PathVariable String id,
            @Valid @RequestBody TransactionApproveDTO dto
    ) {

        var data = inventoryTransactionService.processApproval(id, dto);

        return new ApiResult<>(
                HttpStatus.CREATED,
                "Your stock transaction has been created successfully",
                data
        );

    }

    @GetMapping("/getInventoryTransaction/{id}")
    public ApiResult<TransactionDTO> getInventoryTransaction(
            @PathVariable String id
    ) {

        var data = inventoryTransactionService.getInventoryTransaction(id);

        return new ApiResult<>(
                HttpStatus.OK,
                "Transaction list fetched successfully",
                data
        );
    }

    @DeleteMapping("/deleteInventoryTransaction/{id}")
    private ApiResult<String> deleteInventoryTransaction(
            @PathVariable String id
    ) {

        var data = inventoryTransactionService.deleteInventoryTransaction(id);

        return new ApiResult<>(
                HttpStatus.OK,
                "Transaction deleted successfully",
                data
        );

    }

    @PostMapping("/getTransactionListWithFilter")
    public ApiResult<List<TransactionDTO>> getTransactionListWithFilter(
            @RequestBody(required = false)
            Map<String, Object> filters
    ) {

        var data = inventoryTransactionService.getTransactionListWithFilter(
                filters
        );

        return new ApiResult<>(
                HttpStatus.OK,
                "Transaction list fetched successfully",
                data);

    }

    @PostMapping("/getTransactionListWithPaginationAndFilter")
    public ApiResult<Page<TransactionDTO>> getTransactionListWithPaginationAndFilter(
            @RequestBody(required = false)
            Map<String, Object> filters,
            @PageableDefault(
                    size = 20,
                    sort = "createdAt",
                    direction = Sort.Direction.DESC
            )
            Pageable pageable
    ) {

        var data = inventoryTransactionService.getTransactionListWithPaginationAndFilter(
                filters,
                pageable
        );

        return new ApiResult<>(
                HttpStatus.OK,
                "Transaction list fetched successfully with pagination",
                data
        );

    }
}

package com.wexon.software.wexon_api.modules.inventory.batch_inventory;

import com.wexon.software.wexon_api.commons.responses.successResponse.ApiResult;
import com.wexon.software.wexon_api.modules.inventory.batch_inventory.dto.BatchInventoryDTO;
import io.swagger.v3.oas.annotations.tags.Tag;
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
@RequestMapping("/api/v1/inventory/batch-inventory")
@RequiredArgsConstructor
@Tag(name = "Batch Inventory APIs", description = "Batch wise inventory management")
public class BatchInventoryController {

    private final BatchInventoryService batchInventoryService;

    @PostMapping("/getBatchInventoryListWithFilter")
    public ApiResult<List<BatchInventoryDTO>> getBatchInventoryListWithFilter(
            @RequestBody(required = false) Map<String, Object> filters,
            @RequestParam(required = false) String searchText
    ) {

        var data = batchInventoryService.getBatchInventoryListWithFilter(
                filters,
                searchText
        );

        return new ApiResult<>(
                HttpStatus.OK,
                "Batch inventory list fetched successfully",
                data
        );

    }

    @PostMapping("/getBatchInventoryListWithPaginationAndFilter")
    public ApiResult<Page<BatchInventoryDTO>> getBatchInventoryListWithPaginationAndFilter(
            @RequestBody(required = false) Map<String, Object> filters,
            @RequestParam(required = false) String searchText,
            @PageableDefault(
                    size = 20,
                    sort = "createdAt",
                    direction = Sort.Direction.DESC
            )
            Pageable pageable
    ) {

        var data = batchInventoryService.getBatchInventoryListWithPaginationAndFilter(
                filters,
                searchText,
                pageable
        );

        return new ApiResult<>(
                HttpStatus.OK,
                "Batch inventory list fetched successfully with pagination",
                data
        );
    }
}

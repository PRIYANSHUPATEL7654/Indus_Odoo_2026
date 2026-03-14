package com.wexon.software.wexon_api.modules.warehouse.core;

import com.wexon.software.wexon_api.commons.responses.successResponse.ApiResult;
import com.wexon.software.wexon_api.modules.warehouse.core.dtos.WarehouseDashboardStatsDTO;
import com.wexon.software.wexon_api.modules.warehouse.core.dtos.WarehouseRequestDTO;
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
@RequestMapping("/api/v1/warehouse")
@RequiredArgsConstructor
@Tag(name = "Warehouse APIs", description = "Warehouse Management APIs")
public class WarehouseController {

    private final WarehouseService warehouseService;

    @PostMapping("/create")
    public ApiResult<WarehouseModel> createWarehouse(
            @Valid
            @RequestBody WarehouseRequestDTO dto
    ) {

        var data = warehouseService.createWarehouse(dto);
        return new ApiResult<>(
                HttpStatus.CREATED,
                "Warehouse created successfully",
                data
        );

    }

    @PutMapping("/update/{id}")
    public ApiResult<WarehouseModel> updateWarehouse(
            @PathVariable String id,
            @Valid
            @RequestBody WarehouseRequestDTO dto
    ) {

        var data = warehouseService.updateWarehouse(id, dto);
        return new ApiResult<>(
                HttpStatus.OK,
                "Warehouse updated successfully",
                data
        );

    }

    @DeleteMapping("/delete/{id}")
    public ApiResult<String> deleteWarehouse(
            @PathVariable String id
    ) {

        var data = warehouseService.deleteWarehouse(id);
        return new ApiResult<>(
                HttpStatus.OK,
                "Warehouse deleted successfully",
                data
        );

    }

    @GetMapping("/get/{id}")
    public ApiResult<WarehouseModel> getWarehouse(
            @PathVariable String id
    ) {

        var data = warehouseService.getWarehouse(id);
        return new ApiResult<>(
                HttpStatus.OK,
                "Warehouse fetched successfully",
                data
        );

    }

    @PostMapping("/getWarehouseListWithFilter")
    public ApiResult<List<WarehouseModel>> getWarehouseListWithFilter(
            @RequestParam(required = false)
            String searchText,
            @RequestBody(required = false)
            Map<String, Object> filters
    ) {

        var data = warehouseService.getWarehouseListWithFilter(
                searchText,
                filters
        );
        return new ApiResult<>(
                HttpStatus.OK,
                "Warehouse list fetched successfully",
                data
        );

    }

    @PostMapping("/getWarehouseListWithPaginationAndFilter")
    public ApiResult<Page<WarehouseModel>> getWarehouseListWithPaginationAndFilter(
            @RequestParam(required = false)
            String searchText,
            @RequestBody(required = false)
            Map<String, Object> filters,
            @PageableDefault(
                    size = 20,
                    sort = "createdAt",
                    direction = Sort.Direction.DESC
            )
            Pageable pageable
    ) {

        var data = warehouseService.getWarehouseListWithPaginationAndFilter(searchText, filters, pageable);
        return new ApiResult<>(
                HttpStatus.OK,
                "Warehouse list fetched successfully with pagination",
                data
        );

    }

    @GetMapping("/getStats")
    public ApiResult<WarehouseDashboardStatsDTO> getWarehouseDashboardStats() {

        var data = warehouseService.getWarehouseDashboardStats();

        return new ApiResult<>(
                HttpStatus.OK,
                "Warehouse dashboard stats fetched successfully",
                data
        );
    }

}

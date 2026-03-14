package com.wexon.software.wexon_api.modules.warehouse.locations;

import com.wexon.software.wexon_api.commons.responses.successResponse.ApiResult;
import com.wexon.software.wexon_api.modules.warehouse.locations.dtos.WarehouseLocationRequestDTO;
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
@RequestMapping("/api/v1/warehouse/locations")
@RequiredArgsConstructor
@Tag(name = "Warehouse Location APIs", description = "Warehouse Location Management APIs")
public class WarehouseLocationController {

    private final WarehouseLocationService warehouseLocationService;

    @PostMapping("/create")
    public ApiResult<WarehouseLocationModel> create(@Valid @RequestBody WarehouseLocationRequestDTO dto) {
        var data = warehouseLocationService.create(dto);
        return new ApiResult<>(HttpStatus.CREATED, "Location created successfully", data);
    }

    @PutMapping("/update/{id}")
    public ApiResult<WarehouseLocationModel> update(@PathVariable String id, @Valid @RequestBody WarehouseLocationRequestDTO dto) {
        var data = warehouseLocationService.update(id, dto);
        return new ApiResult<>(HttpStatus.OK, "Location updated successfully", data);
    }

    @DeleteMapping("/delete/{id}")
    public ApiResult<String> delete(@PathVariable String id) {
        var data = warehouseLocationService.delete(id);
        return new ApiResult<>(HttpStatus.OK, "Location deleted successfully", data);
    }

    @GetMapping("/get/{id}")
    public ApiResult<WarehouseLocationModel> get(@PathVariable String id) {
        var data = warehouseLocationService.get(id);
        return new ApiResult<>(HttpStatus.OK, "Location fetched successfully", data);
    }

    @PostMapping("/getAll")
    public ApiResult<List<WarehouseLocationModel>> getAll(
            @RequestParam(required = false) String searchText,
            @RequestBody(required = false) Map<String, Object> filters
    ) {
        var data = warehouseLocationService.getListWithFilter(searchText, filters);
        return new ApiResult<>(HttpStatus.OK, "Location list fetched successfully", data);
    }

    @PostMapping("/getAllWithPagination")
    public ApiResult<Page<WarehouseLocationModel>> getAllWithPagination(
            @RequestParam(required = false) String searchText,
            @RequestBody(required = false) Map<String, Object> filters,
            @PageableDefault(size = 20, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable
    ) {
        var data = warehouseLocationService.getListWithPaginationAndFilter(searchText, filters, pageable);
        return new ApiResult<>(HttpStatus.OK, "Location list fetched successfully with pagination", data);
    }
}


package com.wexon.software.wexon_api.modules.warehouse.core;

import com.wexon.software.wexon_api.modules.warehouse.core.dtos.WarehouseDashboardStatsDTO;
import com.wexon.software.wexon_api.modules.warehouse.core.dtos.WarehouseRequestDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Map;


public interface WarehouseService {

    WarehouseModel createWarehouse(WarehouseRequestDTO dto);

    WarehouseModel updateWarehouse(String id, WarehouseRequestDTO dto);

    String deleteWarehouse(String id);

    WarehouseModel getWarehouse(String id);

    List<WarehouseModel> getWarehouseListWithFilter(
            String searchText,
            Map<String, Object> filters
    );

    Page<WarehouseModel> getWarehouseListWithPaginationAndFilter(
            String searchText,
            Map<String, Object> filters,
            Pageable pageable
    );

    WarehouseDashboardStatsDTO getWarehouseDashboardStats();


}




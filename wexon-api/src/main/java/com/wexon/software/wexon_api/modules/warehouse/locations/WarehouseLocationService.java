package com.wexon.software.wexon_api.modules.warehouse.locations;

import com.wexon.software.wexon_api.modules.warehouse.locations.dtos.WarehouseLocationRequestDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Map;

public interface WarehouseLocationService {
    WarehouseLocationModel create(WarehouseLocationRequestDTO dto);
    WarehouseLocationModel update(String id, WarehouseLocationRequestDTO dto);
    String delete(String id);
    WarehouseLocationModel get(String id);
    List<WarehouseLocationModel> getListWithFilter(String searchText, Map<String, Object> filters);
    Page<WarehouseLocationModel> getListWithPaginationAndFilter(String searchText, Map<String, Object> filters, Pageable pageable);
}


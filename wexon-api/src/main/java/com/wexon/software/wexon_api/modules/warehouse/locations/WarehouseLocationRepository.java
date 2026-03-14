package com.wexon.software.wexon_api.modules.warehouse.locations;

import org.springframework.data.mongodb.repository.MongoRepository;

public interface WarehouseLocationRepository extends MongoRepository<WarehouseLocationModel, String> {
    boolean existsByWarehouseIdAndLocationCodeAndIsDeletedFalse(String warehouseId, String locationCode);
}


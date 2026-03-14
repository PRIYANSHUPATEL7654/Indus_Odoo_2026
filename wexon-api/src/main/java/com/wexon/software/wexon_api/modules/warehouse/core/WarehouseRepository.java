package com.wexon.software.wexon_api.modules.warehouse.core;

import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface WarehouseRepository extends MongoRepository<WarehouseModel, String> {
    Optional<WarehouseModel> findByIdAndIsDeletedFalse(String id);
    boolean existsByContactNumber(String contactNumber);
}

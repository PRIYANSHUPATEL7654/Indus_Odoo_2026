package com.wexon.software.wexon_api.modules.products;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ProductRepository extends MongoRepository<ProductModel, String> {
    Optional<ProductModel> findByIdAndIsDeletedFalse(String id);
    boolean existsBySku(String sku);
}

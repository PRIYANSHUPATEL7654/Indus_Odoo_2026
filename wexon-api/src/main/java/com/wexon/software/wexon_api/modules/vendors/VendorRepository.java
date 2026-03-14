package com.wexon.software.wexon_api.modules.vendors;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface VendorRepository extends MongoRepository<VendorModel, String> {
    boolean existsByMobileNumberAndIsDeletedFalse(String mobileNumber);
    Optional<VendorModel> findByIdAndIsDeletedFalse(String id);
}

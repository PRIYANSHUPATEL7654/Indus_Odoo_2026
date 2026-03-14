package com.wexon.software.wexon_api.modules.users.repositories;

import com.wexon.software.wexon_api.modules.users.models.UserModel;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends MongoRepository<UserModel, String> {
    Optional<UserModel> getUserModelByEmail(String email);
    Optional<UserModel> findByEmail(String email);
    boolean existsByEmail(String email);
    boolean existsByMobileNumber(String mobileNumber);
}

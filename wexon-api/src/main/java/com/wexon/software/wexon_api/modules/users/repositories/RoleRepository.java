package com.wexon.software.wexon_api.modules.users.repositories;

import com.wexon.software.wexon_api.modules.users.models.RoleModel;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface RoleRepository extends MongoRepository<RoleModel, String> {
    Optional<RoleModel> findByRoleCode(String roleCode);
}

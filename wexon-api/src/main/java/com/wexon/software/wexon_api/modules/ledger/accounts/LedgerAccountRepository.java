package com.wexon.software.wexon_api.modules.ledger.accounts;

import com.wexon.software.wexon_api.commons.enums.EntityType;
import com.wexon.software.wexon_api.commons.enums.PartyType;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface LedgerAccountRepository extends MongoRepository<LedgerAccountModel, String> {

    boolean existsByEntityRefIdAndEntityType(
            String entityRefId,
            EntityType entityType
    );

    LedgerAccountModel findByEntityRefId(String entityRefId);
    Optional<LedgerAccountModel> findByEntityType(EntityType entityType);
    Optional<LedgerAccountModel> findByEntityRefIdAndEntityType(String entityRefId, EntityType entityType);
}

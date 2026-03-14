package com.wexon.software.wexon_api.migrations;

import io.mongock.api.annotations.ChangeUnit;
import io.mongock.api.annotations.Execution;
import io.mongock.api.annotations.RollbackExecution;
import org.bson.Document;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;

import java.util.List;

@ChangeUnit(id = "v1_3_roles_seed", order = "4", author = "Codex")
public class V1_3_RolesSeedMigration {

    private static final String COLLECTION = "user_roles";

    @Execution
    public void seedRoles(MongoTemplate mongoTemplate) {
        ensureRole(mongoTemplate, "SUPER_ADMIN", "Super Admin",
                "Full system access to all modules and operations.");
        ensureRole(mongoTemplate, "ADMIN", "Admin",
                "Administrative access to manage master data and operations.");
        ensureRole(mongoTemplate, "MANAGER", "Manager",
                "Operations manager access for day-to-day warehouse workflows.");
        ensureRole(mongoTemplate, "STAFF", "Staff",
                "Basic access to create and view operational transactions.");
    }

    private void ensureRole(
            MongoTemplate mongoTemplate,
            String roleCode,
            String roleName,
            String roleDescription
    ) {
        boolean exists = mongoTemplate.exists(
                Query.query(Criteria.where("roleCode").is(roleCode)),
                COLLECTION
        );
        if (exists) return;

        Document role = new Document()
                .append("roleCode", roleCode)
                .append("roleName", roleName)
                .append("roleDescription", roleDescription)
                .append("features", List.of());

        mongoTemplate.save(role, COLLECTION);
    }

    @RollbackExecution
    public void rollback(MongoTemplate mongoTemplate) {
        mongoTemplate.remove(
                Query.query(Criteria.where("roleCode").in("ADMIN", "MANAGER", "STAFF")),
                COLLECTION
        );
    }
}


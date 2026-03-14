package com.wexon.software.wexon_api.migrations;

import io.mongock.api.annotations.ChangeUnit;
import io.mongock.api.annotations.Execution;
import io.mongock.api.annotations.RollbackExecution;
import org.bson.Document;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;

import java.util.List;

@ChangeUnit(id = "v1_0_default_admin", order = "1", author = "Vedant")
public class V1_0_DefaultAdminMigration {

    @Execution
    public void createSuperAdminRoleAndUser(MongoTemplate mongoTemplate) {
        // Create SUPER_ADMIN role
        boolean roleExists = mongoTemplate.exists(
                Query.query(Criteria.where("roleCode").is("SUPER_ADMIN")),
                "user_roles"
        );

        if (!roleExists) {
            Document role = new Document()
                    .append("roleCode", "SUPER_ADMIN")
                    .append("roleName", "Super Admin")
                    .append("roleDescription", "Full system access to all modules and operations.")
                    .append("features", List.of());

            mongoTemplate.save(role, "user_roles");
        }

        // Create default admin user
        boolean userExists = mongoTemplate.exists(
                Query.query(Criteria.where("email").is("admin@wexon.in")),
                "app_user"
        );

        if (!userExists) {
            Document role = mongoTemplate.findOne(
                    Query.query(Criteria.where("roleCode").is("SUPER_ADMIN")),
                    Document.class,
                    "user_roles"
            );

            if (role == null) return;

            String roleId = role.getObjectId("_id").toHexString();

            Document user = new Document()
                    .append("email", "admin@wexon.in")
                    .append("password", "$2b$12$WUN1mjB7SfulCAMdk49piuk3sOB4mAIwOzyY7ac1KOp0r3h2ylrEi")
                    .append("fullName", "Super Admin")
                    .append("mobileNumber", "9100000000")
                    .append("enabled", true)
                    .append("accountNonExpired", true)
                    .append("credentialsNonExpired", true)
                    .append("accountNonLocked", true)
                    .append("roleIds", List.of(roleId));

            mongoTemplate.save(user, "app_user");
        }
    }

    @RollbackExecution
    public void rollback(MongoTemplate mongoTemplate) {
        // Optional rollback logic
        mongoTemplate.remove(
                Query.query(Criteria.where("email").is("admin@wexon.in")),
                "app_user"
        );
        mongoTemplate.remove(
                Query.query(Criteria.where("roleCode").is("SUPER_ADMIN")),
                "user_roles"
        );
    }
}
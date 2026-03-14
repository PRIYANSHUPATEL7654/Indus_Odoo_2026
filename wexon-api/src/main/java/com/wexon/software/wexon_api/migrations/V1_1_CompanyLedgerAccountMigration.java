package com.wexon.software.wexon_api.migrations;

import com.wexon.software.wexon_api.commons.enums.BalanceType;
import com.wexon.software.wexon_api.commons.enums.EntityType;
import io.mongock.api.annotations.ChangeUnit;
import io.mongock.api.annotations.Execution;
import io.mongock.api.annotations.RollbackExecution;
import org.bson.Document;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;

@ChangeUnit(id = "v1_1_company_ledger_account", order = "2", author = "Vedant")
public class V1_1_CompanyLedgerAccountMigration {

    private static final String COLLECTION = "ledger_account";
    private static final String COMPANY_REF_ID = "COMPANY";

    @Execution
    public void createCompanyLedgerAccount(MongoTemplate mongoTemplate) {

        boolean exists = mongoTemplate.exists(
                Query.query(
                        Criteria.where("entityType").is(EntityType.COMPANY)
                                .and("entityRefId").is(COMPANY_REF_ID)
                ),
                COLLECTION
        );

        if (exists) {
            return;
        }

        Document companyLedger = new Document()
                .append("entityRefId", COMPANY_REF_ID)
                .append("entityType", EntityType.COMPANY.name())
                .append("accountName", "Inventory Account")
                .append("accountNumber", COMPANY_REF_ID)
                .append("openingBalance", 0.0)
                .append("openingType", BalanceType.DEBIT.name())
                .append("totalDebit", 0.0)
                .append("totalCredit", 0.0)
                .append("currentBalance", 0.0)
                .append("balanceType", BalanceType.DEBIT.name())
                .append("active", true);

        mongoTemplate.save(companyLedger, COLLECTION);
    }

    @RollbackExecution
    public void rollback(MongoTemplate mongoTemplate) {
        mongoTemplate.remove(
                Query.query(
                        Criteria.where("entityType").is(EntityType.COMPANY)
                                .and("entityRefId").is(COMPANY_REF_ID)
                ),
                COLLECTION
        );
    }
}

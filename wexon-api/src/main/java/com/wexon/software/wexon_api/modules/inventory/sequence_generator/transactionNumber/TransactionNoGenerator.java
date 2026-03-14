package com.wexon.software.wexon_api.modules.inventory.sequence_generator.transactionNumber;

import com.wexon.software.wexon_api.commons.enums.TransactionDirection;
import com.wexon.software.wexon_api.commons.enums.TransactionNature;
import lombok.RequiredArgsConstructor;
import org.springframework.data.mongodb.core.FindAndModifyOptions;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Objects;

@Service
@RequiredArgsConstructor
public class TransactionNoGenerator {

    private final MongoTemplate mongoTemplate;

    public String generate(
            LocalDate transactionDate,
            TransactionNature transactionNature,
            TransactionDirection transactionDirection,
            String productId
    ) {

        String date = transactionDate
                .format(DateTimeFormatter.ofPattern("yyyyMMdd"));

        String sequenceKey = String.join("-",
                "TXN",
                date,
                productId,
                transactionNature.name(),
                transactionDirection.name()
        );

        Query query = Query.query(
                Criteria.where("_id").is(sequenceKey)
        );

        Update update = new Update().inc("sequence", 1);

        FindAndModifyOptions options = FindAndModifyOptions.options()
                .returnNew(true)
                .upsert(true);

        TransactionNoModel seq = mongoTemplate.findAndModify(
                query,
                update,
                options,
                TransactionNoModel.class
        );

        return String.format(
                "%s-%03d",
                sequenceKey,
                Objects.requireNonNull(seq).getSequence()
        );
    }
}

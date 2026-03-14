package com.wexon.software.wexon_api.modules.inventory.sequence_generator.batchNumber;


import lombok.RequiredArgsConstructor;
import org.springframework.data.mongodb.core.FindAndModifyOptions;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.Objects;

@Service
@RequiredArgsConstructor
public class BatchNoGenerator {

    private final MongoTemplate mongoTemplate;

    public String generate() {

        String date = LocalDate.now()
                .format(DateTimeFormatter.ofPattern("ddMMyyyy"));

        String sequenceKey = "BATCH-" + date;

        Query query = Query.query(
                Criteria.where("_id").is(sequenceKey)
        );

        Update update = new Update()
                .inc("sequence", 1);

        FindAndModifyOptions options = FindAndModifyOptions.options()
                .returnNew(true)
                .upsert(true);

        BatchModel batch = mongoTemplate.findAndModify(
                query,
                update,
                options,
                BatchModel.class
        );

        return String.format(
                "%s-%03d",
                sequenceKey,
                Objects.requireNonNull(batch).getSequence()
        );
    }
}

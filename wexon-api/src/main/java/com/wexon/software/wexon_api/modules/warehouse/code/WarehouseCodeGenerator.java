package com.wexon.software.wexon_api.modules.warehouse.code;

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
public class WarehouseCodeGenerator {

    private final MongoTemplate mongoTemplate;

    public String generateWarehouseCode() {

        String year = LocalDate.now().format(DateTimeFormatter.ofPattern("yyyy"));
        String sequenceKey = "WAREHOUSE-" + year;

        Query query = Query.query(
                Criteria.where("_id").is(sequenceKey)
        );

        Update update = new Update().inc("sequence", 1);

        FindAndModifyOptions options = FindAndModifyOptions.options()
                .returnNew(true)
                .upsert(true);

        WarehouseSequenceModel sequence = mongoTemplate.findAndModify(
                query,
                update,
                options,
                WarehouseSequenceModel.class
        );

        return String.format(
                "WH-%s-%03d",
                year,
                Objects.requireNonNull(sequence).getSequence()
        );
    }
}

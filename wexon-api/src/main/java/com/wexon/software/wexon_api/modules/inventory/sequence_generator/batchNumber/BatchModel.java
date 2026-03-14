package com.wexon.software.wexon_api.modules.inventory.sequence_generator.batchNumber;

import com.wexon.software.wexon_api.modules.audit.AuditMetadata;
import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "batch_sequence")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BatchModel extends AuditMetadata {

    @Id
    private String id;
    private Long sequence;

}

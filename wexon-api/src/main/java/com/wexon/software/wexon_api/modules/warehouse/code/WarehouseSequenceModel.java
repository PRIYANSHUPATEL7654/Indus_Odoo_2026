package com.wexon.software.wexon_api.modules.warehouse.code;

import com.wexon.software.wexon_api.modules.audit.AuditMetadata;
import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "warehouse_sequence")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class WarehouseSequenceModel extends AuditMetadata {

    @Id
    private String id;
    private Long sequence;
}


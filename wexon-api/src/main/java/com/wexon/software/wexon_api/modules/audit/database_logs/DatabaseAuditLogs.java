package com.wexon.software.wexon_api.modules.audit.database_logs;


import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.Map;

@Document(collection = "database_audit_logs")
@Data
public class DatabaseAuditLogs {

    @Id
    private String id;
    private String ipAddress;

    private String entityName;
    private String entityId;
    private String operation;

    private Object oldState;
    private Object newState;

    private String createdBy;
    private LocalDateTime createdAt;
    private Map<String, Object> additionalInfo;

}

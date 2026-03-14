package com.wexon.software.wexon_api.modules.audit.database_logs;


import com.wexon.software.wexon_api.modules.audit.AuditorProvider;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.bson.Document;
import org.checkerframework.checker.nullness.qual.NonNull;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.mapping.event.AbstractMongoEventListener;
import org.springframework.data.mongodb.core.mapping.event.AfterDeleteEvent;
import org.springframework.data.mongodb.core.mapping.event.AfterSaveEvent;
import org.springframework.data.mongodb.core.mapping.event.BeforeSaveEvent;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Component;

import java.lang.reflect.Field;
import java.time.LocalDateTime;
import java.util.Map;
import java.util.Objects;
import java.util.concurrent.ConcurrentHashMap;

@Component
@RequiredArgsConstructor
public class DatabaseLogEventListener extends AbstractMongoEventListener<Object> {

    private final MongoTemplate mongoTemplate;
    private final HttpServletRequest httpServletRequest;
    private final AuditorProvider auditorProvider;

    private final Map<String, Document> oldStateCache = new ConcurrentHashMap<>();


    @Override
    public void onBeforeSave(@NonNull BeforeSaveEvent<Object> event) {
        Object source = event.getSource();

        if (source instanceof DatabaseAuditLogs) {
            return;
        }

        String entityId = getEntityId(source);
        if (entityId != null) {
            String collectionName = event.getCollectionName();
            Document oldDoc = (Document) fetchOldValue(collectionName, entityId);
            if (oldDoc != null) {
                oldStateCache.put(entityId, oldDoc);
            }
        }
    }

    @Override
    public void onAfterSave(@NonNull AfterSaveEvent<Object> event) {

        Object source = event.getSource();

        if (source instanceof DatabaseAuditLogs) {
            return;
        }

        Document document = event.getDocument();
        String entityId = getEntityId(source);
        if (entityId == null && document != null) {
            entityId = extractId(document);
        }

        // If we can't resolve an ID (e.g. raw Document without _id), skip audit logging
        // to avoid null keys in the cache and unstable audit entries.
        if (entityId == null) {
            return;
        }

        boolean isNew = !oldStateCache.containsKey(entityId);

        DatabaseAuditLogs databaseAuditLogs = new DatabaseAuditLogs();
        databaseAuditLogs.setEntityName(source.getClass().getSimpleName());
        databaseAuditLogs.setEntityId(entityId);
        databaseAuditLogs.setOperation(isNew ? "CREATE" : "UPDATE");
        databaseAuditLogs.setNewState(document);

        if (!isNew) {
            Document oldValue = oldStateCache.remove(entityId);
            databaseAuditLogs.setOldState(oldValue);
        }

        databaseAuditLogs.setCreatedBy(getCurrentUser());
        databaseAuditLogs.setCreatedAt(LocalDateTime.now());
        databaseAuditLogs.setIpAddress(getClientIp());
        mongoTemplate.save(databaseAuditLogs);

    }

    @Override
    public void onAfterDelete(@NonNull AfterDeleteEvent<Object> event) {

        if ("database_audit_logs".equals(event.getCollectionName())) return;

        Document document = event.getDocument();
        if (document == null) return;

        DatabaseAuditLogs auditLog = new DatabaseAuditLogs();
        auditLog.setEntityName(
                Objects.requireNonNull(event.getType()).getSimpleName()
        );

        auditLog.setEntityId(extractId(document));

        auditLog.setOperation("DELETE");
        auditLog.setOldState(new Document(document));
        auditLog.setCreatedBy(getCurrentUser());
        auditLog.setCreatedAt(LocalDateTime.now());
        auditLog.setIpAddress(getClientIp());

        mongoTemplate.save(auditLog);
    }


    private String getEntityId(Object entity) {
        try {
            Field idField = entity.getClass().getDeclaredField("id");
            idField.setAccessible(true);
            Object id = idField.get(entity);
            return id != null ? id.toString() : null;
        } catch (Exception e) {
            return null;
        }
    }

    private String extractId(Document document) {
        Object id = document.get("_id");
        return id != null ? id.toString() : null;
    }

    private Object fetchOldValue(String collectionName, String entityId) {
        try {
            Query query = new Query(Criteria.where("_id").is(entityId));
            return mongoTemplate.findOne(query, Document.class, collectionName);
        } catch (Exception e) {
            return null;
        }
    }

    private String getCurrentUser() {
        return auditorProvider.getCurrentAuditor()
                .orElse("SYSTEM");
    }

    private String getClientIp() {
        try {
            String xForwardedFor = httpServletRequest.getHeader("X-Forwarded-For");
            if (xForwardedFor != null && !xForwardedFor.isEmpty()) {
                return xForwardedFor.split(",")[0];
            }
            return httpServletRequest.getRemoteAddr();
        } catch (Exception e) {
            return "UNKNOWN";
        }
    }

}

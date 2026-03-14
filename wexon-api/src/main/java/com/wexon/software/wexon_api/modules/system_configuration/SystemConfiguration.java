package com.wexon.software.wexon_api.modules.system_configuration;

import com.wexon.software.wexon_api.modules.audit.AuditMetadata;

public class SystemConfiguration extends AuditMetadata {

    private String id;

    private String configKey;
    private String configValue;
    private String valueType;

    private String module;
    private String description;

}

package com.wexon.software.wexon_api.modules.warehouse.core.dtos;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class WarehouseDashboardStatsDTO {

    private Long totalWarehouses;
    private Double totalCapacity;
    private Double availableCapacity;
    private Double usedCapacity;
    private Double utilizationPercentage;

}

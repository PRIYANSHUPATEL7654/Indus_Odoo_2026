package com.wexon.software.wexon_api.modules.dashboard.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class DashboardKpiDTO {

    private Long totalProducts;
    private Long distinctProductsInStock;
    private Double totalAvailableStockQuantity;

    private Long lowStockItems;
    private Long outOfStockItems;

    private Long pendingReceipts;
    private Long pendingDeliveries;
    private Long internalTransfersScheduled;
    private Long pendingAdjustments;
}


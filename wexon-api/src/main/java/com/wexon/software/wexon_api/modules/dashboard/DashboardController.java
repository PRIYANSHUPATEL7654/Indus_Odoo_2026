package com.wexon.software.wexon_api.modules.dashboard;

import com.wexon.software.wexon_api.commons.responses.successResponse.ApiResult;
import com.wexon.software.wexon_api.modules.dashboard.dto.DashboardKpiDTO;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/dashboard")
@RequiredArgsConstructor
@Tag(name = "Dashboard APIs", description = "Dashboard KPI APIs")
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping("/kpis")
    public ApiResult<DashboardKpiDTO> getKpis() {
        var data = dashboardService.getKpis();
        return new ApiResult<>(
                HttpStatus.OK,
                "Dashboard KPIs fetched successfully",
                data
        );
    }
}


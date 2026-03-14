package com.wexon.software.wexon_api.modules.vendors;

import com.wexon.software.wexon_api.commons.responses.successResponse.ApiResult;
import com.wexon.software.wexon_api.modules.vendors.dtos.VendorRequestDTO;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/vendor")
@RequiredArgsConstructor
@Tag(name = "Vendor APIs", description = "Vendor Management APIs")
public class VendorController {

    private final VendorService vendorService;

    @PostMapping("/create")
    public ApiResult<VendorModel> createVendor(
            @Valid @RequestBody VendorRequestDTO dto
    ) {

        var data = vendorService.createVendor(dto);
        return new ApiResult<>(
                HttpStatus.CREATED,
                "Vendor created successfully",
                data
        );
    }

    @PutMapping("/update/{id}")
    public ApiResult<VendorModel> updateVendor(
            @PathVariable String id,
            @Valid @RequestBody VendorRequestDTO dto
    ) {

        var data = vendorService.updateVendor(id, dto);
        return new ApiResult<>(
                HttpStatus.OK,
                "Vendor updated successfully",
                data
        );
    }

    @DeleteMapping("/delete/{id}")
    public ApiResult<String> deleteVendor(
            @PathVariable String id
    ) {

        var data = vendorService.deleteVendor(id);
        return new ApiResult<>(
                HttpStatus.OK,
                "Vendor permanently deleted successfully",
                data
        );
    }

    @GetMapping("/get/{id}")
    public ApiResult<VendorModel> getVendor(
            @PathVariable String id
    ) {

        var data = vendorService.getVendor(id);
        return new ApiResult<>(
                HttpStatus.OK,
                "Vendor fetched successfully",
                data
        );
    }

    @PostMapping("/getVendorListWithFilter")
    public ApiResult<List<VendorModel>> getVendorListWithFilter(
            @RequestParam(required = false)
            String searchText,
            @RequestBody(required = false)
            Map<String, Object> filters
    ) {

        var data = vendorService.getVendorListWithFilter(searchText, filters);
        return new ApiResult<>(
                HttpStatus.OK,
                "Vendor list fetched successfully",
                data
        );

    }

    @PostMapping("/getVendorListWithPaginationAndFilter")
    public ApiResult<Page<VendorModel>> getVendorListWithPaginationAndFilter(
            @RequestParam(required = false)
            String searchText,
            @RequestBody(required = false)
            Map<String, Object> filters,
            @PageableDefault(
                    size = 20,
                    sort = "createdAt",
                    direction = Sort.Direction.DESC
            )
            Pageable pageable
    ) {

        var data = vendorService.getVendorListWithPaginationAndFilter(
                searchText,
                filters,
                pageable
        );

        return new ApiResult<>(
                HttpStatus.OK,
                "Vendor list fetched successfully with pagination",
                data
        );

    }

}

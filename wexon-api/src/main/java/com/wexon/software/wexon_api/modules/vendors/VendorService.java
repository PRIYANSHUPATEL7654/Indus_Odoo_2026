package com.wexon.software.wexon_api.modules.vendors;

import com.wexon.software.wexon_api.modules.vendors.dtos.VendorRequestDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import java.util.List;
import java.util.Map;

public interface VendorService {

    VendorModel createVendor(VendorRequestDTO dto);

    VendorModel updateVendor(String id, VendorRequestDTO dto);

    String deleteVendor(String id);

    VendorModel getVendor(String id);

    List<VendorModel> getVendorListWithFilter(
            String searchText,
            Map<String, Object> filters
    );

    Page<VendorModel> getVendorListWithPaginationAndFilter(
            String searchText,
            Map<String, Object> filters,
            Pageable pageable
    );
}

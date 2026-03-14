package com.wexon.software.wexon_api.modules.vendors;

import com.wexon.software.wexon_api.commons.exceptions.ErrorCode;
import com.wexon.software.wexon_api.commons.exceptions.ExtendedException.BusinessException;
import com.wexon.software.wexon_api.modules.vendors.dtos.VendorRequestDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

@Service
@RequiredArgsConstructor
public class VendorServiceImplementation implements VendorService {

    private final VendorRepository vendorRepository;
    private final MongoTemplate mongoTemplate;

    @Override
    @Transactional
    public VendorModel createVendor(VendorRequestDTO dto) {

        if (vendorRepository.existsByMobileNumberAndIsDeletedFalse(dto.getMobileNumber())) {
            throw new BusinessException(
                    ErrorCode.VENDOR_ALREADY_EXISTS.message(),
                    ErrorCode.VENDOR_ALREADY_EXISTS.code()
            );
        }

        VendorModel vendor = VendorModel.builder()
                .vendorName(dto.getVendorName())
                .companyName(dto.getCompanyName())
                .email(dto.getEmail())
                .mobileNumber(dto.getMobileNumber())
                .gstNumber(dto.getGstNumber())
                .addressLine1(dto.getAddressLine1())
                .addressLine2(dto.getAddressLine2())
                .village(dto.getVillage())
                .taluka(dto.getTaluka())
                .district(dto.getDistrict())
                .city(dto.getCity())
                .state(dto.getState())
                .pincode(dto.getPincode())
                .isActive(dto.getIsActive())
                .isDeleted(false)
                .build();

        return vendorRepository.save(vendor);

    }


    @Override
    public VendorModel updateVendor(String id, VendorRequestDTO dto) {

        VendorModel existingVendor = vendorRepository.findByIdAndIsDeletedFalse(id)
                .orElseThrow(() -> new BusinessException(
                        ErrorCode.VENDOR_NOT_FOUND.message(),
                        ErrorCode.VENDOR_NOT_FOUND.code()
                ));

        existingVendor.setVendorName(dto.getVendorName());
        existingVendor.setCompanyName(dto.getCompanyName());
        existingVendor.setEmail(dto.getEmail());
        existingVendor.setGstNumber(dto.getGstNumber());
        existingVendor.setAddressLine1(dto.getAddressLine1());
        existingVendor.setAddressLine2(dto.getAddressLine2());
        existingVendor.setVillage(dto.getVillage());
        existingVendor.setTaluka(dto.getTaluka());
        existingVendor.setDistrict(dto.getDistrict());
        existingVendor.setCity(dto.getCity());
        existingVendor.setState(dto.getState());
        existingVendor.setPincode(dto.getPincode());
        existingVendor.setIsActive(dto.getIsActive());

        return vendorRepository.save(existingVendor);
    }


    @Override
    public String deleteVendor(String id) {

        VendorModel existingVendor = vendorRepository.findByIdAndIsDeletedFalse(id)
                .orElseThrow(() -> new BusinessException(
                        ErrorCode.VENDOR_NOT_FOUND.message(),
                        ErrorCode.VENDOR_NOT_FOUND.code()
                ));

        existingVendor.setIsDeleted(true);
        vendorRepository.delete(existingVendor);
        return id;

    }

    @Override
    public VendorModel getVendor(String id) {

        return vendorRepository.findByIdAndIsDeletedFalse(id)
                .orElseThrow(() -> new BusinessException(
                        ErrorCode.VENDOR_NOT_FOUND.message(),
                        ErrorCode.VENDOR_NOT_FOUND.code()
                ));

    }

    @Override
    public List<VendorModel> getVendorListWithFilter(
            String searchText,
            Map<String, Object> filters
    ) {

        List<Criteria> criteriaList = new ArrayList<>();

        // Exclude soft-deleted vendors
        criteriaList.add(Criteria.where("isDeleted").is(false));

        // Search name, mobile and company
        if (searchText != null && !searchText.isBlank() && !searchText.trim().isEmpty()) {
            criteriaList.add(
                    new Criteria().orOperator(
                            Criteria.where("vendorName").regex(searchText, "iu"),
                            Criteria.where("mobileNumber").regex(searchText, "i"),
                            Criteria.where("companyName").regex(searchText, "iu")
                    )
            );
        }

        // Dynamic filters
        if (filters != null && !filters.isEmpty()) {
            for (Map.Entry<String, Object> entry : filters.entrySet()) {
                Object value = entry.getValue();
                if (value != null && !value.toString().isBlank()) {
                    criteriaList.add(Criteria.where(entry.getKey()).is(value));
                }
            }
        }

        // Combine Query
        Criteria criteria = new Criteria();
        if (!criteriaList.isEmpty()) {
            criteria = new Criteria().andOperator(
                    criteriaList.toArray(new Criteria[0])
            );
        }

        Query query = new Query(criteria).with(Sort.by(Sort.Direction.DESC, "updatedAt"));
        return mongoTemplate.find(query, VendorModel.class);

    }

    @Override
    public Page<VendorModel> getVendorListWithPaginationAndFilter(
            String searchText,
            Map<String, Object> filters,
            Pageable pageable
    ) {

        List<Criteria> criteriaList = new ArrayList<>();

       // Exclude soft-deleted vendors
        criteriaList.add(Criteria.where("isDeleted").is(false));

        // Search name, mobile and company
        if (searchText != null && !searchText.isBlank() && !searchText.trim().isEmpty()) {
            criteriaList.add(
                    new Criteria().orOperator(
                            Criteria.where("vendorName").regex(searchText, "iu"),
                            Criteria.where("mobileNumber").regex(searchText, "i"),
                            Criteria.where("companyName").regex(searchText, "iu")
                    )
            );
        }

        // Dynamic filters
        if (filters != null && !filters.isEmpty()) {
            for (Map.Entry<String, Object> entry : filters.entrySet()) {
                Object value = entry.getValue();
                if (value != null && !value.toString().isBlank()) {
                    criteriaList.add(Criteria.where(entry.getKey()).is(value));
                }
            }
        }

        // Combine Query
        Criteria criteria = new Criteria();
        if (!criteriaList.isEmpty()) {
            criteria = new Criteria().andOperator(
                    criteriaList.toArray(new Criteria[0])
            );
        }

        Query query = new Query(criteria).with(pageable);
        List<VendorModel> vendorList = mongoTemplate.find(query, VendorModel.class);
        long totalCount = mongoTemplate.count(
                        Query.of(query).limit(-1).skip(-1),
                        VendorModel.class
                );

        return new PageImpl<>(vendorList, pageable, totalCount);

    }
}

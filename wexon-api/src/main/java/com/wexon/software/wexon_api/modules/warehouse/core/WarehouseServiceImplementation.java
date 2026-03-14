package com.wexon.software.wexon_api.modules.warehouse.core;

import com.wexon.software.wexon_api.commons.exceptions.ErrorCode;
import com.wexon.software.wexon_api.commons.exceptions.ExtendedException.BusinessException;
import com.wexon.software.wexon_api.modules.warehouse.code.WarehouseCodeGenerator;
import com.wexon.software.wexon_api.modules.warehouse.core.dtos.WarehouseDashboardStatsDTO;
import com.wexon.software.wexon_api.modules.warehouse.core.dtos.WarehouseRequestDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;
import lombok.RequiredArgsConstructor;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class WarehouseServiceImplementation implements WarehouseService {

    private final WarehouseRepository warehouseRepository;
    private final WarehouseCodeGenerator warehouseCodeGenerator;
    private final MongoTemplate mongoTemplate;

    @Override
    public WarehouseModel createWarehouse(WarehouseRequestDTO dto) {

        if (warehouseRepository.existsByContactNumber(dto.getContactNumber())) {
            throw new BusinessException(
                    ErrorCode.WAREHOUSE_ALREADY_EXISTS.message(),
                    ErrorCode.WAREHOUSE_ALREADY_EXISTS.code()
            );
        }

        String warehouseCode = warehouseCodeGenerator.generateWarehouseCode();

        WarehouseModel newWarehouse = WarehouseModel.builder()
                .warehouseName(dto.getWarehouseName())
                .warehouseCode(warehouseCode)
                .ownerName(dto.getOwnerName())
                .contactNumber(dto.getContactNumber())
                .totalCapacity(dto.getTotalCapacity())
                .availableCapacity(dto.getTotalCapacity())
                .usedCapacity(0.00)
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

        return warehouseRepository.save(newWarehouse);

    }

    @Override
    public WarehouseModel updateWarehouse(String id, WarehouseRequestDTO dto) {

        WarehouseModel existingWarehouse = warehouseRepository.findById(id)
                .orElseThrow(() -> new BusinessException(
                        ErrorCode.WAREHOUSE_NOT_FOUND.message(),
                        ErrorCode.WAREHOUSE_NOT_FOUND.code()
                ));

        // Do NOT update warehouseCode
        // Do NOT update contactNumber
        existingWarehouse.setWarehouseName(dto.getWarehouseName());
        existingWarehouse.setOwnerName(dto.getOwnerName());
        existingWarehouse.setTotalCapacity(dto.getTotalCapacity());
        existingWarehouse.setAddressLine1(dto.getAddressLine1());
        existingWarehouse.setAddressLine2(dto.getAddressLine2());
        existingWarehouse.setVillage(dto.getVillage());
        existingWarehouse.setTaluka(dto.getTaluka());
        existingWarehouse.setDistrict(dto.getDistrict());
        existingWarehouse.setCity(dto.getCity());
        existingWarehouse.setState(dto.getState());
        existingWarehouse.setPincode(dto.getPincode());
        existingWarehouse.setIsActive(dto.getIsActive());

        return warehouseRepository.save(existingWarehouse);
    }


    @Override
    public String deleteWarehouse(String id) {

        WarehouseModel existingWarehouse = warehouseRepository.findById(id)
                .orElseThrow(() -> new BusinessException(
                        ErrorCode.WAREHOUSE_NOT_FOUND.message(),
                        ErrorCode.WAREHOUSE_NOT_FOUND.code()
                ));
        existingWarehouse.setIsDeleted(true);
        warehouseRepository.save(existingWarehouse);
        return id;

    }

    @Override
    public WarehouseModel getWarehouse(String id) {

        return warehouseRepository.findByIdAndIsDeletedFalse(id)
                .orElseThrow(() -> new BusinessException(
                        ErrorCode.WAREHOUSE_NOT_FOUND.message(),
                        ErrorCode.WAREHOUSE_NOT_FOUND.code()
                ));

    }

    @Override
    public List<WarehouseModel> getWarehouseListWithFilter(
            String searchText,
            Map<String, Object> filters
    ) {

        // Create Criteria List
        List<Criteria> criteriaList = new ArrayList<>();

        // Always exclude deleted warehouse
        criteriaList.add(Criteria.where("isDeleted").is(false));

        // Search logic (ONLY name & contactNumber)
        if (searchText != null && !searchText.isBlank() && !searchText.trim().isBlank()) {
            criteriaList.add(
                    new Criteria().orOperator(
                            Criteria.where("warehouseName").regex(searchText, "iu"),
                            Criteria.where("contactNumber").regex(searchText, "i")
                    )
            );
        }

        // Dynamic filters
        if (filters != null && !filters.isEmpty()) {
            for (Map.Entry<String, Object> entry : filters.entrySet()) {
                String field = entry.getKey();
                Object value = entry.getValue();
                if (value != null && !value.toString().isBlank()) {
                    criteriaList.add(Criteria.where(field).is(value));
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

        return mongoTemplate.find(query, WarehouseModel.class);

    }

    @Override
    public Page<WarehouseModel> getWarehouseListWithPaginationAndFilter(
            String searchText,
            Map<String, Object> filters,
            Pageable pageable
    ) {
        // Create Criteria List
        List<Criteria> criteriaList = new ArrayList<>();

        // Always exclude deleted warehouse
        criteriaList.add(Criteria.where("isDeleted").is(false));

        // Search logic (ONLY name & contactNumber)
        if (searchText != null && !searchText.isBlank() && !searchText.trim().isBlank()) {
            criteriaList.add(
                    new Criteria().orOperator(
                            Criteria.where("warehouseName").regex(searchText, "iu"),
                            Criteria.where("contactNumber").regex(searchText, "i")
                    )
            );
        }

        // Dynamic filters
        if (filters != null && !filters.isEmpty()) {
            for (Map.Entry<String, Object> entry : filters.entrySet()) {
                String field = entry.getKey();
                Object value = entry.getValue();
                if (value != null && !value.toString().isBlank()) {
                    criteriaList.add(Criteria.where(field).is(value));
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
        List<WarehouseModel> warehouseList = mongoTemplate.find(query, WarehouseModel.class);
        long totalCount = mongoTemplate.count(
                Query.of(query).limit(-1).skip(-1),
                WarehouseModel.class
        );

        return new PageImpl<>(warehouseList, pageable, totalCount);

    }

    @Override
    public WarehouseDashboardStatsDTO getWarehouseDashboardStats() {

        Long warehouseCount = warehouseRepository.count();
        List<WarehouseModel> warehouseList = warehouseRepository.findAll();

        double totalCapacity = 0.0;
        double availableCapacity = 0.0;
        double usedCapacity = 0.0;
        double utilizationPercentage = 0.0;

        for (WarehouseModel warehouse : warehouseList) {

            if (warehouse.getTotalCapacity() != null) {
                totalCapacity += warehouse.getTotalCapacity();
            }

            if (warehouse.getAvailableCapacity() != null) {
                availableCapacity += warehouse.getAvailableCapacity();
            }

            if (warehouse.getUsedCapacity() != null) {
                usedCapacity += warehouse.getUsedCapacity();
            }
        }

        if (totalCapacity > 0) {
            utilizationPercentage = (usedCapacity / totalCapacity) * 100;
        }

        return WarehouseDashboardStatsDTO.builder()
                .totalWarehouses(warehouseCount)
                .totalCapacity(totalCapacity)
                .availableCapacity(availableCapacity)
                .usedCapacity(usedCapacity)
                .utilizationPercentage(
                        Math.round(utilizationPercentage * 100.0) / 100.0
                )
                .build();
    }

}

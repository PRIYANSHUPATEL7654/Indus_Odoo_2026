package com.wexon.software.wexon_api.modules.warehouse.locations;

import com.wexon.software.wexon_api.commons.exceptions.ErrorCode;
import com.wexon.software.wexon_api.commons.exceptions.ExtendedException.BusinessException;
import com.wexon.software.wexon_api.modules.warehouse.locations.dtos.WarehouseLocationRequestDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class WarehouseLocationServiceImplementation implements WarehouseLocationService {

    private final WarehouseLocationRepository warehouseLocationRepository;
    private final MongoTemplate mongoTemplate;

    @Override
    public WarehouseLocationModel create(WarehouseLocationRequestDTO dto) {

        if (warehouseLocationRepository.existsByWarehouseIdAndLocationCodeAndIsDeletedFalse(dto.getWarehouseId(), dto.getLocationCode())) {
            throw new BusinessException(
                    ErrorCode.LOCATION_ALREADY_EXISTS.message(),
                    ErrorCode.LOCATION_ALREADY_EXISTS.code()
            );
        }

        WarehouseLocationModel location = WarehouseLocationModel.builder()
                .warehouseId(dto.getWarehouseId())
                .locationName(dto.getLocationName())
                .locationCode(dto.getLocationCode())
                .isActive(dto.getIsActive())
                .isDeleted(false)
                .build();

        return warehouseLocationRepository.save(location);
    }

    @Override
    public WarehouseLocationModel update(String id, WarehouseLocationRequestDTO dto) {

        WarehouseLocationModel existing = get(id);

        existing.setWarehouseId(dto.getWarehouseId());
        existing.setLocationName(dto.getLocationName());
        existing.setLocationCode(dto.getLocationCode());
        existing.setIsActive(dto.getIsActive());

        return warehouseLocationRepository.save(existing);
    }

    @Override
    public String delete(String id) {
        WarehouseLocationModel existing = get(id);
        existing.setIsDeleted(true);
        warehouseLocationRepository.save(existing);
        return id;
    }

    @Override
    public WarehouseLocationModel get(String id) {
        return warehouseLocationRepository.findById(id).orElseThrow(
                () -> new BusinessException(
                        ErrorCode.LOCATION_NOT_FOUND.message(),
                        ErrorCode.LOCATION_NOT_FOUND.code()
                )
        );
    }

    @Override
    public List<WarehouseLocationModel> getListWithFilter(String searchText, Map<String, Object> filters) {

        List<Criteria> criteriaList = new ArrayList<>();
        criteriaList.add(Criteria.where("isDeleted").is(false));

        if (searchText != null && !searchText.isBlank()) {
            criteriaList.add(new Criteria().orOperator(
                    Criteria.where("locationName").regex(searchText, "i"),
                    Criteria.where("locationCode").regex(searchText, "i")
            ));
        }

        if (filters != null && !filters.isEmpty()) {
            for (Map.Entry<String, Object> entry : filters.entrySet()) {
                Object value = entry.getValue();
                if (value != null && !value.toString().isBlank()) {
                    criteriaList.add(Criteria.where(entry.getKey()).is(value));
                }
            }
        }

        Criteria criteria = new Criteria().andOperator(criteriaList.toArray(new Criteria[0]));
        Query query = new Query(criteria).with(Sort.by(Sort.Direction.DESC, "updatedAt"));
        return mongoTemplate.find(query, WarehouseLocationModel.class);
    }

    @Override
    public Page<WarehouseLocationModel> getListWithPaginationAndFilter(String searchText, Map<String, Object> filters, Pageable pageable) {

        List<Criteria> criteriaList = new ArrayList<>();
        criteriaList.add(Criteria.where("isDeleted").is(false));

        if (searchText != null && !searchText.isBlank()) {
            criteriaList.add(new Criteria().orOperator(
                    Criteria.where("locationName").regex(searchText, "i"),
                    Criteria.where("locationCode").regex(searchText, "i")
            ));
        }

        if (filters != null && !filters.isEmpty()) {
            for (Map.Entry<String, Object> entry : filters.entrySet()) {
                Object value = entry.getValue();
                if (value != null && !value.toString().isBlank()) {
                    criteriaList.add(Criteria.where(entry.getKey()).is(value));
                }
            }
        }

        Criteria criteria = new Criteria().andOperator(criteriaList.toArray(new Criteria[0]));
        Query query = new Query(criteria).with(pageable);
        List<WarehouseLocationModel> list = mongoTemplate.find(query, WarehouseLocationModel.class);

        long totalCount = mongoTemplate.count(
                Query.of(query).limit(-1).skip(-1),
                WarehouseLocationModel.class
        );

        return new PageImpl<>(list, pageable, totalCount);
    }
}


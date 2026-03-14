package com.wexon.software.wexon_api.modules.inventory.batch_inventory;

import com.wexon.software.wexon_api.commons.exceptions.ErrorCode;
import com.wexon.software.wexon_api.commons.exceptions.ExtendedException.BusinessException;
import com.wexon.software.wexon_api.modules.inventory.batch_inventory.dto.BatchInventoryDTO;
import com.wexon.software.wexon_api.modules.products.ProductModel;
import com.wexon.software.wexon_api.modules.products.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.FindAndModifyOptions;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class BatchInventoryServiceImplementation implements BatchInventoryService {

    private final BatchInventoryRepository batchInventoryRepository;
    private final MongoTemplate mongoTemplate;
    private final ProductService productService;

    @Override
    public void createBatchInventory(
            String batchNo,
            String transactionNo,
            String productId,
            Double availableQuantity,
            Double totalQuantity,
            Double rentalQuantity,
            Boolean affectsWarehouseQuantity,
            String warehouseId
    ) {

        BatchInventory batchInventory = BatchInventory.builder()
                .batchNo(batchNo)
                .transactionNo(transactionNo)
                .productId(productId)
                .availableQuantity(availableQuantity)
                .totalQuantity(totalQuantity)
                .rentalQuantity(rentalQuantity)
                .affectsWarehouseQuantity(affectsWarehouseQuantity)
                .warehouseId(warehouseId)
                .build();

        batchInventoryRepository.save(batchInventory);
    }

    @Override
    public void createBatchInventory(
            String batchNo,
            String transactionNo,
            String productId,
            Double availableQuantity,
            Double totalQuantity,
            Double rentalQuantity,
            Boolean affectsWarehouseQuantity
    ) {

        BatchInventory batchInventory = BatchInventory.builder()
                .batchNo(batchNo)
                .transactionNo(transactionNo)
                .productId(productId)
                .availableQuantity(availableQuantity)
                .totalQuantity(totalQuantity)
                .rentalQuantity(rentalQuantity)
                .affectsWarehouseQuantity(affectsWarehouseQuantity)
                .build();

        batchInventoryRepository.save(batchInventory);
    }

    @Override
    @Transactional
    public BatchInventory reduceQuantity(
            String batchNo,
            Double quantity
    ) {

        Query query = new Query(
                Criteria.where("batchNo").is(batchNo)
                        .and("availableQuantity").gte(quantity)
        );

        Update update = new Update().inc("availableQuantity", -quantity);

        FindAndModifyOptions options = FindAndModifyOptions.options()
                .returnNew(true);

        BatchInventory updatedInventory =
                mongoTemplate.findAndModify(
                        query,
                        update,
                        options,
                        BatchInventory.class
                );

        if (updatedInventory == null) {
            throw new BusinessException(
                    ErrorCode.INVENTORY_QUANTITY_INSUFFICIENT.message(),
                    ErrorCode.INVENTORY_QUANTITY_INSUFFICIENT.code()
            );
        }

        return updatedInventory;
    }

    @Override
    public List<BatchInventoryDTO> getBatchInventoryListWithFilter(
            Map<String, Object> filters,
            String searchText
    ) {

        List<Criteria> criteriaList = new ArrayList<>();

        // Dynamic filters
        if (filters != null && !filters.isEmpty()) {
            for (Map.Entry<String, Object> entry : filters.entrySet()) {
                Object value = entry.getValue();
                if (value != null && !value.toString().isBlank()) {
                    criteriaList.add(Criteria.where(entry.getKey()).is(value));
                }
            }
        }

        // Search text
        if (searchText != null && !searchText.isBlank()) {
            criteriaList.add(new Criteria().orOperator(
                    Criteria.where("batchNo").regex(searchText, "i"),
                    Criteria.where("transactionNo").regex(searchText, "i")
            ));
        }

        Criteria criteria = new Criteria();
        if (!criteriaList.isEmpty()) {
            criteria = new Criteria().andOperator(
                    criteriaList.toArray(new Criteria[0])
            );
        }

        Query query = new Query(criteria)
                .with(Sort.by(Sort.Direction.DESC, "updatedAt"));

        List<BatchInventory> inventories =
                mongoTemplate.find(query, BatchInventory.class);

        List<BatchInventoryDTO> dtoList = new ArrayList<>();

        for (BatchInventory inventory : inventories) {

            BatchInventoryDTO dto = new BatchInventoryDTO();
            dto.setId(inventory.getId());
            dto.setBatchNo(inventory.getBatchNo());
            dto.setTransactionNo(inventory.getTransactionNo());

            dto.setProductId(inventory.getProductId());
            dto.setAvailableQuantity(inventory.getAvailableQuantity());
            dto.setTotalQuantity(inventory.getTotalQuantity());
            dto.setRentalQuantity(inventory.getRentalQuantity());

            dto.setAffectsWarehouseQuantity(inventory.getAffectsWarehouseQuantity());
            dto.setWarehouseId(inventory.getWarehouseId());

            ProductModel product = productService.getProduct(inventory.getProductId());
            dto.setProductName(product.getProductName());

            dtoList.add(dto);
        }

        return dtoList;
    }


    @Override
    public Page<BatchInventoryDTO> getBatchInventoryListWithPaginationAndFilter(
            Map<String, Object> filters,
            String searchText,
            Pageable pageable
    ) {

        List<Criteria> criteriaList = new ArrayList<>();

        // Dynamic filters
        if (filters != null && !filters.isEmpty()) {
            for (Map.Entry<String, Object> entry : filters.entrySet()) {
                Object value = entry.getValue();
                if (value != null && !value.toString().isBlank()) {
                    criteriaList.add(Criteria.where(entry.getKey()).is(value));
                }
            }
        }

        // Search text
        if (searchText != null && !searchText.isBlank()) {
            criteriaList.add(new Criteria().orOperator(
                    Criteria.where("batchNo").regex(searchText, "i"),
                    Criteria.where("transactionNo").regex(searchText, "i")
            ));
        }

        Criteria criteria = new Criteria();
        if (!criteriaList.isEmpty()) {
            criteria = new Criteria().andOperator(
                    criteriaList.toArray(new Criteria[0])
            );
        }

        Query query = new Query(criteria).with(pageable);

        List<BatchInventory> inventories =
                mongoTemplate.find(query, BatchInventory.class);

        long totalCount = mongoTemplate.count(
                Query.of(query).limit(-1).skip(-1),
                BatchInventory.class
        );

        List<BatchInventoryDTO> dtoList = new ArrayList<>();

        for (BatchInventory inventory : inventories) {

            BatchInventoryDTO dto = new BatchInventoryDTO();
            dto.setId(inventory.getId());
            dto.setBatchNo(inventory.getBatchNo());
            dto.setTransactionNo(inventory.getTransactionNo());

            dto.setProductId(inventory.getProductId());
            dto.setAvailableQuantity(inventory.getAvailableQuantity());
            dto.setTotalQuantity(inventory.getTotalQuantity());
            dto.setRentalQuantity(inventory.getRentalQuantity());

            dto.setAffectsWarehouseQuantity(inventory.getAffectsWarehouseQuantity());
            dto.setWarehouseId(inventory.getWarehouseId());

            ProductModel product = productService.getProduct(inventory.getProductId());
            dto.setProductName(product.getProductName());

            dtoList.add(dto);
        }

        return new PageImpl<>(dtoList, pageable, totalCount);
    }



}


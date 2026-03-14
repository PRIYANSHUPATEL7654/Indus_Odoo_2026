package com.wexon.software.wexon_api.modules.inventory.inventory_transaction;

import com.wexon.software.wexon_api.commons.enums.PartyType;
import com.wexon.software.wexon_api.commons.enums.TransactionStatus;
import com.wexon.software.wexon_api.commons.exceptions.ErrorCode;
import com.wexon.software.wexon_api.commons.exceptions.ExtendedException.BusinessException;
import com.wexon.software.wexon_api.modules.inventory.inventory_transaction.Handler.TransactionHandler;
import com.wexon.software.wexon_api.modules.inventory.inventory_transaction.Handler.TransactionHandlerFactory;
import com.wexon.software.wexon_api.modules.inventory.inventory_transaction.dto.TransactionApproveDTO;
import com.wexon.software.wexon_api.modules.inventory.inventory_transaction.dto.TransactionCreateDTO;
import com.wexon.software.wexon_api.modules.inventory.inventory_transaction.dto.TransactionDTO;
import com.wexon.software.wexon_api.modules.inventory.transaction_details.InventoryTransactionDetails;
import com.wexon.software.wexon_api.modules.products.ProductModel;
import com.wexon.software.wexon_api.modules.products.ProductService;
import com.wexon.software.wexon_api.modules.vendors.VendorModel;
import com.wexon.software.wexon_api.modules.vendors.VendorService;
import com.wexon.software.wexon_api.modules.warehouse.core.WarehouseModel;
import com.wexon.software.wexon_api.modules.warehouse.core.WarehouseService;
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

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class InventoryTransactionService {

    private final TransactionHandlerFactory transactionHandlerFactory;

    private final MongoTemplate mongoTemplate;
    private final ProductService productService;
    private final WarehouseService warehouseService;
    private final VendorService vendorService;
    private final InventoryTransactionRepository inventoryTransactionRepository;


    @Transactional
    public String processCreate(TransactionCreateDTO dto) {

        TransactionHandler handler = transactionHandlerFactory.getTransactionHandler(dto.getTransactionNature());
        String id = handler.handleCreate(dto);

        boolean autoApprove = dto.getAutoApprove() == null || dto.getAutoApprove();
        if (autoApprove) {
            TransactionApproveDTO approveDTO = new TransactionApproveDTO();
            approveDTO.setTransactionNature(dto.getTransactionNature());
            handler.handleApproved(id, approveDTO);
        }

        return id;

    }

    public String processApproval(String id, TransactionApproveDTO dto) {

        TransactionHandler handler = transactionHandlerFactory.getTransactionHandler(dto.getTransactionNature());
        return handler.handleApproved(id, dto);

    }

    public TransactionDTO getInventoryTransaction(String id) {

        InventoryTransaction inventoryTransaction = inventoryTransactionRepository.findById(id).orElseThrow(
                () -> new BusinessException(
                        ErrorCode.INVENTORY_TRANSECTION_NOT_FOUND.message(),
                        ErrorCode.INVENTORY_TRANSECTION_NOT_FOUND.code()
                )
        );

        TransactionDTO txDTO = new TransactionDTO();
        txDTO.setId(inventoryTransaction.getId());
        txDTO.setTransactionNo(inventoryTransaction.getTransactionNo());
        txDTO.setTransactionDate(inventoryTransaction.getTransactionDate());
        txDTO.setTransactionNature(inventoryTransaction.getTransactionNature());
        txDTO.setTransactionDirection(inventoryTransaction.getTransactionDirection());

        if (inventoryTransaction.getAffectsWarehouseQuantity() != null) {
            txDTO.setAffectsWarehouseQuantity(inventoryTransaction.getAffectsWarehouseQuantity());

            if (inventoryTransaction.getAffectsWarehouseQuantity()) {
                WarehouseModel warehouse = warehouseService.getWarehouse(inventoryTransaction.getWarehouseId());
                txDTO.setWarehouseId(inventoryTransaction.getWarehouseId());
                txDTO.setWarehouseName(warehouse.getWarehouseName());
            }

        }

        txDTO.setProductId(inventoryTransaction.getProductId());
        ProductModel product = productService.getProduct(inventoryTransaction.getProductId());
        txDTO.setProductName(product.getProductName());

        txDTO.setPartyType(inventoryTransaction.getPartyType());
        if (inventoryTransaction.getPartyType() == PartyType.VENDOR) {
            VendorModel vendor = vendorService.getVendor(inventoryTransaction.getPartyId());
            txDTO.setPartyId(inventoryTransaction.getPartyId());
            txDTO.setPartyName(vendor.getVendorName());
        }

        txDTO.setStatus(inventoryTransaction.getStatus());
        txDTO.setRemarks(inventoryTransaction.getRemarks());

        if (inventoryTransaction.getNetQuantity() != null &&
                inventoryTransaction.getNetAmountPrice() != null
        ) {
            txDTO.setNetQuantity(inventoryTransaction.getNetQuantity());
            txDTO.setNetUnitPrice(inventoryTransaction.getNetAmountPrice());
        }

        return txDTO;
    }

    @Transactional
    public String deleteInventoryTransaction(String id) {

        InventoryTransaction tx = inventoryTransactionRepository.findById(id)
                .orElseThrow(() -> new BusinessException(
                        ErrorCode.INVENTORY_TRANSECTION_NOT_FOUND.message(),
                        ErrorCode.INVENTORY_TRANSECTION_NOT_FOUND.code()
                ));


        if (tx.getStatus() != TransactionStatus.CREATED) {
            throw new BusinessException(
                    ErrorCode.UPDATE_INVENTORY_TRANSACTION_DETAILS_NOT_ALLOWED.message(),
                    ErrorCode.UPDATE_INVENTORY_TRANSACTION_DETAILS_NOT_ALLOWED.code()
            );
        }

        Query query = new Query(Criteria.where("transactionId").is(tx.getId()));
        mongoTemplate.remove(query, InventoryTransactionDetails.class);

        inventoryTransactionRepository.delete(tx);

        return id;

    }


    public List<TransactionDTO> getTransactionListWithFilter(
            Map<String, Object> filters
    ) {

        // Create Criteria List
        List<Criteria> criteriaList = new ArrayList<>();

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

        List<InventoryTransaction> inventoryTransactionList = mongoTemplate.find(query, InventoryTransaction.class);

        List<TransactionDTO> transactionDTOList = new ArrayList<>();

        for (InventoryTransaction inventoryTransaction: inventoryTransactionList) {

            TransactionDTO txDTO = new TransactionDTO();
            txDTO.setId(inventoryTransaction.getId());
            txDTO.setTransactionNo(inventoryTransaction.getTransactionNo());
            txDTO.setTransactionDate(inventoryTransaction.getTransactionDate());
            txDTO.setTransactionNature(inventoryTransaction.getTransactionNature());
            txDTO.setTransactionDirection(inventoryTransaction.getTransactionDirection());
            txDTO.setAffectsWarehouseQuantity(inventoryTransaction.getAffectsWarehouseQuantity());

            if (inventoryTransaction.getAffectsWarehouseQuantity()) {
                WarehouseModel warehouse = warehouseService.getWarehouse(inventoryTransaction.getWarehouseId());
                txDTO.setWarehouseId(inventoryTransaction.getWarehouseId());
                txDTO.setWarehouseName(warehouse.getWarehouseName());
            }

            txDTO.setProductId(inventoryTransaction.getProductId());
            ProductModel product = productService.getProduct(inventoryTransaction.getProductId());
            txDTO.setProductName(product.getProductName());

            txDTO.setPartyType(inventoryTransaction.getPartyType());
            if (inventoryTransaction.getPartyType() == PartyType.VENDOR) {
                VendorModel vendor = vendorService.getVendor(inventoryTransaction.getPartyId());
                txDTO.setPartyId(inventoryTransaction.getPartyId());
                txDTO.setPartyName(vendor.getVendorName());
            }

            txDTO.setStatus(inventoryTransaction.getStatus());
            txDTO.setRemarks(inventoryTransaction.getRemarks());

            if (inventoryTransaction.getNetQuantity() != null &&
                    inventoryTransaction.getNetAmountPrice() != null
            ) {
                txDTO.setNetQuantity(inventoryTransaction.getNetQuantity());
                txDTO.setNetUnitPrice(inventoryTransaction.getNetAmountPrice());
            }

            transactionDTOList.add(txDTO);

        }

        return transactionDTOList;

    }

    public Page<TransactionDTO> getTransactionListWithPaginationAndFilter(
            Map<String, Object> filters,
            Pageable pageable
    ) {

        // Create Criteria List
        List<Criteria> criteriaList = new ArrayList<>();

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

        List<InventoryTransaction> inventoryTransactionList = mongoTemplate.find(query, InventoryTransaction.class);
        long totalCount = mongoTemplate.count(
                Query.of(query).limit(-1).skip(-1),
                InventoryTransaction.class
        );

        List<TransactionDTO> transactionDTOList = new ArrayList<>();

        for (InventoryTransaction inventoryTransaction: inventoryTransactionList) {

            TransactionDTO txDTO = new TransactionDTO();
            txDTO.setId(inventoryTransaction.getId());
            txDTO.setTransactionNo(inventoryTransaction.getTransactionNo());
            txDTO.setTransactionDate(inventoryTransaction.getTransactionDate());
            txDTO.setTransactionNature(inventoryTransaction.getTransactionNature());
            txDTO.setTransactionDirection(inventoryTransaction.getTransactionDirection());

            if (inventoryTransaction.getAffectsWarehouseQuantity() != null) {
                txDTO.setAffectsWarehouseQuantity(inventoryTransaction.getAffectsWarehouseQuantity());

                if (inventoryTransaction.getAffectsWarehouseQuantity()) {
                    WarehouseModel warehouse = warehouseService.getWarehouse(inventoryTransaction.getWarehouseId());
                    txDTO.setWarehouseId(inventoryTransaction.getWarehouseId());
                    txDTO.setWarehouseName(warehouse.getWarehouseName());
                }

            }

            txDTO.setProductId(inventoryTransaction.getProductId());
            ProductModel product = productService.getProduct(inventoryTransaction.getProductId());
            txDTO.setProductName(product.getProductName());

            txDTO.setPartyType(inventoryTransaction.getPartyType());
            if (inventoryTransaction.getPartyType() == PartyType.VENDOR) {
                VendorModel vendor = vendorService.getVendor(inventoryTransaction.getPartyId());
                txDTO.setPartyId(inventoryTransaction.getPartyId());
                txDTO.setPartyName(vendor.getVendorName());
            }

            txDTO.setStatus(inventoryTransaction.getStatus());
            txDTO.setRemarks(inventoryTransaction.getRemarks());

            if (inventoryTransaction.getNetQuantity() != null &&
                    inventoryTransaction.getNetAmountPrice() != null
            ) {
                txDTO.setNetQuantity(inventoryTransaction.getNetQuantity());
                txDTO.setNetUnitPrice(inventoryTransaction.getNetAmountPrice());
            }

            transactionDTOList.add(txDTO);

        }

        return new PageImpl<>(transactionDTOList, pageable, totalCount);

    }
}

package com.wexon.software.wexon_api.modules.inventory.transaction_details;

import com.wexon.software.wexon_api.commons.enums.TransactionNature;
import com.wexon.software.wexon_api.commons.enums.TransactionStatus;
import com.wexon.software.wexon_api.commons.exceptions.ErrorCode;
import com.wexon.software.wexon_api.commons.exceptions.ExtendedException.BusinessException;
import com.wexon.software.wexon_api.modules.inventory.inventory_transaction.InventoryTransactionService;
import com.wexon.software.wexon_api.modules.inventory.inventory_transaction.dto.TransactionDTO;
import com.wexon.software.wexon_api.modules.inventory.sequence_generator.batchNumber.BatchNoGenerator;
import com.wexon.software.wexon_api.modules.inventory.transaction_details.dto.TransactionDetailRequestDTO;
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
public class InventoryTransactionDetailsServiceImplementation implements InventoryTransactionDetailsService {

    private final InventoryTransactionService inventoryTransactionService;
    private final InventoryTransactionDetailsRepository inventoryTransactionDetailsRepository;
    private final BatchNoGenerator batchNoGenerator;
    private final MongoTemplate mongoTemplate;

    @Override
    public InventoryTransactionDetails createTransactionDetails(
            String transactionId,
            TransactionDetailRequestDTO dto
    ) {

        TransactionDTO inventoryTransaction = inventoryTransactionService.getInventoryTransaction(transactionId);

        InventoryTransactionDetails txd = new InventoryTransactionDetails();
        txd.setTransactionId(inventoryTransaction.getId());
        txd.setTransactionNo(inventoryTransaction.getTransactionNo());
        String batchNo;
        if (inventoryTransaction.getTransactionNature() == TransactionNature.BUY) {
            batchNo = batchNoGenerator.generate();
        } else {
            batchNo = dto.getBatchNo();
        }
        txd.setBatchNo(batchNo);
        txd.setVehicleNumber(dto.getVehicleNumber());
        txd.setGrossQuantity(dto.getGrossQuantity());
        txd.setPerBagLessQuantity(dto.getPerBagLessQuantity());
        txd.setDebitNoteQuantity(dto.getDebitNoteQuantity());
        txd.setMeasurementUnit(dto.getMeasurementUnit());
        txd.setBagQuantity(dto.getBagQuantity());

        Double netQuantity = txd.getGrossQuantity()
                - (dto.getPerBagLessQuantity() * dto.getBagQuantity())
                - dto.getDebitNoteQuantity();

        txd.setNetQuantity(netQuantity);
        txd.setNetUnitPrice(dto.getNetUnitPrice());
        txd.setRemarks(dto.getRemarks());

        return inventoryTransactionDetailsRepository.save(txd);

    }

    @Override
    public InventoryTransactionDetails updateTransactionDetails(String id, TransactionDetailRequestDTO dto) {

        InventoryTransactionDetails txd = inventoryTransactionDetailsRepository.findById(id).orElseThrow(
                () -> new BusinessException(
                        ErrorCode.INVENTORY_TRANSECTION_DETAIL_NOT_FOUND.message(),
                        ErrorCode.INVENTORY_TRANSECTION_DETAIL_NOT_FOUND.code()
                )
        );

        TransactionDTO inventoryTransaction = inventoryTransactionService.getInventoryTransaction(txd.getTransactionId());

        if (inventoryTransaction.getStatus() != TransactionStatus.CREATED) {
            throw new BusinessException(
                    ErrorCode.UPDATE_INVENTORY_TRANSACTION_DETAILS_NOT_ALLOWED.message(),
                    ErrorCode.UPDATE_INVENTORY_TRANSACTION_DETAILS_NOT_ALLOWED.code()
            );
        }

        txd.setTransactionId(inventoryTransaction.getId());
        txd.setTransactionNo(inventoryTransaction.getTransactionNo());
        txd.setVehicleNumber(dto.getVehicleNumber());
        txd.setGrossQuantity(dto.getGrossQuantity());
        txd.setPerBagLessQuantity(dto.getPerBagLessQuantity());
        txd.setDebitNoteQuantity(dto.getDebitNoteQuantity());
        txd.setMeasurementUnit(dto.getMeasurementUnit());
        txd.setBagQuantity(dto.getBagQuantity());

        Double netQuantity = txd.getGrossQuantity()
                - (dto.getPerBagLessQuantity() * dto.getBagQuantity())
                - dto.getDebitNoteQuantity();

        txd.setNetQuantity(netQuantity);
        txd.setNetUnitPrice(dto.getNetUnitPrice());
        txd.setRemarks(dto.getRemarks());

        return inventoryTransactionDetailsRepository.save(txd);

    }

    @Override
    public String deleteTransactionDetails(String id) {

        InventoryTransactionDetails txd = inventoryTransactionDetailsRepository.findById(id).orElseThrow(
                () -> new BusinessException(
                        ErrorCode.INVENTORY_TRANSECTION_DETAIL_NOT_FOUND.message(),
                        ErrorCode.INVENTORY_TRANSECTION_DETAIL_NOT_FOUND.code()
                )
        );

        TransactionDTO inventoryTransaction = inventoryTransactionService.getInventoryTransaction(txd.getTransactionId());
        if (inventoryTransaction.getStatus() != TransactionStatus.CREATED) {
            throw new BusinessException(
                    ErrorCode.UPDATE_INVENTORY_TRANSACTION_DETAILS_NOT_ALLOWED.message(),
                    ErrorCode.UPDATE_INVENTORY_TRANSACTION_DETAILS_NOT_ALLOWED.code()
            );
        }

        inventoryTransactionDetailsRepository.delete(txd);
        return id;
    }

    @Override
    public InventoryTransactionDetails getTransactionDetail(String id) {

        return inventoryTransactionDetailsRepository.findById(id).orElseThrow(
                () -> new BusinessException(
                        ErrorCode.INVENTORY_TRANSECTION_DETAIL_NOT_FOUND.message(),
                        ErrorCode.INVENTORY_TRANSECTION_DETAIL_NOT_FOUND.code()
                )
        );

    }

    @Override
    public List<InventoryTransactionDetails> getTransactionDetailListWithFilter(
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

        return mongoTemplate.find(query, InventoryTransactionDetails.class);

    }

    @Override
    public Page<InventoryTransactionDetails> getTransactionDetailWithPaginationAndFilter(
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

        List<InventoryTransactionDetails> inventoryTransactionDetailsList = mongoTemplate.find(query, InventoryTransactionDetails.class);
        long totalCount = mongoTemplate.count(
                Query.of(query).limit(-1).skip(-1),
                InventoryTransactionDetails.class
        );

        return new PageImpl<>(inventoryTransactionDetailsList, pageable, totalCount);
    }

}

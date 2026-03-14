package com.wexon.software.wexon_api.modules.warehouse.core;


import com.wexon.software.wexon_api.commons.enums.TransactionDirection;
import com.wexon.software.wexon_api.commons.exceptions.ErrorCode;
import com.wexon.software.wexon_api.commons.exceptions.ExtendedException.BusinessException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class WarehouseInternalService {

    private final WarehouseRepository warehouseRepository;

    public void updateWarehouseStock(
            String warehouseId,
            Double quantity,
            TransactionDirection transactionDirection) {

        WarehouseModel warehouse = warehouseRepository.findById(warehouseId)
                .orElseThrow(() -> new BusinessException(
                        ErrorCode.WAREHOUSE_NOT_FOUND.message(),
                        ErrorCode.WAREHOUSE_NOT_FOUND.code()
                ));

        double usedCapacity = warehouse.getUsedCapacity() == null ? 0.0 : warehouse.getUsedCapacity();
        double availableCapacity = warehouse.getAvailableCapacity() == null ? 0.0 : warehouse.getAvailableCapacity();

        if (transactionDirection == TransactionDirection.IN) {
            if (availableCapacity < quantity) {
                throw new BusinessException(
                        ErrorCode.WAREHOUSE_CAPACITY_EXCEEDED.message(),
                        ErrorCode.WAREHOUSE_CAPACITY_EXCEEDED.code()
                );
            }
            warehouse.setUsedCapacity(usedCapacity + quantity);
            warehouse.setAvailableCapacity(availableCapacity - quantity);

        } else if (transactionDirection == TransactionDirection.OUT) {
            if (usedCapacity < quantity) {
                throw new BusinessException(
                        ErrorCode.WAREHOUSE_INSUFFICIENT_STOCK.message(),
                        ErrorCode.WAREHOUSE_INSUFFICIENT_STOCK.code()
                );
            }
            warehouse.setUsedCapacity(usedCapacity - quantity);
            warehouse.setAvailableCapacity(availableCapacity + quantity);
        }

        warehouseRepository.save(warehouse);

    }

}

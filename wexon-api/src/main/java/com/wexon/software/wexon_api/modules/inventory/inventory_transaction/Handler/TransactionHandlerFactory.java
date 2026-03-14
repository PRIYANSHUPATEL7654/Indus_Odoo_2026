package com.wexon.software.wexon_api.modules.inventory.inventory_transaction.Handler;

import com.wexon.software.wexon_api.commons.enums.TransactionNature;
import com.wexon.software.wexon_api.commons.exceptions.ErrorCode;
import com.wexon.software.wexon_api.commons.exceptions.ExtendedException.BusinessException;
import org.springframework.stereotype.Component;

import java.util.EnumMap;
import java.util.List;
import java.util.Map;

@Component
public class TransactionHandlerFactory {

    private final Map<TransactionNature, TransactionHandler> transactionHandlerMap = new EnumMap<>(TransactionNature.class);

    public TransactionHandlerFactory(List<TransactionHandler> transactionHandlerList) {

        for (TransactionHandler transactionHandler : transactionHandlerList) {

            TransactionNature transactionNature = transactionHandler.getTransactionNature();

            if (transactionHandlerMap.containsKey(transactionNature)) {
                throw new BusinessException(
                        ErrorCode.DUPLICATE_INVENTORY_TRANSACTION_HANDLER.message(),
                        ErrorCode.DUPLICATE_INVENTORY_TRANSACTION_HANDLER.code()
                );
            }

            transactionHandlerMap.put(transactionNature, transactionHandler);

        }
    }

    public TransactionHandler getTransactionHandler(TransactionNature transactionNature) {

        TransactionHandler transactionHandler = transactionHandlerMap.get(transactionNature);

        if (transactionHandler == null) {
            throw new BusinessException(
                    ErrorCode.TRANSECTION_NATURE_NOT_VALID.message(),
                    ErrorCode.TRANSECTION_NATURE_NOT_VALID.code()
            );
        }

        return transactionHandler;

    }
}

package com.wexon.software.wexon_api.modules.ledger.transactions;

import com.wexon.software.wexon_api.commons.responses.successResponse.ApiResult;
import com.wexon.software.wexon_api.modules.ledger.accounts.LedgerAccountModel;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/ledger/transaction")
@RequiredArgsConstructor
@Tag(name = "Inventory Transaction APIs")
public class LedgerTransactionController {

    private final LedgerTransactionService ledgerTransactionService;

    @GetMapping("getLedgerTransactionByEntityId/{id}")
    public ApiResult<List<LedgerTransactionModel>> getLedgerTransactionByEntityId(
            @PathVariable String id
    ) {

        var data = ledgerTransactionService.getLedgerTransactionByEntityId(id);

        return new ApiResult<>(
                HttpStatus.OK,
                "Ledger transaction fetched successfully",
                data
        );
    }
}

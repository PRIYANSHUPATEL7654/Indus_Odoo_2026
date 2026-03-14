package com.wexon.software.wexon_api.modules.ledger.accounts;


import com.wexon.software.wexon_api.commons.responses.successResponse.ApiResult;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/ledger/account")
@RequiredArgsConstructor
@Tag(name = "Ledger Account APIs")
public class LedgerAccountController {

    private final LedgerAccountService ledgerAccountService;

    @GetMapping("/getLedgerAccountByEntityId/{id}")
    public ApiResult<LedgerAccountModel> getLedgerAccountByEntityId(
            @PathVariable String id
    ) {

        var data = ledgerAccountService.getLedgerAccountByEntityId(id);

        return new ApiResult<>(
                HttpStatus.OK,
                "Ledger account fetched successfully",
                data
        );
    }
}

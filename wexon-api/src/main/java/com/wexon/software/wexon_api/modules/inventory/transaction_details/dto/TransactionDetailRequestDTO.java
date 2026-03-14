package com.wexon.software.wexon_api.modules.inventory.transaction_details.dto;

import com.wexon.software.wexon_api.commons.enums.MeasurementUnit;
import lombok.Data;

@Data
public class TransactionDetailRequestDTO {

    private String batchNo;
    private String vehicleNumber;
    private Double grossQuantity;
    private Double perBagLessQuantity;
    private Double debitNoteQuantity;
    private MeasurementUnit measurementUnit;
    private Integer bagQuantity;
    private Double netQuantity;
    private Double netUnitPrice;
    private String remarks;

}

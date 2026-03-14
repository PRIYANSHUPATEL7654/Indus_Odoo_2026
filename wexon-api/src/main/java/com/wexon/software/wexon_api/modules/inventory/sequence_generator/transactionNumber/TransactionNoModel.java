package com.wexon.software.wexon_api.modules.inventory.sequence_generator.transactionNumber;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "transaction_sequence")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TransactionNoModel {

    @Id
    private String id;
    private Long sequence;

}
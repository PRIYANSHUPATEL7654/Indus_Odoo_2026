package com.wexon.software.wexon_api.modules.users.dtos;

import lombok.Data;

import java.util.List;

@Data
public class FeatureDTO {
    private String featureName;
    private List<String> operations;
}
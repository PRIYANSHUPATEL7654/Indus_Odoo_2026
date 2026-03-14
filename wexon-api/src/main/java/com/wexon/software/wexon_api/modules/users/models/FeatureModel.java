package com.wexon.software.wexon_api.modules.users.models;

import lombok.Data;

import java.util.List;

@Data
public class FeatureModel {
    private String featureName;
    private List<OperationModel> operations;
}

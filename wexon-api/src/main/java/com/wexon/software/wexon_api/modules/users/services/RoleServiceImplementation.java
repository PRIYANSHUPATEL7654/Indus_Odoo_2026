package com.wexon.software.wexon_api.modules.users.services;

import com.wexon.software.wexon_api.commons.exceptions.ExtendedException.ResourceNotFoundException;
import com.wexon.software.wexon_api.modules.users.dtos.FeatureDTO;
import com.wexon.software.wexon_api.modules.users.dtos.RoleDTO;
import com.wexon.software.wexon_api.modules.users.dtos.RoleRequestDTO;
import com.wexon.software.wexon_api.modules.users.models.FeatureModel;
import com.wexon.software.wexon_api.modules.users.models.OperationModel;
import com.wexon.software.wexon_api.modules.users.models.RoleModel;
import com.wexon.software.wexon_api.modules.users.repositories.RoleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class RoleServiceImplementation implements RoleService{

    private final RoleRepository roleRepository;

    @Override
    public RoleDTO createRole(RoleRequestDTO dto) {
        RoleModel model = toModel(dto);
        return toResponse(roleRepository.save(model));
    }

    @Override
    public RoleDTO updateRole(String id, RoleRequestDTO dto) {
        RoleModel role = roleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Role not found", "ROLE_NOT_FOUND"));

        role.setRoleCode(dto.getRoleCode());
        role.setRoleName(dto.getRoleName());
        role.setRoleDescription(dto.getRoleDescription());

        List<FeatureModel> featureModels = new ArrayList<>();

        for (FeatureDTO f : dto.getFeatures()) {
            FeatureModel feature = new FeatureModel();
            feature.setFeatureName(f.getFeatureName());

            List<OperationModel> operations = new ArrayList<>();
            for (String op : f.getOperations()) {
                OperationModel om = new OperationModel();
                om.setName(op);
                operations.add(om);
            }
            feature.setOperations(operations);
            featureModels.add(feature);
        }
        role.setFeatures(featureModels);

        return toResponse(roleRepository.save(role));
    }


    @Override
    public String deleteRole(String id) {
        if (!roleRepository.existsById(id)) {
            throw new ResourceNotFoundException("Role not found", "ROLE_NOT_FOUND");
        }
        roleRepository.deleteById(id);
        return id;
    }

    @Override
    public RoleDTO getRole(String id) {
        return roleRepository.findById(id)
                .map(this::toResponse)
                .orElseThrow(() -> new ResourceNotFoundException("Role not found", "ROLE_NOT_FOUND"));
    }

    @Override
    public List<RoleDTO> getRoleList() {
        return roleRepository.findAll()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    private RoleModel toModel(RoleRequestDTO dto) {
        RoleModel role = new RoleModel();
        role.setId(null);
        role.setRoleCode(dto.getRoleCode());
        role.setRoleName(dto.getRoleName());
        role.setRoleDescription(dto.getRoleDescription());

        List<FeatureModel> featureModels = new ArrayList<>();

        for (FeatureDTO f : dto.getFeatures()) {
            FeatureModel feature = new FeatureModel();
            feature.setFeatureName(f.getFeatureName());

            List<OperationModel> operations = new ArrayList<>();
            for (String op : f.getOperations()) {
                OperationModel om = new OperationModel();
                om.setName(op);
                operations.add(om);
            }

            feature.setOperations(operations);
            featureModels.add(feature);
        }

        role.setFeatures(featureModels);

        return role;
    }

    private RoleDTO toResponse(RoleModel model) {
        RoleDTO dto = new RoleDTO();
        dto.setId(model.getId());
        dto.setRoleCode(model.getRoleCode());
        dto.setRoleName(model.getRoleName());
        dto.setRoleDescription(model.getRoleDescription());

        List<FeatureDTO> featureDTOs = new ArrayList<>();
        if (model.getFeatures() != null) {
            for (FeatureModel f : model.getFeatures()) {
                FeatureDTO featureDTO = new FeatureDTO();
                featureDTO.setFeatureName(f.getFeatureName());

                List<String> operationNames = new ArrayList<>();
                if (f.getOperations() != null) {
                    for (OperationModel op : f.getOperations()) {
                        operationNames.add(op.getName());
                    }
                }

                featureDTO.setOperations(operationNames);
                featureDTOs.add(featureDTO);
            }
        }

        dto.setFeatures(featureDTOs);
        return dto;
    }


}

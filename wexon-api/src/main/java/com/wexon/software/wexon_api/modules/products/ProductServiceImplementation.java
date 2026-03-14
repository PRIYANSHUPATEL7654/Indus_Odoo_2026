package com.wexon.software.wexon_api.modules.products;

import com.wexon.software.wexon_api.commons.exceptions.ErrorCode;
import com.wexon.software.wexon_api.commons.exceptions.ExtendedException.BusinessException;
import com.wexon.software.wexon_api.modules.products.dtos.ProductRequestDTO;
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
public class ProductServiceImplementation implements ProductService {

    private final ProductRepository productRepository;
    private final MongoTemplate mongoTemplate;

    @Override
    public ProductModel createProduct(ProductRequestDTO dto) {

        if (productRepository.existsBySku(dto.getSku())) {
            throw new BusinessException(
                    ErrorCode.PRODUCT_ALREADY_EXISTS.message(),
                    ErrorCode.PRODUCT_ALREADY_EXISTS.code()
            );
        }

        ProductModel newProduct = ProductModel.builder()
                .sku(dto.getSku())
                .productName(dto.getProductName())
                .description(dto.getDescription())
                .category(dto.getCategory())
                .baseUnit(dto.getBaseUnit())
                .isActive(dto.getIsActive())
                .isDeleted(false)
                .build();

        return productRepository.save(newProduct);

    }

    @Override
    public ProductModel updateProduct(String id, ProductRequestDTO dto) {

        ProductModel existingProduct = productRepository.findById(id)
                .orElseThrow(() -> new BusinessException(
                        ErrorCode.PRODUCT_NOT_FOUND.message(),
                        ErrorCode.PRODUCT_NOT_FOUND.code()
                ));

        existingProduct.setSku(dto.getSku());
        existingProduct.setProductName(dto.getProductName());
        existingProduct.setDescription(dto.getDescription());
        existingProduct.setCategory(dto.getCategory());
        existingProduct.setBaseUnit(dto.getBaseUnit());
        existingProduct.setIsActive(dto.getIsActive());

        return productRepository.save(existingProduct);

    }

    @Override
    public String deleteProduct(String id) {

        ProductModel existingProduct = productRepository.findById(id)
                .orElseThrow(() -> new BusinessException(
                        ErrorCode.PRODUCT_NOT_FOUND.message(),
                        ErrorCode.PRODUCT_NOT_FOUND.code()
                ));

        existingProduct.setIsDeleted(false);
        productRepository.save(existingProduct);
        return id;

    }

    @Override
    public ProductModel getProduct(String id) {

        return productRepository.findByIdAndIsDeletedFalse(id)
                .orElseThrow(() -> new BusinessException(
                        ErrorCode.PRODUCT_NOT_FOUND.message(),
                        ErrorCode.PRODUCT_NOT_FOUND.code()
                ));

    }

    @Override
    public List<ProductModel> getProductListWithFilter(
            String searchText,
            Map<String, Object> filters
    ) {

        // Create Criteria List
        List<Criteria> criteriaList = new ArrayList<>();

        // Always exclude deleted warehouse
        criteriaList.add(Criteria.where("isDeleted").is(false));

        // Search logic (ONLY name & contactNumber)
        if (searchText != null && !searchText.isBlank() && !searchText.trim().isBlank()) {
            criteriaList.add(
                    new Criteria().orOperator(
                            Criteria.where("sku").regex(searchText, "i"),
                            Criteria.where("productName").regex(searchText, "iu"),
                            Criteria.where("category").regex(searchText, "iu")
                    )
            );
        }

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

        return mongoTemplate.find(query, ProductModel.class);

    }

    @Override
    public Page<ProductModel> getProductListWithPaginationAndFilter(
            String searchText,
            Map<String, Object> filters,
            Pageable pageable
    ) {

        // Create Criteria List
        List<Criteria> criteriaList = new ArrayList<>();

        // Always exclude deleted warehouse
        criteriaList.add(Criteria.where("isDeleted").is(false));

        // Search logic (ONLY sku, productName & category)
        if (searchText != null && !searchText.isBlank() && !searchText.trim().isBlank()) {
            criteriaList.add(
                    new Criteria().orOperator(
                            Criteria.where("sku").regex(searchText, "i"),
                            Criteria.where("productName").regex(searchText, "iu"),
                            Criteria.where("category").regex(searchText, "iu")
                    )
            );
        }

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

        List<ProductModel> productList = mongoTemplate.find(query, ProductModel.class);
        long totalCount = mongoTemplate.count(
                Query.of(query).limit(-1).skip(-1),
                ProductModel.class
        );

        return new PageImpl<>(productList, pageable, totalCount);

    }

}

package com.wexon.software.wexon_api.modules.products;

import com.wexon.software.wexon_api.modules.products.dtos.ProductRequestDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Map;

public interface ProductService {

    ProductModel createProduct(ProductRequestDTO dto);

    ProductModel updateProduct(String id, ProductRequestDTO dto);

    String deleteProduct(String id);

    ProductModel getProduct(String id);

    List<ProductModel> getProductListWithFilter(
            String searchText,
            Map<String, Object> filters
    );

    Page<ProductModel> getProductListWithPaginationAndFilter(
            String searchText,
            Map<String, Object> filters,
            Pageable pageable
    );

}

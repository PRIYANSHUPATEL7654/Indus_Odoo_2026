package com.wexon.software.wexon_api.modules.products;

import com.wexon.software.wexon_api.commons.responses.successResponse.ApiResult;
import com.wexon.software.wexon_api.modules.products.dtos.ProductRequestDTO;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/product")
@RequiredArgsConstructor
@Tag(name = "Product APIs", description = "Product Management APIs")
public class ProductController {

    private final ProductService productService;

    @PostMapping("/create")
    public ApiResult<ProductModel> createProduct(
            @Valid @RequestBody ProductRequestDTO dto
    ) {
        var data = productService.createProduct(dto);
        return new ApiResult<>(
                HttpStatus.CREATED,
                "Product created successfully",
                data);

    }

    @PutMapping("/update/{id}")
    public ApiResult<ProductModel> updateProduct(
            @PathVariable String id,
            @Valid @RequestBody ProductRequestDTO dto
    ) {

        var data = productService.updateProduct(id, dto);
        return new ApiResult<>(
                HttpStatus.OK,
                "Product updated successfully",
                data);

    }

    @DeleteMapping("/delete/{id}")
    public ApiResult<String> deleteProduct(@PathVariable String id) {

        var data = productService.deleteProduct(id);
        return new ApiResult<>(
                HttpStatus.OK,
                "Product deleted successfully",
                data);

    }

    @GetMapping("/get/{id}")
    public ApiResult<ProductModel> getProduct(@PathVariable String id) {

        var data = productService.getProduct(id);
        return new ApiResult<>(
                HttpStatus.OK,
                "Product fetched successfully",
                data);

    }

    @PostMapping("/getProductListWithFilter")
    public ApiResult<List<ProductModel>> getProductListWithFilter(
            @RequestParam(required = false)
            String searchText,
            @RequestBody(required = false)
            Map<String, Object> filters
    ) {

        var data = productService.getProductListWithFilter(
                searchText,
                filters
        );

        return new ApiResult<>(
                HttpStatus.OK,
                "Product list fetched successfully",
                data);

    }

    @PostMapping("/getProductListWithPaginationAndFilter")
    public ApiResult<Page<ProductModel>> getProductListWithPaginationAndFilter(
            @RequestParam(required = false)
            String searchText,
            @RequestBody(required = false)
            Map<String, Object> filters,
            @PageableDefault(
                    size = 20,
                    sort = "createdAt",
                    direction = Sort.Direction.DESC
            )
            Pageable pageable
    ) {

        var data = productService.getProductListWithPaginationAndFilter(
                searchText,
                filters,
                pageable
        );

        return new ApiResult<>(
                HttpStatus.OK,
                "Product list fetched successfully with pagination",
                data
        );

    }
}

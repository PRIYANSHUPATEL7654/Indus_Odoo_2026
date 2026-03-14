package com.wexon.software.wexon_api.modules.inventory.product_inventory;

import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/product/inventory")
@RequiredArgsConstructor
@Tag(name = "Product Inventory APIs", description = "Product Inventory Management APIs")
public class ProductInventoryController {

}

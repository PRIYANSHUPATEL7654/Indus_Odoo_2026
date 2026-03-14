package com.wexon.software.wexon_api.migrations;

import com.wexon.software.wexon_api.commons.enums.PartyType;
import com.wexon.software.wexon_api.commons.enums.ProductCategory;
import com.wexon.software.wexon_api.commons.enums.TransactionDirection;
import com.wexon.software.wexon_api.commons.enums.TransactionNature;
import com.wexon.software.wexon_api.commons.enums.TransactionStatus;
import com.wexon.software.wexon_api.modules.inventory.batch_inventory.BatchInventory;
import com.wexon.software.wexon_api.modules.inventory.inventory_transaction.InventoryTransaction;
import com.wexon.software.wexon_api.modules.inventory.product_inventory.ProductInventory;
import com.wexon.software.wexon_api.modules.inventory.transaction_details.InventoryTransactionDetails;
import com.wexon.software.wexon_api.modules.products.ProductModel;
import com.wexon.software.wexon_api.modules.vendors.VendorModel;
import com.wexon.software.wexon_api.modules.warehouse.core.WarehouseModel;
import com.wexon.software.wexon_api.modules.warehouse.locations.WarehouseLocationModel;
import io.mongock.api.annotations.ChangeUnit;
import io.mongock.api.annotations.Execution;
import io.mongock.api.annotations.RollbackExecution;
import org.bson.Document;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;

import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.List;

@ChangeUnit(id = "v1_2_demo_data_seed", order = "3", author = "Codex")
public class V1_2_DemoDataSeedMigration {

    private static final String MARKER_COLLECTION = "seed_markers";
    private static final String MARKER_ID = "wexon_demo_seed_v1";

    @Execution
    public void seed(MongoTemplate mongoTemplate) {

        boolean alreadySeeded = mongoTemplate.exists(
                Query.query(Criteria.where("_id").is(MARKER_ID)),
                MARKER_COLLECTION
        );
        if (alreadySeeded) {
            return;
        }

        LocalDate today = LocalDate.now();
        Instant now = Instant.now();

        // --- Vendors (used as Supplier/Customer for demo) ---
        VendorModel supplier = VendorModel.builder()
                .vendorName("Acme Supplies")
                .companyName("Acme Supplies Pvt Ltd")
                .email("sales@acme.example")
                .mobileNumber("9000000001")
                .gstNumber("27ABCDE1234F1Z5")
                .city("Pune")
                .state("Maharashtra")
                .pincode("411001")
                .isActive(true)
                .isDeleted(false)
                .build();
        supplier = mongoTemplate.save(supplier);

        VendorModel customer = VendorModel.builder()
                .vendorName("City Retail")
                .companyName("City Retail LLP")
                .email("orders@cityretail.example")
                .mobileNumber("9000000002")
                .gstNumber("27ABCDE5678F1Z5")
                .city("Mumbai")
                .state("Maharashtra")
                .pincode("400001")
                .isActive(true)
                .isDeleted(false)
                .build();
        customer = mongoTemplate.save(customer);

        // --- Warehouses ---
        WarehouseModel wh1 = WarehouseModel.builder()
                .warehouseName("Central Warehouse")
                .warehouseCode("WEX-WH-001")
                .ownerName("WEXON Ops")
                .contactNumber("9100000000")
                .totalCapacity(10000.0)
                .availableCapacity(10000.0)
                .usedCapacity(0.0)
                .city("Pune")
                .state("Maharashtra")
                .pincode("411001")
                .isActive(true)
                .isDeleted(false)
                .build();
        wh1 = mongoTemplate.save(wh1);

        WarehouseModel wh2 = WarehouseModel.builder()
                .warehouseName("East Warehouse")
                .warehouseCode("WEX-WH-002")
                .ownerName("WEXON Ops")
                .contactNumber("9100000000")
                .totalCapacity(10000.0)
                .availableCapacity(10000.0)
                .usedCapacity(0.0)
                .city("Mumbai")
                .state("Maharashtra")
                .pincode("400001")
                .isActive(true)
                .isDeleted(false)
                .build();
        wh2 = mongoTemplate.save(wh2);

        // --- Locations ---
        WarehouseLocationModel locA = WarehouseLocationModel.builder()
                .warehouseId(wh1.getId())
                .locationName("Rack A")
                .locationCode("RACK-A")
                .isActive(true)
                .isDeleted(false)
                .build();
        locA = mongoTemplate.save(locA);

        WarehouseLocationModel locB = WarehouseLocationModel.builder()
                .warehouseId(wh1.getId())
                .locationName("Rack B")
                .locationCode("RACK-B")
                .isActive(true)
                .isDeleted(false)
                .build();
        locB = mongoTemplate.save(locB);

        WarehouseLocationModel locZ1 = WarehouseLocationModel.builder()
                .warehouseId(wh2.getId())
                .locationName("Zone 1")
                .locationCode("ZONE-1")
                .isActive(true)
                .isDeleted(false)
                .build();
        locZ1 = mongoTemplate.save(locZ1);

        // --- Products ---
        ProductModel potato = ProductModel.builder()
                .sku("POT-001")
                .productName("Potato (Grade A)")
                .description("Demo product: Potato Grade A (Kg)")
                .category(ProductCategory.POTATO)
                .baseUnit("Kg")
                .isActive(true)
                .isDeleted(false)
                .build();
        potato = mongoTemplate.save(potato);

        ProductModel potatoGradeB = ProductModel.builder()
                .sku("POT-002")
                .productName("Potato (Grade B)")
                .description("Demo product: Potato Grade B (Kg)")
                .category(ProductCategory.POTATO)
                .baseUnit("Kg")
                .isActive(true)
                .isDeleted(false)
                .build();
        potatoGradeB = mongoTemplate.save(potatoGradeB);

        ProductModel potatoSeed = ProductModel.builder()
                .sku("POT-003")
                .productName("Potato Seed")
                .description("Demo product: Potato Seed (Kg)")
                .category(ProductCategory.POTATO)
                .baseUnit("Kg")
                .isActive(true)
                .isDeleted(false)
                .build();
        potatoSeed = mongoTemplate.save(potatoSeed);

        ProductModel lenoBag = ProductModel.builder()
                .sku("BAG-001")
                .productName("Leno Bag (25 Kg)")
                .description("Demo product: Leno Bag 25 Kg (Nos)")
                .category(ProductCategory.LENO_BAG)
                .baseUnit("Nos")
                .isActive(true)
                .isDeleted(false)
                .build();
        lenoBag = mongoTemplate.save(lenoBag);

        ProductModel lenoBag50 = ProductModel.builder()
                .sku("BAG-002")
                .productName("Leno Bag (50 Kg)")
                .description("Demo product: Leno Bag 50 Kg (Nos)")
                .category(ProductCategory.LENO_BAG)
                .baseUnit("Nos")
                .isActive(true)
                .isDeleted(false)
                .build();
        lenoBag50 = mongoTemplate.save(lenoBag50);

        // --- Product Inventory (global balance) ---
        ProductInventory potatoInv = ProductInventory.builder()
                .productId(potato.getId())
                .availableQuantity(0.0)
                .totalQuantity(0.0)
                .rentalQuantity(0.0)
                .build();
        potatoInv = mongoTemplate.save(potatoInv);

        ProductInventory potatoBInv = ProductInventory.builder()
                .productId(potatoGradeB.getId())
                .availableQuantity(0.0)
                .totalQuantity(0.0)
                .rentalQuantity(0.0)
                .build();
        potatoBInv = mongoTemplate.save(potatoBInv);

        ProductInventory potatoSeedInv = ProductInventory.builder()
                .productId(potatoSeed.getId())
                .availableQuantity(0.0)
                .totalQuantity(0.0)
                .rentalQuantity(0.0)
                .build();
        potatoSeedInv = mongoTemplate.save(potatoSeedInv);

        ProductInventory lenoInv = ProductInventory.builder()
                .productId(lenoBag.getId())
                .availableQuantity(0.0)
                .totalQuantity(0.0)
                .rentalQuantity(0.0)
                .build();
        lenoInv = mongoTemplate.save(lenoInv);

        ProductInventory leno50Inv = ProductInventory.builder()
                .productId(lenoBag50.getId())
                .availableQuantity(0.0)
                .totalQuantity(0.0)
                .rentalQuantity(0.0)
                .build();
        leno50Inv = mongoTemplate.save(leno50Inv);

        // --- Approved Receipt: +500 Kg Potato into WH1 ---
        String receiptNo = "DEMO-" + today.format(DateTimeFormatter.ofPattern("yyyyMMdd")) + "-POT-001-RECEIPT-001";
        InventoryTransaction receipt = InventoryTransaction.builder()
                .transactionNo(receiptNo)
                .transactionDate(today)
                .productId(potato.getId())
                .transactionNature(TransactionNature.BUY)
                .transactionDirection(TransactionDirection.IN)
                .affectsWarehouseQuantity(true)
                .warehouseId(wh1.getId())
                .partyType(PartyType.VENDOR)
                .partyId(supplier.getId())
                .status(TransactionStatus.APPROVED)
                .remarks("Demo receipt: 500 Kg Potato (Rack A)")
                .netQuantity(500.0)
                .netAmountPrice(500.0 * 25.0)
                .build();
        receipt = mongoTemplate.save(receipt);

        String batch1 = "DEMO-BATCH-" + today.format(DateTimeFormatter.ofPattern("ddMMyyyy")) + "-001";
        InventoryTransactionDetails receiptLine = InventoryTransactionDetails.builder()
                .transactionId(receipt.getId())
                .transactionNo(receipt.getTransactionNo())
                .batchNo(batch1)
                .locationId(locA.getId())
                .vehicleNumber("MH12AB1234")
                .grossQuantity(500.0)
                .netQuantity(500.0)
                .netUnitPrice(25.0)
                .bagQuantity(50)
                .remarks("Demo receipt line")
                .build();
        mongoTemplate.save(receiptLine);

        BatchInventory batchInv1 = BatchInventory.builder()
                .batchNo(batch1)
                .transactionNo(receipt.getTransactionNo())
                .productId(potato.getId())
                .availableQuantity(500.0)
                .totalQuantity(500.0)
                .rentalQuantity(0.0)
                .affectsWarehouseQuantity(true)
                .warehouseId(wh1.getId())
                .build();
        mongoTemplate.save(batchInv1);

        // Update balances for receipt (global + warehouse capacity)
        potatoInv.setAvailableQuantity(500.0);
        potatoInv.setTotalQuantity(500.0);
        mongoTemplate.save(potatoInv);

        wh1.setUsedCapacity(500.0);
        wh1.setAvailableCapacity(9500.0);
        mongoTemplate.save(wh1);

        // --- Approved Receipt: +200 Nos Leno Bag (25 Kg) into WH1 ---
        String bagReceiptNo = "DEMO-" + today.format(DateTimeFormatter.ofPattern("yyyyMMdd")) + "-BAG-001-RECEIPT-001";
        InventoryTransaction bagReceipt = InventoryTransaction.builder()
                .transactionNo(bagReceiptNo)
                .transactionDate(today)
                .productId(lenoBag.getId())
                .transactionNature(TransactionNature.BUY)
                .transactionDirection(TransactionDirection.IN)
                .affectsWarehouseQuantity(true)
                .warehouseId(wh1.getId())
                .partyType(PartyType.VENDOR)
                .partyId(supplier.getId())
                .status(TransactionStatus.APPROVED)
                .remarks("Demo receipt: 200 Nos Leno Bag 25 Kg (Rack B)")
                .netQuantity(200.0)
                .netAmountPrice(200.0 * 2.0)
                .build();
        bagReceipt = mongoTemplate.save(bagReceipt);

        String bagBatch1 = "DEMO-BATCH-" + today.format(DateTimeFormatter.ofPattern("ddMMyyyy")) + "-BAG-001";
        InventoryTransactionDetails bagReceiptLine = InventoryTransactionDetails.builder()
                .transactionId(bagReceipt.getId())
                .transactionNo(bagReceipt.getTransactionNo())
                .batchNo(bagBatch1)
                .locationId(locB.getId())
                .grossQuantity(200.0)
                .netQuantity(200.0)
                .netUnitPrice(2.0)
                .bagQuantity(0)
                .remarks("Demo leno bag receipt line")
                .build();
        mongoTemplate.save(bagReceiptLine);

        BatchInventory bagBatchInv1 = BatchInventory.builder()
                .batchNo(bagBatch1)
                .transactionNo(bagReceipt.getTransactionNo())
                .productId(lenoBag.getId())
                .availableQuantity(200.0)
                .totalQuantity(200.0)
                .rentalQuantity(0.0)
                .affectsWarehouseQuantity(true)
                .warehouseId(wh1.getId())
                .build();
        mongoTemplate.save(bagBatchInv1);

        lenoInv.setAvailableQuantity(200.0);
        lenoInv.setTotalQuantity(200.0);
        mongoTemplate.save(lenoInv);

        wh1.setUsedCapacity(700.0);
        wh1.setAvailableCapacity(9300.0);
        mongoTemplate.save(wh1);

        // --- Approved Delivery: -120 Kg Potato from batch1 ---
        String deliveryNo = "DEMO-" + today.format(DateTimeFormatter.ofPattern("yyyyMMdd")) + "-POT-001-DELIVERY-001";
        InventoryTransaction delivery = InventoryTransaction.builder()
                .transactionNo(deliveryNo)
                .transactionDate(today)
                .productId(potato.getId())
                .transactionNature(TransactionNature.SELL)
                .transactionDirection(TransactionDirection.OUT)
                .affectsWarehouseQuantity(true)
                .warehouseId(wh1.getId())
                .partyType(PartyType.VENDOR)
                .partyId(customer.getId())
                .status(TransactionStatus.APPROVED)
                .remarks("Demo delivery: 120 Kg Potato")
                .netQuantity(120.0)
                .netAmountPrice(120.0 * 35.0)
                .build();
        delivery = mongoTemplate.save(delivery);

        InventoryTransactionDetails deliveryLine = InventoryTransactionDetails.builder()
                .transactionId(delivery.getId())
                .transactionNo(delivery.getTransactionNo())
                .batchNo(batch1)
                .locationId(locA.getId())
                .grossQuantity(120.0)
                .netQuantity(120.0)
                .netUnitPrice(35.0)
                .bagQuantity(12)
                .remarks("Demo delivery line")
                .build();
        mongoTemplate.save(deliveryLine);

        // Reduce batch + update balances
        batchInv1.setAvailableQuantity(380.0);
        mongoTemplate.save(batchInv1);
        potatoInv.setAvailableQuantity(380.0);
        mongoTemplate.save(potatoInv);
        wh1.setUsedCapacity(580.0);
        wh1.setAvailableCapacity(9420.0);
        mongoTemplate.save(wh1);

        // --- Approved Internal Transfer: 50 Kg from WH1 -> WH2 ---
        String transferNo = "DEMO-" + today.format(DateTimeFormatter.ofPattern("yyyyMMdd")) + "-POT-001-TRANSFER-001";
        InventoryTransaction transfer = InventoryTransaction.builder()
                .transactionNo(transferNo)
                .transactionDate(today)
                .productId(potato.getId())
                .transactionNature(TransactionNature.TRANSFER)
                .transactionDirection(TransactionDirection.OUT)
                .affectsWarehouseQuantity(true)
                // In our hackathon model, transaction.warehouseId is the DESTINATION
                .warehouseId(wh2.getId())
                .status(TransactionStatus.APPROVED)
                .remarks("Demo transfer: 50 Kg Potato WH1 -> WH2")
                .netQuantity(50.0)
                .netAmountPrice(0.0)
                .build();
        transfer = mongoTemplate.save(transfer);

        InventoryTransactionDetails transferLine = InventoryTransactionDetails.builder()
                .transactionId(transfer.getId())
                .transactionNo(transfer.getTransactionNo())
                .batchNo(batch1)
                .locationId(locB.getId())
                .grossQuantity(50.0)
                .netQuantity(50.0)
                .netUnitPrice(0.0)
                .remarks("Demo transfer line")
                .build();
        mongoTemplate.save(transferLine);

        // Reduce source batch and create destination batch
        batchInv1.setAvailableQuantity(330.0);
        mongoTemplate.save(batchInv1);

        String batch2 = "DEMO-BATCH-" + today.format(DateTimeFormatter.ofPattern("ddMMyyyy")) + "-002";
        BatchInventory batchInv2 = BatchInventory.builder()
                .batchNo(batch2)
                .transactionNo(transfer.getTransactionNo())
                .productId(potato.getId())
                .availableQuantity(50.0)
                .totalQuantity(50.0)
                .rentalQuantity(0.0)
                .affectsWarehouseQuantity(true)
                .warehouseId(wh2.getId())
                .build();
        mongoTemplate.save(batchInv2);

        // Warehouse capacities updated for transfer
        wh1.setUsedCapacity(530.0);
        wh1.setAvailableCapacity(9470.0);
        mongoTemplate.save(wh1);

        wh2.setUsedCapacity(50.0);
        wh2.setAvailableCapacity(9950.0);
        mongoTemplate.save(wh2);

        // --- Approved Adjustment: -10 Kg Potato (damage) in WH1 ---
        String adjNo = "DEMO-" + today.format(DateTimeFormatter.ofPattern("yyyyMMdd")) + "-POT-001-ADJUSTMENT-001";
        InventoryTransaction adjustment = InventoryTransaction.builder()
                .transactionNo(adjNo)
                .transactionDate(today)
                .productId(potato.getId())
                .transactionNature(TransactionNature.ADJUSTMENT)
                .transactionDirection(TransactionDirection.OUT)
                .affectsWarehouseQuantity(true)
                .warehouseId(wh1.getId())
                .status(TransactionStatus.APPROVED)
                .remarks("Demo adjustment: 10 Kg damaged")
                .netQuantity(10.0)
                .netAmountPrice(0.0)
                .build();
        adjustment = mongoTemplate.save(adjustment);

        InventoryTransactionDetails adjustmentLine = InventoryTransactionDetails.builder()
                .transactionId(adjustment.getId())
                .transactionNo(adjustment.getTransactionNo())
                .batchNo("DEMO-ADJ-" + today.format(DateTimeFormatter.ofPattern("ddMMyyyy")) + "-001")
                .locationId(locA.getId())
                .grossQuantity(10.0)
                .netQuantity(10.0)
                .netUnitPrice(0.0)
                .remarks("Demo adjustment line")
                .build();
        mongoTemplate.save(adjustmentLine);

        potatoInv.setAvailableQuantity(370.0);
        mongoTemplate.save(potatoInv);
        wh1.setUsedCapacity(520.0);
        wh1.setAvailableCapacity(9480.0);
        mongoTemplate.save(wh1);

        // --- Low stock + out-of-stock demo inventories ---
        // POT-002 low stock (8 Kg) in WH2
        String potBReceiptNo = "DEMO-" + today.format(DateTimeFormatter.ofPattern("yyyyMMdd")) + "-POT-002-RECEIPT-001";
        InventoryTransaction potBReceipt = InventoryTransaction.builder()
                .transactionNo(potBReceiptNo)
                .transactionDate(today.minusDays(1))
                .productId(potatoGradeB.getId())
                .transactionNature(TransactionNature.BUY)
                .transactionDirection(TransactionDirection.IN)
                .affectsWarehouseQuantity(true)
                .warehouseId(wh2.getId())
                .partyType(PartyType.VENDOR)
                .partyId(supplier.getId())
                .status(TransactionStatus.APPROVED)
                .remarks("Demo receipt: 8 Kg Potato Grade B (Zone 1)")
                .netQuantity(8.0)
                .netAmountPrice(8.0 * 18.0)
                .build();
        potBReceipt = mongoTemplate.save(potBReceipt);

        String potBBatch1 = "DEMO-BATCH-" + today.minusDays(1).format(DateTimeFormatter.ofPattern("ddMMyyyy")) + "-POT-002";
        InventoryTransactionDetails potBReceiptLine = InventoryTransactionDetails.builder()
                .transactionId(potBReceipt.getId())
                .transactionNo(potBReceipt.getTransactionNo())
                .batchNo(potBBatch1)
                .locationId(locZ1.getId())
                .grossQuantity(8.0)
                .netQuantity(8.0)
                .netUnitPrice(18.0)
                .bagQuantity(1)
                .remarks("Demo low stock line")
                .build();
        mongoTemplate.save(potBReceiptLine);

        BatchInventory potBBatchInv1 = BatchInventory.builder()
                .batchNo(potBBatch1)
                .transactionNo(potBReceipt.getTransactionNo())
                .productId(potatoGradeB.getId())
                .availableQuantity(8.0)
                .totalQuantity(8.0)
                .rentalQuantity(0.0)
                .affectsWarehouseQuantity(true)
                .warehouseId(wh2.getId())
                .build();
        mongoTemplate.save(potBBatchInv1);

        potatoBInv.setAvailableQuantity(8.0);
        potatoBInv.setTotalQuantity(8.0);
        mongoTemplate.save(potatoBInv);

        wh2.setUsedCapacity(58.0);
        wh2.setAvailableCapacity(9942.0);
        mongoTemplate.save(wh2);

        // BAG-002 low stock (5 Nos) in WH1
        String bag50ReceiptNo = "DEMO-" + today.format(DateTimeFormatter.ofPattern("yyyyMMdd")) + "-BAG-002-RECEIPT-001";
        InventoryTransaction bag50Receipt = InventoryTransaction.builder()
                .transactionNo(bag50ReceiptNo)
                .transactionDate(today.minusDays(2))
                .productId(lenoBag50.getId())
                .transactionNature(TransactionNature.BUY)
                .transactionDirection(TransactionDirection.IN)
                .affectsWarehouseQuantity(true)
                .warehouseId(wh1.getId())
                .partyType(PartyType.VENDOR)
                .partyId(supplier.getId())
                .status(TransactionStatus.APPROVED)
                .remarks("Demo receipt: 5 Nos Leno Bag 50 Kg (Rack A)")
                .netQuantity(5.0)
                .netAmountPrice(5.0 * 3.0)
                .build();
        bag50Receipt = mongoTemplate.save(bag50Receipt);

        String bag50Batch1 = "DEMO-BATCH-" + today.minusDays(2).format(DateTimeFormatter.ofPattern("ddMMyyyy")) + "-BAG-002";
        InventoryTransactionDetails bag50ReceiptLine = InventoryTransactionDetails.builder()
                .transactionId(bag50Receipt.getId())
                .transactionNo(bag50Receipt.getTransactionNo())
                .batchNo(bag50Batch1)
                .locationId(locA.getId())
                .grossQuantity(5.0)
                .netQuantity(5.0)
                .netUnitPrice(3.0)
                .remarks("Demo low stock bag line")
                .build();
        mongoTemplate.save(bag50ReceiptLine);

        BatchInventory bag50BatchInv1 = BatchInventory.builder()
                .batchNo(bag50Batch1)
                .transactionNo(bag50Receipt.getTransactionNo())
                .productId(lenoBag50.getId())
                .availableQuantity(5.0)
                .totalQuantity(5.0)
                .rentalQuantity(0.0)
                .affectsWarehouseQuantity(true)
                .warehouseId(wh1.getId())
                .build();
        mongoTemplate.save(bag50BatchInv1);

        leno50Inv.setAvailableQuantity(5.0);
        leno50Inv.setTotalQuantity(5.0);
        mongoTemplate.save(leno50Inv);

        wh1.setUsedCapacity(525.0);
        wh1.setAvailableCapacity(9475.0);
        mongoTemplate.save(wh1);

        // POT-003 out-of-stock remains 0 (inventory already created)

        // --- Pending (CREATED) demo documents for dashboard counters ---
        seedPending(mongoTemplate, today, supplier, customer, wh1, wh2, potato, lenoBag, lenoBag50);

        // marker
        Document marker = new Document()
                .append("_id", MARKER_ID)
                .append("seededAt", now)
                .append("timezone", ZoneId.systemDefault().toString());
        mongoTemplate.save(marker, MARKER_COLLECTION);
    }

    private void seedPending(
            MongoTemplate mongoTemplate,
            LocalDate today,
            VendorModel supplier,
            VendorModel customer,
            WarehouseModel wh1,
            WarehouseModel wh2,
            ProductModel potato,
            ProductModel lenoBag,
            ProductModel lenoBag50
    ) {
        InventoryTransaction pendingReceipt = InventoryTransaction.builder()
                .transactionNo("DEMO-PENDING-RECEIPT-001")
                .transactionDate(today)
                .productId(lenoBag.getId())
                .transactionNature(TransactionNature.BUY)
                .transactionDirection(TransactionDirection.IN)
                .affectsWarehouseQuantity(true)
                .warehouseId(wh1.getId())
                .partyType(PartyType.VENDOR)
                .partyId(supplier.getId())
                .status(TransactionStatus.CREATED)
                .remarks("Pending demo receipt (not approved yet)")
                .build();
        mongoTemplate.save(pendingReceipt);

        InventoryTransaction pendingReceipt2 = InventoryTransaction.builder()
                .transactionNo("DEMO-PENDING-RECEIPT-002")
                .transactionDate(today)
                .productId(lenoBag50.getId())
                .transactionNature(TransactionNature.BUY)
                .transactionDirection(TransactionDirection.IN)
                .affectsWarehouseQuantity(true)
                .warehouseId(wh2.getId())
                .partyType(PartyType.VENDOR)
                .partyId(supplier.getId())
                .status(TransactionStatus.CREATED)
                .remarks("Pending demo receipt (not approved yet)")
                .build();
        mongoTemplate.save(pendingReceipt2);

        InventoryTransaction pendingDelivery = InventoryTransaction.builder()
                .transactionNo("DEMO-PENDING-DELIVERY-001")
                .transactionDate(today)
                .productId(potato.getId())
                .transactionNature(TransactionNature.SELL)
                .transactionDirection(TransactionDirection.OUT)
                .affectsWarehouseQuantity(true)
                .warehouseId(wh1.getId())
                .partyType(PartyType.VENDOR)
                .partyId(customer.getId())
                .status(TransactionStatus.CREATED)
                .remarks("Pending demo delivery (not approved yet)")
                .build();
        mongoTemplate.save(pendingDelivery);

        InventoryTransaction pendingTransfer = InventoryTransaction.builder()
                .transactionNo("DEMO-PENDING-TRANSFER-001")
                .transactionDate(today)
                .productId(potato.getId())
                .transactionNature(TransactionNature.TRANSFER)
                .transactionDirection(TransactionDirection.OUT)
                .affectsWarehouseQuantity(true)
                .warehouseId(wh2.getId())
                .status(TransactionStatus.CREATED)
                .remarks("Pending demo transfer (not approved yet)")
                .build();
        mongoTemplate.save(pendingTransfer);

        InventoryTransaction pendingAdjustment = InventoryTransaction.builder()
                .transactionNo("DEMO-PENDING-ADJUSTMENT-001")
                .transactionDate(today)
                .productId(potato.getId())
                .transactionNature(TransactionNature.ADJUSTMENT)
                .transactionDirection(TransactionDirection.OUT)
                .affectsWarehouseQuantity(true)
                .warehouseId(wh1.getId())
                .status(TransactionStatus.CREATED)
                .remarks("Pending demo adjustment (not approved yet)")
                .build();
        mongoTemplate.save(pendingAdjustment);
    }

    @RollbackExecution
    public void rollback(MongoTemplate mongoTemplate) {
        mongoTemplate.remove(Query.query(Criteria.where("_id").is(MARKER_ID)), MARKER_COLLECTION);

        // Best-effort cleanup for demo entities (by known codes/skus/prefixes).
        mongoTemplate.remove(
                Query.query(Criteria.where("locationCode").in("RACK-A", "RACK-B", "ZONE-1")),
                WarehouseLocationModel.class
        );

        mongoTemplate.remove(
                Query.query(Criteria.where("warehouseCode").in("WEX-WH-001", "WEX-WH-002")),
                WarehouseModel.class
        );

        mongoTemplate.remove(
                Query.query(Criteria.where("vendorName").in("Acme Supplies", "City Retail")),
                VendorModel.class
        );

        List<ProductModel> demoProducts = mongoTemplate.find(
                Query.query(Criteria.where("sku").in("POT-001", "POT-002", "POT-003", "BAG-001", "BAG-002")),
                ProductModel.class
        );

        List<String> demoProductIds = demoProducts.stream().map(ProductModel::getId).toList();

        if (!demoProductIds.isEmpty()) {
            mongoTemplate.remove(
                    Query.query(Criteria.where("productId").in(demoProductIds)),
                    ProductInventory.class
            );
        }

        mongoTemplate.remove(
                Query.query(Criteria.where("transactionNo").regex("^DEMO-")),
                InventoryTransaction.class
        );

        mongoTemplate.remove(
                Query.query(Criteria.where("transactionNo").regex("^DEMO-")),
                InventoryTransactionDetails.class
        );

        mongoTemplate.remove(
                Query.query(Criteria.where("batchNo").regex("^DEMO-")),
                BatchInventory.class
        );

        mongoTemplate.remove(
                Query.query(Criteria.where("sku").in("POT-001", "POT-002", "POT-003", "BAG-001", "BAG-002")),
                ProductModel.class
        );
    }
}

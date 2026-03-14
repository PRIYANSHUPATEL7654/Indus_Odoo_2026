# Hackathon Migration Plan — CoreInventory Alignment

This repo (`wexon-api` + `wexon-ui`) must match the **CoreInventory** problem statement (Inventory Management System: Products, Operations, Warehouses/Locations, Dashboard KPIs, Move History).

Principles:
- Keep the app **working at every step** (no big-bang rewrite).
- Prefer **compatibility layers** first, then refactor/move files.
- Ship the PDF core scope first: **Auth + Dashboard + Products + Operations (Receipts/Deliveries/Transfers/Adjustments) + Move History + Settings**.

---

## Step-by-step checklist (minimum viable “working” first)

### Phase 0 — Baseline + Docs
1. [ ] Freeze scope: implement **Core Features** only (Products, Receipts, Deliveries, Transfers, Adjustments, Move History, Dashboard KPIs).
2. [ ] Add a single source of truth doc: this file + keep `README.md` aligned to hackathon naming.
3. [ ] Confirm environments run locally:
   - Backend: `cd wexon-api && ./gradlew bootRun`
   - Frontend: `cd wexon-ui && npm run dev`
4. [ ] Add a “hackathon” API contract note (request/response examples) for Operations.

### Phase 1 — Fix “not working” contract mismatches (must-do)
5. [ ] Unify request payload keys: UI must send `transactionNature` + `transactionDate` (not `transactionType`).
6. [ ] Make Operations “one-step” in hackathon mode:
   - On create, backend also creates `InventoryTransactionDetails` (single line) and **auto-approves** (updates stock immediately).
7. [ ] Fix enum/status mismatches between UI and backend:
   - Backend: `CANCELED`
   - UI must accept/render the backend status values.
8. [ ] Fix broken frontend routes in menu (links must exist).

### Phase 2 — Rename UI modules to match PDF navigation
9. [ ] Replace “Inventory” menu with “Operations”:
   - Receipts (incoming)
   - Delivery Orders (outgoing)
   - Internal Transfers
   - Inventory Adjustments
10. [ ] Add pages under `src/app/(protected)/operations/...` and keep old routes as thin wrappers temporarily.
11. [ ] Add “Move History” page (stock ledger list) + filters (type/status/warehouse/category).

### Phase 3 — Data model alignment (multi-warehouse/location stock)
12. [ ] Add **Location** under Warehouse (rack/bin/location):
   - Backend: new `warehouse/locations` module (CRUD)
   - UI: Settings → Locations
13. [ ] Make stock balances per warehouse/location:
   - Update `ProductInventory` to include `warehouseId` and `locationId`
   - Ensure all operations update the correct balance rows
14. [ ] Implement “Low stock / Out of stock” rules:
   - Add reorder rules to products (minQty, reorderQty, etc.)

### Phase 4 — Implement missing Operations (core)
15. [ ] Implement Internal Transfer:
   - Request includes `fromWarehouseId/fromLocationId` and `toWarehouseId/toLocationId`
   - Logs one movement, updates both balances
16. [ ] Implement Stock Adjustment:
   - Request includes `countedQuantity` and system computes delta
   - Logs the adjustment as a movement
17. [ ] Add Operations list screens with PDF statuses (Draft/Waiting/Ready/Done/Canceled) or a mapping layer.

### Phase 5 — Dashboard KPIs (PDF)
18. [ ] Backend: add dashboard KPI endpoint:
   - Total products in stock
   - Low/out-of-stock items
   - Pending receipts
   - Pending deliveries
   - Scheduled internal transfers
19. [ ] UI dashboard: KPI tiles + dynamic filters:
   - By document type, status, warehouse/location, product category

### Phase 6 — Cleanup and “hackathon ready”
20. [ ] Remove non-hackathon modules from nav (ledger/accounting), or relabel clearly.
21. [ ] Remove “Farmer” domain (hackathon doesn’t include it):
   - Replace with Supplier/Customer (or a single `Party` model)
22. [ ] Seed/demo data + a scripted runbook for judges.
23. [ ] Final smoke test flow:
   - Create product → create receipt → stock increases → create delivery → stock decreases → transfer → adjustment → view move history → dashboard updates.

---

## Current work in progress (started)
- Step 5/6/8: Align UI↔API for transactions and make receipt/delivery creation update stock immediately (auto-approve).
- Step 9/10: Add Operations routes and fix sidebar links.


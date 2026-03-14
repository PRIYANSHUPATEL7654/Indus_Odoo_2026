"use client";

import React from "react";
import PageTitle from "@/components/basicComponents/PageTitle";
import { History } from "lucide-react";
import InventoryTransactionTable from "@/app/(protected)/inventory/manage/InventoryTransactionTable";
import { useSearchParams } from "next/navigation";

const MoveHistoryPage = () => {
  const searchParams = useSearchParams();
  const partyId = searchParams.get("partyId") ?? undefined;
  const transactionNature = searchParams.get("transactionNature") ?? undefined;

  const filters: Record<string, any> = {};
  if (partyId) filters.partyId = partyId;
  if (transactionNature) filters.transactionNature = transactionNature;

  return (
    <div className="flex flex-col gap-5">
      <PageTitle
        title="Move History"
        description="All stock movements (receipts, deliveries, transfers, adjustments) in one ledger view."
        startIcon={History}
      />

      <InventoryTransactionTable filters={filters} tableHeaderText="Move History" />
    </div>
  );
};

export default MoveHistoryPage;

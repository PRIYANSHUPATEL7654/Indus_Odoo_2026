"use client"

import {Contact2} from "lucide-react";
import PageTitle from "@/components/basicComponents/PageTitle";
import {useParams} from "next/navigation";
import {useQuery} from "@tanstack/react-query";
import {getLedgerAccountByEntityId, getLedgerTransactionByEntityId} from "@/api/ledger";
import AccountPageHeader from "@/app/(protected)/ledger/[id]/AccountPageHeader";

const fetchEntityLedgerAccount = (entityId: string) => ({
    queryKey: ["ledgerAccount", entityId],
    queryFn: async () => {
        const response = await getLedgerAccountByEntityId(entityId);
        return response?.data;
    },
    enabled: !!entityId,
})

const fetchEntityLedgerTransaction = (entityId: string) => ({
    queryKey: ["ledgerTransaction", entityId],
    queryFn: async () => {
        const response = await getLedgerTransactionByEntityId(entityId);
        return response?.data;
    },
    enabled: !!entityId,
})


const LedgerPageClient = () => {

    const { id: entityId } = useParams<{ id: string }>();
    const { data: ledgerAccount, isLoading: isLoadingAccount } = useQuery(fetchEntityLedgerAccount(entityId));
    const { data: ledgerTransaction, isLoading: isLoadingTransaction } = useQuery(fetchEntityLedgerTransaction(entityId));

    return (
        <div className="flex flex-col gap-5">

            <PageTitle
                title="Ledger"
                description="View and manage all financial transactions and balances for client."
                startIcon={Contact2}
            />

            <AccountPageHeader entityId={entityId} />


        </div>
    )
}

export default LedgerPageClient;
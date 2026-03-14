"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import {
    Building2,
    CircleCheckBig,
    CircleX,
    User,
    Wallet,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { getLedgerAccountByEntityId } from "@/api/ledger";

const fetchEntityLedgerAccount = (entityId: string) => ({
    queryKey: ["ledgerAccount", entityId],
    queryFn: async () => {
        const response = await getLedgerAccountByEntityId(entityId);
        return response?.data;
    },
    enabled: !!entityId,
});


type AccountPageHeaderProps = {
    entityId: string;
};


const AccountPageHeader = ({ entityId }: AccountPageHeaderProps) => {

    const {
        data: account,
        isLoading,
    } = useQuery(fetchEntityLedgerAccount(entityId));


    if (isLoading) {
        return (
            <div className="w-full border rounded-xl">
                <div className="flex p-4 gap-3 items-start justify-between">
                    <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-3">
                            <Skeleton className="h-7 w-48" />
                            <Skeleton className="h-6 w-20 rounded-full" />
                        </div>
                        <Skeleton className="h-4 w-52" />
                        <Skeleton className="h-4 w-44" />
                    </div>

                    <div className="flex gap-3">
                        {[1, 2, 3].map((_, i) => (
                            <div
                                key={i}
                                className="p-3 border border-dashed rounded-lg flex flex-col gap-2"
                            >
                                <Skeleton className="h-6 w-24" />
                                <Skeleton className="h-4 w-28" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }


    return (
        <div>
            <div className="w-full border-t border-l border-r rounded-tl-lg rounded-tr-lg">
                <div className="flex p-4 gap-3 items-start justify-between">
                    <div className="flex gap-3">
                        <div className="flex flex-col">
                            <div className="flex items-center gap-3">

                                <div className="text-2xl font-semibold flex items-center gap-2">
                                    {account?.accountName} - {account?.accountNumber}
                                </div>

                                <Badge>
                                    {account?.entityType === "vendor" ? <Building2 /> : <User />}
                                    {account?.entityType === "vendor" ? "Vendor" : "Party"}
                                </Badge>

                            </div>

                            <div className="flex flex-col text-sm font-medium text-muted-foreground">
                                <div>Opening Balance: {account?.openingBalance}</div>
                                <div>Opening Balance Type: {account?.openingType}</div>
                            </div>
                        </div>
                    </div>


                    <div className="flex gap-3">

                        <div className="p-3 border border-dashed rounded-lg">
                            <div className="text-xl font-semibold flex items-center gap-1">
                                ₹ {account?.currentBalance}
                            </div>
                            <div className="text-sm text-muted-foreground">
                                Current Balance
                            </div>
                        </div>

                        <div className="p-3 border border-dashed rounded-lg">
                            <div className="text-xl font-semibold">
                                ₹ {account?.totalCredit}
                            </div>
                            <div className="text-sm text-muted-foreground">
                                Total Credit
                            </div>
                        </div>

                        <div className="p-3 border border-dashed rounded-lg">
                            <div className="text-xl font-semibold">
                                ₹ {account?.totalDebit}
                            </div>
                            <div className="text-sm text-muted-foreground">
                                Total Debit
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="border-t px-4 py-2 text-xs flex gap-6 bg-black text-white rounded-bl-lg rounded-br-lg border-black">
                <div>
                    Created : {format(new Date(account?.createdAt), "dd MMMM yyyy")}
                </div>
                <div>
                    Last Updated : {format(new Date(account?.updatedAt), "dd MMMM yyyy")}
                </div>
            </div>
        </div>


    );
};

export default AccountPageHeader;

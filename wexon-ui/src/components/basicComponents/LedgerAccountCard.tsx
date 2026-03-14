
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { User } from "lucide-react";
import React from "react";

const LedgerAccountCard = ({ account }: { account: any }) => {

    return (
        <div className="flex flex-col gap-2">
            <div className="flex items-center p-2 gap-2 text-lg font-semibold border-b">
                <User className="h-5 w-5 text-green-600" />
                Account Details
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-2">
                <div className="space-y-0.5">
                    <p className="text-xs text-muted-foreground">Account Number</p>
                    <p className="font-medium">{account.accountName}</p>
                </div>
                <div className="space-y-0.5">
                    <p className="text-xs text-muted-foreground">Account Number</p>
                    <p className="font-medium">{account.accountNumber}</p>
                </div>
                <div className="space-y-0.5">
                    <p className="text-xs text-muted-foreground">Entity Type</p>
                    <p className="font-medium">{account.entityType}</p>
                </div>
                <div className="space-y-0.5">
                    <p className="text-xs text-muted-foreground">Opening Balance</p>
                    <p className="font-medium">
                        ₹ {account.openingBalance}{"  "}
                        <Badge variant="outline">
                            {account.openingType}
                        </Badge>
                    </p>
                </div>
                <div className="space-y-0.5">
                    <p className="text-xs text-muted-foreground">Total Credit</p>
                    <p className="font-medium text-green-600">
                        ₹ {account.totalCredit}
                    </p>
                </div>
                <div className="space-y-0.5">
                    <p className="text-xs text-muted-foreground">Total Debit</p>
                    <p className="font-medium text-red-600">
                        ₹ {account.totalDebit}
                    </p>
                </div>
                <div className="space-y-0.5">
                    <p className="text-xs text-muted-foreground">Current Balance</p>
                    <p className="font-semibold">
                        ₹ {account.currentBalance}{"  "}
                        <Badge variant="outline">
                            {account.balanceType}
                        </Badge>
                    </p>
                </div>
                <div className="space-y-0.5">
                    <p className="text-xs text-muted-foreground">Created At</p>
                    <p className="font-medium">
                        {format(new Date(account.createdAt), "dd MMM yyyy")}
                    </p>
                </div>
                <div className="space-y-0.5">
                    <p className="text-xs text-muted-foreground">Created At</p>
                    <p className="font-medium">
                        {format(new Date(account.updatedAt), "dd MMM yyyy")}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LedgerAccountCard;

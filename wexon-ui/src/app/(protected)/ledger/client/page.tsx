"use client"

import {Contact2, Search} from "lucide-react";
import PageTitle from "@/components/basicComponents/PageTitle";
import {InputGroup, InputGroupAddon, InputGroupInput} from "@/components/ui/input-group";
import {Button} from "@/components/ui/button";


const LedgerClientPage = () => {

    return (
        <div className="flex flex-col gap-5">

            <PageTitle
                title="Ledger"
                description="View and manage all financial transactions and balances for clients and parties."
                startIcon={Contact2}
            />

            <div className="flex gap-4">
                <InputGroup>
                    <InputGroupAddon align="inline-start">
                        <Search />
                    </InputGroupAddon>
                    <InputGroupInput
                        placeholder="Search By Client Mobile Number"
                    />
                </InputGroup>
                <Button>Search</Button>
            </div>

        </div>
    )
}

export default LedgerClientPage;
import getAxiosInstance from "@/api/getAxiosInstance";

export const getLedgerAccountByEntityId = (id: string) => {
    const instance = getAxiosInstance();
    return instance.get(`/ledger/account/getLedgerAccountByEntityId/${id}`);
}

export const getLedgerTransactionByEntityId = (id: string) => {
    const instance = getAxiosInstance();
    return instance.get(`/ledger/transaction/getLedgerTransactionByEntityId/${id}`);
}
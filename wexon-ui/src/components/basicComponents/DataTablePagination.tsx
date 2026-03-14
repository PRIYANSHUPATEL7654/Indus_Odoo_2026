"use client";

import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
    PaginationEllipsis,
} from "@/components/ui/pagination";

interface DataTablePaginationProps {
    page: number; // 0-based
    totalPages: number;
    onPageChange: (page: number) => void;
}

const DataTablePagination = (
    {
        page,
        totalPages,
        onPageChange,
    }: DataTablePaginationProps
) => {

    if (totalPages <= 1) return null;

    const visiblePages = () => {
        const pages = new Set<number>();

        pages.add(0);
        pages.add(totalPages - 1);

        for (let i = page - 1; i <= page + 1; i++) {
            if (i > 0 && i < totalPages - 1) {
                pages.add(i);
            }
        }

        return Array.from(pages).sort((a, b) => a - b);
    };

    const pages = visiblePages();

    return (
        <Pagination>
            <PaginationContent>
                <PaginationItem>
                    <PaginationPrevious
                        aria-disabled={page === 0}
                        className={page === 0 ? "pointer-events-none opacity-50" : ""}
                        onClick={() => onPageChange(page - 1)}
                    />
                </PaginationItem>

                {pages.map((p, i) => (
                    <PaginationItem key={p} className="flex">
                        {i > 0 && pages[i - 1] !== p - 1 && <PaginationEllipsis />}
                        <PaginationLink
                            isActive={p === page}
                            onClick={() => onPageChange(p)}
                        >
                            {p + 1}
                        </PaginationLink>
                    </PaginationItem>
                ))}

                <PaginationItem>
                    <PaginationNext
                        aria-disabled={page + 1 >= totalPages}
                        className={
                            page + 1 >= totalPages
                                ? "pointer-events-none opacity-50"
                                : ""
                        }
                        onClick={() => onPageChange(page + 1)}
                    />
                </PaginationItem>
            </PaginationContent>
        </Pagination>
    );
}

export default DataTablePagination;
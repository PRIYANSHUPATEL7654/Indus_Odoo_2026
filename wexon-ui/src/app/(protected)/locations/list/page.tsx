"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import { MapPin, Plus } from "lucide-react";

import PageTitle from "@/components/basicComponents/PageTitle";
import DataTable from "@/components/basicComponents/DataTable";
import { Button } from "@/components/ui/button";
import { getLocationListWithPaginationAndFilter } from "@/api/location";

type LocationRow = {
  id: string;
  warehouseId: string;
  locationName: string;
  locationCode: string;
  isActive: boolean;
};

const LocationsListPage = () => {
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [sort, setSort] = useState("createdAt,desc");

  const { data, isLoading } = useQuery({
    queryKey: ["locations", page, size, sort],
    queryFn: async () => {
      const res = await getLocationListWithPaginationAndFilter({ page, size, sort }, {});
      return res.data;
    },
  });

  const columns: ColumnDef<LocationRow>[] = [
    { accessorKey: "locationName", header: "Location Name" },
    { accessorKey: "locationCode", header: "Code" },
    { accessorKey: "warehouseId", header: "Warehouse Id" },
    {
      accessorKey: "isActive",
      header: "Active",
      cell: ({ row }) => (row.original.isActive ? "Yes" : "No"),
    },
  ];

  return (
    <div className="flex flex-col gap-5">
      <PageTitle
        title="Locations"
        description="Manage storage locations inside warehouses."
        startIcon={MapPin}
        actions={
          <Button size="lg" variant="default" asChild>
            <Link href="/locations/add" className="flex items-center gap-2">
              <Plus />
              <span>Add Location</span>
            </Link>
          </Button>
        }
      />

      <DataTable
        columns={columns}
        data={data?.content ?? []}
        page={page}
        pageSize={size}
        totalPages={data?.page?.totalPages ?? 0}
        totalElements={data?.page?.totalElements ?? 0}
        onPageChange={setPage}
        onSortChange={setSort}
        isLoading={isLoading}
        stickyLastColumn={false}
        tableHeaderText="Locations"
      />
    </div>
  );
};

export default LocationsListPage;


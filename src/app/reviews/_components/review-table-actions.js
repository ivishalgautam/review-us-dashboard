"use client";
import { DataTableSearch } from "@/components/ui/table/data-table-search";
import { useReviewTableFilters } from "./use-review-table-filters";
import { DataTableResetFilter } from "@/components/ui/table/data-table-reset-filter";

export default function ReviewTableActions() {
  const {
    isAnyFilterActive,
    resetFilters,
    searchQuery,
    setPage,
    setSearchQuery,
  } = useReviewTableFilters();

  return (
    <div className="my-3 flex flex-wrap items-center gap-4">
      <DataTableSearch
        searchKey="name"
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        setPage={setPage}
      />
      <DataTableResetFilter
        isFilterActive={isAnyFilterActive}
        onReset={resetFilters}
      />
    </div>
  );
}

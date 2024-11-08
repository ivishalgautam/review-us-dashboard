import { Suspense } from "react";
import { serialize, searchParamsCache } from "@/lib/searchparams";
import { DataTableSkeleton } from "@/components/ui/table/data-table-skeleton";
import { Heading } from "@/components/ui/heading";
import PageContainer from "@/components/layout/page-container";
import ReviewListing from "./_components/review-listing";
import ReviewTableActions from "./_components/review-table-actions";

export const metadata = {
  title: "Queries",
};

export default async function Reviews({ searchParams }) {
  searchParamsCache.parse(searchParams);
  const key = serialize({ ...searchParams });

  return (
    <PageContainer>
      <div className="flex items-center justify-between">
        <Heading
          title={"Reviews"}
          description={"Manage reviews (View, Delete)."}
        />
      </div>
      <ReviewTableActions />

      <Suspense
        key={key}
        fallback={<DataTableSkeleton columnCount={4} rowCount={10} />}
      >
        <ReviewListing />
      </Suspense>
    </PageContainer>
  );
}

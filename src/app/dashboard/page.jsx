"use client";
import PageContainer from "@/components/layout/page-container";
import { Heading } from "@/components/ui/heading";
import { endpoints } from "@/utils/endpoints";
import http from "@/utils/http";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { Star } from "lucide-react";

const getReports = async () => {
  return (await http().get(`${endpoints.reports.getAll}`)) ?? {};
};

export default function Home() {
  const {
    data: report = {},
    isLoading: isReportLoading,
    isError: isReportError,
    error: reportError,
  } = useQuery({
    queryKey: ["reports"],
    queryFn: getReports,
  });

  console.log({ isReportLoading, isReportError, reportError });
  return (
    <PageContainer className={"space-y-4 bg-white"}>
      <Heading title={"Dashboard"} description={"Dashboard reports"} />

      <Reports
        {...{
          data: report,
          isError: isReportError,
          isLoading: isReportLoading,
          error: reportError,
        }}
      />
    </PageContainer>
  );
}

function Reports({ data, isError, isLoading, error }) {
  if (isLoading) return <Skelotons />;
  if (isError) return error?.message ?? "Error fetching reports";
  const size = 25;
  return (
    <GridContainer>
      <Card
        count={data?.last_month}
        title="Last Month Reviews"
        icon={<Star size={size} className="text-primary" />}
      />
      <Card
        count={data?.curr_month}
        title="Current Month Reviews"
        icon={<Star size={size} className="text-primary" />}
      />
      <Card
        count={data?.total}
        title="Overall Reviews"
        icon={<Star size={size} className="text-primary" />}
      />
    </GridContainer>
  );
}

function GridContainer({ children }) {
  return (
    <div className="grid grid-cols-[repeat(auto-fill,_minmax(300px,1fr))] gap-4">
      {children}
    </div>
  );
}

function Card({ count = 0, title = "", icon = "" }) {
  return (
    <div className="flex items-center justify-start gap-2 rounded-lg border bg-gray-100 p-4 py-3">
      <div className="rounded-full border bg-white p-3">{icon}</div>
      <div className="flex flex-col items-start justify-start">
        <span className="text-xs font-medium tracking-wide">{title}</span>
        <span className="text-3xl font-semibold text-primary">{count}</span>
      </div>
    </div>
  );
}

function Skelotons({ length = 3 }) {
  return (
    <div className="grid grid-cols-[repeat(auto-fill,_minmax(300px,1fr))] gap-4">
      {Array.from({ length }).map((_, key) => (
        <Skeleton className={"h-[74.6px] bg-gray-200"} key={key} />
      ))}
    </div>
  );
}

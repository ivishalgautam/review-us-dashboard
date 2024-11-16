"use client";
import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useRouter, useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";

import { DataTable } from "@/components/ui/table/data-table";
import React from "react";
import { columns } from "../columns";
import { DataTableSkeleton } from "@/components/ui/table/data-table-skeleton";
import {
  deleteUser,
  fetchUsers,
  updateUser,
  updateUserStatus,
} from "@/server/users";

export default function UserListing() {
  const [isModal, setIsModal] = useState(false);
  const [userId, setUserId] = useState("");
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();
  const searchParamsStr = searchParams.toString();
  const router = useRouter();

  const { data, isLoading, isFetching, isError, error } = useQuery({
    queryFn: () => fetchUsers(searchParamsStr),
    queryKey: ["users", searchParamsStr],
    enabled: !!searchParamsStr,
  });

  const deleteMutation = useMutation(deleteUser, {
    onSuccess: () => {
      toast.success("Customer deleted.");
      queryClient.invalidateQueries("users");
    },
    onError: (error) => {
      toast.error(error?.message ?? "error deleting!");
    },
  });

  const handleDelete = async (data) => {
    const confirmation = confirm("Are you sure?");
    if (confirmation) {
      deleteMutation.mutate(data);
    }
  };

  async function handleUserStatus(customerId, status) {
    try {
      const response = await updateUserStatus(customerId, status);
      toast.success(response?.message ?? "Status changed");
      queryClient.invalidateQueries(["users"]);
    } catch (error) {
      console.log(error);
    }
  }

  const updateMutation = useMutation({
    mutationFn: (data) => updateUser(data, userId),
    onSuccess: (data) => {
      toast.success("Updated");
      queryClient.invalidateQueries(["users"]);
      setIsModal(false);
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message ?? error?.message ?? "Error");
    },
  });

  const handleUpdate = (data) => {
    updateMutation.mutate(data);
  };

  useEffect(() => {
    if (!searchParamsStr) {
      const params = new URLSearchParams();
      params.set("page", 1);
      params.set("limit", 10);
      router.replace(`?${params.toString()}`);
    }
  }, [searchParamsStr, router]);

  if (isLoading || isFetching)
    return <DataTableSkeleton columnCount={6} rowCount={10} />;

  if (isError) return error?.message ?? "error";

  return (
    <div className="w-full rounded-lg border-input">
      <DataTable
        columns={columns(handleDelete, handleUserStatus, setUserId, () =>
          setIsModal(true),
        )}
        data={data.data}
        totalItems={data.total}
      />
    </div>
  );
}
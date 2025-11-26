"use client";
import { Switch } from "@/components/ui/switch";
import { Small } from "@/components/ui/typography";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import moment from "moment";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const columns = (
  handleDelete,
  handleUserStatus,
  handlePaymentStatus,
  setUserId,
  openModal,
) => [
  {
    accessorKey: "mobile_number",
    header: "Phone",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "is_active",
    header: ({ column }) => {
      return <Button variant="ghost">Status</Button>;
    },
    cell: ({ row }) => {
      const is_active = row.getValue("is_active");
      const id = row.original.id;
      return (
        <div className="flex items-center justify-start gap-2">
          <Switch
            checked={is_active}
            onCheckedChange={() => handleUserStatus(id, !is_active)}
          />
          <Small className={is_active ? "text-green-500" : "text-red-500"}>
            {is_active ? "active" : "inactive"}
          </Small>
        </div>
      );
    },
  },
  {
    accessorKey: "is_payment_received",
    header: ({ column }) => {
      return <Button variant="ghost">Payment</Button>;
    },
    cell: ({ row }) => {
      const is_payment_received = row.getValue("is_payment_received");
      const id = row.original.id;
      return (
        <div className="flex items-center justify-start gap-2">
          <Switch
            checked={is_payment_received}
            onCheckedChange={() =>
              handlePaymentStatus(id, !is_payment_received)
            }
          />
          <Small
            className={is_payment_received ? "text-green-500" : "text-red-500"}
          >
            {is_payment_received ? "Received" : "Not received"}
          </Small>
        </div>
      );
    },
  },
  {
    accessorKey: "created_at",
    header: ({ column }) => {
      return <Button variant="ghost">Registered On</Button>;
    },
    cell: ({ row }) => {
      return (
        <div>{moment(row.getValue("created_at")).format("DD/MM/YYYY")}</div>
      );
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const id = row.original.id;
      const role = row.original.role;
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <DotsHorizontalIcon className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Link href={`/users/${id}/edit`}>Edit</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => handleDelete({ id })}>
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

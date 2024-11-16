"use client";

import * as React from "react";
import { QrCode } from "lucide-react";

import { NavMain } from "@/components/nav-main";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { sidebarData } from "@/data/routes";
import { MainContext } from "@/store/context";
import Link from "next/link";
import { NavUser } from "./nav-user";

export function AppSidebar({ ...props }) {
  const { user } = React.useContext(MainContext);
  const filteredRoutes = sidebarData
    .filter((route) => route.roles.includes(user?.role))
    .map((item) => {
      return {
        ...item,
        items: item.items.filter((item) => item.roles.includes(user?.role)),
      };
    });

  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="#">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <QrCode className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">Review Me</span>
                  {/* <span className="truncate text-xs">Enterprise</span> */}
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={filteredRoutes} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  );
}

"use client";
import React, { useContext, useEffect } from "react";
import { useParams, usePathname, useRouter } from "next/navigation";
import { publicRoutes, sidebarData } from "@/data/routes";
import { MainContext } from "@/store/context";
import { SidebarProvider, SidebarTrigger } from "../ui/sidebar";
import { AppSidebar } from "../app-sidebar";

const parentRoutes = sidebarData.map((item) => ({
  title: item.title,
  url: item.url,
  roles: item.roles,
}));

const childRoutes = sidebarData.flatMap((item) =>
  item.items?.map((item) => ({
    title: item.title,
    url: item.url,
    roles: item.roles,
  })),
);

const filteredRoutes = [...parentRoutes, ...childRoutes];

export default function Layout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const { slug } = useParams();
  const { user, isUserLoading } = useContext(MainContext);
  useEffect(() => {
    if (publicRoutes.some((route) => route === pathname)) {
      return;
    }
    const storedUser = localStorage.getItem("user");
    const currentUser = JSON.parse(storedUser);

    if (!currentUser) return router.replace("/login/user");

    // Find the current route in the AllRoutes array
    const currentRoute = filteredRoutes?.find(
      (route) => route.url === pathname.replace("[slug]", slug),
    );

    // If the current route is not found in the array or the user's role is not allowed for this route
    if (currentRoute && !currentRoute.roles.includes(currentUser.role)) {
      router.replace("/unauthorized");
    }
  }, [pathname, user, isUserLoading, slug, router]);

  const getContent = () => {
    if (publicRoutes.includes(pathname)) {
      return children;
    }

    return (
      <SidebarProvider>
        <AppSidebar />
        <main className="w-full bg-gray-100">
          <SidebarTrigger />
          <div className="px-2">{children}</div>
        </main>
      </SidebarProvider>
    );
  };

  return getContent();
}

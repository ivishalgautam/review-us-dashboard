import { Bot, FileText, LayoutDashboard, User } from "lucide-react";

const ROLES = {
  ADMIN: "admin",
  USER: "user",
};

export const sidebarData = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboard,
    roles: [ROLES.ADMIN, ROLES.USER],
    items: [],
  },
  {
    title: "User",
    url: "#",
    icon: Bot,
    roles: [ROLES.ADMIN],
    items: [
      {
        title: "All Users",
        url: "/users",
        roles: [ROLES.ADMIN],
      },
      {
        title: "Create",
        url: "/users/create",
        roles: [ROLES.ADMIN],
      },
    ],
  },
  {
    title: "Reviews",
    url: "#",
    icon: FileText,
    roles: [ROLES.USER],
    items: [
      {
        title: "All Reviews",
        url: "/reviews",
        roles: [ROLES.USER],
      },
    ],
  },
  {
    title: "Profile Overview",
    url: "/profile",
    icon: User,
    roles: [ROLES.USER],
    items: [],
  },
];

export const publicRoutes = [
  "/login/user",
  "/login/admin",
  "/register",
  "/reviews/create",
  "/thank-you",
];

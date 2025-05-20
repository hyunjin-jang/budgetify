import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("common/pages/home-page.tsx"),
  route("about", "common/pages/about-page.tsx"),
  route("dashboard", "features/dashboard/pages/dashboard-page.tsx"),
  route("dashboard/budget", "features/dashboard/pages/budget-page.tsx"),
  route("dashboard/income", "features/dashboard/pages/income-page.tsx"),
  route("dashboard/expenses", "features/dashboard/pages/expenses-page.tsx"),
  route("dashboard/goals", "features/dashboard/pages/goals-page.tsx"),
  route("auth/join", "features/auth/pages/join-page.tsx"),
  route("auth/login", "features/auth/pages/login-page.tsx"),
] satisfies RouteConfig;

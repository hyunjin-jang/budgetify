import { type RouteConfig, index, prefix, route } from "@react-router/dev/routes";

export default [
  index("common/pages/home-page.tsx"),
  route("about", "common/pages/about-page.tsx"),

  ...prefix("api", [
    route("/notification", "api/notification-api.tsx"),
    route("/welcome", "api/welcome-api.tsx"),
    route("/dashboard", "api/dashboard-api.tsx"),
  ]),

  ...prefix("auth", [
    route("/join", "features/auth/pages/join-page.tsx"),
    route("/login", "features/auth/pages/login-page.tsx"),
    route("/logout", "features/auth/pages/logout-page.tsx"),
  ]),

  ...prefix("notification", [
    index("features/notification/pages/notifications-page.tsx"),
  ]),

  ...prefix("budget", [
    index("features/budget/pages/budget-page.tsx"),
  ]),

  ...prefix("dashboard", [
    index("features/dashboard/pages/dashboard-page.tsx"),
  ]),

  ...prefix("expenses", [
    index("features/expenses/pages/expenses-page.tsx"),
  ]),

  ...prefix("goals", [
    index("features/goals/pages/goals-page.tsx"),
  ]),

  ...prefix("settings", [
    index("features/settings/pages/settings-page.tsx"),
    route("/profile", "features/settings/pages/profile-page.tsx"),
  ]),
] satisfies RouteConfig;

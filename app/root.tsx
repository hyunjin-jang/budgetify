import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLocation,
} from "react-router";

import type { Route } from "./+types/root";
import "./app.css";
import Navigation from "./common/components/navigation";
import { Toaster } from "./common/components/ui/sonner";
import Sidebar from "./common/components/sidebar";
import { makeSSRClient } from "./supa-client";
import { getUserById } from "./features/settings/queries";

export const links: Route.LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
];

export function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const isRoot =
    location.pathname === "/" ||
    location.pathname === "/about" ||
    location.pathname === "/auth/join" ||
    location.pathname === "/auth/login";

  return (
    <html lang="en" className="dark">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="min-h-screen">
        <div className="flex min-h-screen">
          {/* 메인 콘텐츠 */}
          <main
            className={`flex-1 px-8 py-24 md:px-16 ${
              !isRoot ? "md:ml-64" : ""
            }`}
          >
            {children}
          </main>
        </div>

        <Toaster position="bottom-right" />
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export const loader = async ({ request }: Route.LoaderArgs) => {
  const { client } = await makeSSRClient(request);
  const {
    data: { user },
  } = await client.auth.getUser();
  if (user) {
    const profile = await getUserById(client, { id: user.id });
    return { user, profile };
  }
  return { user: null, profile: null };
};

export default function App({ loaderData }: Route.ComponentProps) {
  const isLoggedIn = loaderData.user !== null;
  const location = useLocation();
  const isRoot =
    location.pathname === "/" ||
    location.pathname === "/about" ||
    location.pathname === "/auth/join" ||
    location.pathname === "/auth/login";

  return (
    <>
      {/* 네비게이션 */}
      <Navigation
        isRoot={isRoot}
        isLoggedIn={isLoggedIn}
        hasNotifications={false}
        hasMessages={false}
      />

      {/* 사이드바 */}
      {!isRoot && <Sidebar isRoot={isRoot} />}
      <Outlet />
    </>
  );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details =
      error.status === 404
        ? "The requested page could not be found."
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="pt-16 p-4 container mx-auto">
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre className="w-full p-4 overflow-x-auto">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}

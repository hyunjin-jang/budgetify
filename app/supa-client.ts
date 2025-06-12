import { createBrowserClient, createServerClient, parseCookieHeader, serializeCookieHeader } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "database.types";


// export const browserClient = createBrowserClient<Database>(
//   process.env.SUPABASE_URL!,
//   process.env.SUPABASE_ANON_KEY!
// );

export const makeSSRClient = (request: Request) => {
  const headers = new Headers();

  const serverSideClient = createServerClient<Database>(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          const cookies = parseCookieHeader(request.headers.get("Cookie") ?? "");
          // undefined 값을 가진 쿠키를 필터링하고, value가 string인 것만 반환
          return cookies.filter((cookie): cookie is { name: string; value: string } =>
            cookie.value !== undefined
          );
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            headers.append('Set-Cookie', serializeCookieHeader(name, value, options));
          });
        },
      }
    }
  )
  return {
    client: serverSideClient,
    headers,
  }
}

export const adminClient = createClient<Database>(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);
import { makeSSRClient } from "~/supa-client";
import type { Route } from "../../../.react-router/types/app/+types/logout-page";
import { redirect } from "react-router";

export const loader = async ({ request }: Route.LoaderArgs) => {
  const { client, headers } = await makeSSRClient(request);
  await client.auth.signOut();
  return redirect("/", { headers });
};

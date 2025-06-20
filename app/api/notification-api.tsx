import { adminClient } from "~/supa-client";
import type { Route } from "../../.react-router/types/app/api/+types/notification-api";

export const action = async ({ request }: Route.ActionArgs) => {
  if (request.method !== "POST") {
    return new Response(null, { status: 404 });
  }
  const header = request.headers.get("test");
  if (!header || header !== "notification") {
    return new Response(null, { status: 404 });
  }

  const { data, error } = await adminClient.from("notifications").insert({
    title: "오늘 하루도 화이팅!",
    description: "오늘 하루도 머니도비와 함께 저축하고 목표를 달성하세요!",
    type: "etc",
    read: true,
  });

  if (error) {
    return new Response(JSON.stringify(error), { status: 500 });
  }

  return new Response(JSON.stringify(data), { status: 200 });
};

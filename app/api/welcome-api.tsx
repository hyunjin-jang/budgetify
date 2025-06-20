import { Resend } from "resend";
import type { Route } from "../../.react-router/types/app/api/+types/welcome-api";
import WelcomeUser from "react-email-starter/emails/welcome-user";

const client = new Resend(process.env.RESEND_API_KEY);

export const action = async ({ request }: Route.ActionArgs) => {
  if (request.method !== "POST") {
    return new Response(null, { status: 404 });
  }
  const header = request.headers.get("welcome");
  if (!header || header !== "moneydoby-welcome") {
    return new Response(null, { status: 404 });
  }

  const { email, username } = await request.json();

  const { data, error } = await client.emails.send({
    from: "MoneyDoby <moneydoby@moneydoby.com>",
    to: [email],
    subject: "MoneyDoby 회원가입 축하드립니다!",
    react: <WelcomeUser username={username} />,
  });

  return Response.json({ data, error });
};

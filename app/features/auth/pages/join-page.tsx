import { Button } from "~/common/components/ui/button";
import {
  Form,
  Link,
  redirect,
  useNavigation,
  type MetaFunction,
} from "react-router";
import { Input } from "~/common/components/ui/input";
import z from "zod";
import { makeSSRClient } from "~/supa-client";
import { checkUsernameExists } from "../queries";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Loader2, Eye, EyeOff } from "lucide-react";
import type { Route } from "./+types/join-page";

export const meta: MetaFunction = () => {
  return [
    { title: "머니도비 회원가입" },
    { name: "description", content: "머니도비 회원가입" },
  ];
};

const formSchema = z.object({
  name: z
    .string({ required_error: "이름을 입력해주세요" })
    .min(1, "이름을 입력해주세요"),
  username: z
    .string({ required_error: "닉네임을 입력해주세요" })
    .min(1, "닉네임을 입력해주세요"),
  email: z
    .string({ required_error: "이메일을 입력해주세요" })
    .email("이메일 형식이 올바르지 않습니다"),
  password: z
    .string({ required_error: "비밀번호를 입력해주세요" })
    .min(8, "비밀번호는 8자 이상이어야 합니다"),
});

export const action = async ({ request }: Route.ActionArgs) => {
  console.log(process.env.BASE_URL);
  const formData = await request.formData();
  const { success, data, error } = formSchema.safeParse(
    Object.fromEntries(formData)
  );
  if (!success) {
    return {
      signUpError: null,
      formErrors: error.flatten().fieldErrors,
    };
  }
  const usernameExists = await checkUsernameExists(request, {
    username: data.username,
  });
  if (usernameExists) {
    return {
      signUpError: null,
      formErrors: {
        username: ["이미 존재하는 닉네임입니다."],
        name: [],
        email: [],
        password: [],
      },
    };
  }

  const { client, headers } = await makeSSRClient(request);
  const { error: signUpError } = await client.auth.signUp({
    email: data.email,
    password: data.password,
    options: {
      data: {
        name: data.name,
        username: data.username,
      },
    },
  });
  if (signUpError) {
    return {
      signUpError: signUpError.message,
      formErrors: {
        name: [],
        username: [],
        email: [],
        password: [],
      },
    };
  }

  // 회원가입 성공 시 웰컴 메일 API 호출
  await fetch(`${process.env.BASE_URL}/api/welcome`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      welcome: "moneydoby-welcome",
    },
    body: JSON.stringify({
      email: data.email,
      username: data.username,
    }),
  });

  return redirect("/dashboard", { headers });
};

export default function JoinPage({ actionData }: Route.ComponentProps) {
  const navigation = useNavigation();
  const isSubmitted =
    navigation.state === "submitting" || navigation.state === "loading";
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (actionData && "signUpError" in actionData && actionData.signUpError) {
      toast.error(actionData.signUpError);
    }
  }, [actionData]);

  return (
    <div className="flex flex-col relative items-center justify-center h-full">
      <div className="flex items-center flex-col justify-center w-full max-w-md gap-10">
        <h1 className="text-2xl font-semibold">회원가입</h1>
        <Form className="w-full space-y-4" method="post">
          <Input
            name="name"
            id="name"
            required
            type="text"
            placeholder="이름을 입력해주세요"
          />
          {actionData && "formErrors" in actionData && (
            <p className="text-sm text-red-500">
              {actionData.formErrors.name?.join(", ")}
            </p>
          )}
          <Input
            id="username"
            name="username"
            required
            type="text"
            placeholder="닉네임을 입력해주세요"
          />
          {actionData && "formErrors" in actionData && (
            <p className="text-sm text-red-500">
              {actionData.formErrors.username?.join(", ")}
            </p>
          )}
          <Input
            id="email"
            name="email"
            required
            type="email"
            placeholder="이메일을 입력해주세요"
          />
          {actionData && "formErrors" in actionData && (
            <p className="text-sm text-red-500">
              {actionData.formErrors.email?.join(", ")}
            </p>
          )}
          <div className="relative">
            <Input
              id="password"
              name="password"
              required
              type={showPassword ? "text" : "password"}
              placeholder="비밀번호를 입력해주세요"
              className="pr-10"
            />
            <button
              type="button"
              tabIndex={-1}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground"
              onClick={() => setShowPassword((v) => !v)}
            >
              {showPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </div>
          {actionData && "formErrors" in actionData && (
            <p className="text-sm text-red-500">
              {actionData.formErrors.password?.join(", ")}
            </p>
          )}
          <Button className="w-full" type="submit" disabled={isSubmitted}>
            {isSubmitted ? (
              <Loader2 className="animate-spin" />
            ) : (
              "회원가입 하기"
            )}
          </Button>
          <Button variant={"ghost"} className="w-full">
            <Link to="/auth/login">로그인 하러 가기</Link>
          </Button>
        </Form>
      </div>
    </div>
  );
}

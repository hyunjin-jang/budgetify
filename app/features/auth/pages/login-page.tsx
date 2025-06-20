import { Button } from "~/common/components/ui/button";
import { Form, redirect, useNavigation, type MetaFunction } from "react-router";
import { Input } from "~/common/components/ui/input";
import type { Route } from "../../../.react-router/types/app/+types/login-page";
import { Loader2 } from "lucide-react";
import { z } from "zod";
import { makeSSRClient } from "~/supa-client";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export const meta: MetaFunction = () => {
  return [{ title: "머니도비 로그인" }];
};

const formSchema = z.object({
  email: z
    .string({
      required_error: "이메일을 입력해주세요",
      invalid_type_error: "이메일 형식이 올바르지 않습니다",
    })
    .email("이메일 형식이 올바르지 않습니다"),
  password: z
    .string({
      required_error: "비밀번호를 입력해주세요",
      invalid_type_error: "비밀번호 형식이 올바르지 않습니다",
    })
    .min(8, "비밀번호는 8자 이상이어야 합니다"),
});

export const action = async ({ request }: Route.ActionArgs) => {
  await new Promise((resolve) => setTimeout(resolve, 4000));
  const formData = await request.formData();
  const { success, data, error } = formSchema.safeParse(
    Object.fromEntries(formData)
  );
  if (!success) {
    return {
      loginError: null,
      formErrors: error.flatten().fieldErrors,
    };
  }
  const { email, password } = data;
  const { client, headers } = await makeSSRClient(request);
  const { error: loginError } = await client.auth.signInWithPassword({
    email,
    password,
  });
  if (loginError) {
    return {
      loginError: "아이디 혹은 비밀번호가 올바르지 않습니다",
      formErrors: {
        email: [],
        password: [],
      },
    };
  }
  return redirect("/dashboard", { headers });
};

export default function LoginPage({ actionData }: Route.ComponentProps) {
  const navigation = useNavigation();
  const isSubmitted =
    navigation.state === "submitting" || navigation.state === "loading";
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (actionData && "loginError" in actionData) {
      toast.error(actionData.loginError);
    }
  }, [actionData]);

  return (
    <div className="flex flex-col relative items-center justify-center h-full ">
      <div className="flex items-center flex-col justify-center w-full max-w-md gap-10">
        <h1 className="text-2xl font-semibold">로그인</h1>
        <Form className="w-full space-y-4" method="post">
          <Input
            name="email"
            id="email"
            required
            type="email"
            placeholder="이메일을 입력해주세요"
          />
          {actionData &&
            "formErrors" in actionData &&
            actionData.formErrors && (
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
          {actionData &&
            "formErrors" in actionData &&
            actionData.formErrors && (
              <p className="text-sm text-red-500">
                {actionData.formErrors.password?.join(", ")}
              </p>
            )}
          <Button
            className="w-full active:bg-orange-700"
            type="submit"
            disabled={isSubmitted}
          >
            {isSubmitted ? <Loader2 className="animate-spin" /> : "로그인"}
          </Button>
        </Form>
      </div>
    </div>
  );
}

import { Button } from "~/common/components/ui/button";
import { Form, Link, type MetaFunction } from "react-router";
import { Input } from "~/common/components/ui/input";

export const meta: MetaFunction = () => {
  return [
    { title: "머니도비 로그인" },
    { name: "description", content: "머니도비 로그인" },
  ];
};

export default function LoginPage() {
  return (
    <div className="flex flex-col relative items-center justify-center h-full ">
      <div className="flex items-center flex-col justify-center w-full max-w-md gap-10">
        <h1 className="text-2xl font-semibold">로그인</h1>
        <Form className="w-full space-y-4">
          <Input
            name="email"
            id="email"
            required
            type="email"
            placeholder="이메일을 입력해주세요"
          />
          <Input
            id="password"
            name="password"
            required
            type="password"
            placeholder="비밀번호를 입력해주세요"
          />
          <Button className="w-full" type="submit">
            로그인
          </Button>
        </Form>
      </div>
    </div>
  );
}

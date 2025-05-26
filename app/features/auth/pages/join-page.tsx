import { Button } from "~/common/components/ui/button";
import { Form, Link, type MetaFunction } from "react-router";
import { Input } from "~/common/components/ui/input";

export const meta: MetaFunction = () => {
  return [
    { title: "머니도비 회원가입" },
    { name: "description", content: "머니도비 회원가입" },
  ];
};

export default function JoinPage() {
  return (
    <div className="flex flex-col relative items-center justify-center h-full">
      <div className="flex items-center flex-col justify-center w-full max-w-md gap-10">
        <h1 className="text-2xl font-semibold">회원가입</h1>
        <Form className="w-full space-y-4">
          <Input
            name="name"
            id="name"
            required
            type="text"
            placeholder="이름을 입력해주세요"
          />
          <Input
            id="username"
            name="username"
            required
            type="text"
            placeholder="닉네임을 입력해주세요"
          />
          <Input
            id="email"
            name="email"
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
            회원가입 하기
          </Button>
          <Button variant={"ghost"} className="w-full">
            <Link to="/auth/login">로그인 하러 가기</Link>
          </Button>
        </Form>
      </div>
    </div>
  );
}

import { Link } from "react-router";
import { Button } from "~/common/components/ui/button";

export default function HomePage() {
  return (
    <main className="container px-4 py-8">
      <h1 className="text-4xl font-bold mb-6">돈 관리 한번 해봅시다!</h1>
      <p className="text-lg mb-8">
        월급 날 정말 힘들어요. 돈 관리 한번 해봅시다!
      </p>
      <div className="flex gap-4">
        <Button variant="default">
          <Link to="/dashboard">시작하기</Link>
        </Button>
        <Button variant="outline">
          <Link to="/about">알아보기</Link>
        </Button>
      </div>
    </main>
  );
}

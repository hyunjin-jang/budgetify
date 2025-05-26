import { Link, type MetaFunction } from "react-router";
import { Button } from "~/common/components/ui/button";
import { BorderBeam } from "../components/magicui/border-beam";

export const meta: MetaFunction = () => {
  return [
    { title: "머니도비 홈" },
    { name: "description", content: "머니도비 홈" },
  ];
};

const features = [
  {
    icon: "💸",
    title: "지출 기록",
    description: "카테고리별로 소비 내역을 빠르게 기록할 수 있어요.",
  },
  {
    icon: "🎯",
    title: "예산 설정",
    description: "한 달 예산과 고정비용을 정리하고 스킵/변경도 유연하게.",
  },
  {
    icon: "📊",
    title: "리포트 제공",
    description: "월별/카테고리별 소비 통계와 예산 대비 사용률 제공.",
  },
  {
    icon: "🔔",
    title: "알림 기능",
    description: "예산 초과/지출일 누락 등 주기적인 리마인드 알림.",
  },
  {
    icon: "🗂️",
    title: "목표 설정",
    description: "단기·장기 목표를 설정하고 진행률을 확인할 수 있어요.",
  },
  {
    icon: "🔐",
    title: "안전한 데이터",
    description: "모든 기록은 안전하게 암호화되어 저장됩니다.",
  },
];

export default function HomePage() {
  return (
    <main className="relative overflow-hidden min-h-screen flex flex-col items-center justify-center px-4 bg-background text-foreground">
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-[#0a0a0a] via-[#111] to-[#1a1a1a]" />

      <section className="text-center max-w-2xl py-20">
        <h1 className="text-4xl sm:text-5xl font-bold mb-4 leading-tight">
          예산 설정과 소비 관리를 한번에
        </h1>
        <p className="text-lg text-muted-foreground mb-6">
          머니도비는 수입과 지출을 쉽게 기록하고 예산을 설정하여 체계적으로
          소비를 관리할 수 있는 스마트 가계부 앱입니다.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" variant="default" asChild>
            <Link to="/auth/login">시작하기</Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link to="/about">자세히 알아보기</Link>
          </Button>
        </div>
      </section>

      <section className="relative w-full py-12 bg-muted/5 border-t border-border overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
          {features.map((feature, i) => (
            <div
              key={i}
              className="relative rounded-xl border border-border bg-background p-6 shadow-sm hover:shadow-md transition"
            >
              <BorderBeam
                size={150}
                duration={10}
                className="pointer-events-none absolute inset-0 z-0 rounded-xl"
              />
              <div className="relative z-10">
                <div className="text-3xl mb-2">{feature.icon}</div>
                <h3 className="text-lg font-semibold mb-1">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="text-center py-20 px-4">
        <h2 className="text-xl font-bold text-muted-foreground mb-4">
          어떻게 활용할 수 있나요?
        </h2>
        <p className="text-sm text-muted-foreground max-w-xl mx-auto">
          예산을 설정하고 지출을 기록하면 자동으로 통계가 생성됩니다. 매달
          목표에 따라 소비 패턴을 분석하고 더 나은 재정 생활을 만들어보세요.
        </p>
      </section>
    </main>
  );
}

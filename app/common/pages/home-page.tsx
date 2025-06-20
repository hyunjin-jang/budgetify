import { Link, type MetaFunction } from "react-router";
import { Button } from "~/common/components/ui/button";
import { BorderBeam } from "../components/magicui/border-beam";
import type { Route } from "./+types/home-page";
import { makeSSRClient } from "~/supa-client";

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

export const loader = async ({ request }: Route.LoaderArgs) => {
  const { client } = await makeSSRClient(request);
  const {
    data: { user },
  } = await client.auth.getUser();
  return { isLoggedIn: !!user };
};

export default function HomePage({ loaderData }: Route.ComponentProps) {
  const isLoggedIn = loaderData.isLoggedIn;

  return (
    <main className="relative overflow-hidden min-h-screen flex flex-col items-center justify-center px-4 bg-background text-foreground">
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-[#0a0a0a] via-[#111] to-[#1a1a1a]" />

      <section className="text-center max-w-2xl py-20">
        <h1 className="text-4xl sm:text-5xl font-bold mb-4 leading-tight">
          예산 설정과 소비 관리를 한번에
        </h1>
        <p className="text-lg text-muted-foreground mb-6">
          예산을 설정하고 수입과 지출을 쉽게 기록하세요. <br />
          체계적으로 소비를 관리하세요.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" variant="default" asChild>
            <Link to={isLoggedIn ? "/expenses" : "/auth/login"}>시작하기</Link>
          </Button>
          {/* <Button size="lg" variant="outline" asChild>
            <Link to="/about">자세히 알아보기</Link>
          </Button> */}
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
        <h2 className="text-2xl font-bold mb-8">자주 묻는 질문</h2>

        <div className="max-w-4xl mx-auto space-y-8">
          {/* 서비스 소개 */}
          <div className="text-left">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              🔰 서비스 소개
            </h3>
            <div className="space-y-4">
              <div>
                <p className="font-medium text-sm mb-1">
                  Q. 머니도비는 어떤 앱인가요?
                </p>
                <p className="text-sm text-muted-foreground">
                  A. 머니도비는 예산과 지출을 손쉽게 관리하고, 재무 목표를
                  설정할 수 있도록 도와주는 스마트 가계부 앱입니다. 직관적인
                  UI와 다양한 분석 기능으로 더 나은 소비 습관을 형성할 수 있게
                  해줍니다.
                </p>
              </div>
              <div>
                <p className="font-medium text-sm mb-1">
                  Q. '머니도비'라는 이름의 뜻은 무엇인가요?
                </p>
                <p className="text-sm text-muted-foreground">
                  A. 해리포터의 '도비' 짤에서 영감을 받아, 지출 스트레스에서의
                  해방을 상징합니다.
                </p>
              </div>
            </div>
          </div>

          {/* 예산 및 지출 관리 */}
          <div className="text-left">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              📊 예산 및 지출 관리
            </h3>
            <div className="space-y-4">
              <div>
                <p className="font-medium text-sm mb-1">
                  Q. 예산은 어떻게 설정하나요?
                </p>
                <p className="text-sm text-muted-foreground">
                  A. 월별 예산을 직접 입력하거나 자동 추천 기능을 통해 설정할 수
                  있습니다. 고정지출과 가변지출을 구분해 관리할 수 있으며, 예산
                  초과 시 알림도 받을 수 있습니다.
                </p>
              </div>
              <div>
                <p className="font-medium text-sm mb-1">
                  Q. 지출 내역은 어떻게 추가하나요?
                </p>
                <p className="text-sm text-muted-foreground">
                  A. 카테고리, 금액, 날짜를 입력해 간단히 기록할 수 있습니다.
                </p>
              </div>
            </div>
          </div>

          {/* 목표와 분석 기능 */}
          <div className="text-left">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              🎯 목표와 분석 기능
            </h3>
            <div className="space-y-4">
              <div>
                <p className="font-medium text-sm mb-1">
                  Q. 어떤 목표를 설정할 수 있나요?
                </p>
                <p className="text-sm text-muted-foreground">
                  A. 날짜와 금액 등을 자유롭게 설정 할 수 있습니다.
                </p>
              </div>
              <div>
                <p className="font-medium text-sm mb-1">
                  Q. 리포트는 어떻게 제공되나요?
                </p>
                <p className="text-sm text-muted-foreground">
                  A. 월간 리포트, 카테고리별 분석, 예산 대비 지출 차트 등을 통해
                  자신의 소비 패턴을 한눈에 확인할 수 있습니다.
                </p>
              </div>
            </div>
          </div>

          {/* 보안 및 개인정보 */}
          <div className="text-left">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              🔐 보안 및 개인정보
            </h3>
            <div className="space-y-4">
              <div>
                <p className="font-medium text-sm mb-1">
                  Q. 제 데이터는 안전하게 보호되나요?
                </p>
                <p className="text-sm text-muted-foreground">
                  A. 네. 머니도비는 모든 사용자 데이터를 암호화하여 안전하게
                  저장하며, 외부에 절대 공개되지 않습니다. 또한 정기적으로 보안
                  점검을 실시하고 있습니다.
                </p>
              </div>
              <div>
                <p className="font-medium text-sm mb-1">
                  Q. 로그인 정보는 어떻게 보호되나요?
                </p>
                <p className="text-sm text-muted-foreground">
                  A. 이메일 기반 인증과 함께, 추후 2단계 인증(2FA) 옵션도 지원
                  예정입니다.
                </p>
              </div>
            </div>
          </div>

          {/* 계정 및 고객지원 */}
          <div className="text-left">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              💬 계정 및 고객지원
            </h3>
            <div className="space-y-4">
              <div>
                <p className="font-medium text-sm mb-1">Q. 앱은 무료인가요?</p>
                <p className="text-sm text-muted-foreground">
                  A. 대부분의 핵심 기능은 무료로 제공됩니다. 향후 프리미엄
                  기능은 선택적 구독 형태로 제공될 예정입니다.
                </p>
              </div>
              {/* <div>
                <p className="font-medium text-sm mb-1">
                  Q. 고객지원은 어떻게 받을 수 있나요?
                </p>
                <p className="text-sm text-muted-foreground">
                  A. 앱 내 고객센터 또는 support@moneydoby.com 으로 문의하시면
                  빠르게 답변해드립니다.
                </p>
              </div> */}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

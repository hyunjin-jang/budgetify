import type { MetaFunction } from "react-router";

export const meta: MetaFunction = () => {
  return [
    { title: "머니도비 소개" },
    {
      name: "description",
      content:
        "머니도비는 예산과 지출을 스마트하게 관리할 수 있는 재무관리 앱입니다.",
    },
  ];
};

export default function AboutPage() {
  return (
    <div className="container mx-auto p-4 flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h2 className="text-xl font-semibold">머니도비 이름의 의미</h2>
        <p>
          머니도비(MoneyDoby)는 단순한 가계부 앱이 아니라, 여러분의{" "}
          <strong>돈의 자유를 위한 작은 도우미</strong>가 되고자 만들어졌습니다.
          이름에는 두 가지 의미가 담겨 있습니다. 첫째, "머니(Money)"와
          "도비(Doby)"의 조합으로, 재무관리의 비서 역할을 하는 친근한 캐릭터성을
          나타냅니다. 둘째, 이름의 영감은 영화 해리포터에 등장하는 캐릭터
          "도비(Dobby)"에서 따왔으며, 도비가 "도비 이즈 프리!"라고 외치며 자유를
          얻듯, 사용자가{" "}
          <strong>
            지출과 소비의 스트레스에서 벗어나 자유롭게 돈을 다룰 수 있도록
          </strong>{" "}
          돕는다는 상징적인 의미를 담고 있습니다.
        </p>
      </div>

      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold">머니도비란?</h1>
        <p>
          머니도비(MoneyDoby) 개인의 월별 예산과 지출을 효율적으로 관리할 수
          있도록 설계된 스마트 가계부 앱입니다. 수입과 지출을 직관적으로
          기록하고, 카테고리별로 분석하며, 목표 지출에 맞춰 소비 습관을 개선할
          수 있도록 도와줍니다.
        </p>
      </div>
      <div className="flex flex-col gap-2">
        <h2 className="text-xl font-semibold">주요 기능</h2>
        <ul className="list-disc list-inside text-muted-foreground">
          <li>월별 예산 설정 및 초과 지출 경고</li>
          <li>카테고리별 수입/지출 분석 및 통계 리포트</li>
          <li>정기적인 알림을 통한 소비 습관 개선</li>
          <li>단기 및 장기 목표 설정 기능</li>
          <li>데이터 암호화를 통한 보안 강화</li>
        </ul>
      </div>
      <div className="flex flex-col gap-2">
        <h2 className="text-xl font-semibold">왜 머니도비(MoneyDoby)인가요?</h2>
        <p>
          기존의 복잡한 가계부 앱들과 달리 머니도비는 사용자 중심의 간결한 UI와
          직관적인 흐름을 제공합니다. 소비 습관을 시각화하고 목표 중심으로
          관리함으로써, 사용자의 재정 건강을 실질적으로 향상시킬 수 있도록
          설계되었습니다.
        </p>
      </div>
    </div>
  );
}

import { Button } from "~/common/components/ui/button";
import { BudgetSetting } from "../components/BudgetSetting";
import { useState } from "react";
import type { MetaFunction } from "react-router";

export const meta: MetaFunction = () => [
  { title: "Budgetify 예산 설정" },
  { name: "description", content: "Budgetify 예산 설정" },
];

export default function BudgetPage() {
  const [isBudgetSetting, setIsBudgetSetting] = useState(false);

  return (
    <>
      <div className="space-y-8">
        {/* 예산 설정 버튼 */}
        <div className="flex justify-end">
          <Button onClick={() => setIsBudgetSetting(true)}>예산 설정</Button>
        </div>

        {/* 예산 정보 */}
        <section className="space-y-6">
          <h1 className="text-2xl font-bold">현재 설정중인 예산</h1>

          {/* 예산 설정 방법 */}
          <div className="rounded-lg border p-4 shadow-sm bg-muted/10">
            <h3 className="text-xl font-semibold mb-2">예산 설정 방법</h3>
            <p className="text-muted-foreground">금액으로 설정</p>
          </div>

          {/* 고정 비용 */}
          <div className="rounded-lg border p-4 shadow-sm bg-muted/10">
            <h3 className="text-xl font-semibold mb-2">고정 비용</h3>
            <ul className="space-y-1">
              <li className="flex justify-between">
                <span className="text-muted-foreground">월세</span>
                <span className="font-medium">1,000,000원</span>
              </li>
              <li className="flex justify-between">
                <span className="text-muted-foreground">수도세</span>
                <span className="font-medium">1,000,000원</span>
              </li>
            </ul>
          </div>

          {/* 예산 금액 */}
          <div className="rounded-lg border p-4 shadow-sm bg-muted/10">
            <h3 className="text-xl font-semibold mb-2">예산 금액</h3>
            <p className="font-bold text-lg">1,000,000원</p>
          </div>

          {/* 예산 수준 */}
          <div className="rounded-lg border p-4 shadow-sm bg-muted/10">
            <div className="flex flex-row gap-2 mb-4">
              <h3 className="text-xl font-semibold">예산 수준</h3>
              <p className="text-muted-foreground text-sm">초급</p>
            </div>

            <div className="space-y-1">
              <ul className="grid grid-cols-2 gap-x-4 gap-y-1">
                <li className="flex justify-between">
                  <span>식사</span>
                  <span>100,000원</span>
                </li>
                <li className="flex justify-between">
                  <span>쇼핑</span>
                  <span>100,000원</span>
                </li>
                <li className="flex justify-between">
                  <span>교통</span>
                  <span>100,000원</span>
                </li>
                <li className="flex justify-between">
                  <span>문화</span>
                  <span>100,000원</span>
                </li>
                <li className="flex justify-between">
                  <span>기타</span>
                  <span>100,000원</span>
                </li>
              </ul>
            </div>
          </div>
        </section>
      </div>

      {/* 예산 설정 모달 */}
      <BudgetSetting
        isBudgetSetting={isBudgetSetting}
        onOpenChange={() => setIsBudgetSetting(false)}
      />
    </>
  );
}

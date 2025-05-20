import { useEffect, useState } from "react";
import { Button } from "~/common/components/ui/button";
import { GoalSetting } from "../components/GoalSetting";

export default function GoalsPage() {
  const [goalType, setGoalType] = useState<"short" | "long" | null>(null);
  const [shortGoalAmount, setShortGoalAmount] = useState(0);
  const [longGoalAmount, setLongGoalAmount] = useState(0);

  useEffect(() => {
    const shortGoalAmount = localStorage.getItem("shortGoalAmount");
    const longGoalAmount = localStorage.getItem("longGoalAmount");

    if (shortGoalAmount) {
      setShortGoalAmount(Number(shortGoalAmount));
    }
    if (longGoalAmount) {
      setLongGoalAmount(Number(longGoalAmount));
    }
  }, []);

  return (
    <>
      <div className="flex flex-col gap-4 bg-gray-500 p-4 rounded-lg">
        <div className="flex justify-between">
          {/* 그냥 목표 여러개 추가 가능하도록 해도 될듯 */}
          <div className="flex flex-row gap-2 items-center">
            <h2 className="text-lg font-semibold">이달의 목표 : </h2>
            <p className="text-lg font-semibold">
              {shortGoalAmount.toLocaleString()}원
            </p>
          </div>
          <Button variant="outline" onClick={() => setGoalType("short")}>
            목표 설정
          </Button>
        </div>
        <div className="flex justify-between">
          <div className="flex flex-row gap-2 items-center">
            <h2 className="text-lg font-semibold">장기 목표 : </h2>
            <p className="text-lg font-semibold">
              {longGoalAmount.toLocaleString()}원
            </p>
          </div>
          <Button variant="outline" onClick={() => setGoalType("long")}>
            목표 설정
          </Button>
        </div>
      </div>
      <GoalSetting
        goalType={goalType}
        onOpenChange={() => setGoalType(null)}
        setGoalType={setGoalType}
        shortGoalAmount={shortGoalAmount}
        setShortGoalAmount={setShortGoalAmount}
        longGoalAmount={longGoalAmount}
        setLongGoalAmount={setLongGoalAmount}
      />
    </>
  );
}

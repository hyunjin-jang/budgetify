import { useState } from "react";
import { Button } from "~/common/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "~/common/components/ui/dialog";
import { Input } from "~/common/components/ui/input";

export function BudgetSetting({
  isBudgetSetting,
  onOpenChange,
}: {
  isBudgetSetting: boolean;
  onOpenChange: () => void;
}) {
  const [selectedBudget, setSelectedBudget] = useState<
    "beginner" | "intermediate" | "advanced" | "income"
  >("beginner");
  const [income, setIncome] = useState<Record<string, string>[]>([
    { name: "수입_1", value: "", source: "" },
  ]);

  const handleSave = () => {
    console.log(income);
  };

  return (
    <Dialog open={isBudgetSetting} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>예산 설정</DialogTitle>
        </DialogHeader>

        {selectedBudget === "income" ? (
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-4">
              {income.map((income, index) => {
                return (
                  <div className="flex flex-row gap-2 w-full items-center">
                    <div className="flex flex-col gap-2 w-full ">
                      <p className="w-32">{income.name}</p>
                      <Input
                        type="text"
                        key={index}
                        placeholder="수입"
                        // value={income.value}
                        // onChange={(e) => {
                        //   setIncome(
                        //     income.map((income, index) => {
                        //       return { ...income, value: e.target.value };
                        //     })
                        //   );
                        // }}
                      />
                    </div>
                    <div className="flex flex-col gap-2 w-full ">
                      <p className="w-32">출처</p>
                      <Input
                        type="text"
                        key={index}
                        placeholder="출처"
                        // value={income.source}
                        // onChange={(e) => {
                        //   setIncome(
                        //     income.map((income, index) => {
                        //       return { ...income, value: e.target.value };
                        //     })
                        //   );
                        // }}
                      />
                    </div>
                  </div>
                );
              })}
              <Button
                variant="outline"
                onClick={() =>
                  setIncome([
                    ...income,
                    { name: `수입_${income.length + 1}`, value: "" },
                  ])
                }
              >
                추가
              </Button>
            </div>
            <div className="flex flex-row gap-4 justify-center">
              <Button
                variant="outline"
                onClick={() => setSelectedBudget("beginner")}
              >
                취소
              </Button>
              <Button variant="default" onClick={handleSave}>
                설정
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            <Button
              variant="outline"
              onClick={() => setSelectedBudget("beginner")}
            >
              초심자
            </Button>
            <Button
              variant="outline"
              onClick={() => setSelectedBudget("intermediate")}
            >
              중급자
            </Button>
            <Button
              variant="outline"
              onClick={() => setSelectedBudget("advanced")}
            >
              고급자
            </Button>
            <Button
              variant="outline"
              onClick={() => setSelectedBudget("income")}
            >
              수입에 맞춰서 설정
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

import { useState } from "react";
import { Stepper } from "~/common/components/stepper";
import { Button } from "~/common/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "~/common/components/ui/dialog";
import { Input } from "~/common/components/ui/input";
import { StepIndicator } from "./StepIndicator";

type Step = "init" | "income" | "amount" | "level" | "confirm";

type Props = {
  isBudgetSetting: boolean;
  onOpenChange: () => void;
};

export function BudgetSetting({ isBudgetSetting, onOpenChange }: Props) {
  const [activeStep, setActiveStep] = useState<Step>("init");
  const [income, setIncome] = useState<Record<string, string>[]>([
    { name: "수입1", value: "", source: "" },
  ]);
  const [fixedCost, setFixedCost] = useState<Record<string, string>[]>([
    { name: "고정비용1", value: "", source: "" },
  ]);

  return (
    <Dialog open={isBudgetSetting} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[80vh] pr-3">
        <DialogHeader className="text-center">
          <DialogTitle className="text-2xl font-bold">예산 설정</DialogTitle>
        </DialogHeader>

        <div className="overflow-y-auto scrollbar-thin max-h-[60vh] pr-2">
          <Stepper
            className="pt-6"
            activeStep={activeStep}
            contents={{
              init: (
                <div className="flex flex-col gap-4">
                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full"
                    onClick={() => setActiveStep("amount")}
                  >
                    💰 금액 설정
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full"
                    onClick={() => setActiveStep("income")}
                  >
                    📈 수입 기반 설정
                  </Button>
                </div>
              ),

              amount: (
                <div className="flex flex-col gap-6">
                  <div className="flex flex-col gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        예산
                      </label>
                      <Input type="number" placeholder="예산 금액 입력" />
                    </div>

                    {fixedCost.map((fc, i) => (
                      <div
                        key={i}
                        className="flex flex-col md:flex-row gap-2 items-center"
                      >
                        <div className="w-full">
                          <label className="block text-sm font-medium mb-1">
                            {fc.name}
                          </label>
                          <Input placeholder="금액" type="number" />
                        </div>
                        <div className="w-full">
                          <label className="block text-sm font-medium mb-1">
                            사용처
                          </label>
                          <Input placeholder="지출 항목" type="text" />
                        </div>
                      </div>
                    ))}

                    <Button
                      variant="ghost"
                      className="self-start text-sm text-primary"
                      onClick={() =>
                        setFixedCost([
                          ...fixedCost,
                          {
                            name: `고정비용${fixedCost.length + 1}`,
                            value: "",
                            source: "",
                          },
                        ])
                      }
                    >
                      + 고정비용 추가
                    </Button>
                  </div>

                  <div className="flex flex-col gap-2">
                    <Button onClick={() => setActiveStep("level")}>다음</Button>
                    <Button
                      variant="ghost"
                      onClick={() => setActiveStep("init")}
                    >
                      뒤로
                    </Button>
                  </div>
                </div>
              ),

              income: (
                <div className="flex flex-col gap-6">
                  <div className="flex flex-col gap-4">
                    {income.map((inc, i) => (
                      <div
                        key={i}
                        className="flex flex-col md:flex-row gap-2 items-center"
                      >
                        <div className="w-full">
                          <label className="block text-sm font-medium mb-1">
                            {inc.name}
                          </label>
                          <Input type="number" placeholder="수입 금액" />
                        </div>
                        <div className="w-full">
                          <label className="block text-sm font-medium mb-1">
                            출처
                          </label>
                          <Input type="text" placeholder="예: 급여, 투자 등" />
                        </div>
                      </div>
                    ))}

                    <Button
                      variant="ghost"
                      className="self-start text-sm text-primary"
                      onClick={() =>
                        setIncome([
                          ...income,
                          {
                            name: `수입${income.length + 1}`,
                            value: "",
                            source: "",
                          },
                        ])
                      }
                    >
                      + 수입 항목 추가
                    </Button>

                    <hr className="my-4" />

                    <p className="text-sm font-semibold">💡 고정비용</p>
                    {fixedCost.map((fc, i) => (
                      <div
                        key={`income-fc-${i}`}
                        className="flex flex-col md:flex-row gap-2 items-center"
                      >
                        <div className="w-full">
                          <label className="block text-sm font-medium mb-1">
                            {fc.name}
                          </label>
                          <Input placeholder="금액" type="number" />
                        </div>
                        <div className="w-full">
                          <label className="block text-sm font-medium mb-1">
                            사용처
                          </label>
                          <Input placeholder="지출 항목" type="text" />
                        </div>
                      </div>
                    ))}

                    <Button
                      variant="ghost"
                      className="self-start text-sm text-primary"
                      onClick={() =>
                        setFixedCost([
                          ...fixedCost,
                          {
                            name: `고정비용${fixedCost.length + 1}`,
                            value: "",
                            source: "",
                          },
                        ])
                      }
                    >
                      + 고정비용 추가
                    </Button>
                  </div>

                  <div className="flex flex-col gap-2">
                    <Button onClick={() => setActiveStep("level")}>다음</Button>
                    <Button
                      variant="ghost"
                      onClick={() => setActiveStep("init")}
                    >
                      뒤로
                    </Button>
                  </div>
                </div>
              ),

              level: (
                <div className="flex flex-col gap-4">
                  <Button
                    variant="outline"
                    onClick={() => setActiveStep("confirm")}
                  >
                    🟢 초심자
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setActiveStep("confirm")}
                  >
                    🟡 중급자
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setActiveStep("confirm")}
                  >
                    🔴 고급자
                  </Button>
                </div>
              ),

              confirm: (
                <div className="flex flex-col items-center justify-center gap-6">
                  <p className="text-lg font-semibold text-center">
                    🎉 예산 설정이 완료되었습니다!
                  </p>
                  <Button onClick={() => setActiveStep("init")}>완료</Button>
                </div>
              ),
            }}
          />
        </div>

        <StepIndicator step={activeStep} />
      </DialogContent>
    </Dialog>
  );
}

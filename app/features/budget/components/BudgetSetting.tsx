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
import { Form } from "react-router";
import z from "zod";

type Step = "init" | "income" | "amount" | "level" | "confirm";

type Props = {
  isBudgetSetting: boolean;
  closeModal: () => void;
};

export const formSchema = z.object({
  settingMethod: z.enum(["amount", "income_based"]),
  totalAmount: z.number().min(10000, "예산은 10,000원 이상이어야 합니다."),
  // level: z.enum(["basic", "intermediate", "advanced"]),
  fixedCost: z
    .array(
      z.object({
        amount: z.number(),
        source: z.string(),
      })
    )
    .optional(),
  income: z
    .array(
      z.object({
        amount: z.number(),
        source: z.string(),
      })
    )
    .optional(),
});

export function BudgetSetting({ isBudgetSetting, closeModal }: Props) {
  const [activeStep, setActiveStep] = useState<Step>("init");
  const [selectedLevel, setSelectedLevel] = useState<string>("");
  const [settingMethod, setSettingMethod] = useState<string>("amount");
  const [totalAmount, setTotalAmount] = useState<string>("");
  const [fixedCostValues, setFixedCostValues] = useState<
    Array<{ amount: string; source: string }>
  >([{ amount: "", source: "" }]);
  const [incomeValues, setIncomeValues] = useState<
    Array<{ amount: string; source: string }>
  >([{ amount: "", source: "" }]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;

    // fixedCost와 income 데이터를 배열 형태로 변환
    const fixedCostData = fixedCostValues
      .filter((fc) => fc.amount && fc.source)
      .map((fc) => ({
        amount: Number(fc.amount),
        source: fc.source,
      }));

    const incomeData = incomeValues
      .filter((inc) => inc.amount && inc.source)
      .map((inc) => ({
        amount: Number(inc.amount),
        source: inc.source,
      }));

    // 수입 기반 설정일 경우 totalAmount를 수입의 합계로 설정
    const finalTotalAmount =
      settingMethod === "income_based"
        ? incomeData.reduce((sum, inc) => sum + inc.amount, 0)
        : Number(totalAmount);

    // hidden input에 데이터 추가
    const totalAmountInput = document.createElement("input");
    totalAmountInput.type = "hidden";
    totalAmountInput.name = "totalAmount";
    totalAmountInput.value = finalTotalAmount.toString();
    form.appendChild(totalAmountInput);

    const fixedCostInput = document.createElement("input");
    fixedCostInput.type = "hidden";
    fixedCostInput.name = "fixedCost";
    fixedCostInput.value = JSON.stringify(fixedCostData);
    form.appendChild(fixedCostInput);

    const incomeInput = document.createElement("input");
    incomeInput.type = "hidden";
    incomeInput.name = "income";
    incomeInput.value = JSON.stringify(incomeData);
    form.appendChild(incomeInput);

    console.log("Form data before submit:", {
      settingMethod,
      totalAmount: finalTotalAmount,
      fixedCost: fixedCostData,
      income: incomeData,
    });

    form.submit();
  };

  return (
    <Dialog
      open={isBudgetSetting}
      onOpenChange={() => {
        setActiveStep("init");
        setSelectedLevel("");
        setSettingMethod("amount");
        setTotalAmount("");
        setFixedCostValues([{ amount: "", source: "" }]);
        setIncomeValues([{ amount: "", source: "" }]);
        closeModal();
      }}
    >
      <DialogContent className="max-w-md max-h-[80vh] pr-3">
        <DialogHeader className="text-center">
          <DialogTitle className="text-2xl font-bold">예산 설정</DialogTitle>
        </DialogHeader>

        <div className="overflow-y-auto scrollbar-thin max-h-[60vh] pr-2">
          <Form method="post" onSubmit={handleSubmit}>
            <input type="hidden" name="action" value="create" />
            <input type="hidden" name="settingMethod" value={settingMethod} />
            <input type="hidden" name="level" value={selectedLevel} />

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
                      type="button"
                      onClick={() => {
                        setSettingMethod("amount");
                        setActiveStep("amount");
                      }}
                    >
                      💰 금액 설정
                    </Button>
                    <Button
                      variant="outline"
                      size="lg"
                      className="w-full"
                      type="button"
                      onClick={() => {
                        setSettingMethod("income_based");
                        setActiveStep("income");
                      }}
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
                        <Input
                          type="number"
                          placeholder="예산 금액 입력"
                          value={totalAmount}
                          onChange={(e) => setTotalAmount(e.target.value)}
                        />
                      </div>

                      {fixedCostValues.map((fc, i) => (
                        <div
                          key={i}
                          className="flex flex-col md:flex-row gap-2 items-center"
                        >
                          <div className="w-full">
                            <label className="block text-sm font-medium mb-1">
                              고정비용{i + 1}
                            </label>
                            <Input
                              placeholder="금액"
                              type="number"
                              value={fc.amount}
                              onChange={(e) => {
                                const newValues = [...fixedCostValues];
                                newValues[i] = {
                                  ...newValues[i],
                                  amount: e.target.value,
                                };
                                setFixedCostValues(newValues);
                              }}
                            />
                          </div>
                          <div className="w-full">
                            <label className="block text-sm font-medium mb-1">
                              사용처
                            </label>
                            <Input
                              placeholder="지출 항목"
                              type="text"
                              value={fc.source}
                              onChange={(e) => {
                                const newValues = [...fixedCostValues];
                                newValues[i] = {
                                  ...newValues[i],
                                  source: e.target.value,
                                };
                                setFixedCostValues(newValues);
                              }}
                            />
                          </div>
                        </div>
                      ))}

                      <Button
                        variant="ghost"
                        className="self-start text-sm text-primary"
                        onClick={() =>
                          setFixedCostValues([
                            ...fixedCostValues,
                            { amount: "", source: "" },
                          ])
                        }
                        type="button"
                      >
                        + 고정비용 추가
                      </Button>
                    </div>

                    <div className="flex flex-col gap-2">
                      <Button onClick={() => setActiveStep("confirm")}>
                        다음
                      </Button>
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
                      {incomeValues.map((inc, i) => (
                        <div
                          key={i}
                          className="flex flex-col md:flex-row gap-2 items-center"
                        >
                          <div className="w-full">
                            <label className="block text-sm font-medium mb-1">
                              수입{i + 1}
                            </label>
                            <Input
                              type="number"
                              placeholder="수입 금액"
                              value={inc.amount}
                              onChange={(e) => {
                                const newValues = [...incomeValues];
                                newValues[i] = {
                                  ...newValues[i],
                                  amount: e.target.value,
                                };
                                setIncomeValues(newValues);
                              }}
                            />
                          </div>
                          <div className="w-full">
                            <label className="block text-sm font-medium mb-1">
                              출처
                            </label>
                            <Input
                              type="text"
                              placeholder="예: 급여, 투자 등"
                              value={inc.source}
                              onChange={(e) => {
                                const newValues = [...incomeValues];
                                newValues[i] = {
                                  ...newValues[i],
                                  source: e.target.value,
                                };
                                setIncomeValues(newValues);
                              }}
                            />
                          </div>
                        </div>
                      ))}

                      <Button
                        variant="ghost"
                        className="self-start text-sm text-primary"
                        onClick={() =>
                          setIncomeValues([
                            ...incomeValues,
                            { amount: "", source: "" },
                          ])
                        }
                        type="button"
                      >
                        + 수입 항목 추가
                      </Button>

                      <hr className="my-4" />

                      <p className="text-sm font-semibold">💡 고정비용</p>
                      {fixedCostValues.map((fc, i) => (
                        <div
                          key={`income-fc-${i}`}
                          className="flex flex-col md:flex-row gap-2 items-center"
                        >
                          <div className="w-full">
                            <label className="block text-sm font-medium mb-1">
                              고정비용{i + 1}
                            </label>
                            <Input
                              placeholder="금액"
                              type="number"
                              value={fc.amount}
                              onChange={(e) => {
                                const newValues = [...fixedCostValues];
                                newValues[i] = {
                                  ...newValues[i],
                                  amount: e.target.value,
                                };
                                setFixedCostValues(newValues);
                              }}
                            />
                          </div>
                          <div className="w-full">
                            <label className="block text-sm font-medium mb-1">
                              사용처
                            </label>
                            <Input
                              placeholder="지출 항목"
                              type="text"
                              value={fc.source}
                              onChange={(e) => {
                                const newValues = [...fixedCostValues];
                                newValues[i] = {
                                  ...newValues[i],
                                  source: e.target.value,
                                };
                                setFixedCostValues(newValues);
                              }}
                            />
                          </div>
                        </div>
                      ))}

                      <Button
                        variant="ghost"
                        className="self-start text-sm text-primary"
                        onClick={() =>
                          setFixedCostValues([
                            ...fixedCostValues,
                            { amount: "", source: "" },
                          ])
                        }
                        type="button"
                      >
                        + 고정비용 추가
                      </Button>
                    </div>

                    <div className="flex flex-col gap-2">
                      <Button onClick={() => setActiveStep("confirm")}>
                        다음
                      </Button>
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
                      type="button"
                      onClick={() => {
                        setSelectedLevel("basic");
                        setActiveStep("confirm");
                      }}
                    >
                      🟢 초심자
                    </Button>
                    <Button
                      variant="outline"
                      type="button"
                      onClick={() => {
                        setSelectedLevel("intermediate");
                        setActiveStep("confirm");
                      }}
                    >
                      🟡 중급자
                    </Button>
                    <Button
                      variant="outline"
                      type="button"
                      onClick={() => {
                        setSelectedLevel("advanced");
                        setActiveStep("confirm");
                      }}
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
                    <p className="text-sm text-center">
                      ※완료 버튼을 클릭하지 않으면 예산 설정이 저장되지
                      않습니다.
                    </p>
                    <Button type="submit">완료</Button>
                  </div>
                ),
              }}
            />
          </Form>
        </div>

        <StepIndicator step={activeStep} />
      </DialogContent>
    </Dialog>
  );
}

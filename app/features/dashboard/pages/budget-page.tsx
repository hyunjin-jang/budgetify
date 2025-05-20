import { Button } from "~/common/components/ui/button";
import { BudgetSetting } from "../components/BudgetSetting";
import { useState } from "react";

export default function BudgetPage() {
  const [isBudgetSetting, setIsBudgetSetting] = useState<boolean>(false);

  return (
    <>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-4">
          <Button variant="default" onClick={() => setIsBudgetSetting(true)}>
            예산 설정
          </Button>
        </div>
      </div>

      <BudgetSetting
        isBudgetSetting={isBudgetSetting}
        onOpenChange={() => setIsBudgetSetting(false)}
      />
    </>
  );
}

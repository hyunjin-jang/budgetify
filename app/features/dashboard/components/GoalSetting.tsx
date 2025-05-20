import { Button } from "~/common/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "~/common/components/ui/dialog";
import { Input } from "~/common/components/ui/input";

export function GoalSetting({
  onOpenChange,
  goalType,
  setGoalType,
  shortGoalAmount,
  setShortGoalAmount,
  longGoalAmount,
  setLongGoalAmount,
}: {
  onOpenChange: (open: boolean) => void;
  goalType: "short" | "long" | null;
  setGoalType: (type: "short" | "long" | null) => void;
  shortGoalAmount: number;
  setShortGoalAmount: (amount: number) => void;
  longGoalAmount: number;
  setLongGoalAmount: (amount: number) => void;
}) {
  const handleSave = () => {
    if (goalType === "short") {
      localStorage.setItem("shortGoalAmount", shortGoalAmount.toString());
    } else if (goalType === "long") {
      localStorage.setItem("longGoalAmount", longGoalAmount.toString());
    }
    onOpenChange(false);
  };

  return (
    <Dialog open={goalType !== null} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>목표금액을 설정해주세요</DialogTitle>
          <DialogDescription>
            이 금액은 월급 날 정말 힘들어요. 돈 관리 한번 해봅시다!
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          <Input
            type="text"
            placeholder="목표금액"
            value={goalType === "short" ? shortGoalAmount : longGoalAmount}
            onChange={(e) => {
              if (goalType === "short") {
                setShortGoalAmount(Number(e.target.value));
              } else if (goalType === "long") {
                setLongGoalAmount(Number(e.target.value));
              }
            }}
          />
          <Button onClick={handleSave}>저장</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

const visualSteps = ["init", "income_or_amount", "level", "confirm"] as const;

type Step = "init" | "income" | "amount" | "level" | "confirm";

type VisualStep = (typeof visualSteps)[number];

export function StepIndicator({ step }: { step: Step }) {
  const getVisualStepIndex = (s: Step): number => {
    if (s === "income" || s === "amount") return 1;
    return visualSteps.indexOf(s as VisualStep);
  };

  const currentIndex = getVisualStepIndex(step);
  const progressPercent = ((currentIndex + 1) / visualSteps.length) * 100;

  return (
    <div className="w-full mt-6">
      <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
        <div
          className="h-full bg-primary transition-all duration-300"
          style={{ width: `${progressPercent}%` }}
        />
      </div>
    </div>
  );
}

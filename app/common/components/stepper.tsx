import { cn } from "~/lib/utils";

type Props = {
  activeStep: string;
  contents: Record<string, React.ReactNode>;
  className?: string;
};

export function Stepper({ activeStep, contents, className }: Props) {
  if (!Object.keys(contents).includes(activeStep)) {
    throw new Error("Invalid activeStep");
  }

  return (
    <div className={cn(className)}>
      {Object.entries(contents).map(([key, value]) => (
        <div key={key}>{key === activeStep ? value : null}</div>
      ))}
    </div>
  );
}

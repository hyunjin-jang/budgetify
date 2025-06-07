import { cn } from "~/lib/utils";
import { Button } from "./ui/button";

export default function IconButton({
  children,
  type,
  className,
}: {
  children: React.ReactNode;
  type: "submit" | "button";
  className?: string;
}) {
  return (
    <Button
      className={cn("cursor-pointer", className)}
      variant="ghost"
      size="icon"
      type={type}
    >
      {children}
    </Button>
  );
}

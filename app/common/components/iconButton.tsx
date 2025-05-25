import { cn } from "~/lib/utils";
import { Button } from "./ui/button";

export default function IconButton({
  children,
  onClick,
  className,
}: {
  children: React.ReactNode;
  onClick: () => void;
  className?: string;
}) {
  return (
    <Button
      className={cn("cursor-pointer", className)}
      variant="ghost"
      size="icon"
      onClick={onClick}
    >
      {children}
    </Button>
  );
}

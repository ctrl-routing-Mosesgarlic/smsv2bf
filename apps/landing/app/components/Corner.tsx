import { cn } from "../lib/utils";

type CornerProps = {
  position: "tl" | "tr" | "br" | "bl";
  size?: number;
};

export default function Corner({ position, size = 12 }: CornerProps) {
  return (
    <div
      className={cn(
        "absolute pointer-events-none",
        "border-foreground ",
        {
          "top-0 left-0 border-t-2 border-l-2": position === "tl",
          "top-0 right-0 border-t-2 border-r-2": position === "tr",
          "bottom-0 right-0 border-b-2 border-r-2": position === "br",
          "bottom-0 left-0 border-b-2 border-l-2": position === "bl",
        },
      )}
      style={{ width: size, height: size }}
    />
  );
}

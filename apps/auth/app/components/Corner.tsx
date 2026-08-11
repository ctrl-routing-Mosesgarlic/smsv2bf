import { cn } from "@/lib/utils";

type CornerProps = {
  corners?: "all" | "t" | "b" | "tl" | "tr" | "bl" | "br";
  size?: number;
};

const positions: Record<string, string> = {
  tl: "top-0 left-0 border-t-2 border-l-2",
  tr: "top-0 right-0 border-t-2 border-r-2",
  bl: "bottom-0 left-0 border-b-2 border-l-2",
  br: "bottom-0 right-0 border-b-2 border-r-2",
};

const cornerSets: Record<NonNullable<CornerProps["corners"]>, string[]> = {
  all: ["tl", "tr", "bl", "br"],
  t: ["tl", "tr"],
  b: ["bl", "br"],
  tl: ["tl"],
  tr: ["tr"],
  bl: ["bl"],
  br: ["br"],
};

export default function Corner({ corners = "all", size = 12 }: CornerProps) {
  return cornerSets[corners].map((pos) => (
    <div
      key={pos}
      className={cn("absolute pointer-events-none border-foreground", positions[pos])}
      style={{ width: size, height: size }}
    />
  ));
}

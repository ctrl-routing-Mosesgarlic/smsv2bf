import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import Corner from "./Corner";

type SectionWrapperProps = {
  children: ReactNode;
  className?: string;
};

export default function SectionWrapper({ children, className }: SectionWrapperProps) {
  return (
    <div className="w-full px-12">
      <div className="mx-auto max-w-[72rem] border-l border-r border-border py-4">
        <div className={cn("relative overflow-hidden border border-border py-44 px-24", className)}>
          <Corner corners="all" />
          {children}
        </div>
      </div>
    </div>
  );
}

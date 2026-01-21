import type { FC } from "react";

import { cn } from "@/lib/utils";

export const Logo: FC<{ withText?: boolean; className?: string }> = ({
  withText = true,
  className,
}) => {
  return (
    <div className={cn("flex gap-1 items-center", className)}>
      <img src="/icon.png" className="size-7" />
      {withText && (
        <span className="font-semibold text-2xl text-primary tracking-wide">
          Marz
        </span>
      )}
    </div>
  );
};

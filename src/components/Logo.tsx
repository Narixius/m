import type { FC } from "react";

import { cn } from "@/lib/utils";

export const Logo: FC<{ withText?: boolean; className?: string }> = ({
  withText = true,
  className,
}) => {
  return (
    <div className={cn("flex gap-2 items-center", className)}>
      <img src="icon.png" className="size-7" />
      {withText && (
        <span className="font-semibold text-xl text-primary">Marz</span>
      )}
    </div>
  );
};

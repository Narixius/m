import type { FC } from "react";

import { useTimer } from "@/hooks/useTimer";

export const Timer: FC<{ endTime: Date }> = ({ endTime }) => {
  const { current } = useTimer({
    endDate: endTime,
  });

  return `${current}`;
};

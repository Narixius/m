import type { FC } from "react";

import { useTimer } from "@/hooks/useTimer";

export const Timer: FC<{ endTime: Date }> = ({ endTime }) => {
  const { current } = useTimer({
    endDate: endTime,
    onEnd: () =>
      setTimeout(() => {
        // wait for 5 seconds to make sure the expiration webhook has been received
        window.location.reload();
      }, 5_000),
  });

  return `${current}`;
};

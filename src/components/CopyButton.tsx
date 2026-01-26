import { CopyIcon } from "lucide-react";
import { type FC } from "react";
import useClipboard from "react-use-clipboard";

import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export const CopyButton: FC<{ text: string | number }> = ({ text }) => {
  const [isCopied, setCopied] = useClipboard(String(text), {
    successDuration: 1_500,
  });
  return (
    <TooltipProvider delayDuration={0}>
      <Tooltip>
        <TooltipTrigger
          asChild
          onClick={(e) => {
            e.preventDefault();
            setCopied();
          }}
          onPointerDown={(event) => event.preventDefault()}
        >
          <Button variant="outline" size="icon-sm" className="size-6!">
            <CopyIcon className="size-3.5!" />
          </Button>
        </TooltipTrigger>
        <TooltipContent
          onPointerDownOutside={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
        >
          {isCopied ? "Copied" : "Copy"}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

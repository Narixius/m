import { ArrowUpRight, ChevronRightIcon } from "lucide-react";
import { Suspense, use } from "react";

import { Button } from "@/components/ui/button";
import { CardStack } from "@/components/ui/card-stack";
import { useStopwatch } from "@/hooks/useStopwatch";

const CARDS = [
  {
    id: 0,
    content: (
      <div className="flex w-full text-xs items-center justify-between bg-red-100 border border-red-300 p-2 text-red-950">
        You are running out of data quota
        <button
          tabIndex={-1}
          className="bg-white border border-red-300 flex gap-2 text-red-950 items-center px-2 py-1 "
        >
          Extend <ArrowUpRight size="16" />
        </button>
      </div>
    ),
  },
  {
    id: 1,
    content: (
      <div className="flex w-full text-xs items-center justify-between bg-red-100 border border-red-300 p-2 text-red-950">
        Your subscription ends in 8 days
        <button
          tabIndex={-1}
          className="bg-white border border-red-300 flex gap-2 text-red-950 items-center px-2 py-1 "
        >
          Extend <ArrowUpRight size="16" />
        </button>
      </div>
    ),
  },
  {
    id: 2,
    content: (
      <div className="flex w-full text-xs items-center justify-between bg-red-100 border border-red-300 p-2 text-red-950">
        Selected location has no active subscription
        <button
          tabIndex={-1}
          className="bg-white border border-red-300 flex gap-2 text-red-950 items-center px-2 py-1 "
        >
          Extend <ArrowUpRight size="16" />
        </button>
      </div>
    ),
  },
];

export const StackedAlerts = () => {
  return (
    <div className="absolute top-0 size-full flex flex-col items-center justify-center select-none">
      <CardStack items={CARDS} />
      <div className="w-96 md:w-96 border mt-13 bg-white z-10">
        <div className="w-full flex items-center justify-between p-3 h-16">
          <div className="flex flex-col gap-0">
            <span className="text-green-600 font-medium">Connected</span>
            <Timer />
          </div>
          <Button tabIndex={-1} variant="destructive" className="rounded-none">
            Disconnect
          </Button>
        </div>
        <div className="w-full flex items-center justify-between p-3 border-t h-16">
          <div className="flex flex-col gap-0">
            <span className="font-medium">🇩🇪 Germany</span>
            <span className="text-muted-foreground/70 text-xs">
              <Suspense fallback="Fetching ip...">
                <Ip />
              </Suspense>
            </span>
          </div>
          <ChevronRightIcon className="text-muted-foreground/70" />
        </div>
        <div className="w-full flex items-center justify-between border-t h-16">
          <div className="flex-1/2 flex flex-col border-r gap-0.5 p-3">
            <span className="text-xs font-medium">Upload</span>
            <span className="font-medium">2.8 GB</span>
          </div>
          <div className="flex-1/2 flex flex-col gap-0.5 p-3">
            <span className="text-xs font-medium">Upload</span>
            <span className="font-medium">12.4 GB</span>
          </div>
        </div>
        <div className="w-full flex items-start justify-between border-t h-16">
          <div className="flex justify-between border-r gap-0.5 p-3 font-medium w-full">
            <span className="text-xs">Usage Info</span>
            <span className="text-xs flex gap-1 items-center">
              Extend <ArrowUpRight size="12" />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

let _promise: null | Promise<string> = null;
const createIpPromise = () => {
  if (!_promise) {
    _promise = fetch("https://api.5ip.ir")
      .then((r) => r.json())
      .then((r) => r.ip);
  }
  return _promise;
};

const Ip = () => {
  const ip = use(
    typeof window === "undefined"
      ? Promise.resolve("Fetching ip...")
      : createIpPromise()
  );
  return ip;
};

const Timer = () => {
  const { current } = useStopwatch();
  return <span className="text-muted-foreground/70 text-xs">{current}</span>;
};

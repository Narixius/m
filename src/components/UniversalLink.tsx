import { LinkIcon } from "lucide-react";
import { useRef } from "react";

import { Logo } from "@/components/Logo";
import { AnimatedList } from "@/components/ui/animated-list";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const UniversalLink = () => {
  const iconRef = useRef<SVGSVGElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const container = useRef<HTMLDivElement>(null);
  return (
    <div
      ref={container}
      className="transition-all absolute size-full p-6 top-0 flex items-start flex-col gap-8"
    >
      <Button variant="outline" className="z-10" tabIndex={-1}>
        <LinkIcon ref={iconRef} />
        Import Universal Link
      </Button>
      <div className="flex justify-center gap-3 relative grow max-h-[calc(100%-100px)] min-h-[calc(100%-100px)]">
        <div className="-top-10 left-3 w-0.5 h-10 bg-border absolute" />
        <div className="top-3 left-3 h-0.5 w-10 bg-border absolute" />
        <div ref={logoRef} className="bg-background z-10 w-fit h-fit">
          <Logo withText={false} />
        </div>
        <div
          ref={listRef}
          className="flex flex-col gap-4 p-4 border grow h-full min-h-full max-h-full overflow-hidden bg-background z-10 "
        >
          <AnimatedList>
            {configs.map((item, idx) => (
              <ConfigItem {...item} key={idx} />
            ))}
          </AnimatedList>
        </div>
      </div>
    </div>
  );
};

let configs = [
  {
    icon: "🇩🇪",
    name: "Germany",
    description: "6 Servers",
  },
  {
    icon: "🇺🇸",
    name: "United States",
    description: "10 Servers",
  },
  {
    icon: "🇸🇬",
    name: "Singapore",
    description: "8 Servers",
  },
  {
    icon: "🇧🇷",
    name: "Brazil",
    description: "7 Servers",
  },
  {
    icon: "🇫🇷",
    name: "France",
    description: "5 Servers",
  },
  {
    icon: "🇯🇵",
    name: "Japan",
    description: "9 Servers",
  },
  {
    icon: "🇨🇦",
    name: "Canada",
    description: "4 Servers",
  },
  {
    icon: "🇦🇺",
    name: "Australia",
    description: "6 Servers",
  },
  {
    icon: "🇳🇱",
    name: "Netherlands",
    description: "5 Servers",
  },
  {
    icon: "🇬🇧",
    name: "United Kingdom",
    description: "8 Servers",
  },
];

configs = Array.from({ length: 10 }, () => configs).flat();

interface Item {
  name: string;
  description: string;
  icon: string;
}
const ConfigItem = ({ name, description, icon }: Item) => {
  return (
    <figure
      className={cn(
        "relative mx-auto min-h-fit w-full cursor-pointer overflow-hidden p-4",
        // animation styles
        "transition-all duration-200 ease-in-out hover:scale-[103%]",
        // light styles
        "bg-white [box-shadow:0_0_0_1px_rgba(0,0,0,.03),0_2px_4px_rgba(0,0,0,.05),0_12px_24px_rgba(0,0,0,.05)]",
        // dark styles
        "transform-gpu dark:bg-transparent dark:[box-shadow:0_-20px_80px_-20px_#ffffff1f_inset] dark:backdrop-blur-md dark:[border:1px_solid_rgba(255,255,255,.1)]"
      )}
    >
      <div className="flex flex-row items-center gap-3">
        <div className="flex flex-col overflow-hidden">
          <div className="flex flex-row items-center text-balance justify-between font-medium text-lg whitespace-pre dark:text-white gap-2 min-w-[calc(100vw-170px)] sm:min-w-[470px] md:min-w-[600px] lg:min-w-[340px] xl:min-w-[270px] 2xl:min-w-[340px]">
            <div className="flex items-center gap-2">
              <span className="text-lg">{icon}</span>
              <span className="text-sm">{name}</span>
            </div>
            <p className="text-xs font-normal dark:text-white/60 text-muted-foreground">
              {description}
            </p>
          </div>
        </div>
      </div>
    </figure>
  );
};

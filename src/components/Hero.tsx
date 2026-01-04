import { AnimatedShinyText } from "@/components/ui/animated-shiny-text";
import { Button } from "@/components/ui/button";
import { LightRays } from "@/components/ui/light-rays";
import { SparklesText } from "@/components/ui/sparkles-text";
import { ChevronRight, PartyPopper } from "lucide-react";

export const Hero = () => {
  return (
    <div className="flex flex-col items-center justify-center mt-20 mb-8">
      <div className="mb-10">
        <a
          href="#"
          className="text-xs rounded-full border flex gap-2 items-center bg-white"
        >
          <AnimatedShinyText className="flex gap-2 h-7 px-3 items-center hover:gap-2.5 transition-all">
            <PartyPopper size="16" />
            Beta Available Now
            <ChevronRight size="16" className="-ml-1" />
          </AnimatedShinyText>
        </a>
      </div>
      <div className="max-w-4xl flex flex-col gap-8 items-center">
        <h2 className="text-5xl tracking-tighter text-balance text-center flex flex-wrap gap-3 justify-center">
          Your Infra Deserves a <SparklesText>Better Interface</SparklesText>
          Look Premium. Feel Premium.
        </h2>
        <p className="max-w-[800px] text-base md:text-lg text-center w-full text-muted-foreground font-normal text-balance leading-relaxed tracking-tight">
          Deliver a clean, reliable, user-friendly app your customers actually
          want to keep. UX-first, and built to increase retention without
          touching your infrastructure.
        </p>
      </div>
      <div className="flex gap-3 mt-8">
        <Button>Get Started</Button>
        <Button variant="outline">Download App</Button>
      </div>
    </div>
  );
};

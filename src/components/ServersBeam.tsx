import { useRef } from "react";

import { Logo } from "@/components/Logo";
import { AnimatedBeam } from "@/components/ui/animated-beam";

export const ServersBeam = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const server1Node = useRef<HTMLDivElement>(null);
  const server2Node = useRef<HTMLDivElement>(null);
  const server3Node = useRef<HTMLDivElement>(null);
  const server4Node = useRef<HTMLDivElement>(null);
  const server5Node = useRef<HTMLDivElement>(null);
  const marzNode = useRef<HTMLDivElement>(null);
  const serverOutputNode = useRef<HTMLDivElement>(null);
  return (
    <div
      className="w-full grow relative isolate flex gap-3 justify-between p-10 pb-0"
      ref={containerRef}
    >
      <div className="flex flex-col gap-3 justify-between h-full">
        <div className="flex gap-1 flex-col items-center">
          <div
            ref={server1Node}
            className="flex-col z-20 rounded-full aspect-square border border-neutral-300 bg-neutral-50 flex justify-center items-center w-fit p-2"
          >
            🇩🇪
          </div>
          <span className="text-xs font-medium font-mono">WS</span>
        </div>
        <div className="flex gap-1 flex-col items-center">
          <div
            ref={server2Node}
            className="flex-col z-20 rounded-full aspect-square border border-neutral-300 bg-neutral-50 flex justify-center items-center w-fit p-2"
          >
            🇩🇪
          </div>
          <span className="text-xs font-medium font-mono">WSS</span>
        </div>
        <div className="flex gap-1 flex-col items-center">
          <div
            ref={server3Node}
            className="flex-col z-20 rounded-full aspect-square border border-neutral-300 bg-neutral-50 flex justify-center items-center w-fit p-2"
          >
            🇩🇪
          </div>
          <span className="text-xs font-medium font-mono">REALITY</span>
        </div>
      </div>
      <div className="flex flex-col gap-3 justify-between h-full">
        <div className="flex gap-1 flex-col items-center">
          <div
            ref={server4Node}
            className="flex-col z-20 rounded-full aspect-square border border-neutral-300 bg-neutral-50 flex justify-center items-center w-fit p-2"
          >
            🇩🇪
          </div>
          <span className="text-xs font-medium font-mono">TCP</span>
        </div>
        <div className="flex gap-1 flex-col items-center">
          <div
            ref={server5Node}
            className="flex-col z-20 rounded-full aspect-square border border-neutral-300 bg-neutral-50 flex justify-center items-center w-fit p-2"
          >
            🇩🇪
          </div>
          <span className="text-xs font-medium font-mono">GRPC</span>
        </div>
      </div>
      <div className="flex flex-col gap-3 justify-center h-full">
        <div className="flex gap-1 flex-col items-center">
          <div
            ref={marzNode}
            className="z-20 rounded-full aspect-square border border-primary bg-neutral-50 flex justify-center items-center w-fit p-2"
          >
            <Logo withText={false} />
          </div>
          <span className="text-xs font-medium font-mono">Marz</span>
        </div>
      </div>
      <div className="flex flex-col gap-3 justify-center h-full">
        <div className="flex gap-1 flex-col items-center">
          <div
            ref={serverOutputNode}
            className="z-20 rounded-full aspect-square border border-neutral-300 bg-neutral-50 flex justify-center items-center w-fit p-2"
          >
            🇩🇪
          </div>
          <span className="text-xs font-medium font-mono opacity-0">WSS</span>
        </div>
      </div>
      <AnimatedBeam
        fromRef={server1Node}
        toRef={marzNode}
        containerRef={containerRef}
        curvature={-100}
      />
      <AnimatedBeam
        fromRef={server2Node}
        toRef={marzNode}
        containerRef={containerRef}
      />
      <AnimatedBeam
        fromRef={server3Node}
        toRef={marzNode}
        containerRef={containerRef}
        curvature={100}
      />
      <AnimatedBeam
        fromRef={server4Node}
        toRef={marzNode}
        containerRef={containerRef}
        curvature={-110}
      />
      <AnimatedBeam
        fromRef={server5Node}
        toRef={marzNode}
        containerRef={containerRef}
        curvature={110}
      />
      <AnimatedBeam
        fromRef={marzNode}
        toRef={serverOutputNode}
        containerRef={containerRef}
      />
    </div>
  );
};

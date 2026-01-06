import { PointerIcon } from "lucide-react";
import * as React from "react";
import { createMap } from "svg-dotted-map";

import { cn } from "@/lib/utils";

interface Marker {
  id?: string;
  lat: number;
  lng: number;
  size?: number;
}

export interface DottedMapProps extends React.SVGProps<SVGSVGElement> {
  width?: number;
  height?: number;
  mapSamples?: number;
  markers?: Marker[];
  dotColor?: string;
  markerColor?: string;
  dotRadius?: number;
  stagger?: boolean;
}

const { points, addMarkers } = createMap({
  width: 150,
  height: 75,
  mapSamples: 4500,
});

export function DottedMap({
  markers = [
    {
      id: "paris",
      lat: 48.8566,
      lng: 2.3522,
      size: 0.3, // Paris
    },
    // {
    //   id: 'berlin',
    //   lat: 52.52,
    //   lng: 13.405,
    //   size: 0.3, // Berlin
    // },
    {
      id: "los-angeles",
      lat: 34.0522,
      lng: -118.2437,
      size: 0.3, // Los Angeles
    },
    {
      id: "london",
      lat: 51.5074,
      lng: -0.1278,
      size: 0.3,
    }, // London
    // Poland
    // { lat: 52.2297, lng: 21.0122, size: 0.3 }, // Warsaw
    // { lat: 50.0647, lng: 19.945, size: 0.3 }, // Krakow
    { lat: 51.1079, lng: 17.0385, size: 0.3 }, // Wroclaw
    // Turkey
    {
      id: "istanbul",
      lat: 41.0082,
      lng: 28.9784,
      size: 0.3,
    }, // Istanbul
    // Iran
    { id: "tehran", lat: 35.6892, lng: 51.389, size: 0.3 }, // Tehran
    // Russia
    {
      id: "moscow",
      lat: 55.7558,
      lng: 37.6173,
      size: 0.3,
    }, // Moscow
    { lat: 59.9343, lng: 30.3351, size: 0.3 }, // Saint Petersburg
    // Africa
    { lat: -1.2921, lng: 36.8219, size: 0.3 }, // Nairobi
    { lat: -26.2041, lng: 28.0473, size: 0.3 }, // Johannesburg
    // South America
    {
      lat: -23.5505,
      lng: -46.6333,
      size: 0.3,
    }, // Sao Paulo
    { lat: 19.4326, lng: -99.1332, size: 0.3 }, // Mexico City
    // North Africa
    { lat: 30.0444, lng: 31.2357, size: 0.3 }, // Cairo
    // North West Africa
    {
      id: "tunis",
      lat: 36.8065,
      lng: 10.1815,
      size: 0.3,
    }, // Tunis
    // Asia
    { lat: 28.6139, lng: 77.209, size: 0.3 }, // New Delhi
    { lat: 1.3521, lng: 103.8198, size: 0.3 }, // Singapore
    // MENA
    { lat: 24.7136, lng: 46.6753, size: 0.3 }, // Riyadh
    { lat: 25.276987, lng: 55.296249, size: 0.3 }, // Dubai
    // Middle Russia
    { lat: 56.8389, lng: 60.6057, size: 0.3 }, // Yekaterin
    // iceland
    {
      id: "reykjavik",
      lat: 64.1466,
      lng: -21.9426,
      size: 0.3,
    }, // Reykjavik
    // senegal
    { lat: 14.6928, lng: -17.4467, size: 0.3 }, // Dakar
  ],
  markerColor = "#55428999",
  dotRadius = 0.2,
  stagger = true,
  className,
  style,
}: DottedMapProps) {
  const processedMarkers = addMarkers(markers);

  // Compute stagger helpers in a single, simple pass
  const { xStep, yToRowIndex } = React.useMemo(() => {
    const sorted = [...points].sort((a, b) => a.y - b.y || a.x - b.x);
    const rowMap = new Map<number, number>();
    let step = 0;
    let prevY = Number.NaN;
    let prevXInRow = Number.NaN;

    for (const p of sorted) {
      if (p.y !== prevY) {
        // new row
        prevY = p.y;
        prevXInRow = Number.NaN;
        if (!rowMap.has(p.y)) rowMap.set(p.y, rowMap.size);
      }
      if (!Number.isNaN(prevXInRow)) {
        const delta = p.x - prevXInRow;
        if (delta > 0) step = step === 0 ? delta : Math.min(step, delta);
      }
      prevXInRow = p.x;
    }

    return { xStep: step || 1, yToRowIndex: rowMap };
  }, [points]);

  const svgRef = React.useRef<SVGSVGElement>(null);
  const pointerRef = React.useRef<SVGForeignObjectElement>(null);

  React.useEffect(() => {
    const circleIds = [
      "paris",
      "london",
      "istanbul",
      "moscow",
      "tehran",
      "tunis",
      "reykjavik",
    ];
    let index = 0;

    const movePointer = () => {
      const currentId = circleIds[index];
      const circleElement = document.getElementById(currentId);
      const pointerIcon = pointerRef.current;

      if (circleElement && pointerIcon && svgRef.current) {
        const cx = circleElement.getAttribute("cx");
        const cy = circleElement.getAttribute("cy");

        if (cx && cy) {
          const x = Number.parseFloat(cx);
          const y = Number.parseFloat(cy);

          // Use transform for smoother GPU-accelerated animation
          requestAnimationFrame(() => {
            pointerIcon.style.transform = `translate(${x - 1}px, ${y + 1}px)`;
          });
        }
      }

      index = (index + 1) % circleIds.length;
    };

    // Initial position
    movePointer();

    const interval = setInterval(movePointer, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <svg
      ref={svgRef}
      viewBox={`0 0 ${150} ${75}`}
      className={cn("text-gray-500 dark:text-gray-500", className)}
      style={{ width: "100%", height: "100%", ...style }}
    >
      {points.map((point, index) => {
        const rowIndex = yToRowIndex.get(point.y) ?? 0;
        const offsetX = stagger && rowIndex % 2 === 1 ? xStep / 2 : 0;
        return (
          <circle
            cx={point.x + offsetX}
            cy={point.y}
            r={dotRadius}
            fill="currentColor"
            key={`${point.x}-${point.y}-${index}`}
          />
        );
      })}
      {processedMarkers.map((marker, index) => {
        const rowIndex = yToRowIndex.get(marker.y) ?? 0;
        const offsetX = stagger && rowIndex % 2 === 1 ? xStep / 2 : 0;
        return (
          <>
            <circle
              id={marker.id}
              cx={marker.x + offsetX}
              cy={marker.y}
              r={marker.size ?? dotRadius}
              fill={markerColor}
              key={`${marker.x}-${marker.y}-${index}`}
            />
            <circle
              cx={marker.x + offsetX}
              cy={marker.y}
              r={(marker.size ?? dotRadius) + 0.5}
              fill={markerColor}
              key={`${marker.x}-${marker.y}-${index}-shade`}
              className="animate-pulse"
            />
          </>
        );
      })}
      <foreignObject
        ref={pointerRef}
        id="pointer-icon"
        x="0"
        y="0"
        width="3"
        height="3"
        style={{
          transition: "transform 1200ms cubic-bezier(0.4, 0, 0.2, 1)",
          willChange: "transform",
          transform: "translate(64.9545px, 8.95153px)", // initial position
        }}
        className="overflow-visible pointer-events-none"
      >
        <PointerIcon className="w-full h-full fill-white" />
      </foreignObject>
    </svg>
  );
}

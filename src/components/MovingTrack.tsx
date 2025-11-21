import { cn } from "@/lib/utils";
import { Radio } from "lucide-react";

interface Train {
  id: string;
  label: string;
  color: string;
  position: number;
  latitude?: number;
  longitude?: number;
  stationName?: string;
}

interface MovingTrackProps {
  name: string;
  direction: "forward" | "backward";
  mainTrain: Train;
  nearbyTrains: Train[];
  status: "Approaching" | "Moving Away";
  signalLeft: "safe" | "caution" | "danger";
  signalRight: "safe" | "caution" | "danger";
  onSignalClick?: (side: "left" | "right") => void;
}

export const MovingTrack = ({ name, direction, mainTrain, nearbyTrains, status, signalLeft, signalRight, onSignalClick }: MovingTrackProps) => {
  const trackLetter = name.includes("UP") ? "A" : name.includes("DOWN") ? "B" : "C";

  // Static background elements (pillars, stations, traffic signals) - no movement
  const backgroundElements = [
    { id: 1, position: 10, type: "pillar" },
    { id: 2, position: 20, type: "traffic-signal" },
    { id: 3, position: 30, type: "station" },
    { id: 4, position: 40, type: "traffic-signal" },
    { id: 5, position: 50, type: "pillar" },
    { id: 6, position: 60, type: "traffic-signal" },
    { id: 7, position: 70, type: "station" },
    { id: 8, position: 80, type: "traffic-signal" },
    { id: 9, position: 90, type: "pillar" },
  ];

  return (
    <div className="relative py-8 flex items-center gap-4">
      {/* Track Name Label */}
      <div className="min-w-[100px]">
        <span className="text-sm font-semibold text-foreground">{name}</span>
      </div>

      {/* Track Container - Static (No Animation) - Zoomed Out */}
      <div className="flex-1 relative overflow-hidden h-32">
        {/* Static Background Layer */}
        <div className="absolute inset-0 flex items-center">
          <div className="relative h-3 w-full">
            {/* Rail track - continuous line */}
            <div className="absolute h-3 bg-track rounded-full w-full" />

            {/* Static Background Elements */}
            {backgroundElements.map(element => (
              <div
                key={element.id}
                className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2"
                style={{ left: `${element.position}%` }}
              >
                {element.type === "pillar" && (
                  <div className="flex flex-col items-center gap-1">
                    <div className="w-1 h-8 bg-muted-foreground/40 rounded-full" />
                    <div className="w-3 h-3 bg-muted-foreground/60 rounded-full" />
                  </div>
                )}
                {element.type === "station" && (
                  <div className="flex flex-col items-center gap-1">
                    <div className="px-2 py-1 bg-station/80 rounded text-[8px] text-white font-bold">
                      STN
                    </div>
                    <div className="w-px h-4 bg-station/40" />
                  </div>
                )}
                {element.type === "traffic-signal" && (
                  <div className="flex flex-col items-center gap-1">
                    <div className="flex flex-col gap-0.5 bg-secondary/90 p-1 rounded border border-border">
                      <div className="w-2 h-2 rounded-full bg-signal-stop/80 border border-signal-stop" />
                      <div className="w-2 h-2 rounded-full bg-accent/80 border border-accent" />
                      <div className="w-2 h-2 rounded-full bg-signal-safe/80 border border-signal-safe" />
                    </div>
                    <div className="w-px h-6 bg-muted-foreground/40" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Nearby Trains */}
        {nearbyTrains.map((train) => (
          <div
            key={train.id}
            className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 flex flex-col items-center gap-1 z-30 opacity-60"
            style={{ left: `${train.position}%` }}
          >
            <div className="relative">
              <div
                className="w-10 h-9 rounded-lg flex items-center justify-center shadow-lg border border-white/20"
                style={{ backgroundColor: train.color }}
              >
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2c-4 0-8 0.5-8 4v9.5C4 17.43 5.57 19 7.5 19L6 20.5v0.5h2l2-2h4l2 2h2v-0.5L16.5 19c1.93 0 3.5-1.57 3.5-3.5V6c0-3.5-4-4-8-4zM7.5 17c-0.83 0-1.5-0.67-1.5-1.5S6.67 14 7.5 14s1.5 0.67 1.5 1.5S8.33 17 7.5 17zm3.5-7H6V6h5v4zm2 0V6h5v4h-5zm3.5 7c-0.83 0-1.5-0.67-1.5-1.5s0.67-1.5 1.5-1.5 1.5 0.67 1.5 1.5-0.67 1.5-1.5 1.5z" />
                </svg>
              </div>
              {/* Distance Label */}
              <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-0.5 bg-background/80 px-1.5 py-1 rounded border border-border shadow-sm z-50">
                <span className="text-[8px] font-bold text-foreground whitespace-nowrap">
                  {Math.abs(train.position - mainTrain.position) > 0 ? `${Math.abs((train.position - mainTrain.position) / 10).toFixed(1)} km` : ''}
                </span>
                {train.stationName && (
                  <span className="text-[8px] font-medium text-muted-foreground whitespace-nowrap">{train.stationName}</span>
                )}
                {train.latitude && (
                  <span className="text-[7px] text-muted-foreground/80 whitespace-nowrap">
                    {train.latitude.toFixed(3)}°N, {train.longitude?.toFixed(3)}°E
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}

        {/* Main Train (Locopilot) */}
        <div
          className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-40"
          style={{ left: `${mainTrain.position}%` }}
        >
          <div className="px-3 py-1 bg-card/95 rounded border border-border shadow-lg">
            <div className="flex flex-col items-center gap-0.5">
              <span className="font-bold text-foreground text-xs whitespace-nowrap">{mainTrain.label}</span>
              <div className="flex flex-col items-center text-[9px] font-medium text-muted-foreground">
                <span>{mainTrain.stationName}</span>
                <span className="text-[8px] opacity-80">{mainTrain.latitude?.toFixed(3)}°N, {mainTrain.longitude?.toFixed(3)}°E</span>
              </div>
            </div>
          </div>
          <div className="relative">
            <div
              className="w-16 h-14 rounded-lg flex items-center justify-center shadow-2xl border-2 border-white/20"
              style={{ backgroundColor: mainTrain.color }}
            >
              <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2c-4 0-8 0.5-8 4v9.5C4 17.43 5.57 19 7.5 19L6 20.5v0.5h2l2-2h4l2 2h2v-0.5L16.5 19c1.93 0 3.5-1.57 3.5-3.5V6c0-3.5-4-4-8-4zM7.5 17c-0.83 0-1.5-0.67-1.5-1.5S6.67 14 7.5 14s1.5 0.67 1.5 1.5S8.33 17 7.5 17zm3.5-7H6V6h5v4zm2 0V6h5v4h-5zm3.5 7c-0.83 0-1.5-0.67-1.5-1.5s0.67-1.5 1.5-1.5 1.5 0.67 1.5 1.5-0.67 1.5-1.5 1.5z" />
              </svg>
            </div>
          </div>
          <div className="text-[11px] font-semibold text-foreground bg-background/80 px-2 py-0.5 rounded border border-border">
            {status}
          </div>
        </div>
      </div>
    </div>
  );
};

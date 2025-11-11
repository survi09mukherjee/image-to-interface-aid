import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface Train {
  id: string;
  label: string;
  color: string;
  position: number;
}

interface ApproachingTrain {
  id: string;
  position: number;
  color: string;
}

interface MovingTrackProps {
  name: string;
  direction: "forward" | "backward";
  train: Train;
  signalLeft: "safe" | "caution" | "danger";
  signalRight: "safe" | "caution" | "danger";
  onSignalClick?: (side: "left" | "right") => void;
  onCollisionRisk?: (isRisk: boolean) => void;
}

export const MovingTrack = ({ name, direction, train, signalLeft, signalRight, onSignalClick, onCollisionRisk }: MovingTrackProps) => {
  const [trackOffset, setTrackOffset] = useState(0);
  const [approachingTrains, setApproachingTrains] = useState<ApproachingTrain[]>([
    { id: "approaching-1", position: direction === "forward" ? -20 : 120, color: "#ff3366" },
    { id: "approaching-2", position: direction === "forward" ? -60 : 160, color: "#9333ea" },
  ]);
  const [trafficSignals, setTrafficSignals] = useState([
    { id: "signal-1", position: 25 },
    { id: "signal-2", position: 75 },
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTrackOffset(prev => {
        if (direction === "forward") {
          return prev >= 100 ? 0 : prev + 0.5;
        } else {
          return prev <= -100 ? 0 : prev - 0.5;
        }
      });

      // Move approaching trains
      setApproachingTrains(prev => prev.map(t => {
        let newPos;
        if (direction === "forward") {
          newPos = t.position >= 120 ? -20 : t.position + 0.8;
        } else {
          newPos = t.position <= -20 ? 120 : t.position - 0.8;
        }
        return { ...t, position: newPos };
      }));

      // Move traffic signals
      setTrafficSignals(prev => prev.map(signal => {
        let newPos;
        if (direction === "forward") {
          newPos = signal.position >= 100 ? 0 : signal.position + 0.5;
        } else {
          newPos = signal.position <= 0 ? 100 : signal.position - 0.5;
        }
        return { ...signal, position: newPos };
      }));
    }, 50);

    return () => clearInterval(interval);
  }, [direction]);

  // Check for collision risk
  useEffect(() => {
    const isRisk = approachingTrains.some(approaching => {
      const distance = Math.abs(approaching.position - train.position);
      return distance < 20;
    });
    onCollisionRisk?.(isRisk);
  }, [approachingTrains, train.position, onCollisionRisk]);

  return (
    <div className="relative py-6 flex items-center gap-4">
      {/* Track Label */}
      <div className="min-w-[80px]">
        <span className="text-sm font-semibold text-foreground">{name}</span>
      </div>

      {/* Left Signal Circle */}
      <div 
        className="cursor-pointer hover:scale-110 transition-transform z-30"
        onClick={() => onSignalClick?.("left")}
      >
        <div className={cn(
          "w-10 h-10 rounded-full border-2 transition-all",
          signalLeft === "safe" 
            ? "bg-signal-safe border-signal-safe shadow-lg shadow-signal-safe/50" 
            : signalLeft === "danger"
            ? "bg-signal-stop border-signal-stop shadow-lg shadow-signal-stop/50"
            : "bg-muted border-muted-foreground/40"
        )} />
      </div>

      {/* Track Container */}
      <div className="flex-1 relative overflow-hidden">
        <div className="h-3 bg-track rounded-full relative overflow-hidden">
          {/* Moving track pattern */}
          <div 
            className="absolute inset-0 flex z-0"
            style={{ 
              transform: `translateX(${trackOffset}px)`,
              transition: 'transform 0.05s linear'
            }}
          >
            {/* Track dashes pattern */}
            {Array.from({ length: 50 }).map((_, i) => (
              <div 
                key={i} 
                className="h-1 w-6 bg-muted-foreground/30 mx-2 my-auto"
                style={{ minWidth: '24px' }}
              />
            ))}
          </div>

          {/* Approaching Trains (moving with track) */}
          {approachingTrains.map(approaching => (
            <div
              key={approaching.id}
              className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 z-10"
              style={{ left: `${approaching.position}%` }}
            >
              <div 
                className="w-10 h-8 rounded-lg flex items-center justify-center shadow-lg opacity-70"
                style={{ backgroundColor: approaching.color }}
              >
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2c-4 0-8 0.5-8 4v9.5C4 17.43 5.57 19 7.5 19L6 20.5v0.5h2l2-2h4l2 2h2v-0.5L16.5 19c1.93 0 3.5-1.57 3.5-3.5V6c0-3.5-4-4-8-4zM7.5 17c-0.83 0-1.5-0.67-1.5-1.5S6.67 14 7.5 14s1.5 0.67 1.5 1.5S8.33 17 7.5 17zm3.5-7H6V6h5v4zm2 0V6h5v4h-5zm3.5 7c-0.83 0-1.5-0.67-1.5-1.5s0.67-1.5 1.5-1.5 1.5 0.67 1.5 1.5-0.67 1.5-1.5 1.5z"/>
                </svg>
              </div>
            </div>
          ))}

          {/* Moving Traffic Signals */}
          {trafficSignals.map(signal => (
            <div
              key={signal.id}
              className="absolute top-1/2 -translate-y-1/2 z-10"
              style={{ left: `${signal.position}%` }}
            >
              <div className="flex flex-col items-center gap-1">
                <div className="w-1 h-8 bg-muted-foreground/40" />
                <div className="flex flex-col gap-0.5 bg-secondary/90 p-1 rounded border border-border">
                  <div className="w-2 h-2 rounded-full bg-signal-stop/80 border border-signal-stop" />
                  <div className="w-2 h-2 rounded-full bg-accent/80 border border-accent" />
                  <div className="w-2 h-2 rounded-full bg-signal-safe/80 border border-signal-safe" />
                </div>
              </div>
            </div>
          ))}
          
          {/* Stationary Train (foreground) */}
          <div 
            className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-40"
            style={{ left: `${train.position}%` }}
          >
            <div className="px-3 py-1 bg-card/90 rounded border border-border">
              <span className="font-bold text-foreground text-sm">{train.label}</span>
            </div>
            <div className="relative">
              <div 
                className="w-14 h-12 rounded-lg flex items-center justify-center shadow-xl"
                style={{ backgroundColor: train.color }}
              >
                <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2c-4 0-8 0.5-8 4v9.5C4 17.43 5.57 19 7.5 19L6 20.5v0.5h2l2-2h4l2 2h2v-0.5L16.5 19c1.93 0 3.5-1.57 3.5-3.5V6c0-3.5-4-4-8-4zM7.5 17c-0.83 0-1.5-0.67-1.5-1.5S6.67 14 7.5 14s1.5 0.67 1.5 1.5S8.33 17 7.5 17zm3.5-7H6V6h5v4zm2 0V6h5v4h-5zm3.5 7c-0.83 0-1.5-0.67-1.5-1.5s0.67-1.5 1.5-1.5 1.5 0.67 1.5 1.5-0.67 1.5-1.5 1.5z"/>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Signal Circle */}
      <div 
        className="cursor-pointer hover:scale-110 transition-transform z-30"
        onClick={() => onSignalClick?.("right")}
      >
        <div className={cn(
          "w-10 h-10 rounded-full border-2 transition-all",
          signalRight === "safe" 
            ? "bg-signal-safe border-signal-safe shadow-lg shadow-signal-safe/50" 
            : signalRight === "danger"
            ? "bg-signal-stop border-signal-stop shadow-lg shadow-signal-stop/50"
            : "bg-muted border-muted-foreground/40"
        )} />
      </div>
    </div>
  );
};

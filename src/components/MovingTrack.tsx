import { cn } from "@/lib/utils";
import { Radio } from "lucide-react";
import { useEffect, useState } from "react";

interface Train {
  id: string;
  label: string;
  color: string;
  position: number;
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
  const trackLetter = name.includes("UP") ? "A" : name.includes("DOWN") ? "B" : "C";
  const [dynamicTrainPositions, setDynamicTrainPositions] = useState([20, 60, 130]);
  
  // Moving background elements (pillars, stations, traffic signals)
  const backgroundElements = [
    { id: 1, position: 5, type: "pillar" },
    { id: 2, position: 15, type: "traffic-signal" },
    { id: 3, position: 25, type: "station" },
    { id: 4, position: 35, type: "traffic-signal" },
    { id: 5, position: 45, type: "pillar" },
    { id: 6, position: 55, type: "traffic-signal" },
    { id: 7, position: 65, type: "pillar" },
    { id: 8, position: 75, type: "station" },
    { id: 9, position: 85, type: "traffic-signal" },
    { id: 10, position: 95, type: "pillar" },
    // Duplicate for seamless loop
    { id: 11, position: 105, type: "pillar" },
    { id: 12, position: 115, type: "traffic-signal" },
    { id: 13, position: 125, type: "station" },
    { id: 14, position: 135, type: "traffic-signal" },
    { id: 15, position: 145, type: "pillar" },
    { id: 16, position: 155, type: "traffic-signal" },
    { id: 17, position: 165, type: "pillar" },
    { id: 18, position: 175, type: "station" },
    { id: 19, position: 185, type: "traffic-signal" },
  ];

  // Dynamic moving trains on the track
  const dynamicTrains = [
    { id: "dyn1", position: dynamicTrainPositions[0], color: direction === "forward" ? "#10b981" : "#f59e0b", size: "small" },
    { id: "dyn2", position: dynamicTrainPositions[1], color: direction === "forward" ? "#3b82f6" : "#ef4444", size: "medium" },
    { id: "dyn3", position: dynamicTrainPositions[2], color: direction === "forward" ? "#8b5cf6" : "#06b6d4", size: "small" },
  ];

  // Collision detection
  useEffect(() => {
    const checkCollision = () => {
      const COLLISION_THRESHOLD = 15; // Distance threshold for collision risk
      let hasRisk = false;

      dynamicTrainPositions.forEach(dynPos => {
        // Normalize positions to handle the 200% width track
        const normalizedDynPos = dynPos % 100;
        const distance = Math.abs(normalizedDynPos - train.position);
        
        if (distance < COLLISION_THRESHOLD) {
          hasRisk = true;
        }
      });

      onCollisionRisk?.(hasRisk);
    };

    const interval = setInterval(() => {
      // Update dynamic train positions based on direction
      setDynamicTrainPositions(prev => 
        prev.map(pos => {
          const speed = direction === "forward" ? 0.5 : -0.5;
          const newPos = pos + speed;
          // Reset position when reaching boundaries for continuous loop
          if (newPos > 200) return newPos - 100;
          if (newPos < 0) return newPos + 100;
          return newPos;
        })
      );
      checkCollision();
    }, 50);

    return () => clearInterval(interval);
  }, [dynamicTrainPositions, train.position, direction, onCollisionRisk]);

  const animationClass = direction === "forward" ? "animate-track-forward" : "animate-track-backward";

  return (
    <div className="relative py-4 flex items-center gap-4">
      {/* Track Name Label */}
      <div className="min-w-[100px]">
        <span className="text-sm font-semibold text-foreground">{name}</span>
      </div>

      {/* Track Container with Moving Background */}
      <div className="flex-1 relative overflow-hidden h-24">
        {/* Moving Background Layer */}
        <div className={cn("absolute inset-0 flex items-center", animationClass)}>
          <div className="relative h-3 bg-track rounded-full" style={{ width: "200%" }}>
            {/* Background Elements Moving with Track */}
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

            {/* Dynamic Moving Trains */}
            {dynamicTrains.map(dynTrain => (
              <div
                key={dynTrain.id}
                className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 z-20"
                style={{ left: `${dynTrain.position}%` }}
              >
                <div 
                  className={cn(
                    "rounded-lg flex items-center justify-center shadow-xl border border-white/20",
                    dynTrain.size === "small" ? "w-10 h-8" : "w-12 h-10"
                  )}
                  style={{ backgroundColor: dynTrain.color }}
                >
                  <svg className="w-6 h-6 text-white/90" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2c-4 0-8 0.5-8 4v9.5C4 17.43 5.57 19 7.5 19L6 20.5v0.5h2l2-2h4l2 2h2v-0.5L16.5 19c1.93 0 3.5-1.57 3.5-3.5V6c0-3.5-4-4-8-4zM7.5 17c-0.83 0-1.5-0.67-1.5-1.5S6.67 14 7.5 14s1.5 0.67 1.5 1.5S8.33 17 7.5 17zm3.5-7H6V6h5v4zm2 0V6h5v4h-5zm3.5 7c-0.83 0-1.5-0.67-1.5-1.5s0.67-1.5 1.5-1.5 1.5 0.67 1.5 1.5-0.67 1.5-1.5 1.5z"/>
                  </svg>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Static Foreground Train (Always Visible) */}
        <div 
          className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-40"
          style={{ left: `${train.position}%` }}
        >
          <div className="px-3 py-1 bg-card/95 rounded border border-border shadow-lg">
            <div className="flex flex-col items-center gap-0.5">
              <span className="font-bold text-foreground text-sm whitespace-nowrap">{train.label}</span>
              <span className="text-[10px] text-muted-foreground">Status: Active</span>
            </div>
          </div>
          <div className="relative">
            <div 
              className="w-16 h-14 rounded-lg flex items-center justify-center shadow-2xl border-2 border-white/20"
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
  );
};

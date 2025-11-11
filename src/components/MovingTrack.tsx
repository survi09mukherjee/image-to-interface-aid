import { cn } from "@/lib/utils";
import { Radio } from "lucide-react";

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

export const MovingTrack = ({ name, direction, train, signalLeft, signalRight, onSignalClick }: MovingTrackProps) => {
  // RFID sensor positions along the track
  const trackLetter = name.includes("UP") ? "A" : name.includes("DOWN") ? "B" : "C";
  const rfidSensors = [
    { id: 1, position: 15, label: `RFID ${trackLetter}1` },
    { id: 2, position: 30, label: direction === "forward" ? `RFID ${trackLetter}2` : "Wireless" },
    { id: 3, position: 50, label: "Wireless" },
    { id: 4, position: 70, label: direction === "forward" ? `RFID ${trackLetter}3` : `RFID ${trackLetter}3` },
    { id: 5, position: 85, label: direction === "forward" ? `RFID ${trackLetter}4` : "BPC RFID" },
  ];

  return (
    <div className="relative py-6 flex items-center gap-4">
      {/* Track Name Label */}
      <div className="min-w-[100px]">
        <span className="text-sm font-semibold text-foreground">{name}</span>
      </div>
      {/* Left Traffic Signal */}
      <div 
        className="cursor-pointer hover:scale-110 transition-transform z-30 flex flex-col items-center gap-1"
        onClick={() => onSignalClick?.("left")}
      >
        <div className="h-16 w-2 bg-muted-foreground/20" />
        <div className="flex flex-col gap-1 bg-secondary/90 p-2 rounded border border-border">
          <div className={cn(
            "w-3 h-3 rounded-full border",
            signalLeft === "danger" ? "bg-signal-stop border-signal-stop shadow-lg shadow-signal-stop/50" : "bg-muted/50 border-muted-foreground/30"
          )} />
          <div className={cn(
            "w-3 h-3 rounded-full border",
            signalLeft === "caution" ? "bg-accent border-accent shadow-lg shadow-accent/50" : "bg-muted/50 border-muted-foreground/30"
          )} />
          <div className={cn(
            "w-3 h-3 rounded-full border",
            signalLeft === "safe" ? "bg-signal-safe border-signal-safe shadow-lg shadow-signal-safe/50" : "bg-muted/50 border-muted-foreground/30"
          )} />
        </div>
      </div>

      {/* Track Container */}
      <div className="flex-1 relative">
        <div className="h-2 bg-track rounded-full relative">
          {/* RFID Sensors */}
          {rfidSensors.map(sensor => (
            <div
              key={sensor.id}
              className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 flex flex-col items-center gap-1 z-10"
              style={{ left: `${sensor.position}%` }}
            >
              <div className="flex flex-col items-center gap-0.5 bg-primary/90 px-2 py-1 rounded border border-primary shadow-lg shadow-primary/20">
                <Radio className="w-3 h-3 text-white" />
              </div>
              <span className="text-[10px] text-primary font-medium whitespace-nowrap">{sensor.label}</span>
              <div className="w-px h-2 bg-muted-foreground/30" />
            </div>
          ))}

          {/* Stationary Train */}
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

      {/* Right Traffic Signal */}
      <div 
        className="cursor-pointer hover:scale-110 transition-transform z-30 flex flex-col items-center gap-1"
        onClick={() => onSignalClick?.("right")}
      >
        <div className="h-16 w-2 bg-muted-foreground/20" />
        <div className="flex flex-col gap-1 bg-secondary/90 p-2 rounded border border-border">
          <div className={cn(
            "w-3 h-3 rounded-full border",
            signalRight === "danger" ? "bg-signal-stop border-signal-stop shadow-lg shadow-signal-stop/50" : "bg-muted/50 border-muted-foreground/30"
          )} />
          <div className={cn(
            "w-3 h-3 rounded-full border",
            signalRight === "caution" ? "bg-accent border-accent shadow-lg shadow-accent/50" : "bg-muted/50 border-muted-foreground/30"
          )} />
          <div className={cn(
            "w-3 h-3 rounded-full border",
            signalRight === "safe" ? "bg-signal-safe border-signal-safe shadow-lg shadow-signal-safe/50" : "bg-muted/50 border-muted-foreground/30"
          )} />
        </div>
      </div>
    </div>
  );
};

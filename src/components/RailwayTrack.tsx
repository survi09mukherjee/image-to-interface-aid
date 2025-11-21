import { cn } from "@/lib/utils";

interface TrainData {
  id: string;
  label: string;
  color: string;
  position: number;
  speed: number;
}

interface TrackProps {
  name: string;
  train?: TrainData;
  signalLeft: "safe" | "caution" | "danger";
  signalRight: "safe" | "caution" | "danger";
  onSignalClick?: (side: "left" | "right") => void;
}

export const RailwayTrack = ({ name, train, signalLeft, signalRight, onSignalClick }: TrackProps) => {
  return (
    <div className="relative py-8">
      {/* Track Label */}
      <div className="absolute left-0 top-1/2 -translate-y-1/2">
        <span className="text-sm font-semibold text-foreground">{name}</span>
      </div>

      {/* Track Line */}
      <div className="ml-24 mr-8 relative">
        <div className="h-3 bg-track rounded-full relative">
          {/* Left Traffic Signal */}
          <div 
            className="absolute top-1/2 -translate-y-1/2 left-2 cursor-pointer hover:scale-110 transition-transform"
            onClick={() => onSignalClick?.("left")}
          >
            <div className="flex flex-col gap-1 bg-secondary/80 p-1.5 rounded-lg border border-border">
              <div className={cn(
                "w-4 h-4 rounded-full border-2 transition-all",
                signalLeft === "danger" 
                  ? "bg-signal-stop border-signal-stop shadow-lg shadow-signal-stop/50" 
                  : "bg-muted/50 border-muted-foreground/20"
              )} />
              <div className={cn(
                "w-4 h-4 rounded-full border-2 transition-all",
                signalLeft === "caution" 
                  ? "bg-accent border-accent shadow-lg shadow-accent/50 animate-pulse" 
                  : "bg-muted/50 border-muted-foreground/20"
              )} />
              <div className={cn(
                "w-4 h-4 rounded-full border-2 transition-all",
                signalLeft === "safe" 
                  ? "bg-signal-safe border-signal-safe shadow-lg shadow-signal-safe/50" 
                  : "bg-muted/50 border-muted-foreground/20"
              )} />
            </div>
          </div>

          {/* Right Traffic Signal */}
          <div 
            className="absolute top-1/2 -translate-y-1/2 right-2 cursor-pointer hover:scale-110 transition-transform"
            onClick={() => onSignalClick?.("right")}
          >
            <div className="flex flex-col gap-1 bg-secondary/80 p-1.5 rounded-lg border border-border">
              <div className={cn(
                "w-4 h-4 rounded-full border-2 transition-all",
                signalRight === "danger" 
                  ? "bg-signal-stop border-signal-stop shadow-lg shadow-signal-stop/50" 
                  : "bg-muted/50 border-muted-foreground/20"
              )} />
              <div className={cn(
                "w-4 h-4 rounded-full border-2 transition-all",
                signalRight === "caution" 
                  ? "bg-accent border-accent shadow-lg shadow-accent/50 animate-pulse" 
                  : "bg-muted/50 border-muted-foreground/20"
              )} />
              <div className={cn(
                "w-4 h-4 rounded-full border-2 transition-all",
                signalRight === "safe" 
                  ? "bg-signal-safe border-signal-safe shadow-lg shadow-signal-safe/50" 
                  : "bg-muted/50 border-muted-foreground/20"
              )} />
            </div>
          </div>
          
          {/* Train */}
          {train && (
            <div 
              className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 flex flex-col items-center gap-2 transition-all duration-1000 ease-linear"
              style={{ left: `${train.position}%` }}
            >
              <div className="px-3 py-1 bg-card/90 rounded border border-border">
                <span className="font-bold text-foreground text-sm">{train.label}</span>
              </div>
              <div className="relative">
                <div 
                  className="w-14 h-12 rounded-lg flex items-center justify-center shadow-xl animate-pulse"
                  style={{ backgroundColor: train.color }}
                >
                  <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2c-4 0-8 0.5-8 4v9.5C4 17.43 5.57 19 7.5 19L6 20.5v0.5h2l2-2h4l2 2h2v-0.5L16.5 19c1.93 0 3.5-1.57 3.5-3.5V6c0-3.5-4-4-8-4zM7.5 17c-0.83 0-1.5-0.67-1.5-1.5S6.67 14 7.5 14s1.5 0.67 1.5 1.5S8.33 17 7.5 17zm3.5-7H6V6h5v4zm2 0V6h5v4h-5zm3.5 7c-0.83 0-1.5-0.67-1.5-1.5s0.67-1.5 1.5-1.5 1.5 0.67 1.5 1.5-0.67 1.5-1.5 1.5z"/>
                  </svg>
                </div>
                <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] font-semibold text-primary whitespace-nowrap">
                  {train.speed} km/h
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

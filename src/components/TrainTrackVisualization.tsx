import { Train, Radio, Zap, Building2, TowerControl } from "lucide-react";

interface TrainData {
  id: string;
  label: string;
  color: "teal" | "orange" | "red";
  track: number;
  position: number;
}

interface RFIDModule {
  track: number;
  position: number;
  label: string;
  active: boolean;
}

interface TrafficSignal {
  track: number;
  position: number;
  activeColor: "red" | "yellow" | "green";
}

const TrainTrackVisualization = () => {
  // Three tracks: A, B, C with trains
  const trains: TrainData[] = [
    { id: "A", label: "TRAIN A", color: "teal", track: 0, position: 25 },
    { id: "B", label: "TRAIN B", color: "orange", track: 1, position: 50 },
    { id: "C", label: "TRAIN C", color: "red", track: 2, position: 70 },
  ];

  // RFID modules distributed across all tracks
  const rfidModules: RFIDModule[] = [
    // Track A modules
    { track: 0, position: 15, label: "RFID A1", active: true },
    { track: 0, position: 35, label: "RFID A2", active: true },
    { track: 0, position: 55, label: "RFID A3", active: true },
    { track: 0, position: 80, label: "RFID A4", active: false },
    
    // Track B modules
    { track: 1, position: 20, label: "RFID B1", active: true },
    { track: 1, position: 40, label: "RFID B2", active: false },
    { track: 1, position: 65, label: "RFID B3", active: true },
    { track: 1, position: 85, label: "RFID B4", active: true },
    
    // Track C modules
    { track: 2, position: 18, label: "RFID C1", active: true },
    { track: 2, position: 45, label: "RFID C2", active: true },
    { track: 2, position: 75, label: "EPC RFID", active: true },
    { track: 2, position: 90, label: "RFID C4", active: false },
  ];

  // Traffic signals at various positions
  const trafficSignals: TrafficSignal[] = [
    { track: 0, position: 10, activeColor: "green" },
    { track: 0, position: 90, activeColor: "yellow" },
    { track: 1, position: 10, activeColor: "green" },
    { track: 1, position: 90, activeColor: "red" },
    { track: 2, position: 10, activeColor: "green" },
    { track: 2, position: 90, activeColor: "yellow" },
  ];

  const getTrainColor = (color: string) => {
    switch (color) {
      case "teal":
        return "text-[hsl(180,70%,50%)]";
      case "orange":
        return "text-[hsl(30,95%,60%)]";
      case "red":
        return "text-destructive";
      default:
        return "text-primary";
    }
  };

  const getSignalColor = (color: string) => {
    switch (color) {
      case "green":
        return "bg-success";
      case "yellow":
        return "bg-accent";
      case "red":
        return "bg-destructive";
      default:
        return "bg-muted";
    }
  };

  const getSignalShadow = (color: string) => {
    switch (color) {
      case "green":
        return "0 0 12px hsl(var(--success))";
      case "yellow":
        return "0 0 12px hsl(var(--accent))";
      case "red":
        return "0 0 12px hsl(var(--destructive))";
      default:
        return "none";
    }
  };

  return (
    <div className="relative w-full h-full bg-track-bg rounded-lg p-6 overflow-hidden">
      <div className="flex gap-4 h-full">
        {/* Left Side - Station & Signal Cabin */}
        <div className="flex-shrink-0 w-24 flex flex-col justify-around gap-8">
          {/* Station */}
          <div className="flex flex-col items-center gap-2">
            <Building2 className="w-12 h-12 text-primary" />
            <div className="text-[10px] text-muted-foreground font-semibold text-center">
              STATION
            </div>
          </div>

          {/* Signal Cabin */}
          <div className="flex flex-col items-center gap-2">
            <TowerControl className="w-12 h-12 text-accent" />
            <div className="text-[10px] text-muted-foreground font-semibold text-center">
              SIGNAL<br/>CABIN
            </div>
          </div>
        </div>

        {/* Main Track Area */}
        <div className="flex-1 relative">
          {/* Power Supply Indicators */}
          <div className="absolute top-0 left-0 right-0 flex justify-between text-[10px] text-accent mb-2">
            <div className="flex items-center gap-1">
              <Zap className="w-3 h-3" />
              <span>110V DC - RFID Power Supply</span>
            </div>
            <div className="flex items-center gap-1">
              <span>110V DC - RFID Power Supply</span>
              <Zap className="w-3 h-3" />
            </div>
          </div>

          {/* Three Parallel Tracks */}
          <div className="absolute top-12 bottom-12 left-0 right-0 flex flex-col justify-around">
            {[0, 1, 2].map((trackIndex) => (
              <div key={trackIndex} className="relative">
                {/* Track Label */}
                <div className="absolute -left-16 top-1/2 -translate-y-1/2 text-[10px] font-bold text-muted-foreground">
                  TRACK {String.fromCharCode(65 + trackIndex)}
                </div>

                {/* Main Rail */}
                <div className="relative h-2 bg-track-rail rounded-full shadow-lg">
                  {/* Junction curves at the start */}
                  {trackIndex > 0 && (
                    <svg
                      className="absolute -left-12 top-1/2 -translate-y-1/2 w-12 h-16"
                      style={{ top: trackIndex === 1 ? '-20px' : '-40px' }}
                      viewBox="0 0 48 64"
                      fill="none"
                    >
                      <path
                        d={trackIndex === 1 ? "M 0 32 Q 24 20 48 32" : "M 0 48 Q 24 20 48 32"}
                        stroke="hsl(var(--track-rail))"
                        strokeWidth="2"
                        strokeDasharray="4,4"
                        fill="none"
                      />
                    </svg>
                  )}

                  {/* Junction curves at the end */}
                  {trackIndex > 0 && (
                    <svg
                      className="absolute -right-12 top-1/2 -translate-y-1/2 w-12 h-16"
                      style={{ top: trackIndex === 1 ? '-20px' : '-40px' }}
                      viewBox="0 0 48 64"
                      fill="none"
                    >
                      <path
                        d={trackIndex === 1 ? "M 0 32 Q 24 20 48 32" : "M 0 32 Q 24 20 48 48"}
                        stroke="hsl(var(--track-rail))"
                        strokeWidth="2"
                        strokeDasharray="4,4"
                        fill="none"
                      />
                    </svg>
                  )}

                  {/* Traffic Signals on this track */}
                  {trafficSignals
                    .filter((signal) => signal.track === trackIndex)
                    .map((signal, idx) => (
                      <div
                        key={idx}
                        className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 flex flex-col items-center gap-1"
                        style={{ left: `${signal.position}%` }}
                      >
                        <div className="bg-card border border-border rounded-md p-0.5 flex flex-col gap-0.5 mb-1">
                          <div className={`w-2 h-2 rounded-full ${signal.activeColor === 'red' ? 'bg-destructive' : 'bg-destructive/20'}`} />
                          <div className={`w-2 h-2 rounded-full ${signal.activeColor === 'yellow' ? 'bg-accent' : 'bg-accent/20'}`} />
                          <div 
                            className={`w-2 h-2 rounded-full ${signal.activeColor === 'green' ? 'bg-success' : 'bg-success/20'}`}
                            style={{ boxShadow: signal.activeColor === 'green' ? getSignalShadow('green') : 'none' }}
                          />
                        </div>
                      </div>
                    ))}

                  {/* Train on this track */}
                  {trains
                    .filter((train) => train.track === trackIndex)
                    .map((train) => (
                      <div
                        key={train.id}
                        className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2"
                        style={{ left: `${train.position}%` }}
                      >
                        {/* Train Label */}
                        <div className="absolute -top-10 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-card border border-border rounded text-[9px] font-bold whitespace-nowrap">
                          {train.label}
                          <div className="text-[7px] text-muted-foreground">Status: Active</div>
                        </div>

                        {/* Train Icon */}
                        <Train className={`w-10 h-10 ${getTrainColor(train.color)} drop-shadow-lg`} />

                        {/* Wireless Indicator */}
                        <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-0.5">
                          <Radio className="w-3 h-3 text-primary animate-pulse" />
                          <div className="text-[7px] text-primary">Wireless</div>
                        </div>
                      </div>
                    ))}

                  {/* RFID Modules on this track */}
                  {rfidModules
                    .filter((module) => module.track === trackIndex)
                    .map((module, idx) => (
                      <div
                        key={idx}
                        className="absolute -bottom-12 -translate-x-1/2"
                        style={{ left: `${module.position}%` }}
                      >
                        {/* Connection line to track */}
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 w-px h-4 bg-primary/30" />
                        
                        {/* RFID Module Box */}
                        <div className="flex flex-col items-center gap-0.5">
                          <div
                            className={`w-6 h-5 ${
                              module.active ? "bg-primary" : "bg-muted"
                            } rounded border border-border flex items-center justify-center shadow-sm`}
                          >
                            <Radio
                              className={`w-3 h-3 ${
                                module.active ? "text-primary-foreground" : "text-muted-foreground"
                              }`}
                            />
                          </div>
                          <div className="text-[7px] text-muted-foreground whitespace-nowrap">
                            {module.label}
                          </div>
                          {module.active && (
                            <div className="w-1 h-1 bg-success rounded-full animate-pulse" />
                          )}
                        </div>

                        {/* Wireless connection visualization */}
                        {module.active && (
                          <svg className="absolute -top-6 left-1/2 -translate-x-1/2 w-8 h-6 opacity-30">
                            <circle cx="16" cy="12" r="2" fill="hsl(var(--primary))" />
                            <circle cx="16" cy="12" r="6" fill="none" stroke="hsl(var(--primary))" strokeWidth="0.5" />
                            <circle cx="16" cy="12" r="10" fill="none" stroke="hsl(var(--primary))" strokeWidth="0.3" />
                          </svg>
                        )}
                      </div>
                    ))}
                </div>

                {/* Signal flow indicators between RFID modules */}
                <div className="absolute -bottom-16 left-0 right-0 h-2">
                  {rfidModules
                    .filter((module) => module.track === trackIndex && module.active)
                    .map((module, idx, arr) => {
                      if (idx < arr.length - 1) {
                        const nextModule = arr[idx + 1];
                        return (
                          <div
                            key={idx}
                            className="absolute h-px bg-primary/40"
                            style={{
                              left: `${module.position}%`,
                              width: `${nextModule.position - module.position}%`,
                            }}
                          />
                        );
                      }
                      return null;
                    })}
                </div>
              </div>
            ))}
          </div>

          {/* Bottom Info Panel */}
          <div className="absolute bottom-0 left-0 right-0 bg-card/50 border border-border rounded p-2">
            <div className="flex justify-around text-[8px] text-muted-foreground">
              <div className="flex items-center gap-1">
                <div className="w-1.5 h-1.5 bg-primary rounded" />
                <span>Active RFID Module</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-1.5 h-1.5 bg-muted rounded" />
                <span>Passive RFID Module</span>
              </div>
              <div className="flex items-center gap-1">
                <Radio className="w-3 h-3 text-primary" />
                <span>Wireless Communication</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-1.5 h-1.5 bg-success rounded-full" />
                <span>Safe Signal</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-1.5 h-1.5 bg-destructive rounded-full" />
                <span>Stop Signal</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrainTrackVisualization;

import { Train, Radio, Zap } from "lucide-react";

interface TrainPosition {
  id: string;
  label: string;
  color: "teal" | "orange" | "red";
  position: number;
}

interface RFIDModule {
  position: number;
  signal: string;
  active: boolean;
}

interface TrafficSignal {
  position: number;
  colors: ("red" | "yellow" | "green")[];
}

const TrainTrackVisualization = () => {
  const trains: TrainPosition[] = [
    { id: "A", label: "TRAIN A", color: "teal", position: 20 },
    { id: "B", label: "TRAIN B", color: "orange", position: 45 },
    { id: "C", label: "TRAIN C", color: "red", position: 70 },
  ];

  // RFID modules along the track
  const rfidModules: RFIDModule[] = [
    { position: 15, signal: "Signal A", active: true },
    { position: 35, signal: "Signal B", active: true },
    { position: 55, signal: "Signal B", active: false },
    { position: 75, signal: "Signal C", active: true },
    { position: 85, signal: "Signal D", active: false },
  ];

  // Traffic signals on both ends
  const trafficSignals: TrafficSignal[] = [
    { position: 0, colors: ["red", "yellow", "green"] },
    { position: 100, colors: ["red", "yellow", "green"] },
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

  const getTrainBg = (color: string) => {
    switch (color) {
      case "teal":
        return "bg-[hsl(180,70%,50%)]/20";
      case "orange":
        return "bg-[hsl(30,95%,60%)]/20";
      case "red":
        return "bg-destructive/20";
      default:
        return "bg-primary/20";
    }
  };

  return (
    <div className="relative w-full h-full bg-track-bg rounded-lg p-8">
      <div className="space-y-8">
        {/* Signal Zone Labels */}
        <div className="flex justify-around text-sm text-muted-foreground mb-4">
          <div className="text-center">
            <div className="text-xs font-semibold">SIGNAL A</div>
            <div className="text-[10px] text-primary">Active RFID</div>
          </div>
          <div className="text-center">
            <div className="text-xs font-semibold">SIGNAL B</div>
            <div className="text-[10px] text-primary">Active RFID</div>
          </div>
          <div className="text-center">
            <div className="text-xs font-semibold">SIGNAL C</div>
            <div className="text-[10px] text-accent">Track Changing</div>
          </div>
          <div className="text-center">
            <div className="text-xs font-semibold">SIGNAL D</div>
            <div className="text-[10px] text-muted-foreground">Passive RFID</div>
          </div>
        </div>

        {/* Main Track Visualization */}
        <div className="relative h-48">
          {/* Traffic Signals */}
          {trafficSignals.map((signal, idx) => (
            <div
              key={idx}
              className="absolute top-0 flex flex-col gap-1"
              style={{ left: `${signal.position}%` }}
            >
              <div className="text-[10px] text-muted-foreground mb-1 whitespace-nowrap">
                RAIL TRAFFIC SIGNAL
              </div>
              <div className="bg-card border border-border rounded-md p-1 flex flex-col gap-0.5">
                {signal.colors.map((color, colorIdx) => (
                  <div
                    key={colorIdx}
                    className={`w-3 h-3 rounded-full ${
                      colorIdx === 2 ? "bg-success" : `bg-${color}-500/30`
                    }`}
                    style={{
                      boxShadow: colorIdx === 2 ? "0 0 8px hsl(var(--success))" : "none",
                    }}
                  />
                ))}
              </div>
            </div>
          ))}

          {/* Main Rail Track */}
          <div className="absolute top-24 w-full">
            {/* Track Rail */}
            <div className="relative h-2 bg-track-rail rounded-full shadow-lg">
              {/* Power Supply Lines */}
              <div className="absolute -top-6 left-0 text-[10px] text-accent flex items-center gap-1">
                <Zap className="w-3 h-3" />
                <span>110V DC</span>
              </div>
              <div className="absolute -top-6 right-0 text-[10px] text-accent flex items-center gap-1">
                <span>110V DC</span>
                <Zap className="w-3 h-3" />
              </div>

              {/* Train Labels Above Track */}
              {trains.map((train) => (
                <div
                  key={train.id}
                  className={`absolute -top-12 left-1/2 -translate-x-1/2 px-2 py-1 rounded text-[10px] font-bold ${getTrainBg(
                    train.color
                  )} border border-current`}
                  style={{ left: `${train.position}%` }}
                >
                  {train.label}
                </div>
              ))}

              {/* Trains on Track */}
              {trains.map((train) => (
                <div
                  key={train.id}
                  className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2"
                  style={{ left: `${train.position}%` }}
                >
                  <Train className={`w-12 h-12 ${getTrainColor(train.color)} drop-shadow-lg`} />
                  
                  {/* Wireless Transmission Indicator */}
                  <div className="absolute -bottom-6 left-1/2 -translate-x-1/2">
                    <Radio className="w-4 h-4 text-primary animate-pulse" />
                  </div>
                </div>
              ))}
            </div>

            {/* RFID Modules Below Track */}
            <div className="relative mt-8">
              {rfidModules.map((module, idx) => (
                <div
                  key={idx}
                  className="absolute"
                  style={{ left: `${module.position}%` }}
                >
                  {/* RFID Module Box */}
                  <div
                    className={`flex flex-col items-center gap-1 ${
                      module.active ? "opacity-100" : "opacity-50"
                    }`}
                  >
                    <div
                      className={`w-8 h-6 ${
                        module.active ? "bg-primary" : "bg-muted"
                      } rounded border-2 border-border flex items-center justify-center`}
                    >
                      <Radio
                        className={`w-3 h-3 ${
                          module.active ? "text-primary-foreground" : "text-muted-foreground"
                        }`}
                      />
                    </div>
                    <div className="text-[8px] text-muted-foreground whitespace-nowrap">
                      {module.signal}
                    </div>
                    {/* Connection Line */}
                    <div className="w-px h-4 bg-border" />
                  </div>
                </div>
              ))}

              {/* Signal Flow Lines */}
              <div className="absolute top-16 w-full">
                <svg className="w-full h-12" viewBox="0 0 100 12" preserveAspectRatio="none">
                  {/* Signal A to B */}
                  <path
                    d="M 15 6 L 35 6"
                    stroke="hsl(180, 70%, 50%)"
                    strokeWidth="0.3"
                    strokeDasharray="2,2"
                    fill="none"
                  />
                  {/* Signal B to C */}
                  <path
                    d="M 35 6 L 55 6"
                    stroke="hsl(30, 95%, 60%)"
                    strokeWidth="0.3"
                    strokeDasharray="2,2"
                    fill="none"
                  />
                  {/* Signal C to D */}
                  <path
                    d="M 55 6 L 75 6"
                    stroke="hsl(var(--destructive))"
                    strokeWidth="0.3"
                    strokeDasharray="2,2"
                    fill="none"
                  />
                </svg>
                <div className="text-center text-[9px] text-muted-foreground mt-1">
                  Wireless Connection & Signal Flow
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="flex justify-center gap-6 text-[10px] text-muted-foreground mt-8">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-primary rounded" />
            <span>Active RFID Module</span>
          </div>
          <div className="flex items-center gap-1">
            <Radio className="w-3 h-3 text-primary" />
            <span>Wireless Transmission</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-success rounded-full" />
            <span>Safe Signal</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrainTrackVisualization;

import { Card } from "./ui/card";

interface SignalStatusProps {
  distance: number;
  status: "safe" | "caution" | "danger";
}

export const SignalStatus = ({ distance, status }: SignalStatusProps) => {
  return (
    <Card className="p-2 bg-card border-border">
      <h3 className="text-[10px] font-medium text-muted-foreground tracking-wider mb-2">NEXT SIGNAL</h3>
      <div className="flex items-center justify-between">
        {/* Traffic Light Visual */}
        <div className="bg-black/80 p-1.5 rounded-lg border border-gray-700 flex gap-1.5 shadow-inner">
          {/* Red Light */}
          <div className={`w-6 h-6 rounded-full border border-red-900 transition-all duration-300 ${status === 'danger' ? 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.8)] scale-110' : 'bg-red-900/30'}`} />

          {/* Yellow Light */}
          <div className={`w-6 h-6 rounded-full border border-yellow-900 transition-all duration-300 ${status === 'caution' ? 'bg-yellow-500 shadow-[0_0_10px_rgba(234,179,8,0.8)] scale-110' : 'bg-yellow-900/30'}`} />

          {/* Green Light */}
          <div className={`w-6 h-6 rounded-full border border-green-900 transition-all duration-300 ${status === 'safe' ? 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.8)] scale-110' : 'bg-green-900/30'}`} />
        </div>

        <div className="text-right">
          <p className="text-[10px] text-muted-foreground">Distance</p>
          <p className="text-lg font-bold text-foreground leading-tight">{distance} KM</p>
        </div>
      </div>
    </Card>
  );
};

import { Card } from "./ui/card";
import { Activity, TrendingUp, AlertTriangle, CheckCircle2 } from "lucide-react";

export const AnalyticsDashboard = () => {
  const metrics = [
    { label: "Active Trains", value: "2", icon: Activity, color: "text-train-a" },
    { label: "Avg Speed", value: "66 km/h", icon: TrendingUp, color: "text-signal-safe" },
    { label: "Warnings", value: "0", icon: AlertTriangle, color: "text-accent" },
    { label: "System Status", value: "Normal", icon: CheckCircle2, color: "text-signal-safe" },
  ];

  return (
    <Card className="p-2 bg-card border-border">
      <h3 className="text-xs font-medium text-muted-foreground tracking-wider mb-2">ANALYTICS DASHBOARD</h3>

      <div className="grid grid-cols-2 gap-2">
        {metrics.map((metric, index) => (
          <div key={index} className="p-2 bg-secondary/50 rounded-lg border border-border">
            <div className="flex items-center justify-between mb-1">
              <metric.icon className={`w-3.5 h-3.5 ${metric.color}`} />
              <span className="text-lg font-bold text-foreground">{metric.value}</span>
            </div>
            <div className="text-[10px] text-muted-foreground uppercase tracking-wide">{metric.label}</div>
          </div>
        ))}
      </div>

      <div className="mt-2 grid grid-cols-2 gap-2">
        {/* Signal Coverage - LEFT */}
        <div className="p-2 bg-secondary/30 rounded-lg border border-border">
          <div className="text-xs mb-1 text-center">
            <span className="text-muted-foreground font-medium">Signal Coverage</span>
          </div>
          <div className="flex justify-center">
            <button className="w-7 h-7 rounded-full bg-muted/30 border-2 border-muted-foreground/20 hover:bg-muted/50 transition-colors" />
          </div>
        </div>

        {/* Track Module - RIGHT */}
        <div className="p-2 bg-secondary/30 rounded-lg border border-border">
          <div className="text-xs mb-1 text-center">
            <span className="text-muted-foreground font-medium">Track Module</span>
          </div>
          <div className="flex justify-center">
            <button className="w-7 h-7 rounded-full bg-muted/30 border-2 border-muted-foreground/20 hover:bg-muted/50 transition-colors" />
          </div>
        </div>
      </div>


    </Card>
  );
};

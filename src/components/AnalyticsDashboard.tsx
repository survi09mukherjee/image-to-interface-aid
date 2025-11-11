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
    <Card className="p-6 bg-card border-border">
      <h3 className="text-sm font-medium text-muted-foreground tracking-wider mb-4">ANALYTICS DASHBOARD</h3>
      
      <div className="grid grid-cols-2 gap-4">
        {metrics.map((metric, index) => (
          <div key={index} className="p-4 bg-secondary/50 rounded-lg border border-border">
            <div className="flex items-center justify-between mb-2">
              <metric.icon className={`w-5 h-5 ${metric.color}`} />
              <span className="text-2xl font-bold text-foreground">{metric.value}</span>
            </div>
            <div className="text-xs text-muted-foreground uppercase tracking-wide">{metric.label}</div>
          </div>
        ))}
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4">
        {/* Signal Coverage - LEFT */}
        <div className="p-4 bg-secondary/30 rounded-lg border border-border">
          <div className="text-sm mb-3 text-center">
            <span className="text-muted-foreground font-medium">Signal Coverage</span>
          </div>
          <div className="flex justify-center">
            <button className="w-10 h-10 rounded-full bg-signal-safe hover:bg-signal-safe/90 transition-colors" />
          </div>
        </div>

        {/* Track Module - RIGHT */}
        <div className="p-4 bg-secondary/30 rounded-lg border border-border">
          <div className="text-sm mb-3 text-center">
            <span className="text-muted-foreground font-medium">Track Module</span>
          </div>
          <div className="flex justify-center">
            <button className="w-10 h-10 rounded-full bg-signal-safe hover:bg-signal-safe/90 transition-colors" />
          </div>
        </div>
      </div>
    </Card>
  );
};

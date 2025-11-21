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

      <div className="flex items-center justify-between gap-2">
        {metrics.map((metric, index) => (
          <div key={index} className="flex-1 p-1.5 bg-secondary/50 rounded-lg border border-border flex flex-col items-center justify-center">
            <div className="flex items-center gap-1 mb-0.5">
              <metric.icon className={`w-3 h-3 ${metric.color}`} />
              <span className="text-sm font-bold text-foreground">{metric.value}</span>
            </div>
            <div className="text-[8px] text-muted-foreground uppercase tracking-wide">{metric.label}</div>
          </div>
        ))}
      </div>


    </Card>
  );
};

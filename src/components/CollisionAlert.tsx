import { Card } from "./ui/card";
import { AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

interface CollisionAlertProps {
  isRisk: boolean;
  trainLabel: string;
}

export const CollisionAlert = ({ isRisk, trainLabel }: CollisionAlertProps) => {
  return (
    <Card className={cn(
      "p-1.5 border-2 transition-all duration-300",
      isRisk
        ? "bg-signal-stop/20 border-signal-stop animate-pulse"
        : "bg-card border-border"
    )}>
      <h3 className="text-[9px] font-medium text-muted-foreground tracking-wider mb-1">{trainLabel} - ALERT</h3>

      <div className={cn(
        "flex items-center gap-1.5 p-1.5 rounded-lg border-2 transition-all duration-300",
        isRisk
          ? "bg-signal-stop/30 border-signal-stop"
          : "bg-signal-safe/20 border-signal-safe"
      )}>
        <div className={cn(
          "w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0",
          isRisk ? "bg-signal-stop animate-pulse" : "bg-signal-safe"
        )}>
          <AlertTriangle className={cn(
            "w-3 h-3",
            isRisk ? "text-white animate-pulse" : "text-background"
          )} />
        </div>

        <div className="flex-1 min-w-0">
          <div className={cn(
            "text-xs font-bold tracking-wide",
            isRisk ? "text-signal-stop" : "text-signal-safe"
          )}>
            {isRisk ? "⚠️ RISK (<1km)" : "✓ ALL CLEAR"}
          </div>
          <div className="text-[9px] text-muted-foreground truncate">
            {isRisk
              ? "Emergency alert"
              : "Safe distance"}
          </div>
        </div>
      </div>
    </Card>
  );
};

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
      "p-4 border-2 transition-all duration-300",
      isRisk 
        ? "bg-signal-stop/20 border-signal-stop animate-pulse" 
        : "bg-card border-border"
    )}>
      <h3 className="text-xs font-medium text-muted-foreground tracking-wider mb-3">{trainLabel} - COLLISION ALERT</h3>
      
      <div className={cn(
        "flex items-center gap-3 p-3 rounded-lg border-2 transition-all duration-300",
        isRisk
          ? "bg-signal-stop/30 border-signal-stop"
          : "bg-signal-safe/20 border-signal-safe"
      )}>
        <div className={cn(
          "w-10 h-10 rounded-full flex items-center justify-center",
          isRisk ? "bg-signal-stop animate-pulse" : "bg-signal-safe"
        )}>
          <AlertTriangle className={cn(
            "w-6 h-6",
            isRisk ? "text-white animate-pulse" : "text-background"
          )} />
        </div>
        
        <div className="flex-1">
          <div className={cn(
            "text-lg font-bold tracking-wide",
            isRisk ? "text-signal-stop" : "text-signal-safe"
          )}>
            {isRisk ? "⚠️ COLLISION RISK" : "✓ ALL CLEAR"}
          </div>
          <div className="text-xs text-muted-foreground">
            {isRisk 
              ? "Approaching train in danger zone" 
              : "Safe distance maintained"}
          </div>
        </div>
      </div>
    </Card>
  );
};

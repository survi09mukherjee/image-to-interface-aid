import { Card } from "./ui/card";
import { Slider } from "./ui/slider";
import { Play, Pause } from "lucide-react";
import { Button } from "./ui/button";

interface Train {
  id: string;
  name: string;
  speed: number;
  color: string;
}

interface TrainControlsProps {
  trains: Train[];
  isAnimating: boolean;
  onSpeedChange: (trainId: string, speed: number) => void;
  onToggleAnimation: () => void;
}

export const TrainControls = ({ 
  trains, 
  isAnimating, 
  onSpeedChange, 
  onToggleAnimation 
}: TrainControlsProps) => {
  return (
    <Card className="p-6 bg-card border-border">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-muted-foreground tracking-wider">TRAIN CONTROLS</h3>
          <Button
            size="sm"
            variant={isAnimating ? "destructive" : "default"}
            onClick={onToggleAnimation}
            className="gap-2"
          >
            {isAnimating ? (
              <>
                <Pause className="w-4 h-4" />
                Pause
              </>
            ) : (
              <>
                <Play className="w-4 h-4" />
                Start
              </>
            )}
          </Button>
        </div>
        
        <div className="space-y-4">
          {trains.map((train) => (
            <div key={train.id} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: train.color }}
                  />
                  <span className="text-sm font-medium text-foreground">{train.name}</span>
                </div>
                <span className="text-sm text-muted-foreground">{train.speed} km/h</span>
              </div>
              <Slider
                value={[train.speed]}
                onValueChange={(value) => onSpeedChange(train.id, value[0])}
                max={120}
                min={0}
                step={5}
                className="cursor-pointer"
              />
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};

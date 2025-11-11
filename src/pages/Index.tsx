import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MovingTrack } from "@/components/MovingTrack";
import { SpeedDisplay } from "@/components/SpeedDisplay";
import { SignalStatus } from "@/components/SignalStatus";
import { AutoSignalResponse } from "@/components/AutoSignalResponse";
import { AnalyticsDashboard } from "@/components/AnalyticsDashboard";
import { CollisionAlert } from "@/components/CollisionAlert";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { toast } from "@/hooks/use-toast";

interface TrainState {
  id: string;
  label: string;
  color: string;
  position: number;
  speed: number;
  distance: number;
}

interface SignalState {
  left: "safe" | "caution" | "danger";
  right: "safe" | "caution" | "danger";
}

const Index = () => {
  const [showEmergencyDialog, setShowEmergencyDialog] = useState(false);
  const [selectedTrain, setSelectedTrain] = useState<string | null>(null);
  const [collisionRiskUp, setCollisionRiskUp] = useState(false);
  const [collisionRiskDown, setCollisionRiskDown] = useState(false);
  
  const [trains, setTrains] = useState<TrainState[]>([
    { id: "train-a", label: "UP TRAIN", color: "#00d4ff", position: 50, speed: 72, distance: 3 },
    { id: "train-b", label: "DOWN TRAIN", color: "#ff9500", position: 50, speed: 60, distance: 5 },
  ]);
  
  const [signals, setSignals] = useState<Record<string, SignalState>>({
    "track-up": { left: "safe", right: "safe" },
    "track-down": { left: "safe", right: "caution" },
  });

  const isCollisionRisk = collisionRiskUp || collisionRiskDown;


  const handleSignalClick = (trackId: string, side: "left" | "right") => {
    setSignals(prev => {
      const currentSignal = prev[trackId][side];
      const nextSignal = 
        currentSignal === "safe" ? "caution" :
        currentSignal === "caution" ? "danger" : "safe";
      
      return {
        ...prev,
        [trackId]: {
          ...prev[trackId],
          [side]: nextSignal
        }
      };
    });
    
    toast({
      title: "Signal Updated",
      description: `${trackId.toUpperCase()} ${side} signal changed`,
    });
  };

  const handleEmergencyStop = async (trainId: string) => {
    const train = trains.find(t => t.id === trainId);
    if (!train) return;

    // First notification: Emergency brake initialization
    toast({
      title: "🚨 EMERGENCY STOP ACTIVATED",
      description: `${train.label}: Emergency brake initialization...`,
      variant: "destructive",
    });

    // Second notification after 2 seconds: Slowing vehicle
    setTimeout(() => {
      toast({
        title: "⚠️ BRAKING IN PROGRESS",
        description: `${train.label}: Slowing down... Speed reducing rapidly.`,
        variant: "destructive",
      });
    }, 2000);

    // Final notification after 4 seconds: Vehicle stopped
    setTimeout(() => {
      toast({
        title: "✓ VEHICLE STOPPED",
        description: `${train.label} has been brought to a complete stop safely.`,
      });
      setSelectedTrain(null);
      setShowEmergencyDialog(false);
    }, 4000);
  };

  return (
    <div className="min-h-screen bg-background text-foreground p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-center tracking-wider mb-2">
          SMART RAIL-TRACKING AND ANTI-COLLISION SYSTEM
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-[1800px] mx-auto">
        {/* Main Track Visualization */}
        <div className="lg:col-span-2 space-y-4">
          {/* Railway Tracks */}
          <Card className="p-8 bg-card border-border">
            <div className="space-y-6">
              <MovingTrack
                name="UP TRACK"
                direction="forward"
                train={trains[0]}
                signalLeft={signals["track-up"].left}
                signalRight={signals["track-up"].right}
                onSignalClick={(side) => handleSignalClick("track-up", side)}
                onCollisionRisk={setCollisionRiskUp}
              />
              <MovingTrack
                name="DOWN TRACK"
                direction="backward"
                train={trains[1]}
                signalLeft={signals["track-down"].left}
                signalRight={signals["track-down"].right}
                onSignalClick={(side) => handleSignalClick("track-down", side)}
                onCollisionRisk={setCollisionRiskDown}
              />
            </div>
          </Card>

          {/* Auto Signal Response */}
          <AutoSignalResponse />
          
          {/* Analytics Dashboard */}
          <AnalyticsDashboard />
        </div>

        {/* Right Sidebar - Metrics */}
        <div className="space-y-4">
          <SpeedDisplay 
            tracks={[
              { direction: "UP", speed: trains[0].speed, distance: trains[0].distance },
              { direction: "DOWN", speed: trains[1].speed, distance: trains[1].distance },
            ]} 
          />
          <SignalStatus distance={2} />
          <CollisionAlert isRisk={collisionRiskUp} trainLabel="TRAIN UP" />
          <CollisionAlert isRisk={collisionRiskDown} trainLabel="TRAIN DOWN" />
          <Button
            onClick={() => setShowEmergencyDialog(true)}
            className="w-full h-16 text-lg font-bold bg-destructive hover:bg-destructive/90 text-destructive-foreground shadow-lg"
          >
            EMERGENCY STOP
          </Button>
        </div>
      </div>

      {/* Emergency Stop Dialog */}
      <AlertDialog open={showEmergencyDialog} onOpenChange={setShowEmergencyDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Select Train to Stop</AlertDialogTitle>
            <AlertDialogDescription>
              Choose which train should execute emergency stop procedure.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="space-y-3 my-4">
            {trains.map((train) => (
              <Button
                key={train.id}
                onClick={() => {
                  setSelectedTrain(train.id);
                  handleEmergencyStop(train.id);
                }}
                className="w-full h-12 text-lg font-semibold"
                style={{ backgroundColor: train.color }}
              >
                {train.label} - {train.speed} km/h
              </Button>
            ))}
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Index;

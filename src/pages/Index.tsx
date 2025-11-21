import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MovingTrack } from "@/components/MovingTrack";
import { SpeedDisplay } from "@/components/SpeedDisplay";
import { SignalStatus } from "@/components/SignalStatus";

import { AnalyticsDashboard } from "@/components/AnalyticsDashboard";
import { CollisionAlert } from "@/components/CollisionAlert";
import { WeatherTime } from "@/components/WeatherTime";
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
  
  // Train data - THIS WILL BE UPDATED FROM HARDWARE CONNECTION
  // Distance is in kilometers (km)
  // When hardware is connected, update these values with real-time data:
  // - position: train position on track (0-100%)
  // - speed: train speed in km/h
  // - distance: distance between trains in kilometers
  const [trains, setTrains] = useState<TrainState[]>([
    { id: "train-a", label: "UP TRAIN (Locopilot)", color: "#00d4ff", position: 30, speed: 0, distance: 5 },
    { id: "train-b", label: "DOWN TRAIN", color: "#ff9500", position: 70, speed: 0, distance: 5 },
  ]);

  // Calculate if trains are approaching or moving away
  // When hardware updates positions, this will show real-time status
  const getTrainStatus = (trainA: TrainState, trainB: TrainState): "Approaching" | "Moving Away" => {
    // If distance is decreasing, trains are approaching
    // Hardware will update this based on real-time position changes
    return trainA.distance <= 3 ? "Approaching" : "Moving Away";
  };
  
  const [signals, setSignals] = useState<Record<string, SignalState>>({
    "track-up": { left: "safe", right: "safe" },
    "track-down": { left: "safe", right: "safe" },
  });

  // COLLISION DETECTION LOGIC
  // Alert triggers when trains are within 1 km of each other
  // Hardware should update the 'distance' field in trains array
  const COLLISION_THRESHOLD_KM = 1;
  const collisionRiskUp = trains[0].distance <= COLLISION_THRESHOLD_KM;
  const collisionRiskDown = trains[1].distance <= COLLISION_THRESHOLD_KM;
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
    <div className="h-screen w-screen bg-background text-foreground overflow-hidden flex flex-col p-3">
      {/* Header */}
      <div className="mb-3 flex-shrink-0">
        <h1 className="text-xl font-bold text-center tracking-wider">
          SMART RAIL-TRACKING AND ANTI-COLLISION SYSTEM
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 flex-1 overflow-hidden min-h-0">
        {/* Main Track Visualization */}
        <div className="lg:col-span-2 flex flex-col gap-2 overflow-hidden min-h-0">
          {/* Railway Tracks */}
          <Card className="p-4 bg-card border-border flex-shrink-0">
            <div className="space-y-3">
              <MovingTrack
                name="UP TRACK"
                direction="forward"
                mainTrain={trains[0]}
                backTrain={{ ...trains[0], position: Math.max(0, trains[0].position - 15), label: "UP-BACK" }}
                frontTrain={{ ...trains[0], position: Math.min(100, trains[0].position + 15), label: "UP-FRONT" }}
                status={getTrainStatus(trains[0], trains[1])}
                signalLeft={signals["track-up"].left}
                signalRight={signals["track-up"].right}
                onSignalClick={(side) => handleSignalClick("track-up", side)}
              />
              <MovingTrack
                name="DOWN TRACK"
                direction="backward"
                mainTrain={trains[1]}
                backTrain={{ ...trains[1], position: Math.min(100, trains[1].position + 15), label: "DOWN-BACK" }}
                frontTrain={{ ...trains[1], position: Math.max(0, trains[1].position - 15), label: "DOWN-FRONT" }}
                status={getTrainStatus(trains[1], trains[0])}
                signalLeft={signals["track-down"].left}
                signalRight={signals["track-down"].right}
                onSignalClick={(side) => handleSignalClick("track-down", side)}
              />
            </div>
          </Card>

          {/* Analytics Dashboard */}
          <div className="flex-1 overflow-hidden min-h-0">
            <AnalyticsDashboard />
          </div>
        </div>

        {/* Right Sidebar - Metrics */}
        <div className="flex flex-col gap-1.5 overflow-hidden">
          <SpeedDisplay 
            tracks={[
              { direction: "UP", speed: trains[0].speed, distance: trains[0].distance },
              { direction: "DOWN", speed: trains[1].speed, distance: trains[1].distance },
            ]} 
          />
          <WeatherTime />
          <SignalStatus distance={trains[0].distance < trains[1].distance ? trains[0].distance : trains[1].distance} />
          <CollisionAlert isRisk={collisionRiskUp} trainLabel="UP TRAIN (LOCOPILOT)" />
          <CollisionAlert isRisk={collisionRiskDown} trainLabel="DOWN TRAIN" />
          <Button
            onClick={() => setShowEmergencyDialog(true)}
            className="w-full h-9 text-sm font-bold bg-destructive hover:bg-destructive/90 text-destructive-foreground shadow-lg flex-shrink-0"
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

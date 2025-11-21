import { useState, useEffect } from "react";
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
import { stations } from "@/data/stations";

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

interface TrainDetails {
  id: string;
  name: string;
  number: string;
  status: string;
  eta: string;
}

const Index = () => {
  const [showEmergencyDialog, setShowEmergencyDialog] = useState(false);
  const [selectedTrain, setSelectedTrain] = useState<string | null>(null);
  const [previousTrain, setPreviousTrain] = useState<TrainDetails | null>(null);
  const [nextTrain, setNextTrain] = useState<TrainDetails | null>(null);

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

  // Mock Hardware Input Simulation
  // In a real app, this would be a WebSocket connection or API polling
  const [currentGPS, setCurrentGPS] = useState({
    lat: stations[0].coordinates.lat,
    lng: stations[0].coordinates.lng
  });

  // Polling for live backend data
  useEffect(() => {
    const API_URL = import.meta.env.VITE_BACKEND_API || "http://localhost:8080";

    const fetchLiveData = async () => {
      try {
        const response = await fetch(`${API_URL}/live`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();

        // Update GPS
        if (data.currentGPS) {
          setCurrentGPS({ lat: data.currentGPS.lat, lng: data.currentGPS.lng });
        }

        // Update train info
        if (data.currentGPS && data.nearestStation) {
          setTrains(prev => prev.map(train => ({
            ...train,
            latitude: data.currentGPS.lat,
            longitude: data.currentGPS.lng,
            stationName: data.nearestStation.name,
            distance: data.nearestStation.distance
          })));
        }

        // Update signals
        if (data.signals) {
          setSignals(data.signals);
        }

        // Update previous + next train
        if (data.previousTrain) setPreviousTrain(data.previousTrain);
        if (data.nextTrain) setNextTrain(data.nextTrain);

      } catch (error) {
        console.error("Error fetching live data:", error);
      }
    };

    // Initial fetch
    fetchLiveData();

    const interval = setInterval(fetchLiveData, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Create WebSocket connection
    const wsUrl = import.meta.env.VITE_BACKEND_WS || "ws://localhost:8080";
    const ws = new WebSocket(wsUrl);

    // When WebSocket opens
    ws.onopen = () => {
      console.log("WebSocket connected 👍");
    };

    // When message received from backend
    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);

        // Update current GPS position (for map)
        if (data.lat && data.lng) {
          setCurrentGPS({
            lat: data.lat,
            lng: data.lng,
          });

          // Update train location + nearest station info
          setTrains(prev =>
            prev.map((train) => ({
              ...train,
              latitude: data.lat,
              longitude: data.lng,
              stationName: data.nearestStation?.name || "Unknown",
              distance: data.nearestStation?.distance || 0,
            }))
          );
        }

        // Handle Signal Updates
        if (data.type === 'SIGNAL_UPDATE' && data.signals) {
          setSignals(data.signals);
        }

        // Update previous + next train
        if (data.previousTrain) setPreviousTrain(data.previousTrain);
        if (data.nextTrain) setNextTrain(data.nextTrain);

        // Handle Emergency Stop
        if (data.type === 'EMERGENCY_STOP') {
          toast({
            title: "🚨 EMERGENCY STOP RECEIVED",
            description: `Train ${data.trainId} stopped remotely.`,
            variant: "destructive",
          });
        }

        console.log("Received:", data);
      } catch (err) {
        console.error("WebSocket parse error:", err);
      }
    };

    // When WebSocket closes
    ws.onclose = () => {
      console.log("WebSocket disconnected ❌");
    };

    // On error
    ws.onerror = (err) => {
      console.error("WebSocket error:", err);
    };

    // Cleanup on unmount
    return () => {
      ws.close();
    };
  }, []);


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
  const collisionRiskUp = trains[0].distance <= COLLISION_THRESHOLD_KM;
  const collisionRiskDown = trains[1].distance <= COLLISION_THRESHOLD_KM;
  const isCollisionRisk = collisionRiskUp || collisionRiskDown;

  // Dashboard Metrics Calculation
  const avgSpeed = Math.round(trains.reduce((acc, curr) => acc + curr.speed, 0) / trains.length) || 0;
  const warningCount = isCollisionRisk ? 1 : 0;
  const systemStatus = isCollisionRisk ? "Warning" : "Normal";


  const handleSignalClick = (trackId: string, side: "left" | "right") => {
    const apiUrl = import.meta.env.VITE_BACKEND_API || "http://localhost:8080";

    setSignals(prev => {
      const currentSignal = prev[trackId][side];
      const nextSignal =
        currentSignal === "safe" ? "caution" :
          currentSignal === "caution" ? "danger" : "safe";

      // API Call
      fetch(`${apiUrl}/update-signal`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ trackId, [side]: nextSignal })
      }).catch(err => console.error("Failed to update signal:", err));

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

    const apiUrl = import.meta.env.VITE_BACKEND_API || "http://localhost:8080";
    fetch(`${apiUrl}/emergency-stop`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ trainId })
    }).catch(err => console.error("Failed to trigger emergency stop:", err));

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
    <div className="h-screen w-screen bg-background text-foreground overflow-hidden flex flex-col p-2">
      {/* Header */}
      <div className="mb-1 flex-shrink-0">
        <h1 className="text-xl font-bold text-center tracking-wider">
          SMART RAIL-TRACKING AND ANTI-COLLISION SYSTEM
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-2 flex-1 overflow-hidden min-h-0">
        {/* Main Track Visualization */}
        <div className="lg:col-span-2 flex flex-col gap-1 overflow-hidden min-h-0">
          {/* Railway Tracks */}
          <Card className="p-2 bg-card border-border flex-shrink-0 overflow-hidden flex flex-col">
            <div className="space-y-3 flex-1">
              <MovingTrack
                name="MAIN TRACK"
                direction="forward"
                mainTrain={{
                  ...trains[0],
                  position: 50,
                  latitude: currentGPS.lat,
                  longitude: currentGPS.lng,
                  stationName: stations[0].name,
                  direction: "UP"
                }} // Center the main train
                nearbyTrains={[
                  // Front trains (ahead) - DEPARTING
                  {
                    ...trains[0],
                    id: "front-1",
                    label: "DEPARTING",
                    position: 60,
                    color: "#22c55e",
                    latitude: stations[1].coordinates.lat,
                    longitude: stations[1].coordinates.lng,
                    stationName: stations[1].name,
                    direction: "DOWN"
                  }, // +1km (10%)

                  // Back trains (behind) - APPROACHING
                  {
                    ...trains[0],
                    id: "back-2",
                    label: "APPROACHING",
                    position: 10,
                    color: "#ef4444",
                    latitude: 10.950, // Hypothetical further back
                    longitude: 76.900,
                    stationName: "Approaching PTJ",
                    direction: "UP"
                  },   // -5km (40%)
                ]}
                status={getTrainStatus(trains[0], trains[1])}
                signalLeft={signals["track-up"].left}
                signalRight={signals["track-up"].right}
                onSignalClick={(side) => handleSignalClick("track-up", side)}
              />
            </div>
          </Card>

          {/* Analytics Dashboard */}
          <div className="flex-shrink-0 overflow-hidden min-h-0">
            <AnalyticsDashboard
              activeTrains={3}
              avgSpeed={avgSpeed}
              warningCount={warningCount}
              systemStatus={systemStatus}
            />
            <div className="mt-1 mb-1">
              <SignalStatus
                distance={trains[0].distance < trains[1].distance ? trains[0].distance : trains[1].distance}
                status={signals["track-up"].left}
              />
            </div>
            <Button
              onClick={() => setShowEmergencyDialog(true)}
              className="w-full h-9 text-sm font-bold bg-destructive hover:bg-destructive/90 text-destructive-foreground shadow-lg flex-shrink-0"
            >
              EMERGENCY STOP
            </Button>
          </div>
        </div>

        {/* Right Sidebar - Metrics */}
        <div className="flex flex-col gap-1.5 overflow-hidden">
          <SpeedDisplay
            tracks={[
              { direction: "UP", speed: 45, distance: 5 }, // Approaching
              { direction: "DOWN", speed: 60, distance: 1 }, // Departing
            ]}
          />
          <WeatherTime locationName={stations[0].name} />
          <CollisionAlert isRisk={collisionRiskUp} trainLabel="MAIN TRAIN" />

          {/* Previous & Next Train Details */}
          <Card className="p-1.5 bg-card border-border space-y-1.5">
            <div className="grid grid-cols-2 gap-1.5">
              <div className="bg-muted/50 p-1.5 rounded-md">
                <p className="text-[10px] text-muted-foreground mb-0.5">Previous Train</p>
                {previousTrain ? (
                  <>
                    <p className="font-bold text-xs truncate">{previousTrain.name}</p>
                    <p className="text-[10px] font-mono leading-none opacity-80">{previousTrain.number}</p>
                    <p className="text-[10px] text-green-500 font-medium mt-0.5">{previousTrain.status}</p>
                  </>
                ) : (
                  <p className="text-[10px] italic">Loading...</p>
                )}
              </div>
              <div className="bg-muted/50 p-1.5 rounded-md">
                <p className="text-[10px] text-muted-foreground mb-0.5">Next Train</p>
                {nextTrain ? (
                  <>
                    <p className="font-bold text-xs truncate">{nextTrain.name}</p>
                    <p className="text-[10px] font-mono leading-none opacity-80">{nextTrain.number}</p>
                    <p className="text-[10px] text-blue-500 font-medium mt-0.5">ETA: {nextTrain.eta}</p>
                  </>
                ) : (
                  <p className="text-[10px] italic">Loading...</p>
                )}
              </div>
            </div>
          </Card>
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
            {trains.slice(0, 1).map((train) => (
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
      </AlertDialog >
    </div >
  );
};

export default Index;

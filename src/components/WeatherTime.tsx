import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Cloud, Sun, CloudRain, MapPin, Clock } from "lucide-react";
import { useState, useEffect } from "react";

interface WeatherTimeProps {
  locationName?: string;
}

export const WeatherTime = ({ locationName = "Coimbatore Junction" }: WeatherTimeProps) => {
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const weather = "Partly Cloudy" as const;
  const temperature = 28;

  const getWeatherIcon = (weatherType: string) => {
    if (weatherType === "Sunny") {
      return <Sun className="w-8 h-8 text-accent" />;
    } else if (weatherType === "Rainy") {
      return <CloudRain className="w-8 h-8 text-primary" />;
    } else {
      return <Cloud className="w-8 h-8 text-muted-foreground" />;
    }
  };

  return (
    <Card className="bg-card border-border flex-shrink-0">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold flex items-center gap-2">
          <MapPin className="w-4 h-4 text-primary" />
          LOCATION & WEATHER
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Location */}
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">Location</span>
          <span className="text-sm font-medium">{locationName}</span>
        </div>

        {/* Weather */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {getWeatherIcon(weather)}
            <div>
              <div className="text-sm font-medium">{weather}</div>
              <div className="text-xs text-muted-foreground">{temperature}°C</div>
            </div>
          </div>
        </div>

        {/* Time */}
        <div className="flex items-center justify-between pt-2 border-t border-border">
          <span className="text-xs text-muted-foreground flex items-center gap-1">
            <Clock className="w-3 h-3" />
            Current Time
          </span>
          <span className="text-sm font-medium font-mono">
            {currentTime.toLocaleTimeString('en-IN', {
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit',
              hour12: true
            })}
          </span>
        </div>
      </CardContent>
    </Card>
  );
};

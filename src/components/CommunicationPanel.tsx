import { Card } from "./ui/card";

interface TrainDistance {
  trainId: number;
  distance: string;
}

interface CommunicationPanelProps {
  trains: TrainDistance[];
}

export const CommunicationPanel = ({ trains }: CommunicationPanelProps) => {
  return (
    <Card className="p-6 bg-card border-border">
      <h3 className="text-sm font-medium text-muted-foreground tracking-wider mb-4">COMMUNICATION</h3>
      <div className="space-y-3">
        {trains.map((train) => (
          <div key={train.trainId} className="flex items-center justify-between py-2 px-3 bg-secondary/50 rounded">
            <span className="text-foreground font-semibold">TRAIN {train.trainId}</span>
            <span className="text-muted-foreground">{train.distance}</span>
          </div>
        ))}
      </div>
    </Card>
  );
};

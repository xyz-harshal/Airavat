import { Brain, Pills, Info } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function SimulationHeader() {
  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Brain className="h-8 w-8 text-primary" />
            Brain Digital Twin Simulation
          </h1>
          <p className="text-muted-foreground">
            Simulate the effects of medications and surgical interventions on brain activity patterns
          </p>
        </div>
      </div>
      
      <Alert variant="default" className="bg-primary/5 border-primary/20">
        <Info className="h-4 w-4" />
        <AlertTitle>About Digital Twin Simulation</AlertTitle>
        <AlertDescription className="mt-1">
          The Brain Digital Twin technology creates a personalized computational model of a patient's brain based on their EEG data.
          These simulations predict potential outcomes of interventions with 85-90% accuracy, but should always be used as a 
          decision support tool in conjunction with clinical expertise.
        </AlertDescription>
      </Alert>
    </div>
  );
}

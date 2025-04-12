"use client";

import { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Pill, Brain, AlertCircle, Info } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

// Sample medication data
const medications = [
  {
    id: "med-001",
    name: "Levetiracetam",
    category: "Anti-epileptic",
    targetConditions: ["Epilepsy"],
    description: "Binds to synaptic vesicle protein SV2A, inhibiting neurotransmitter release.",
    doseRange: { min: 500, max: 3000, step: 250, unit: "mg" },
    frequency: ["Once daily", "Twice daily", "Three times daily"],
    effects: {
      seizureReduction: 0.65,
      cognitiveImpact: -0.15,
      sleepQuality: -0.2
    }
  },
  {
    id: "med-002",
    name: "Lamotrigine",
    category: "Anti-epileptic/Mood stabilizer",
    targetConditions: ["Epilepsy", "Depression"],
    description: "Blocks voltage-sensitive sodium channels and inhibits release of glutamate.",
    doseRange: { min: 25, max: 400, step: 25, unit: "mg" },
    frequency: ["Once daily", "Twice daily"],
    effects: {
      seizureReduction: 0.55,
      moodStabilization: 0.4,
      cognitiveImpact: -0.1
    }
  },
  {
    id: "med-003",
    name: "Sertraline",
    category: "SSRI Antidepressant",
    targetConditions: ["Depression", "Cognitive Stress"],
    description: "Selectively inhibits serotonin reuptake in the CNS.",
    doseRange: { min: 25, max: 200, step: 25, unit: "mg" },
    frequency: ["Once daily"],
    effects: {
      moodImprovement: 0.5,
      anxietyReduction: 0.45,
      cognitiveImpact: 0.1,
      sleep: -0.2
    }
  },
  {
    id: "med-004",
    name: "Amantadine",
    category: "Anti-Parkinsonian",
    targetConditions: ["Parkinson's"],
    description: "Increases dopamine release and blocks dopamine reuptake.",
    doseRange: { min: 100, max: 400, step: 100, unit: "mg" },
    frequency: ["Once daily", "Twice daily"],
    effects: {
      motorImprovement: 0.4,
      tremorReduction: 0.35,
      cognitiveImpact: 0.1
    }
  },
  {
    id: "med-005",
    name: "Methylphenidate",
    category: "CNS Stimulant",
    targetConditions: ["Cognitive Stress", "ADHD"],
    description: "Blocks dopamine and norepinephrine reuptake transporters.",
    doseRange: { min: 5, max: 60, step: 5, unit: "mg" },
    frequency: ["Once daily", "Twice daily", "Three times daily"],
    effects: {
      attentionImprovement: 0.6,
      executiveFunctionImprovement: 0.5,
      anxietyIncrease: 0.3
    }
  }
];

export default function MedicationSimulation({ patientId, onStartSimulation, onSimulationComplete }) {
  const [selectedMedication, setSelectedMedication] = useState(null);
  const [dosage, setDosage] = useState(0);
  const [frequency, setFrequency] = useState("");
  const [simulating, setSimulating] = useState(false);
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);
  const [combinationTherapy, setCombinationTherapy] = useState(false);
  const [secondaryMedication, setSecondaryMedication] = useState(null);
  const [secondaryDosage, setSecondaryDosage] = useState(0);

  // Handle medication selection
  const handleMedicationSelect = (medicationId) => {
    const selected = medications.find(med => med.id === medicationId);
    setSelectedMedication(selected);
    setDosage(selected?.doseRange.min || 0);
    setFrequency(selected?.frequency[0] || "");
  };

  // Handle secondary medication selection
  const handleSecondaryMedicationSelect = (medicationId) => {
    const selected = medications.find(med => med.id === medicationId);
    setSecondaryMedication(selected);
    setSecondaryDosage(selected?.doseRange.min || 0);
  };

  // Run simulation
  const runSimulation = async () => {
    if (!selectedMedication) return;
    
    setSimulating(true);
    onStartSimulation();
    
    try {
      // In a real app, this would call an API to run the simulation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Generate results based on medication properties and dosage
      const baseEffectiveness = selectedMedication.effects;
      
      // Calculate dosage impact (higher dosages have stronger effects)
      const dosageRatio = (dosage - selectedMedication.doseRange.min) / 
        (selectedMedication.doseRange.max - selectedMedication.doseRange.min);
      
      // Calculate frequency impact
      const frequencyIndex = selectedMedication.frequency.indexOf(frequency);
      const frequencyFactor = (frequencyIndex + 1) / selectedMedication.frequency.length;
      
      // Calculate combination effects if applicable
      let combinationEffects = {};
      if (combinationTherapy && secondaryMedication) {
        // Secondary medication adds its effects at reduced strength
        const secondaryEffectiveness = secondaryMedication.effects;
        
        Object.entries(secondaryEffectiveness).forEach(([key, value]) => {
          combinationEffects[key] = value * 0.6 * 
            (secondaryDosage - secondaryMedication.doseRange.min) / 
            (secondaryMedication.doseRange.max - secondaryMedication.doseRange.min);
        });
      }
      
      // Generate simulated response based on these factors
      const simulatedResults = {
        patientId,
        medication: {
          primary: {
            name: selectedMedication.name,
            dosage: `${dosage}${selectedMedication.doseRange.unit}`,
            frequency
          },
          secondary: combinationTherapy && secondaryMedication ? {
            name: secondaryMedication.name,
            dosage: `${secondaryDosage}${secondaryMedication.doseRange.unit}`
          } : null
        },
        brainResponse: {
          effectivenessScore: Math.min(0.95, 0.3 + (dosageRatio * 0.4) + (frequencyFactor * 0.2)),
          sideEffectRisk: 0.2 + (dosageRatio * 0.3),
          timeToEffect: combinationTherapy ? "2-3 weeks" : "3-4 weeks",
          predictedAdherence: combinationTherapy ? "Moderate" : "High"
        },
        eegChanges: generateEEGChanges(selectedMedication, dosageRatio, combinationEffects),
        clinicalOutcomes: generateClinicalOutcomes(selectedMedication, dosageRatio, 
          frequencyFactor, combinationEffects),
        recommendations: generateRecommendations(selectedMedication, dosageRatio)
      };
      
      // Return simulation results
      onSimulationComplete(simulatedResults);
    } catch (error) {
      console.error("Simulation error:", error);
    } finally {
      setSimulating(false);
    }
  };

  // Generate EEG changes based on medication effect
  const generateEEGChanges = (medication, dosageRatio, combinationEffects) => {
    const changes = {};
    
    // Different medications affect different brain wave patterns
    if (medication.category.includes("Anti-epileptic")) {
      changes.deltaWaves = { change: "decrease", magnitude: 10 + (dosageRatio * 15) };
      changes.thetaWaves = { change: "decrease", magnitude: 5 + (dosageRatio * 10) };
    }
    
    if (medication.category.includes("Antidepressant")) {
      changes.alphaWaves = { change: "increase", magnitude: 5 + (dosageRatio * 15) };
      changes.betaWaves = { change: "increase", magnitude: 8 + (dosageRatio * 10) };
    }
    
    if (medication.category.includes("Anti-Parkinsonian")) {
      changes.betaWaves = { change: "decrease", magnitude: 10 + (dosageRatio * 20) };
    }
    
    if (medication.category.includes("CNS Stimulant")) {
      changes.betaWaves = { change: "increase", magnitude: 15 + (dosageRatio * 25) };
      changes.gammaWaves = { change: "increase", magnitude: 10 + (dosageRatio * 15) };
    }
    
    // Add combination effects
    if (Object.keys(combinationEffects).length > 0) {
      // Modify changes based on secondary medication
      Object.keys(changes).forEach(wave => {
        changes[wave].magnitude *= 1.2; // Enhanced effect
      });
    }
    
    return changes;
  };

  // Generate clinical outcomes based on medication effect
  const generateClinicalOutcomes = (medication, dosageRatio, frequencyFactor, combinationEffects) => {
    const outcomes = [];
    
    // Base effects from primary medication
    Object.entries(medication.effects).forEach(([effect, value]) => {
      let effectName = effect.replace(/([A-Z])/g, ' $1').toLowerCase();
      effectName = effectName.charAt(0).toUpperCase() + effectName.slice(1);
      
      const magnitude = Math.round((value * dosageRatio * frequencyFactor) * 100);
      
      outcomes.push({
        outcome: effectName,
        probability: Math.min(0.95, value * 0.5 + (dosageRatio * 0.3) + (frequencyFactor * 0.2)),
        magnitude: `${magnitude}%`,
        timeFrame: "2-4 weeks"
      });
    });
    
    // Add side effects based on medication
    if (medication.category.includes("Anti-epileptic")) {
      outcomes.push({
        outcome: "Drowsiness",
        probability: 0.2 + (dosageRatio * 0.4),
        magnitude: "Mild to Moderate",
        timeFrame: "First 2 weeks"
      });
    }
    
    if (medication.category.includes("Antidepressant")) {
      outcomes.push({
        outcome: "Initial anxiety",
        probability: 0.3 + (dosageRatio * 0.2),
        magnitude: "Mild",
        timeFrame: "First 1-2 weeks"
      });
    }
    
    // Add combination effects
    if (Object.keys(combinationEffects).length > 0) {
      outcomes.push({
        outcome: "Drug Interaction Effects",
        probability: 0.2 + (dosageRatio * 0.2),
        magnitude: "Mild",
        timeFrame: "Ongoing"
      });
    }
    
    return outcomes;
  };

  // Generate recommendations
  const generateRecommendations = (medication, dosageRatio) => {
    const recommendations = [
      "Monitor EEG activity after 4 weeks to assess response",
      `Follow up clinical assessment in ${dosageRatio > 0.7 ? "2" : "4"} weeks`
    ];
    
    if (dosageRatio > 0.8) {
      recommendations.push("Consider dose reduction if side effects occur");
    }
    
    if (medication.category.includes("Anti-epileptic")) {
      recommendations.push("Monitor for breakthrough seizures during initial titration");
    }
    
    if (medication.category.includes("Antidepressant")) {
      recommendations.push("Monitor for mood changes in the first 2 weeks of treatment");
    }
    
    return recommendations;
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-medium flex items-center gap-2">
            <Pill className="h-5 w-5 text-primary" />
            Medication Simulation
          </CardTitle>
        </div>
        <CardDescription>
          Predict how medications will affect brain activity and clinical outcomes
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="selection">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="selection">Medication Selection</TabsTrigger>
            <TabsTrigger value="about">About This Tool</TabsTrigger>
          </TabsList>
          
          <TabsContent value="selection" className="space-y-4">
            <div className="grid gap-4">
              <div className="space-y-2">
                <Label htmlFor="medication">Select Medication</Label>
                <Select 
                  onValueChange={handleMedicationSelect}
                  disabled={simulating}
                >
                  <SelectTrigger id="medication">
                    <SelectValue placeholder="Choose a medication" />
                  </SelectTrigger>
                  <SelectContent>
                    {medications.map(med => (
                      <SelectItem key={med.id} value={med.id}>
                        {med.name} ({med.category})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {selectedMedication && (
                <>
                  <div className="bg-muted/20 p-3 rounded-md text-sm">
                    <p className="font-medium">{selectedMedication.name}</p>
                    <p className="text-muted-foreground text-xs mt-1">
                      {selectedMedication.description}
                    </p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {selectedMedication.targetConditions.map(condition => (
                        <span 
                          key={condition} 
                          className="bg-primary/10 text-primary text-xs py-0.5 px-2 rounded-full"
                        >
                          {condition}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <Label htmlFor="dosage">Dosage ({selectedMedication.doseRange.unit})</Label>
                      <span className="text-sm font-medium">{dosage}</span>
                    </div>
                    <Slider
                      id="dosage"
                      min={selectedMedication.doseRange.min}
                      max={selectedMedication.doseRange.max}
                      step={selectedMedication.doseRange.step}
                      value={[dosage]}
                      onValueChange={(values) => setDosage(values[0])}
                      disabled={simulating}
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Min: {selectedMedication.doseRange.min}</span>
                      <span>Max: {selectedMedication.doseRange.max}</span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="frequency">Frequency</Label>
                    <Select 
                      value={frequency} 
                      onValueChange={setFrequency}
                      disabled={simulating}
                    >
                      <SelectTrigger id="frequency">
                        <SelectValue placeholder="Select frequency" />
                      </SelectTrigger>
                      <SelectContent>
                        {selectedMedication.frequency.map(freq => (
                          <SelectItem key={freq} value={freq}>
                            {freq}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center space-x-2">
                      <Switch 
                        id="advanced"
                        checked={showAdvancedOptions}
                        onCheckedChange={setShowAdvancedOptions}
                        disabled={simulating}
                      />
                      <Label htmlFor="advanced">Advanced Options</Label>
                    </div>
                  </div>
                  
                  {showAdvancedOptions && (
                    <div className="space-y-4 bg-muted/20 p-4 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <Switch 
                          id="combination"
                          checked={combinationTherapy}
                          onCheckedChange={setCombinationTherapy}
                          disabled={simulating}
                        />
                        <Label htmlFor="combination">Combination Therapy</Label>
                      </div>
                      
                      {combinationTherapy && (
                        <>
                          <div className="space-y-2">
                            <Label htmlFor="secondaryMed">Secondary Medication</Label>
                            <Select 
                              onValueChange={handleSecondaryMedicationSelect}
                              disabled={simulating}
                            >
                              <SelectTrigger id="secondaryMed">
                                <SelectValue placeholder="Choose a medication" />
                              </SelectTrigger>
                              <SelectContent>
                                {medications
                                  .filter(med => med.id !== selectedMedication?.id)
                                  .map(med => (
                                    <SelectItem key={med.id} value={med.id}>
                                      {med.name} ({med.category})
                                    </SelectItem>
                                  ))
                                }
                              </SelectContent>
                            </Select>
                          </div>
                          
                          {secondaryMedication && (
                            <div className="space-y-2">
                              <div className="flex justify-between items-center">
                                <Label htmlFor="secondaryDosage">
                                  {secondaryMedication.name} Dosage ({secondaryMedication.doseRange.unit})
                                </Label>
                                <span className="text-sm font-medium">{secondaryDosage}</span>
                              </div>
                              <Slider
                                id="secondaryDosage"
                                min={secondaryMedication.doseRange.min}
                                max={secondaryMedication.doseRange.max}
                                step={secondaryMedication.doseRange.step}
                                value={[secondaryDosage]}
                                onValueChange={(values) => setSecondaryDosage(values[0])}
                                disabled={simulating}
                              />
                            </div>
                          )}
                          
                          {selectedMedication && secondaryMedication && (
                            <Alert variant="outline" className="bg-amber-50 border-amber-200">
                              <AlertCircle className="h-4 w-4 text-amber-600" />
                              <AlertDescription className="text-amber-800 text-xs">
                                Note: Combining {selectedMedication.name} with {secondaryMedication.name} may 
                                increase both therapeutic effects and side effects.
                              </AlertDescription>
                            </Alert>
                          )}
                        </>
                      )}
                    </div>
                  )}
                </>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="about">
            <div className="space-y-4 text-sm">
              <div className="flex items-start gap-3">
                <div className="mt-1">
                  <Brain className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">How Medication Simulation Works</h3>
                  <p className="text-muted-foreground mt-1">
                    This tool uses a personalized Digital Twin of the Brain derived from the patient's EEG data 
                    to simulate how different medications and dosages may affect their brain activity patterns.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="mt-1">
                  <Info className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">Prediction Accuracy</h3>
                  <p className="text-muted-foreground mt-1">
                    Predictions are based on pharmacodynamic models combined with the patient's unique 
                    brain activity patterns. The system has been validated with 85% accuracy for 
                    predicting general medication response.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="mt-1">
                  <AlertCircle className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">Clinical Use Guide</h3>
                  <p className="text-muted-foreground mt-1">
                    Simulation results should be used as a clinical decision support tool only, 
                    not as a replacement for clinical judgment. Always consider the patient's full 
                    medical history and other factors when making treatment decisions.
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter>
        <Button 
          className="w-full" 
          onClick={runSimulation}
          disabled={!selectedMedication || !frequency || simulating}
        >
          {simulating ? (
            <>
              <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
              Simulating Response
            </>
          ) : (
            "Run Simulation"
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}

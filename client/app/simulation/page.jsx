"use client";

import { useState } from "react";
import DashboardLayout from "@/app/components/dashboard/layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PatientSelector from "./components/PatientSelector";
import SimulationHeader from "./components/SimulationHeader";
import MedicationSimulation from "./components/MedicationSimulation";
import SurgicalSimulation from "./components/SurgicalSimulation";
import EEGDataViewer from "./components/EEGDataViewer";
import SimulationResults from "./components/SimulationResults";

export default function SimulationPage() {
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [simulationResults, setSimulationResults] = useState(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationType, setSimulationType] = useState("medication");
  
  // Handle patient selection
  const handlePatientSelect = (patient) => {
    setSelectedPatient(patient);
    setSimulationResults(null); // Reset results when patient changes
  };
  
  // Handle simulation results
  const handleSimulationResults = (results) => {
    setSimulationResults(results);
    setIsSimulating(false);
  };
  
  return (
    <DashboardLayout>
      <div className="container mx-auto py-6 space-y-6">
        <SimulationHeader />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left sidebar - Patient selection */}
          <div className="lg:col-span-1 space-y-6">
            <PatientSelector onSelectPatient={handlePatientSelect} />
          </div>
          
          {/* Main content - Simulation interface */}
          <div className="lg:col-span-2 space-y-6">
            {selectedPatient ? (
              <>
                {/* Display selected patient's EEG data */}
                <EEGDataViewer patientId={selectedPatient.id} />
                
                {/* Simulation tabs */}
                <Tabs 
                  defaultValue="medication" 
                  value={simulationType}
                  onValueChange={(value) => {
                    setSimulationType(value);
                    setSimulationResults(null);
                  }}
                >
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="medication">Medication Simulation</TabsTrigger>
                    <TabsTrigger value="surgical">Surgical Simulation</TabsTrigger>
                  </TabsList>
                  
                  {/* Medication simulation interface */}
                  <TabsContent value="medication">
                    <MedicationSimulation 
                      patientId={selectedPatient.id}
                      onStartSimulation={() => setIsSimulating(true)}
                      onSimulationComplete={handleSimulationResults}
                    />
                  </TabsContent>
                  
                  {/* Surgical simulation interface */}
                  <TabsContent value="surgical">
                    <SurgicalSimulation 
                      patientId={selectedPatient.id}
                      onStartSimulation={() => setIsSimulating(true)}
                      onSimulationComplete={handleSimulationResults}
                    />
                  </TabsContent>
                </Tabs>
                
                {/* Results area */}
                {simulationResults && (
                  <SimulationResults 
                    results={simulationResults}
                    type={simulationType}
                  />
                )}
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-80 bg-muted/20 rounded-lg border-2 border-dashed p-6 text-center">
                <div className="mb-4">
                  <div className="w-20 h-20 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><circle cx="12" cy="8" r="5"/><path d="M20 21a8 8 0 0 0-16 0"/></svg>
                  </div>
                </div>
                <h3 className="text-lg font-medium">Select a Patient</h3>
                <p className="text-muted-foreground mt-2 mb-4">
                  Select a patient from the list to load their digital twin data<br />
                  and run medication or surgical simulations.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

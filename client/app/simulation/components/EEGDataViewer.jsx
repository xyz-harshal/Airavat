"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Activity, Brain, Calendar } from "lucide-react";

export default function EEGDataViewer({ patientId }) {
  const [eegData, setEEGData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState("waves");

  useEffect(() => {
    // Reset when patient changes
    setLoading(true);
    setEEGData(null);

    // Simulate fetching EEG data
    const fetchEEGData = async () => {
      try {
        // In a real app, this would be an API call
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Sample EEG data with different wave patterns
        const sampleEEG = {
          patientId,
          recordingDate: "2025-04-01",
          duration: "25 minutes",
          channels: 32,
          samplingRate: "256 Hz",
          brainRegions: ["Frontal", "Temporal", "Parietal", "Occipital"],
          wavePatterns: {
            delta: Math.random() * 1.5 + 0.5, // 0.5-2 Hz
            theta: Math.random() * 3 + 4,     // 4-7 Hz
            alpha: Math.random() * 3 + 8,     // 8-11 Hz
            beta: Math.random() * 19 + 12,    // 12-31 Hz
            gamma: Math.random() * 69 + 32,   // 32-100 Hz
          },
          abnormalities: generateAbnormalities(patientId),
          digitalTwinId: `DTB-${patientId.split('-')[1]}`,
          lastUpdated: "2025-04-05",
        };

        setEEGData(sampleEEG);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching EEG data:", error);
        setLoading(false);
      }
    };

    if (patientId) {
      fetchEEGData();
    }
  }, [patientId]);

  // Generate sample abnormalities based on patient ID
  function generateAbnormalities(id) {
    // Different abnormalities for different patients
    const patientNumber = parseInt(id.split('-')[1]);
    
    if (patientNumber % 1000 === 1) { // Patient 1001
      return [
        { region: "Left Temporal", type: "Epileptiform Activity", severity: "Moderate" },
        { region: "Right Frontal", type: "Slow Wave Activity", severity: "Mild" }
      ];
    } else if (patientNumber % 1000 === 2) { // Patient 1002
      return [
        { region: "Prefrontal Cortex", type: "Beta Rhythm Abnormality", severity: "Moderate" },
        { region: "Anterior Cingulate", type: "High Beta Activity", severity: "Moderate" }
      ];
    } else if (patientNumber % 1000 === 3) { // Patient 1003
      return [
        { region: "Motor Cortex", type: "Reduced Alpha Activity", severity: "Severe" },
        { region: "Basal Ganglia", type: "Tremor Pattern", severity: "Moderate" }
      ];
    } else if (patientNumber % 1000 === 4) { // Patient 1004
      return [
        { region: "Left Frontotemporal", type: "Alpha Asymmetry", severity: "Moderate" },
        { region: "Right Frontotemporal", type: "Alpha Asymmetry", severity: "Mild" }
      ];
    } else {
      return [
        { region: "General", type: "Non-specific Abnormality", severity: "Mild" }
      ];
    }
  }

  // Get severity color
  const getSeverityColor = (severity) => {
    switch(severity) {
      case "Severe": return "bg-red-100 text-red-800 hover:bg-red-200";
      case "Moderate": return "bg-amber-100 text-amber-800 hover:bg-amber-200";
      case "Mild": return "bg-blue-100 text-blue-800 hover:bg-blue-200";
      default: return "bg-gray-100 text-gray-800 hover:bg-gray-200";
    }
  };

  // Render a simple EEG wave visualization (in a real app, this would be more sophisticated)
  const renderEEGWaves = () => {
    if (!eegData) return null;
    
    return (
      <div className="p-4 bg-black rounded-lg h-40 relative overflow-hidden">
        {/* Simple SVG representation of brainwaves */}
        <svg width="100%" height="100%" viewBox="0 0 800 150" preserveAspectRatio="none">
          <path 
            d={generateWavePath(800, 150, 2.5, eegData.wavePatterns.delta)} 
            stroke="#FF5555" 
            strokeWidth="1.5" 
            fill="none" 
          />
          <path 
            d={generateWavePath(800, 150, 5, eegData.wavePatterns.theta)} 
            stroke="#FFAA00" 
            strokeWidth="1.5" 
            fill="none" 
            transform="translate(0, 30)" 
          />
          <path 
            d={generateWavePath(800, 150, 9, eegData.wavePatterns.alpha)} 
            stroke="#55FF55" 
            strokeWidth="1.5" 
            fill="none" 
            transform="translate(0, 60)" 
          />
          <path 
            d={generateWavePath(800, 150, 20, eegData.wavePatterns.beta)} 
            stroke="#55AAFF" 
            strokeWidth="1.5" 
            fill="none" 
            transform="translate(0, 90)" 
          />
          <path 
            d={generateWavePath(800, 150, 40, eegData.wavePatterns.gamma)} 
            stroke="#AA55FF" 
            strokeWidth="1" 
            fill="none" 
            transform="translate(0, 120)" 
          />
        </svg>
        
        {/* Wave type labels */}
        <div className="absolute top-2 left-3 text-xs text-red-400">Delta</div>
        <div className="absolute top-10 left-3 text-xs text-orange-400">Theta</div>
        <div className="absolute top-18 left-3 text-xs text-green-400">Alpha</div>
        <div className="absolute top-26 left-3 text-xs text-blue-400">Beta</div>
        <div className="absolute top-34 left-3 text-xs text-purple-400">Gamma</div>
      </div>
    );
  };

  // Generate a sinusoidal wave path for the SVG
  const generateWavePath = (width, height, frequency, amplitude) => {
    const points = [];
    const steps = 100;
    
    for (let i = 0; i < steps; i++) {
      const x = (i / steps) * width;
      const y = (height / 4) + Math.sin(i / (steps / (frequency * 10))) * (amplitude * 3);
      points.push(`${x},${y}`);
    }
    
    return `M${points.join(' L')}`;
  };

  // Render brain regions with activity levels
  const renderBrainMap = () => {
    if (!eegData) return null;
    
    return (
      <div className="text-center">
        <div className="bg-muted/20 rounded-lg p-6 text-muted-foreground">
          This would display an interactive 3D brain model with color-coded activity levels.
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-medium">
            <Skeleton className="h-6 w-48" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-40 w-full" />
          <div className="grid grid-cols-2 gap-4 mt-4">
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-medium flex items-center gap-2">
            <Activity className="h-5 w-5 text-primary" />
            EEG Data & Brain Digital Twin
          </CardTitle>
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">
              {eegData?.recordingDate}
            </span>
            <Badge variant="outline">{eegData?.digitalTwinId}</Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue={viewMode} onValueChange={setViewMode}>
          <TabsList className="mb-4">
            <TabsTrigger value="waves">EEG Waveforms</TabsTrigger>
            <TabsTrigger value="brain">Brain Mapping</TabsTrigger>
            <TabsTrigger value="abnormalities">Abnormalities</TabsTrigger>
          </TabsList>
          
          <TabsContent value="waves">
            {renderEEGWaves()}
            <div className="grid grid-cols-5 gap-2 mt-4 text-center">
              {Object.entries(eegData?.wavePatterns || {}).map(([wave, value]) => (
                <div key={wave} className="bg-muted/20 p-2 rounded-lg">
                  <div className="text-sm font-medium capitalize">{wave}</div>
                  <div className="text-xl font-semibold">{value.toFixed(1)}</div>
                  <div className="text-xs text-muted-foreground">Hz</div>
                </div>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="brain">
            {renderBrainMap()}
          </TabsContent>
          
          <TabsContent value="abnormalities">
            <div className="space-y-4">
              <div className="text-sm text-muted-foreground">
                Detected abnormalities in brain activity patterns:
              </div>
              
              {eegData?.abnormalities.length === 0 ? (
                <div className="text-center py-4 text-muted-foreground">
                  No abnormalities detected
                </div>
              ) : (
                <div className="space-y-2">
                  {eegData?.abnormalities.map((abnormality, i) => (
                    <div key={i} className="bg-muted/20 p-3 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div className="font-medium">{abnormality.region}</div>
                        <Badge 
                          variant="secondary" 
                          className={getSeverityColor(abnormality.severity)}
                        >
                          {abnormality.severity}
                        </Badge>
                      </div>
                      <div className="text-sm text-muted-foreground mt-1">
                        {abnormality.type}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

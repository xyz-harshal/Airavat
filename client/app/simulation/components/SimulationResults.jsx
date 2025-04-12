"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  FileBarChart2,
  Download,
  Share2,
  AlertTriangle,
  CheckCircle2,
  Brain,
  Activity,
  Clock,
  ChevronRight,
  BarChart2,
  Pill,
  Slice,
  AlertCircle,
  ThumbsUp,
  ThumbsDown,
  ChartPieIcon,
  BarChart
} from "lucide-react";
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";

export default function SimulationResults({ results, type }) {
  const [activeTab, setActiveTab] = useState("summary");
  
  if (!results) return null;
  
  // Determine result color based on effectiveness
  const getEffectivenessColor = (value) => {
    if (value >= 70) return "text-green-600";
    if (value >= 50) return "text-amber-600";
    return "text-red-600";
  };
  
  // Determine side effect color based on severity
  const getSideEffectColor = (value) => {
    if (value <= 10) return "text-green-600";
    if (value <= 30) return "text-amber-600";
    return "text-red-600";
  };

  // Determine risk level badge color
  const getRiskBadgeColor = (risk) => {
    if (risk === "Low") return "bg-green-100 text-green-800 hover:bg-green-200";
    if (risk === "Medium") return "bg-amber-100 text-amber-800 hover:bg-amber-200";
    if (risk === "High") return "bg-red-100 text-red-800 hover:bg-red-200";
    return "bg-gray-100 text-gray-800 hover:bg-gray-200";
  };
  
  // Determine confidence class based on simulation accuracy
  const getConfidenceClass = (confidence) => {
    switch(confidence) {
      case "high": return "text-green-600";
      case "medium": return "text-amber-600";
      case "low": return "text-red-600";
      default: return "text-muted-foreground";
    }
  };

  return (
    <Card className="border-2 border-primary/20">
      <CardHeader className="bg-primary/5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {type === "medication" ? (
              <Pill className="h-5 w-5 text-primary" />
            ) : (
              <Slice className="h-5 w-5 text-primary" />
            )}
            <CardTitle>
              {type === "medication" 
                ? "Medication Simulation Results" 
                : "Surgical Simulation Results"}
            </CardTitle>
          </div>
          <Badge variant="outline" className={getConfidenceClass(results.simulationConfidence)}>
            {results.simulationConfidence ? `${results.simulationConfidence.charAt(0).toUpperCase()}${results.simulationConfidence.slice(1)} Confidence` : 'Unknown Confidence'}
          </Badge>
        </div>
        <CardDescription>
          {type === "medication" 
            ? `Simulated effects of ${results.medicationName}` 
            : `Simulated outcome of ${results.procedureName}`}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="pt-6">
        <Tabs defaultValue="summary" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="summary">Summary</TabsTrigger>
            <TabsTrigger value="details">Detailed Analysis</TabsTrigger>
            <TabsTrigger value="brainEffects">Brain Effects</TabsTrigger>
          </TabsList>
          
          {/* Summary Tab */}
          <TabsContent value="summary" className="pt-4 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Effectiveness Metric */}
              <Card>
                <CardContent className="p-4">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Effectiveness</span>
                      <ThumbsUp className={`h-5 w-5 ${getEffectivenessColor(results.effectiveness)}`} />
                    </div>
                    <h3 className={`text-3xl font-bold ${getEffectivenessColor(results.effectiveness)}`}>
                      {results.effectiveness}%
                    </h3>
                    <Progress 
                      value={results.effectiveness} 
                      className="h-2"
                      indicatorClassName={
                        results.effectiveness >= 70 ? "bg-green-600" : 
                        results.effectiveness >= 50 ? "bg-amber-600" : "bg-red-600"
                      }
                    />
                  </div>
                </CardContent>
              </Card>
              
              {/* Side Effects Metric */}
              <Card>
                <CardContent className="p-4">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Side Effects</span>
                      <ThumbsDown className={`h-5 w-5 ${getSideEffectColor(results.sideEffects)}`} />
                    </div>
                    <h3 className={`text-3xl font-bold ${getSideEffectColor(results.sideEffects)}`}>
                      {results.sideEffects}%
                    </h3>
                    <Progress 
                      value={results.sideEffects} 
                      className="h-2"
                      indicatorClassName={
                        results.sideEffects <= 10 ? "bg-green-600" : 
                        results.sideEffects <= 30 ? "bg-amber-600" : "bg-red-600"
                      }
                    />
                  </div>
                </CardContent>
              </Card>
              
              {/* Success Probability */}
              <Card>
                <CardContent className="p-4">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Success Probability</span>
                      <Activity className={`h-5 w-5 ${getEffectivenessColor(results.successProbability * 100)}`} />
                    </div>
                    <h3 className={`text-3xl font-bold ${getEffectivenessColor(results.successProbability * 100)}`}>
                      {(results.successProbability * 100).toFixed(0)}%
                    </h3>
                    <Progress 
                      value={results.successProbability * 100} 
                      className="h-2" 
                      indicatorClassName={
                        results.successProbability >= 0.7 ? "bg-green-600" : 
                        results.successProbability >= 0.5 ? "bg-amber-600" : "bg-red-600"
                      }
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Key Findings */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Key Findings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Main effect - seizure reduction or similar */}
                  <div className="flex items-start gap-3">
                    <div className="bg-primary/10 p-2 rounded-full">
                      <Activity className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-medium">
                        {type === "medication" ? "Seizure Reduction" : "Seizure Control"}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {results.seizureReduction}% improvement expected
                      </p>
                    </div>
                  </div>
                  
                  {/* Cognitive impact */}
                  <div className="flex items-start gap-3">
                    <div className="bg-primary/10 p-2 rounded-full">
                      <Brain className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-medium">Cognitive Impact</h4>
                      <p className="text-sm text-muted-foreground">
                        {results.cognitiveImpact}
                      </p>
                    </div>
                  </div>
                  
                  {/* Time-based metric - either onset of action or recovery time */}
                  <div className="flex items-start gap-3">
                    <div className="bg-primary/10 p-2 rounded-full">
                      <Clock className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-medium">
                        {type === "medication" ? "Onset of Action" : "Recovery Time"}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {type === "medication" 
                          ? `${results.onsetOfAction || '2-4'} weeks` 
                          : `${results.recoveryTime} weeks`}
                      </p>
                    </div>
                  </div>
                  
                  {/* Follow-up recommendation */}
                  <div className="flex items-start gap-3">
                    <div className="bg-primary/10 p-2 rounded-full">
                      <Calendar className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-medium">Follow-up</h4>
                      <p className="text-sm text-muted-foreground">
                        {results.recommendedFollowup}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Recommendation */}
            <Card>
              <CardContent className="p-4">
                <div className="flex gap-3 items-start">
                  {results.effectiveness >= 60 ? (
                    <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
                  ) : (
                    <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5" />
                  )}
                  <div>
                    <h4 className="font-medium text-lg">Recommendation</h4>
                    <p className="text-muted-foreground">
                      {results.effectiveness >= 70 
                        ? `This ${type === "medication" ? "medication" : "procedure"} is highly recommended based on the digital twin simulation results.`
                        : results.effectiveness >= 50
                        ? `This ${type === "medication" ? "medication" : "procedure"} shows moderate potential and may be considered.`
                        : `This ${type === "medication" ? "medication" : "procedure"} may not be optimal based on the digital twin simulation.`
                      }
                    </p>
                    
                    {results.sideEffects > 30 && (
                      <div className="mt-2 flex gap-2 text-amber-600">
                        <AlertCircle className="h-4 w-4" />
                        <p className="text-sm">
                          Consider the high probability of side effects when making decisions.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Detailed Analysis Tab */}
          <TabsContent value="details" className="pt-4 space-y-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Detailed Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Metric</TableHead>
                      <TableHead>Value</TableHead>
                      <TableHead>Assessment</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>Effectiveness</TableCell>
                      <TableCell>{results.effectiveness}%</TableCell>
                      <TableCell>
                        <Badge className={getEffectivenessColor(results.effectiveness)}>
                          {results.effectiveness >= 70 ? "High" : 
                           results.effectiveness >= 50 ? "Moderate" : "Low"}
                        </Badge>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Side Effects</TableCell>
                      <TableCell>{results.sideEffects}%</TableCell>
                      <TableCell>
                        <Badge className={getSideEffectColor(results.sideEffects)}>
                          {results.sideEffects <= 10 ? "Minimal" : 
                           results.sideEffects <= 30 ? "Moderate" : "Significant"}
                        </Badge>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Success Probability</TableCell>
                      <TableCell>{(results.successProbability * 100).toFixed(1)}%</TableCell>
                      <TableCell>
                        <Badge className={getEffectivenessColor(results.successProbability * 100)}>
                          {results.successProbability >= 0.7 ? "High" : 
                           results.successProbability >= 0.5 ? "Moderate" : "Low"}
                        </Badge>
                      </TableCell>
                    </TableRow>
                    {type === "medication" ? (
                      <>
                        <TableRow>
                          <TableCell>Onset of Action</TableCell>
                          <TableCell>{results.onsetOfAction || '2-4'} weeks</TableCell>
                          <TableCell>Standard</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Duration of Effect</TableCell>
                          <TableCell>{results.durationOfEffect || 'Continuous'}</TableCell>
                          <TableCell>-</TableCell>
                        </TableRow>
                      </>
                    ) : (
                      <>
                        <TableRow>
                          <TableCell>Recovery Time</TableCell>
                          <TableCell>{results.recoveryTime} weeks</TableCell>
                          <TableCell>
                            {results.recoveryTime <= 4 ? "Short" : 
                             results.recoveryTime <= 8 ? "Average" : "Extended"}
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Post-Op Therapy Needed</TableCell>
                          <TableCell>
                            {results.postOpMedications && results.postOpMedications.length > 0 ? "Yes" : "No"}
                          </TableCell>
                          <TableCell>-</TableCell>
                        </TableRow>
                      </>
                    )}
                    <TableRow>
                      <TableCell>Cognitive Impact</TableCell>
                      <TableCell>{results.cognitiveImpact}</TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {results.cognitiveImpact === "Minimal" ? "Favorable" : "Caution"}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
            
            {/* Specific details based on treatment type */}
            {type === "medication" ? (
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Medication Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Dosage Impact</h4>
                    <div className="bg-muted/30 rounded-md p-4">
                      <div className="grid grid-cols-3 gap-4">
                        <div className="text-center">
                          <div className="text-sm text-muted-foreground">Low Dose</div>
                          <div className="font-medium mt-1">
                            {(results.effectiveness * 0.7).toFixed(1)}% Effective
                          </div>
                          <div className="text-xs text-muted-foreground mt-1">
                            {(results.sideEffects * 0.6).toFixed(1)}% Side Effects
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="text-sm text-muted-foreground font-medium">Standard Dose</div>
                          <div className="font-medium mt-1 text-primary">
                            {results.effectiveness}% Effective
                          </div>
                          <div className="text-xs text-muted-foreground mt-1">
                            {results.sideEffects}% Side Effects
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="text-sm text-muted-foreground">High Dose</div>
                          <div className="font-medium mt-1">
                            {Math.min(99.9, (results.effectiveness * 1.2)).toFixed(1)}% Effective
                          </div>
                          <div className="text-xs text-muted-foreground mt-1">
                            {Math.min(99.9, (results.sideEffects * 1.5)).toFixed(1)}% Side Effects
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Medication interaction warnings if any */}
                  {results.interactionWarnings && results.interactionWarnings.length > 0 && (
                    <div>
                      <h4 className="font-medium mb-2">Potential Interactions</h4>
                      <div className="space-y-2">
                        {results.interactionWarnings.map((warning, idx) => (
                          <div key={idx} className="flex items-start gap-2 text-amber-600 text-sm">
                            <AlertCircle className="h-4 w-4 mt-0.5" />
                            <p>{warning}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Procedure Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Post-Operative Recommendations</h4>
                    <ul className="list-disc list-inside space-y-1 text-sm pl-2">
                      {results.postOpMedications && results.postOpMedications.map((med, idx) => (
                        <li key={idx}>{med}</li>
                      ))}
                      {(!results.postOpMedications || results.postOpMedications.length === 0) && (
                        <li>No specific post-operative medications required</li>
                      )}
                      <li>{results.recommendedFollowup}</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
          
          {/* Brain Effects Tab */}
          <TabsContent value="brainEffects" className="pt-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Brain Activity Impact</CardTitle>
                <CardDescription>
                  Changes in brain activity patterns predicted by digital twin
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium mb-2">Affected Brain Regions</h4>
                    <div className="bg-muted/30 rounded-md p-4">
                      <ul className="space-y-2">
                        {results.brainRegionsAffected && results.brainRegionsAffected.map((region, idx) => (
                          <li key={idx} className="flex items-center gap-2">
                            <Brain className="h-4 w-4 text-primary" />
                            <span>{region}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">Simulated Neural Activity</h4>
                    <div className="h-40 bg-muted/20 rounded-md border flex items-center justify-center">
                      <div className="text-center">
                        <BarChart className="h-10 w-10 mx-auto text-primary/70" />
                        <p className="text-sm text-muted-foreground mt-2">
                          Neural activity visualization not available in this view
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Electroencephalogram Changes</h4>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Wave Type</TableHead>
                        <TableHead>Before</TableHead>
                        <TableHead>After</TableHead>
                        <TableHead>Change</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {[
                        { name: "Delta (0.5-4 Hz)", before: "32%", after: "28%", change: "-4%" },
                        { name: "Theta (4-8 Hz)", before: "26%", after: "22%", change: "-4%" },
                        { name: "Alpha (8-13 Hz)", before: "18%", after: "24%", change: "+6%" },
                        { name: "Beta (13-30 Hz)", before: "20%", after: "22%", change: "+2%" },
                        { name: "Gamma (30+ Hz)", before: "4%", after: "4%", change: "0%" }
                      ].map((wave, idx) => (
                        <TableRow key={idx}>
                          <TableCell>{wave.name}</TableCell>
                          <TableCell>{wave.before}</TableCell>
                          <TableCell>{wave.after}</TableCell>
                          <TableCell className={
                            wave.change.startsWith("+") ? "text-green-600" : 
                            wave.change.startsWith("-") ? "text-red-600" : ""
                          }>
                            {wave.change}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </CardContent>
      
      <CardFooter className="flex justify-between">
        <div className="text-sm text-muted-foreground">
          Digital twin simulation computed on {new Date().toLocaleDateString()}
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
          <Button variant="outline" size="sm">
            <Share2 className="h-4 w-4 mr-2" />
            Share Results
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}

function Calendar(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
      <line x1="16" x2="16" y1="2" y2="6" />
      <line x1="8" x2="8" y1="2" y2="6" />
      <line x1="3" x2="21" y1="10" y2="10" />
    </svg>
  );
}

"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import DashboardLayout from "@/app/components/dashboard/layout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Brain, Activity, ChevronDown, Download, Save, Share, ArrowLeft, FileText, AlertCircle } from "lucide-react";
import { toast } from "sonner";

export default function AnalysisResultsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [analysisResults, setAnalysisResults] = useState(null);
  const [patientInfo, setPatientInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [resultId, setResultId] = useState(null);

  useEffect(() => {
    // Check if results were passed via URL params
    const resultData = searchParams.get("data");
    const patientId = searchParams.get("patientId");
    const patientName = searchParams.get("patientName");
    const resultIdParam = searchParams.get("resultId");
    
    if (resultData) {
      try {
        // If results were passed directly via URL
        const parsedResults = JSON.parse(decodeURIComponent(resultData));
        setAnalysisResults(parsedResults);
        setPatientInfo({
          id: patientId,
          name: patientName || "Patient"
        });
        if (resultIdParam) {
          setResultId(resultIdParam);
        }
        setLoading(false);
      } catch (error) {
        console.error("Error parsing result data:", error);
        toast.error("Failed to load analysis data");
        setLoading(false);
      }
    } else if (resultIdParam) {
      // If only an ID was passed, fetch results from API
      setResultId(resultIdParam);
      fetchResultById(resultIdParam);
    } else {
      // No data or ID provided
      setLoading(false);
      toast.error("No analysis data provided");
    }
  }, [searchParams]);

  const fetchResultById = async (id) => {
    setLoading(true);
    try {
      // API call to fetch results by ID (replace with your actual API endpoint)
      const response = await fetch(`/api/eeg-results/${id}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch results: ${response.statusText}`);
      }
      
      const data = await response.json();
      setAnalysisResults(data.results);
      setPatientInfo(data.patient);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching result data:", error);
      toast.error("Failed to load analysis data");
      setLoading(false);
    }
  };

  // Calculate risk level based on condition probabilities
  const calculateRiskLevel = () => {
    if (!analysisResults?.condition_probabilities) return { level: "unknown", color: "gray" };
    
    const { epilepsy, cognitive_stress, depression } = analysisResults.condition_probabilities;
    const maxProb = Math.max(epilepsy, cognitive_stress, depression);
    
    if (maxProb > 0.7) return { level: "High", color: "red" };
    if (maxProb > 0.4) return { level: "Medium", color: "amber" };
    return { level: "Low", color: "green" };
  };

  const handleDownloadReport = () => {
    toast.success("Generating report", {
      description: "Your report will be downloaded shortly"
    });
    
    // This would typically call an API to generate a PDF report
    setTimeout(() => {
      toast.success("Report downloaded successfully");
    }, 2000);
  };

  const handleSaveToPatientRecord = () => {
    toast.success("Results saved", {
      description: "Analysis results have been saved to patient record"
    });
    
    // Navigate to patient records page
    router.push("/dashboard/patient-records");
  };

  const handleShareResults = () => {
    // Copy shareable link to clipboard
    const baseUrl = window.location.origin;
    const shareUrl = `${baseUrl}/dashboard/services/analysis-results?resultId=${resultId}`;
    
    navigator.clipboard.writeText(shareUrl)
      .then(() => {
        toast.success("Link copied to clipboard", {
          description: "Share this link with authorized medical professionals"
        });
      })
      .catch(err => {
        toast.error("Failed to copy link", {
          description: "Please try again or copy the URL manually"
        });
      });
  };

  const risk = calculateRiskLevel();

  if (loading) {
    return (
      <DashboardLayout>
        <div className="container mx-auto py-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">EEG Analysis Results</h1>
              <p className="text-muted-foreground mt-1">
                Loading analysis data...
              </p>
            </div>
          </div>
          
          <div className="grid place-items-center h-[50vh]">
            <div className="flex flex-col items-center gap-4">
              <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
              <p className="text-muted-foreground">Loading analysis results...</p>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!analysisResults) {
    return (
      <DashboardLayout>
        <div className="container mx-auto py-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">EEG Analysis Results</h1>
              <p className="text-muted-foreground mt-1">
                No results found
              </p>
            </div>
            <Button
              variant="outline"
              onClick={() => router.push("/dashboard/services/upload-eeg")}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Upload
            </Button>
          </div>
          
          <Alert className="bg-destructive/10 text-destructive border border-destructive/30">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>No Analysis Results Available</AlertTitle>
            <AlertDescription>
              No EEG analysis results were found or could be loaded. Please upload an EEG file for analysis.
            </AlertDescription>
          </Alert>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="container mx-auto py-6 space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-bold">EEG Analysis Results</h1>
            <p className="text-muted-foreground mt-1">
              AI-powered brain analysis for {patientInfo?.name || "Patient"}
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={handleDownloadReport}
            >
              <Download className="mr-2 h-4 w-4" />
              Download Report
            </Button>
          </div>
        </div>

        {/* Summary Card */}
        <Card className="bg-muted/20">
          <CardHeader className="pb-4">
            <CardTitle>Analysis Summary</CardTitle>
            <CardDescription>
              Summary of EEG analysis results from {new Date().toLocaleDateString()}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex flex-col gap-1">
                <Label className="text-sm text-muted-foreground">Patient</Label>
                <p className="font-medium">{patientInfo?.name || "Unknown"}</p>
              </div>
              
              <div className="flex flex-col gap-1">
                <Label className="text-sm text-muted-foreground">Analysis Date</Label>
                <p className="font-medium">{new Date().toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'short', 
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}</p>
              </div>
              
              <div className="flex flex-col gap-1">
                <Label className="text-sm text-muted-foreground">Risk Level</Label>
                <div className="flex items-center">
                  <div className={`w-3 h-3 rounded-full bg-${risk.color}-500 mr-2`}></div>
                  <p className="font-medium">{risk.level}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        {/* Main Results Card */}
        <Card className="overflow-hidden border-0 shadow-lg bg-gradient-to-br from-background to-muted/30">
          <CardContent className="p-6 space-y-6">
            {/* Conditions Section */}
            <div className="space-y-5">
              <div className="flex items-center space-x-2">
                <Activity className="h-5 w-5 text-primary" />
                <h3 className="text-base font-semibold">Condition Probability Analysis</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {analysisResults.condition_probabilities && (
                  <>
                    <div className="p-4 rounded-xl bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-900/10 border border-red-200 dark:border-red-800/30">
                      <div className="mb-2 flex justify-between items-center">
                        <span className="font-medium text-red-700 dark:text-red-400">Epilepsy</span>
                        <span className="text-sm font-bold px-2 py-0.5 rounded-full bg-red-200 text-red-700 dark:bg-red-700 dark:text-red-100">
                          {Math.round(analysisResults.condition_probabilities.epilepsy * 100)}%
                        </span>
                      </div>
                      <div className="w-full bg-red-200/50 dark:bg-red-950/50 rounded-full h-2.5 overflow-hidden">
                        <div 
                          className="bg-red-500 dark:bg-red-600 h-2.5 rounded-full transition-all duration-500 ease-in-out" 
                          style={{ width: `${analysisResults.condition_probabilities.epilepsy * 100}%` }}
                        ></div>
                      </div>
                      <p className="mt-2 text-xs text-red-600/70 dark:text-red-400/70">
                        {analysisResults.condition_probabilities.epilepsy > 0.7 
                          ? "High probability of epileptiform activity" 
                          : analysisResults.condition_probabilities.epilepsy > 0.4 
                            ? "Moderate signs of epileptiform activity" 
                            : "Low indication of epileptiform activity"}
                      </p>
                    </div>
                    
                    <div className="p-4 rounded-xl bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-900/10 border border-amber-200 dark:border-amber-800/30">
                      <div className="mb-2 flex justify-between items-center">
                        <span className="font-medium text-amber-700 dark:text-amber-400">Cognitive Stress</span>
                        <span className="text-sm font-bold px-2 py-0.5 rounded-full bg-amber-200 text-amber-700 dark:bg-amber-700 dark:text-amber-100">
                          {Math.round(analysisResults.condition_probabilities.cognitive_stress * 100)}%
                        </span>
                      </div>
                      <div className="w-full bg-amber-200/50 dark:bg-amber-950/50 rounded-full h-2.5 overflow-hidden">
                        <div 
                          className="bg-amber-500 dark:bg-amber-600 h-2.5 rounded-full transition-all duration-500 ease-in-out" 
                          style={{ width: `${analysisResults.condition_probabilities.cognitive_stress * 100}%` }}
                        ></div>
                      </div>
                      <p className="mt-2 text-xs text-amber-600/70 dark:text-amber-400/70">
                        {analysisResults.condition_probabilities.cognitive_stress > 0.7 
                          ? "High levels of cognitive stress detected" 
                          : analysisResults.condition_probabilities.cognitive_stress > 0.4 
                            ? "Moderate cognitive stress indicators" 
                            : "Low stress patterns observed"}
                      </p>
                    </div>
                    
                    <div className="p-4 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-900/10 border border-blue-200 dark:border-blue-800/30">
                      <div className="mb-2 flex justify-between items-center">
                        <span className="font-medium text-blue-700 dark:text-blue-400">Depression</span>
                        <span className="text-sm font-bold px-2 py-0.5 rounded-full bg-blue-200 text-blue-700 dark:bg-blue-700 dark:text-blue-100">
                          {Math.round(analysisResults.condition_probabilities.depression * 100)}%
                        </span>
                      </div>
                      <div className="w-full bg-blue-200/50 dark:bg-blue-950/50 rounded-full h-2.5 overflow-hidden">
                        <div 
                          className="bg-blue-500 dark:bg-blue-600 h-2.5 rounded-full transition-all duration-500 ease-in-out" 
                          style={{ width: `${analysisResults.condition_probabilities.depression * 100}%` }}
                        ></div>
                      </div>
                      <p className="mt-2 text-xs text-blue-600/70 dark:text-blue-400/70">
                        {analysisResults.condition_probabilities.depression > 0.7 
                          ? "Strong depression-like brain patterns" 
                          : analysisResults.condition_probabilities.depression > 0.4 
                            ? "Moderate depression indicators present" 
                            : "Minimal depression-like patterns"}
                      </p>
                    </div>
                  </>
                )}
              </div>
            </div>
            
            {/* Raw Predictions Section */}
            {analysisResults.raw_predictions && (
              <div className="space-y-5 pt-4 border-t">
                <div className="flex items-center space-x-2">
                  <Brain className="h-5 w-5 text-primary" />
                  <h3 className="text-base font-semibold">EEG Pattern Analysis</h3>
                  <div className="text-xs text-muted-foreground rounded-full bg-muted px-2 py-1">Raw Predictions</div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  <div className="relative overflow-hidden p-4 rounded-xl border bg-indigo-50/30 dark:bg-indigo-950/20 border-indigo-200 dark:border-indigo-800/30">
                    <div className="mb-2 flex justify-between items-center">
                      <span className="font-medium text-sm text-indigo-700 dark:text-indigo-400">LPD</span>
                      <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-indigo-200 text-indigo-700 dark:bg-indigo-700 dark:text-indigo-100">
                        {Math.round(analysisResults.raw_predictions[1] * 100)}%
                      </span>
                    </div>
                    <div className="w-full bg-indigo-200/50 dark:bg-indigo-950/50 rounded-full h-2 overflow-hidden">
                      <div 
                        className="bg-indigo-500 dark:bg-indigo-600 h-2 rounded-full transition-all duration-500 ease-in-out" 
                        style={{ width: `${analysisResults.raw_predictions[1] * 100}%` }}
                      ></div>
                    </div>
                    <p className="mt-2 text-xs text-indigo-600/70 dark:text-indigo-400/70">Lateralized Periodic Discharges</p>
                  </div>
                  
                  <div className="relative overflow-hidden p-4 rounded-xl border bg-purple-50/30 dark:bg-purple-950/20 border-purple-200 dark:border-purple-800/30">
                    <div className="mb-2 flex justify-between items-center">
                      <span className="font-medium text-sm text-purple-700 dark:text-purple-400">GPD</span>
                      <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-purple-200 text-purple-700 dark:bg-purple-700 dark:text-purple-100">
                        {Math.round(analysisResults.raw_predictions[2] * 100)}%
                      </span>
                    </div>
                    <div className="w-full bg-purple-200/50 dark:bg-purple-950/50 rounded-full h-2 overflow-hidden">
                      <div 
                        className="bg-purple-500 dark:bg-purple-600 h-2 rounded-full transition-all duration-500 ease-in-out" 
                        style={{ width: `${analysisResults.raw_predictions[2] * 100}%` }}
                      ></div>
                    </div>
                    <p className="mt-2 text-xs text-purple-600/70 dark:text-purple-400/70">Generalized Periodic Discharges</p>
                  </div>
                  
                  <div className="relative overflow-hidden p-4 rounded-xl border bg-teal-50/30 dark:bg-teal-950/20 border-teal-200 dark:border-teal-800/30">
                    <div className="mb-2 flex justify-between items-center">
                      <span className="font-medium text-sm text-teal-700 dark:text-teal-400">LRDA</span>
                      <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-teal-200 text-teal-700 dark:bg-teal-700 dark:text-teal-100">
                        {Math.round(analysisResults.raw_predictions[3] * 100)}%
                      </span>
                    </div>
                    <div className="w-full bg-teal-200/50 dark:bg-teal-950/50 rounded-full h-2 overflow-hidden">
                      <div 
                        className="bg-teal-500 dark:bg-teal-600 h-2 rounded-full transition-all duration-500 ease-in-out" 
                        style={{ width: `${analysisResults.raw_predictions[3] * 100}%` }}
                      ></div>
                    </div>
                    <p className="mt-2 text-xs text-teal-600/70 dark:text-teal-400/70">Lateralized Rhythmic Delta Activity</p>
                  </div>
                  
                  <div className="relative overflow-hidden p-4 rounded-xl border bg-emerald-50/30 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800/30">
                    <div className="mb-2 flex justify-between items-center">
                      <span className="font-medium text-sm text-emerald-700 dark:text-emerald-400">GRDA</span>
                      <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-200 text-emerald-700 dark:bg-emerald-700 dark:text-emerald-100">
                        {Math.round(analysisResults.raw_predictions[4] * 100)}%
                      </span>
                    </div>
                    <div className="w-full bg-emerald-200/50 dark:bg-emerald-950/50 rounded-full h-2 overflow-hidden">
                      <div 
                        className="bg-emerald-500 dark:bg-emerald-600 h-2 rounded-full transition-all duration-500 ease-in-out" 
                        style={{ width: `${analysisResults.raw_predictions[4] * 100}%` }}
                      ></div>
                    </div>
                    <p className="mt-2 text-xs text-emerald-600/70 dark:text-emerald-400/70">Generalized Rhythmic Delta Activity</p>
                  </div>
                  
                  <div className="relative overflow-hidden p-4 rounded-xl border bg-rose-50/30 dark:bg-rose-950/20 border-rose-200 dark:border-rose-800/30">
                    <div className="mb-2 flex justify-between items-center">
                      <span className="font-medium text-sm text-rose-700 dark:text-rose-400">Seizure</span>
                      <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-rose-200 text-rose-700 dark:bg-rose-700 dark:text-rose-100">
                        {Math.round(analysisResults.raw_predictions[5] * 100)}%
                      </span>
                    </div>
                    <div className="w-full bg-rose-200/50 dark:bg-rose-950/50 rounded-full h-2 overflow-hidden">
                      <div 
                        className="bg-rose-500 dark:bg-rose-600 h-2 rounded-full transition-all duration-500 ease-in-out" 
                        style={{ width: `${analysisResults.raw_predictions[5] * 100}%` }}
                      ></div>
                    </div>
                    <p className="mt-2 text-xs text-rose-600/70 dark:text-rose-400/70">Seizure Activity</p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
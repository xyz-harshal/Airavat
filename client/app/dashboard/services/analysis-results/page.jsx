"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import DashboardLayout from "@/app/components/dashboard/layout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Brain, Activity, ChevronDown, Download, Save, Share, ArrowLeft, FileText, AlertCircle, Database } from "lucide-react";
import { toast } from "sonner";
import ReactMarkdown from "react-markdown";
import { savePatientAnalysisByName } from "@/app/actions/patients";

export default function AnalysisResultsPage() {
  const router = useRouter();
  const [analysisResults, setAnalysisResults] = useState(null);
  const [patientInfo, setPatientInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [resultId, setResultId] = useState(null);

  useEffect(() => {
    // Instead of using URL params, get data from localStorage
    try {
      const resultData = localStorage.getItem('analysisResultData');
      const patientId = localStorage.getItem('analysisPatientId');
      const patientName = localStorage.getItem('analysisPatientName');
      const resultIdFromStorage = localStorage.getItem('analysisResultId');
      
      if (resultData) {
        // Parse the result data from localStorage
        const parsedResults = JSON.parse(resultData);
        setAnalysisResults(parsedResults);
        
        setPatientInfo({
          id: patientId,
          name: patientName || "Patient"
        });
        
        if (resultIdFromStorage) {
          setResultId(resultIdFromStorage);
        }
        
        // Clear the localStorage after retrieving the data
        // This prevents old data from being shown if the page is refreshed
        localStorage.removeItem('analysisResultData');
        localStorage.removeItem('analysisPatientId');
        localStorage.removeItem('analysisPatientName');
        localStorage.removeItem('analysisResultId');
        
        setLoading(false);
      } else if (resultIdFromStorage) {
        // If only an ID was stored, fetch results from API
        setResultId(resultIdFromStorage);
        fetchResultById(resultIdFromStorage);
      } else {
        // No data or ID provided
        setLoading(false);
        toast.error("No analysis data provided");
      }
    } catch (error) {
      console.error("Error parsing result data:", error);
      toast.error("Failed to load analysis data");
      setLoading(false);
    }
  }, []);

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

  const handleDownloadReport = () => {
    toast.success("Generating report", {
      description: "Your report will be downloaded shortly"
    });
    
    // This would typically call an API to generate a PDF report
    setTimeout(() => {
      toast.success("Report downloaded successfully");
    }, 2000);
  };

  const handleSaveToPatientRecord = async () => {
    if (!patientInfo?.name) {
      toast.error("Error", {
        description: "Patient name is missing"
      });
      return;
    }
    
    // Get the user ID from localStorage
    const userId = localStorage.getItem('token');
    
    if (!userId) {
      toast.error("Authentication required", {
        description: "Please log in to save analysis results"
      });
      return;
    }
    
    try {
      // Set loading state
      const toastId = toast.loading("Saving analysis data to patient record");
      
      // Call the server action to save the analysis data by patient name
      const response = await savePatientAnalysisByName(
        patientInfo.name,
        userId,
        analysisResults
      );
      
      toast.dismiss(toastId);
      
      if (response.error) {
        toast.error("Error", {
          description: response.message || "Failed to save analysis data"
        });
        return;
      }
      
      toast.success("Analysis saved", {
        description: "Analysis results have been saved to patient record"
      });
      
      // Navigate to patient records page after successful save
      router.push("/dashboard/patient-records");
    } catch (error) {
      console.error("Error saving analysis data:", error);
      toast.error("Error", {
        description: error.message || "Failed to save analysis data"
      });
    }
  };

  const handleSaveToDatabase = async () => {
    if (!patientInfo?.name) {
      toast.error("Error", {
        description: "Patient name is missing"
      });
      return;
    }
    
    // Get the user ID from localStorage
    const userId = localStorage.getItem('token');
    
    if (!userId) {
      toast.error("Authentication required", {
        description: "Please log in to save analysis results"
      });
      return;
    }
    
    try {
      // Set loading state with specific database message
      const toastId = toast.loading("Saving analysis data to Supabase database");
      
      // Log the data that's being sent to make it easier to debug
      console.log("Sending to Supabase:", {
        patientName: patientInfo.name,
        userId: userId,
        analysisData: {
          raw_predictions: analysisResults.raw,
          condition_probabilities: analysisResults.percentage,
          medication: analysisResults.medication,
          ai_content: analysisResults.ai_content
        }
      });
      
      // Call the server action to save the analysis data by patient name
      const response = await savePatientAnalysisByName(
        patientInfo.name,
        userId,
        analysisResults
      );
      
      toast.dismiss(toastId);
      
      if (response.error) {
        toast.error("Database Error", {
          description: response.message || "Failed to save analysis data to Supabase"
        });
        return;
      }
      
      toast.success("Data saved to Supabase", {
        description: "Analysis results have been successfully stored in the database"
      });
      
      // Stay on the current page after saving to database
      // This is different from the patient record save which navigates away
    } catch (error) {
      console.error("Error saving analysis data to database:", error);
      toast.error("Database Error", {
        description: error.message || "Failed to save analysis data to Supabase"
      });
    }
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
                  {analysisResults.risk ? (
                    <>
                      <div className={`w-3 h-3 rounded-full bg-${analysisResults.risk.color}-500 mr-2`}></div>
                      <p className="font-medium">{analysisResults.risk.level}</p>
                    </>
                  ) : (
                    <p className="font-medium">
                      {parseFloat(analysisResults.percentage?.cognitive_stress) > 70 || 
                       parseFloat(analysisResults.percentage?.epilepsy) > 70 || 
                       parseFloat(analysisResults.percentage?.depression) > 70 
                        ? "High"
                        : parseFloat(analysisResults.percentage?.cognitive_stress) > 40 || 
                          parseFloat(analysisResults.percentage?.epilepsy) > 40 || 
                          parseFloat(analysisResults.percentage?.depression) > 40
                          ? "Medium" 
                          : "Low"}
                    </p>
                  )}
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
                {analysisResults.percentage && (
                  <>
                    <div className="p-4 rounded-xl bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-900/10 border border-red-200 dark:border-red-800/30">
                      <div className="mb-2 flex justify-between items-center">
                        <span className="font-medium text-red-700 dark:text-red-400">Epilepsy</span>
                        <span className="text-sm font-bold px-2 py-0.5 rounded-full bg-red-200 text-red-700 dark:bg-red-700 dark:text-red-100">
                          {analysisResults.percentage.epilepsy}
                        </span>
                      </div>
                      <div className="w-full bg-red-200/50 dark:bg-red-950/50 rounded-full h-2.5 overflow-hidden">
                        <div 
                          className="bg-red-500 dark:bg-red-600 h-2.5 rounded-full transition-all duration-500 ease-in-out" 
                          style={{ width: analysisResults.percentage.epilepsy }}
                        ></div>
                      </div>
                      <p className="mt-2 text-xs text-red-600/70 dark:text-red-400/70">
                        {parseFloat(analysisResults.percentage.epilepsy) > 70 
                          ? "High probability of epileptiform activity" 
                          : parseFloat(analysisResults.percentage.epilepsy) > 40 
                            ? "Moderate signs of epileptiform activity" 
                            : "Low indication of epileptiform activity"}
                      </p>
                    </div>
                    
                    <div className="p-4 rounded-xl bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-900/10 border border-amber-200 dark:border-amber-800/30">
                      <div className="mb-2 flex justify-between items-center">
                        <span className="font-medium text-amber-700 dark:text-amber-400">Cognitive Stress</span>
                        <span className="text-sm font-bold px-2 py-0.5 rounded-full bg-amber-200 text-amber-700 dark:bg-amber-700 dark:text-amber-100">
                          {analysisResults.percentage.cognitive_stress}
                        </span>
                      </div>
                      <div className="w-full bg-amber-200/50 dark:bg-amber-950/50 rounded-full h-2.5 overflow-hidden">
                        <div 
                          className="bg-amber-500 dark:bg-amber-600 h-2.5 rounded-full transition-all duration-500 ease-in-out" 
                          style={{ width: analysisResults.percentage.cognitive_stress }}
                        ></div>
                      </div>
                      <p className="mt-2 text-xs text-amber-600/70 dark:text-amber-400/70">
                        {parseFloat(analysisResults.percentage.cognitive_stress) > 70 
                          ? "High levels of cognitive stress detected" 
                          : parseFloat(analysisResults.percentage.cognitive_stress) > 40 
                            ? "Moderate cognitive stress indicators" 
                            : "Low stress patterns observed"}
                      </p>
                    </div>
                    
                    <div className="p-4 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-900/10 border border-blue-200 dark:border-blue-800/30">
                      <div className="mb-2 flex justify-between items-center">
                        <span className="font-medium text-blue-700 dark:text-blue-400">Depression</span>
                        <span className="text-sm font-bold px-2 py-0.5 rounded-full bg-blue-200 text-blue-700 dark:bg-blue-700 dark:text-blue-100">
                          {analysisResults.percentage.depression}
                        </span>
                      </div>
                      <div className="w-full bg-blue-200/50 dark:bg-blue-950/50 rounded-full h-2.5 overflow-hidden">
                        <div 
                          className="bg-blue-500 dark:bg-blue-600 h-2.5 rounded-full transition-all duration-500 ease-in-out" 
                          style={{ width: analysisResults.percentage.depression }}
                        ></div>
                      </div>
                      <p className="mt-2 text-xs text-blue-600/70 dark:text-blue-400/70">
                        {parseFloat(analysisResults.percentage.depression) > 70 
                          ? "Strong depression-like brain patterns" 
                          : parseFloat(analysisResults.percentage.depression) > 40 
                            ? "Moderate depression indicators present" 
                            : "Minimal depression-like patterns"}
                      </p>
                    </div>
                  </>
                )}
              </div>
            </div>
            
            {/* Raw Data Section - EEG Pattern Analysis */}
            {analysisResults.raw && (
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
                      <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-indigo-200 text-indigo-700 dark:text-indigo-700 dark:text-indigo-100">
                        {Math.round(analysisResults.raw.lpd * 100)}%
                      </span>
                    </div>
                    <div className="w-full bg-indigo-200/50 dark:bg-indigo-950/50 rounded-full h-2 overflow-hidden">
                      <div 
                        className="bg-indigo-500 dark:bg-indigo-600 h-2 rounded-full transition-all duration-500 ease-in-out" 
                        style={{ width: `${analysisResults.raw.lpd * 100}%` }}
                      ></div>
                    </div>
                    <p className="mt-2 text-xs text-indigo-600/70 dark:text-indigo-400/70">Lateralized Periodic Discharges</p>
                  </div>
                  
                  <div className="relative overflow-hidden p-4 rounded-xl border bg-purple-50/30 dark:bg-purple-950/20 border-purple-200 dark:border-purple-800/30">
                    <div className="mb-2 flex justify-between items-center">
                      <span className="font-medium text-sm text-purple-700 dark:text-purple-400">GPD</span>
                      <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-purple-200 text-purple-700 dark:text-purple-700 dark:text-purple-100">
                        {Math.round(analysisResults.raw.gpd * 100)}%
                      </span>
                    </div>
                    <div className="w-full bg-purple-200/50 dark:bg-purple-950/50 rounded-full h-2 overflow-hidden">
                      <div 
                        className="bg-purple-500 dark:bg-purple-600 h-2 rounded-full transition-all duration-500 ease-in-out" 
                        style={{ width: `${analysisResults.raw.gpd * 100}%` }}
                      ></div>
                    </div>
                    <p className="mt-2 text-xs text-purple-600/70 dark:text-purple-400/70">Generalized Periodic Discharges</p>
                  </div>
                  
                  <div className="relative overflow-hidden p-4 rounded-xl border bg-teal-50/30 dark:bg-teal-950/20 border-teal-200 dark:border-teal-800/30">
                    <div className="mb-2 flex justify-between items-center">
                      <span className="font-medium text-sm text-teal-700 dark:text-teal-400">LRDA</span>
                      <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-teal-200 text-teal-700 dark:text-teal-700 dark:text-teal-100">
                        {Math.round(analysisResults.raw.lrda * 100)}%
                      </span>
                    </div>
                    <div className="w-full bg-teal-200/50 dark:bg-teal-950/50 rounded-full h-2 overflow-hidden">
                      <div 
                        className="bg-teal-500 dark:bg-teal-600 h-2 rounded-full transition-all duration-500 ease-in-out" 
                        style={{ width: `${analysisResults.raw.lrda * 100}%` }}
                      ></div>
                    </div>
                    <p className="mt-2 text-xs text-teal-600/70 dark:text-teal-400/70">Lateralized Rhythmic Delta Activity</p>
                  </div>
                  
                  <div className="relative overflow-hidden p-4 rounded-xl border bg-emerald-50/30 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800/30">
                    <div className="mb-2 flex justify-between items-center">
                      <span className="font-medium text-sm text-emerald-700 dark:text-emerald-400">GRDA</span>
                      <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-200 text-emerald-700 dark:text-emerald-700 dark:text-emerald-100">
                        {Math.round(analysisResults.raw.grda * 100)}%
                      </span>
                    </div>
                    <div className="w-full bg-emerald-200/50 dark:bg-emerald-950/50 rounded-full h-2 overflow-hidden">
                      <div 
                        className="bg-emerald-500 dark:bg-emerald-600 h-2 rounded-full transition-all duration-500 ease-in-out" 
                        style={{ width: `${analysisResults.raw.grda * 100}%` }}
                      ></div>
                    </div>
                    <p className="mt-2 text-xs text-emerald-600/70 dark:text-emerald-400/70">Generalized Rhythmic Delta Activity</p>
                  </div>
                  
                  <div className="relative overflow-hidden p-4 rounded-xl border bg-rose-50/30 dark:bg-rose-950/20 border-rose-200 dark:border-rose-800/30">
                    <div className="mb-2 flex justify-between items-center">
                      <span className="font-medium text-sm text-rose-700 dark:text-rose-400">Other</span>
                      <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-rose-200 text-rose-700 dark:text-rose-700 dark:text-rose-100">
                        {Math.round(analysisResults.raw.other * 100)}%
                      </span>
                    </div>
                    <div className="w-full bg-rose-200/50 dark:bg-rose-950/50 rounded-full h-2 overflow-hidden">
                      <div 
                        className="bg-rose-500 dark:bg-rose-600 h-2 rounded-full transition-all duration-500 ease-in-out" 
                        style={{ width: `${analysisResults.raw.other * 100}%` }}
                      ></div>
                    </div>
                    <p className="mt-2 text-xs text-rose-600/70 dark:text-rose-400/70">Other Activity</p>
                  </div>
                </div>
              </div>
            )}
            
            {/* AI Analysis Section */}
            {analysisResults.ai_content && (
              <div className="space-y-4 pt-4 border-t">
                <div className="flex items-center space-x-2">
                  <Brain className="h-5 w-5 text-primary" />
                  <h3 className="text-base font-semibold">AI Analysis</h3>
                </div>
                
                <Card className="bg-muted/10">
                  <CardContent className="pt-6">
                    <div className="prose prose-sm dark:prose-invert max-w-none">
                      <ReactMarkdown>
                        {analysisResults.ai_content}
                      </ReactMarkdown>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
            
            {/* Medical Recommendations Section */}
            {analysisResults.medication && (
              <div className="space-y-4 pt-4 border-t">
                <div className="flex items-center space-x-2">
                  <FileText className="h-5 w-5 text-primary" />
                  <h3 className="text-base font-semibold">Medical Recommendations</h3>
                </div>
                
                <Alert className="bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800/30">
                  <AlertCircle className="h-4 w-4 text-blue-500" />
                  <AlertTitle className="text-blue-700 dark:text-blue-400">Clinical Advisory</AlertTitle>
                  <AlertDescription className="text-blue-600/90 dark:text-blue-300/90">
                    These recommendations are AI-generated and should be reviewed by a healthcare professional.
                  </AlertDescription>
                </Alert>
                
                <Collapsible className="bg-muted/10 rounded-lg border p-4">
                  <CollapsibleTrigger className="flex items-center justify-between w-full">
                    <span className="text-sm font-medium">View Medical Recommendations</span>
                    <ChevronDown className="h-4 w-4 text-muted-foreground transition-transform ui-open:rotate-180" />
                  </CollapsibleTrigger>
                  <CollapsibleContent className="pt-4">
                    <div className="prose prose-sm dark:prose-invert max-w-none">
                      <ReactMarkdown>
                        {analysisResults.medication}
                      </ReactMarkdown>
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              </div>
            )}
          </CardContent>
          <CardFooter className="bg-muted/20 border-t px-6 py-4">
            <div className="flex justify-between w-full">
              <Button
                variant="outline"
                onClick={() => router.push("/dashboard/services/upload-eeg")}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Upload
              </Button>
              
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={handleShareResults}
                >
                  <Share className="mr-2 h-4 w-4" />
                  Share
                </Button>
                
                <Button
                  variant="outline"
                  onClick={handleSaveToPatientRecord}
                >
                  <Save className="mr-2 h-4 w-4" />
                  Save to Patient Record
                </Button>
                
                <Button
                  variant="default"
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                  onClick={handleSaveToDatabase}
                >
                  <Database className="mr-2 h-4 w-4" />
                  Save to Supabase
                </Button>
              </div>
            </div>
          </CardFooter>
        </Card>
      </div>
    </DashboardLayout>
  );
}
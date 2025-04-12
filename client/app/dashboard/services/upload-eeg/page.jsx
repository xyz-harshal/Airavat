"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import DashboardLayout from "@/app/components/dashboard/layout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Upload, FileText, AlertCircle, Brain, Activity } from "lucide-react";
import AnalysisResults from '@/app/dashboard/services/new-feature/AnalysisResults';

export default function UploadEEGPage() {
  const router = useRouter();
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [patientInfo, setPatientInfo] = useState({
    id: "",
    firstName: "",
    lastName: "",
    age: "",
    gender: "",
    notes: ""
  });
  const [analysisType, setAnalysisType] = useState("comprehensive");
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setSelectedFiles(filesArray);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPatientInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    
    if (selectedFiles.length === 0) return;
    
    setUploading(true);
    
    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        const newProgress = prev + 5;
        if (newProgress >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            // Redirect to analysis page after "processing"
            router.push("/dashboard/services/brain-analysis");
          }, 1500);
          return 100;
        }
        return newProgress;
      });
    }, 200);
  };

  const handleAnalyze = async () => {
    if (selectedFiles.length === 0) {
      setError('Please select a file to upload.');
      return;
    }

    setLoading(true);
    setError(null);

    const formData = new FormData();
    selectedFiles.forEach(file => {
      formData.append('file', file);
    });

    try {
      const response = await fetch('http://127.0.0.1:5000/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload and analyze the EEG file.');
      }

      const result = await response.json();
      setResponse(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto py-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Upload EEG Data</h1>
            <p className="text-muted-foreground mt-1">
              Upload EEG reports for AI-powered brain analysis
            </p>
          </div>
        </div>

        <Tabs defaultValue="upload" className="w-full">
          <TabsList className="grid grid-cols-2 w-full max-w-md">
            <TabsTrigger value="upload">Upload Files</TabsTrigger>
            <TabsTrigger value="formats">Supported Formats</TabsTrigger>
          </TabsList>
          <TabsContent value="upload" className="space-y-4 pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>EEG Data Upload</CardTitle>
                  <CardDescription>
                    Upload EEG data files for analysis by our AI system
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:bg-muted/50 transition-colors">
                      <input 
                        type="file" 
                        id="eeg-file" 
                        className="hidden" 
                        accept=".fif" 
                        onChange={handleFileChange}
                        multiple
                      />
                      <label htmlFor="eeg-file" className="cursor-pointer w-full h-full block">
                        <div className="flex flex-col items-center justify-center">
                          <Upload className="h-10 w-10 text-muted-foreground mb-2" />
                          <p className="font-medium mb-1">Click to upload or drag and drop</p>
                          <p className="text-sm text-muted-foreground mb-2">
                            EDF, BDF, GDF, TXT, CSV, SET, or NMF files
                          </p>
                          {selectedFiles.length > 0 ? (
                            <p className="text-sm font-medium text-primary">{selectedFiles.length} file(s) selected</p>
                          ) : (
                            <p className="text-xs text-muted-foreground">Max file size: 500MB</p>
                          )}
                        </div>
                      </label>
                    </div>
                    
                    {selectedFiles.length > 0 && (
                      <div className="space-y-2">
                        <Label>Selected Files:</Label>
                        <div className="max-h-32 overflow-y-auto space-y-1 bg-muted/20 p-2 rounded-md">
                          {selectedFiles.map((file, index) => (
                            <div key={index} className="flex items-center gap-2 text-sm">
                              <FileText className="h-4 w-4 text-primary" />
                              <span className="truncate">{file.name}</span>
                              <span className="text-xs text-muted-foreground">({(file.size / (1024 * 1024)).toFixed(2)} MB)</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    <div className="space-y-2">
                      <Label>Analysis Type</Label>
                      <Select value={analysisType} onValueChange={setAnalysisType}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select analysis type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="comprehensive">Comprehensive Brain Analysis</SelectItem>
                          <SelectItem value="epilepsy">Epilepsy Detection</SelectItem>
                          <SelectItem value="cognitive">Cognitive Stress Analysis</SelectItem>
                          <SelectItem value="depression">Depression Indicators</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Patient Information</CardTitle>
                  <CardDescription>
                    Enter patient details for accurate analysis
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="patientId">Patient ID</Label>
                        <Input 
                          id="patientId" 
                          name="id" 
                          value={patientInfo.id} 
                          onChange={handleInputChange} 
                          placeholder="e.g., PT-12345"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="age">Age</Label>
                        <Input 
                          id="age" 
                          name="age" 
                          type="number" 
                          value={patientInfo.age} 
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">First Name</Label>
                        <Input 
                          id="firstName" 
                          name="firstName" 
                          value={patientInfo.firstName} 
                          onChange={handleInputChange}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input 
                          id="lastName" 
                          name="lastName" 
                          value={patientInfo.lastName} 
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="gender">Gender</Label>
                      <Select name="gender" onValueChange={(value) => setPatientInfo(prev => ({...prev, gender: value}))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="notes">Clinical Notes</Label>
                      <Textarea 
                        id="notes" 
                        name="notes" 
                        value={patientInfo.notes} 
                        onChange={handleInputChange}
                        placeholder="Enter any relevant clinical history or notes"
                        rows={3}
                      />
                    </div>
                  </form>
                </CardContent>
                <CardFooter>
                  <Button 
                    onClick={handleAnalyze} 
                    disabled={loading || selectedFiles.length === 0}
                    className="w-full"
                  >
                    {loading ? (
                      <div className="flex items-center">
                        <span className="mr-2">Processing</span>
                        <span>{uploadProgress}%</span>
                      </div>
                    ) : (
                      <div className="flex items-center">
                        <Brain className="mr-2 h-4 w-4" />
                        <span>Analyze EEG Data</span>
                      </div>
                    )}
                  </Button>
                </CardFooter>
              </Card>
            </div>

            {uploading && (
              <div className="w-full bg-muted rounded-full h-2.5 overflow-hidden">
                <div 
                  className="bg-primary h-2.5 rounded-full transition-all duration-300 ease-in-out" 
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
            )}

            <Alert className="bg-muted/30 border-primary/30">
              <Brain className="h-4 w-4 text-primary" />
              <AlertTitle>Digital Twin of the Brain</AlertTitle>
              <AlertDescription>
                Our AI system will create a personalized Digital Twin of the Brain based on the EEG data, 
                enabling early detection of neurological conditions and simulation of treatment options.
              </AlertDescription>
            </Alert>
          </TabsContent>
          
          <TabsContent value="formats" className="pt-4 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Supported File Formats</CardTitle>
                <CardDescription>
                  Our system accepts the following EEG data formats
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-muted/20 p-4 rounded-md">
                      <div className="font-medium flex items-center">
                        <FileText className="mr-2 h-4 w-4 text-primary" />
                        <span>EDF (European Data Format)</span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        Standard format for exchange and storage of medical time series data
                      </p>
                    </div>
                    
                    <div className="bg-muted/20 p-4 rounded-md">
                      <div className="font-medium flex items-center">
                        <FileText className="mr-2 h-4 w-4 text-primary" />
                        <span>BDF (Biosemi Data Format)</span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        24-bit extension of the 16-bit EDF format
                      </p>
                    </div>
                    
                    <div className="bg-muted/20 p-4 rounded-md">
                      <div className="font-medium flex items-center">
                        <FileText className="mr-2 h-4 w-4 text-primary" />
                        <span>GDF (General Data Format)</span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        Advanced format supporting multiple sampling rates
                      </p>
                    </div>
                    
                    <div className="bg-muted/20 p-4 rounded-md">
                      <div className="font-medium flex items-center">
                        <FileText className="mr-2 h-4 w-4 text-primary" />
                        <span>SET (EEGLAB dataset)</span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        EEGLAB's native format for storing EEG data
                      </p>
                    </div>
                    
                    <div className="bg-muted/20 p-4 rounded-md">
                      <div className="font-medium flex items-center">
                        <FileText className="mr-2 h-4 w-4 text-primary" />
                        <span>CSV/TXT (Comma/Tab Separated Values)</span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        Generic formats for tabular data
                      </p>
                    </div>
                    
                    <div className="bg-muted/20 p-4 rounded-md">
                      <div className="font-medium flex items-center">
                        <FileText className="mr-2 h-4 w-4 text-primary" />
                        <span>NMF (Neuroscan Format)</span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        Proprietary format from Neuroscan EEG systems
                      </p>
                    </div>
                  </div>

                  <Alert variant="destructive" className="bg-destructive/10 text-destructive border-destructive/30">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Limitations</AlertTitle>
                    <AlertDescription>
                      <ul className="list-disc list-inside text-sm space-y-1">
                        <li>Maximum file size per upload: 500MB</li>
                        <li>Maximum number of files per upload: 10</li>
                        <li>Data must be properly formatted with clear channel labels</li>
                        <li>Patient identifiable information should be removed or anonymized</li>
                      </ul>
                    </AlertDescription>
                  </Alert>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {response ? (
        <AnalysisResults response={response} />
      ) : (
        <Card className="mt-8">
          <CardContent>
            <p className="text-gray-600 text-sm">
              Our AI system will create a personalized Digital Twin of the Brain based on the EEG data, enabling early detection of neurological conditions and simulation of treatment options.
            </p>
          </CardContent>
        </Card>
      )}
    </DashboardLayout>
  );
}

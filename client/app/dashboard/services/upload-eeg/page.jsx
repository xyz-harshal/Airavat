"use client";

import { useState, useEffect } from "react";
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
import { Upload, FileText, AlertCircle, Brain, Activity, UserPlus } from "lucide-react";
import { createPatient } from "@/app/actions/createPatient";
import { fetchPatients } from "@/app/actions/patients";
import { toast } from "sonner";

export default function UploadEEGPage() {
  const router = useRouter();
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [activeTab, setActiveTab] = useState("register");
  const [patientInfo, setPatientInfo] = useState({
    name: "",
    gender: "",
    note: "",
    status: "",
    age: "",
    conditions: [],
    risk: ""
  });
  const [analysisType, setAnalysisType] = useState("comprehensive");
  const [uid, setUid] = useState(null);
  const [isRegisteringPatient, setIsRegisteringPatient] = useState(false);
  const [patients, setPatients] = useState([]);
  const [loadingPatients, setLoadingPatients] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [showPatientList, setShowPatientList] = useState(false);

  // Retrieve UID from localStorage on component mount
  useEffect(() => {
    const userToken = localStorage.getItem('token');
    if (userToken) {
      setUid(userToken);
    } else {
      // Redirect to login if no token found
      toast.error("Authentication required", {
        description: "Please log in to upload EEG data"
      });
      router.push("/login");
    }
  }, [router]);

  // Load patients when tab changes to upload
  useEffect(() => {
    if (activeTab === "upload" && uid) {
      loadPatients();
    }
  }, [activeTab, uid]);

  // Function to load patients from the server
  const loadPatients = async () => {
    if (!uid) return;
    
    setLoadingPatients(true);
    try {
      const data = await fetchPatients();
      if (data && !data.error && data.data) {
        setPatients(data.data);
      } else {
        setPatients([]);
      }
    } catch (error) {
      console.error("Error loading patients:", error);
      toast.error("Failed to load patients", {
        description: "Please try again or contact support"
      });
      setPatients([]);
    } finally {
      setLoadingPatients(false);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setSelectedFiles(filesArray);
    }
  };

  // Handle patient selection
  const handlePatientSelect = (patient) => {
    setSelectedPatient(patient);
    setShowPatientList(false);
  };

  // Handle uploading EEG data for selected patient
  const handleUploadForPatient = async (e) => {
    e.preventDefault();

    if (!uid) {
      toast.error("Authentication required", {
        description: "Please log in to upload EEG data"
      });
      return;
    }

    if (!selectedPatient) {
      toast.error("No patient selected", {
        description: "Please select a patient to analyze"
      });
      return;
    }

    if (selectedFiles.length === 0) {
      toast.error("No files selected", {
        description: "Please select at least one EEG file to upload"
      });
      return;
    }

    setUploading(true);

    try {
      // Create a FormData object to send the file
      const formData = new FormData();
      formData.append('file', selectedFiles[0]); // Upload the first selected file
      
      // Add patient and analysis information to the request
      // Even though the Flask endpoint is currently only checking for file,
      // we'll send all the data, which can be accessed in Flask via request.form
      formData.append('patient_name', selectedPatient.name);
      formData.append('patient_id', selectedPatient.id);
      formData.append('analysis_type', analysisType);
      
      // Make the request to the Flask server
      const response = await fetch('http://localhost:5000/upload', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error(`Upload failed: ${response.statusText}`);
      }
      
      const result = await response.json();
      console.log('Upload result:', result);
      
      // Simulate upload progress
      const interval = setInterval(() => {
        setUploadProgress((prev) => {
          const newProgress = prev + 5;
          if (newProgress >= 100) {
            clearInterval(interval);
            setTimeout(() => {
              toast.success("Upload complete", {
                description: `EEG data analyzed for ${selectedPatient.name}`
              });
              // Navigate to patient records
              router.push("/dashboard/patient-records");
            }, 1500);
            return 100;
          }
          return newProgress;
        });
      }, 200);
    } catch (error) {
      console.error(error);
      toast.error("Error", {
        description: error.message || "Failed to upload EEG data"
      });
    } finally {
      setUploading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPatientInfo((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRegisterPatient = async (e) => {
    e.preventDefault();

    if (!uid) {
      toast.error("Authentication required", {
        description: "Please log in to register a patient"
      });
      return;
    }

    // Validate patient information
    if (!patientInfo.name || !patientInfo.gender || !patientInfo.status || !patientInfo.risk || !patientInfo.age) {
      toast.error("Missing information", {
        description: "Please fill in all required patient information fields"
      });
      return;
    }

    setIsRegisteringPatient(true);

    try {
      // Convert age to number for backend validation
      const patientData = {
        ...patientInfo,
        age: Number(patientInfo.age),
        uid
      };

      await createPatient(patientData);
      toast.success("Patient registered", {
        description: "Patient record has been created successfully"
      });
      
      // Switch to the upload tab
      setActiveTab("upload");
      
      setIsRegisteringPatient(false);
    } catch (error) {
      console.error(error);
      toast.error("Error", {
        description: error.message || "Failed to register patient"
      });
      setIsRegisteringPatient(false);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();

    if (!uid) {
      toast.error("Authentication required", {
        description: "Please log in to upload EEG data"
      });
      return;
    }

    // Validate patient information
    if (!patientInfo.name || !patientInfo.gender || !patientInfo.status || !patientInfo.risk || !patientInfo.age) {
      toast.error("Missing information", {
        description: "Please fill in all required patient information fields"
      });
      return;
    }

    // Convert age to number for backend validation
    const patientData = {
      ...patientInfo,
      age: Number(patientInfo.age),
      uid
    };

    setUploading(true);

    try {
      await createPatient(patientData);
      
      // Simulate upload progress if files are selected
      if (selectedFiles.length > 0) {
        const interval = setInterval(() => {
          setUploadProgress((prev) => {
            const newProgress = prev + 5;
            if (newProgress >= 100) {
              clearInterval(interval);
              setTimeout(() => {
                toast.success("Upload complete", {
                  description: "Patient record created and EEG data uploaded"
                });
                // Navigate directly to patient records
                router.push("/dashboard/patient-records");
              }, 1500);
              return 100;
            }
            return newProgress;
          });
        }, 200);
      } else {
        // No files, just show success and redirect to patient records
        toast.success("Patient registered", {
          description: "Patient record has been created successfully"
        });
        router.push("/dashboard/patient-records");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error", {
        description: error.message || "Failed to create patient record"
      });
    } finally {
      setUploading(false);
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

        <Tabs 
          value={activeTab} 
          onValueChange={setActiveTab} 
          className="w-full"
        >
          <TabsList className="grid grid-cols-3 w-full max-w-md">
            <TabsTrigger value="register">Register Patient</TabsTrigger>
            <TabsTrigger value="upload">Upload EEG</TabsTrigger>
            <TabsTrigger value="formats">Supported Formats</TabsTrigger>
          </TabsList>

          <TabsContent value="register" className="space-y-4 pt-4">
            <div className="max-w-lg mx-auto">
              <Card>
                <CardHeader>
                  <CardTitle>Register New Patient</CardTitle>
                  <CardDescription>
                    Add a new patient to the records without EEG data
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="register-name">Name</Label>
                      <Input
                        id="register-name"
                        name="name"
                        value={patientInfo.name}
                        onChange={handleInputChange}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="register-gender">Gender</Label>
                      <Select
                        name="gender"
                        onValueChange={(value) =>
                          setPatientInfo((prev) => ({ ...prev, gender: value }))
                        }
                      >
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
                      <Label htmlFor="register-note">Clinical Notes</Label>
                      <Textarea
                        id="register-note"
                        name="note"
                        value={patientInfo.note}
                        onChange={handleInputChange}
                        placeholder="Enter any relevant clinical history or notes"
                        rows={3}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="register-status">Status</Label>
                      <Select
                        name="status"
                        onValueChange={(value) =>
                          setPatientInfo((prev) => ({ ...prev, status: value }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="inactive">Inactive</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="register-age">Age</Label>
                      <Input
                        id="register-age"
                        name="age"
                        type="number"
                        value={patientInfo.age}
                        onChange={handleInputChange}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="register-risk">Risk</Label>
                      <Select
                        name="risk"
                        onValueChange={(value) =>
                          setPatientInfo((prev) => ({ ...prev, risk: value }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select risk level" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <Button
                      onClick={handleRegisterPatient}
                      disabled={isRegisteringPatient}
                      className="w-full mt-4"
                    >
                      {isRegisteringPatient ? (
                        <div className="flex items-center">
                          <span className="mr-2">Registering</span>
                        </div>
                      ) : (
                        <div className="flex items-center">
                          <UserPlus className="mr-2 h-4 w-4" />
                          <span>Register Patient</span>
                        </div>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
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
                      <Label>Select Patient</Label>
                      <div className="relative">
                        <Button
                          type="button"
                          variant="outline"
                          className="w-full justify-between"
                          onClick={() => setShowPatientList(!showPatientList)}
                        >
                          {selectedPatient ? (
                            <span>{selectedPatient.name}</span>
                          ) : (
                            <span className="text-muted-foreground">Select a patient</span>
                          )}
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className={`h-4 w-4 transition-transform ${
                              showPatientList ? "rotate-180" : ""
                            }`}
                          >
                            <polyline points="6 9 12 15 18 9"></polyline>
                          </svg>
                        </Button>
                        
                        {showPatientList && (
                          <div className="absolute z-10 mt-1 w-full rounded-md border bg-card shadow-lg">
                            <div className="max-h-60 overflow-auto p-1">
                              {loadingPatients ? (
                                <div className="flex items-center justify-center p-4">
                                  <span className="text-sm text-muted-foreground">Loading patients...</span>
                                </div>
                              ) : patients.length === 0 ? (
                                <div className="flex items-center justify-center p-4">
                                  <span className="text-sm text-muted-foreground">No patients found</span>
                                </div>
                              ) : (
                                <div className="space-y-1">
                                  {patients.map((patient) => (
                                    <button
                                      key={patient.id}
                                      type="button"
                                      className={`w-full rounded-md px-3 py-2 text-left text-sm hover:bg-muted/50 ${
                                        selectedPatient?.id === patient.id ? "bg-muted" : ""
                                      }`}
                                      onClick={() => handlePatientSelect(patient)}
                                    >
                                      {patient.name}
                                    </button>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    
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
                <CardFooter>
                  <Button
                    onClick={handleUploadForPatient}
                    disabled={uploading || !selectedPatient}
                    className="w-full"
                  >
                    {uploading ? (
                      <div className="flex items-center">
                        <span className="mr-2">Processing</span>
                        <span>{uploadProgress}%</span>
                      </div>
                    ) : (
                      <div className="flex items-center">
                        <Brain className="mr-2 h-4 w-4" />
                        <span>{selectedPatient ? `Analyze EEG for ${selectedPatient.name}` : "Select a patient first"}</span>
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

      <Card className="mt-8">
        <CardContent>
          <p className="text-gray-600 text-sm">
            Our AI system will create a personalized Digital Twin of the Brain based on the EEG data, enabling early detection of neurological conditions and simulation of treatment options.
          </p>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}

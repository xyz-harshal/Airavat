"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import DashboardLayout from "@/app/components/dashboard/layout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  Search, 
  Plus, 
  Filter, 
  MoreHorizontal, 
  UserPlus,
  UserRound,
  FileText,
  Calendar,
  Activity,
  Brain,
  FileBarChart2,
  Trash2,
  Mail,
  Phone,
  MapPin,
  Clock,
  ChevronRight,
  Filter as FilterIcon,
  ArrowUpDown
} from "lucide-react";

// Sample patient data
const samplePatients = [
  {
    id: "PAT-1001",
    firstName: "John",
    lastName: "Doe",
    age: 45,
    gender: "Male",
    dateAdded: "2025-03-15",
    lastEEG: "2025-04-01",
    condition: "Epilepsy",
    status: "Active",
    riskLevel: "Medium",
    eegCount: 8,
    nextAppointment: "2025-04-25"
  },
  {
    id: "PAT-1002",
    firstName: "Emma",
    lastName: "Wilson",
    age: 32,
    gender: "Female",
    dateAdded: "2025-02-18",
    lastEEG: "2025-04-05",
    condition: "Cognitive Stress",
    status: "Active",
    riskLevel: "Low",
    eegCount: 3,
    nextAppointment: "2025-05-10"
  },
  {
    id: "PAT-1003",
    firstName: "Robert",
    lastName: "Johnson",
    age: 67,
    gender: "Male",
    dateAdded: "2024-11-30",
    lastEEG: "2025-03-25",
    condition: "Parkinson's",
    status: "Active",
    riskLevel: "High",
    eegCount: 12,
    nextAppointment: "2025-04-20"
  },
  {
    id: "PAT-1004",
    firstName: "Sarah",
    lastName: "Martinez",
    age: 29,
    gender: "Female",
    dateAdded: "2025-01-12",
    lastEEG: "2025-03-22",
    condition: "Depression",
    status: "Active",
    riskLevel: "Medium",
    eegCount: 4,
    nextAppointment: "2025-05-01"
  },
  {
    id: "PAT-1005",
    firstName: "Michael",
    lastName: "Brown",
    age: 52,
    gender: "Male",
    dateAdded: "2024-10-05",
    lastEEG: "2025-03-18",
    condition: "Epilepsy",
    status: "Inactive",
    riskLevel: "Low",
    eegCount: 10,
    nextAppointment: null
  },
  {
    id: "PAT-1006",
    firstName: "Jennifer",
    lastName: "Garcia",
    age: 41,
    gender: "Female",
    dateAdded: "2025-02-28",
    lastEEG: "2025-04-10",
    condition: "Sleep Disorder",
    status: "Active",
    riskLevel: "Medium",
    eegCount: 2,
    nextAppointment: "2025-04-22"
  },
  {
    id: "PAT-1007",
    firstName: "David",
    lastName: "Lee",
    age: 73,
    gender: "Male",
    dateAdded: "2024-12-15",
    lastEEG: "2025-02-20",
    condition: "Alzheimer's",
    status: "Active",
    riskLevel: "High",
    eegCount: 8,
    nextAppointment: "2025-04-18"
  }
];

export default function PatientRecordsPage() {
  const router = useRouter();
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [conditionFilter, setConditionFilter] = useState("all");
  const [sortField, setSortField] = useState("lastEEG");
  const [sortDirection, setSortDirection] = useState("desc");
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [isAddPatientOpen, setIsAddPatientOpen] = useState(false);
  const [newPatient, setNewPatient] = useState({
    firstName: "",
    lastName: "",
    age: "",
    gender: "Male",
    condition: "",
    notes: ""
  });

  useEffect(() => {
    // Check authentication
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    // Simulate fetching patients
    setTimeout(() => {
      setPatients(samplePatients);
      setLoading(false);
    }, 800);
  }, [router]);

  // Handle sort change
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  // Handle patient selection
  const handlePatientSelect = (patient) => {
    setSelectedPatient(patient);
  };

  // Handle new patient input change
  const handleNewPatientChange = (e) => {
    const { name, value } = e.target;
    setNewPatient(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle new patient form submission
  const handleAddPatient = (e) => {
    e.preventDefault();
    
    // Add new patient
    const newId = `PAT-${1000 + patients.length + 1}`;
    const today = new Date().toISOString().split('T')[0];
    
    const patientToAdd = {
      id: newId,
      firstName: newPatient.firstName,
      lastName: newPatient.lastName,
      age: parseInt(newPatient.age),
      gender: newPatient.gender,
      dateAdded: today,
      lastEEG: null,
      condition: newPatient.condition,
      status: "Active",
      riskLevel: "Not assessed",
      eegCount: 0,
      nextAppointment: null
    };
    
    setPatients([patientToAdd, ...patients]);
    setIsAddPatientOpen(false);
    setNewPatient({
      firstName: "",
      lastName: "",
      age: "",
      gender: "Male",
      condition: "",
      notes: ""
    });
  };

  // Apply filters and search
  const filteredPatients = patients.filter(patient => {
    const matchesSearch = 
      patient.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || patient.status.toLowerCase() === statusFilter.toLowerCase();
    const matchesCondition = conditionFilter === "all" || (patient.condition && patient.condition.toLowerCase() === conditionFilter.toLowerCase());
    
    return matchesSearch && matchesStatus && matchesCondition;
  });

  // Apply sorting
  const sortedPatients = [...filteredPatients].sort((a, b) => {
    if (a[sortField] == null) return 1;
    if (b[sortField] == null) return -1;
    
    if (typeof a[sortField] === "string") {
      return sortDirection === "asc" 
        ? a[sortField].localeCompare(b[sortField])
        : b[sortField].localeCompare(a[sortField]);
    } else {
      return sortDirection === "asc" 
        ? a[sortField] - b[sortField]
        : b[sortField] - a[sortField];
    }
  });

  // Get unique conditions for filter
  const conditions = ["all", ...new Set(patients.filter(p => p.condition).map(p => p.condition.toLowerCase()))];

  // Get risk level badge color
  const getRiskBadgeColor = (risk) => {
    switch(risk.toLowerCase()) {
      case "high": return "bg-red-100 text-red-800 hover:bg-red-200";
      case "medium": return "bg-amber-100 text-amber-800 hover:bg-amber-200";
      case "low": return "bg-green-100 text-green-800 hover:bg-green-200";
      default: return "bg-gray-100 text-gray-800 hover:bg-gray-200";
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="container mx-auto py-10 text-center">
          <div className="flex flex-col items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            <p className="mt-4">Loading patient records...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="container mx-auto py-6 space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold">Patient Records</h1>
            <p className="text-muted-foreground">Manage EEG data and brain digital twins for your patients</p>
          </div>
          
          <Button onClick={() => setIsAddPatientOpen(true)} className="whitespace-nowrap">
            <UserPlus className="mr-2 h-4 w-4" />
            Add Patient
          </Button>
        </div>

        {/* Search and filters */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search patients by name or ID..." 
              className="pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex gap-2 flex-wrap md:flex-nowrap">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[160px] whitespace-nowrap">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={conditionFilter} onValueChange={setConditionFilter}>
              <SelectTrigger className="w-[180px] whitespace-nowrap">
                <SelectValue placeholder="Filter by condition" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Conditions</SelectItem>
                {conditions.filter(c => c !== "all").map(condition => (
                  <SelectItem key={condition} value={condition}>
                    {condition.charAt(0).toUpperCase() + condition.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <Tabs defaultValue="table" className="w-full">
          <TabsList className="grid w-[400px] grid-cols-2">
            <TabsTrigger value="table">Table View</TabsTrigger>
            <TabsTrigger value="grid">Grid View</TabsTrigger>
          </TabsList>
          
          {/* Table View */}
          <TabsContent value="table">
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[120px]">
                      <div className="flex items-center cursor-pointer" onClick={() => handleSort("id")}>
                        Patient ID
                        {sortField === "id" && (
                          <ArrowUpDown className={`ml-2 h-4 w-4 ${sortDirection === "desc" ? "transform rotate-180" : ""}`} />
                        )}
                      </div>
                    </TableHead>
                    <TableHead>
                      <div className="flex items-center cursor-pointer" onClick={() => handleSort("lastName")}>
                        Patient Name
                        {sortField === "lastName" && (
                          <ArrowUpDown className={`ml-2 h-4 w-4 ${sortDirection === "desc" ? "transform rotate-180" : ""}`} />
                        )}
                      </div>
                    </TableHead>
                    <TableHead>
                      <div className="flex items-center cursor-pointer" onClick={() => handleSort("age")}>
                        Age
                        {sortField === "age" && (
                          <ArrowUpDown className={`ml-2 h-4 w-4 ${sortDirection === "desc" ? "transform rotate-180" : ""}`} />
                        )}
                      </div>
                    </TableHead>
                    <TableHead>Condition</TableHead>
                    <TableHead>
                      <div className="flex items-center cursor-pointer" onClick={() => handleSort("lastEEG")}>
                        Last EEG
                        {sortField === "lastEEG" && (
                          <ArrowUpDown className={`ml-2 h-4 w-4 ${sortDirection === "desc" ? "transform rotate-180" : ""}`} />
                        )}
                      </div>
                    </TableHead>
                    <TableHead>Risk Level</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedPatients.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="h-24 text-center">
                        No patients found matching your filters
                      </TableCell>
                    </TableRow>
                  ) : (
                    sortedPatients.map((patient) => (
                      <TableRow 
                        key={patient.id} 
                        className="cursor-pointer hover:bg-muted/50"
                        onClick={() => handlePatientSelect(patient)}
                      >
                        <TableCell className="font-medium">{patient.id}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback className="text-xs bg-primary/10 text-primary">
                                {patient.firstName[0]}{patient.lastName[0]}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              {patient.firstName} {patient.lastName}
                              <div className="text-xs text-muted-foreground">
                                {patient.gender}, {patient.age} years
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{patient.age}</TableCell>
                        <TableCell>
                          {patient.condition ? (
                            <Badge variant="outline">
                              {patient.condition}
                            </Badge>
                          ) : (
                            <span className="text-muted-foreground text-sm">Not specified</span>
                          )}
                        </TableCell>
                        <TableCell>
                          {patient.lastEEG ? (
                            <div className="flex items-center gap-1">
                              <Activity className="h-3 w-3 text-primary" />
                              <span>{patient.lastEEG}</span>
                            </div>
                          ) : (
                            <span className="text-muted-foreground text-sm">No EEG data</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge className={getRiskBadgeColor(patient.riskLevel)} variant="secondary">
                            {patient.riskLevel}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={patient.status === "Active" ? "default" : "secondary"}>
                            {patient.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuItem onClick={() => router.push(`/dashboard/services/upload-eeg?patientId=${patient.id}`)}>
                                <Activity className="mr-2 h-4 w-4" />
                                <span>Upload EEG</span>
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Brain className="mr-2 h-4 w-4" />
                                <span>View Digital Twin</span>
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <FileBarChart2 className="mr-2 h-4 w-4" />
                                <span>View Reports</span>
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem>
                                <Trash2 className="mr-2 h-4 w-4" />
                                <span>Remove Patient</span>
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
          
          {/* Grid View */}
          <TabsContent value="grid">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {sortedPatients.map(patient => (
                <Card key={patient.id} className="cursor-pointer hover:border-primary/50 transition-colors" onClick={() => handlePatientSelect(patient)}>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <Badge variant="outline">{patient.id}</Badge>
                      <Badge variant={patient.status === "Active" ? "default" : "secondary"}>
                        {patient.status}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center gap-3 pt-2">
                      <Avatar className="h-12 w-12">
                        <AvatarFallback className="bg-primary/10 text-primary">
                          {patient.firstName[0]}{patient.lastName[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-lg">{patient.firstName} {patient.lastName}</CardTitle>
                        <CardDescription>
                          {patient.gender}, {patient.age} years
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <div className="space-y-2">
                      <div className="grid grid-cols-2 text-sm">
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <Brain className="h-3.5 w-3.5" />
                          <span>Condition:</span>
                        </div>
                        <div className="font-medium">
                          {patient.condition || "Not specified"}
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 text-sm">
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <Activity className="h-3.5 w-3.5" />
                          <span>EEGs:</span>
                        </div>
                        <div className="font-medium">{patient.eegCount}</div>
                      </div>
                      
                      <div className="grid grid-cols-2 text-sm">
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <Clock className="h-3.5 w-3.5" />
                          <span>Last EEG:</span>
                        </div>
                        <div className="font-medium">
                          {patient.lastEEG || "None"}
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 text-sm">
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <Calendar className="h-3.5 w-3.5" />
                          <span>Next Visit:</span>
                        </div>
                        <div className="font-medium">
                          {patient.nextAppointment || "Not scheduled"}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="pt-1">
                    <Badge className={`w-full justify-center ${getRiskBadgeColor(patient.riskLevel)}`} variant="secondary">
                      {patient.riskLevel} Risk
                    </Badge>
                  </CardFooter>
                </Card>
              ))}
              
              {sortedPatients.length === 0 && (
                <div className="col-span-full flex items-center justify-center h-40 border rounded-md border-dashed">
                  <div className="text-center">
                    <p className="text-muted-foreground">No patients found matching your filters</p>
                  </div>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Patient Detail Dialog */}
      {selectedPatient && (
        <Dialog open={!!selectedPatient} onOpenChange={() => setSelectedPatient(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Patient Details</DialogTitle>
              <DialogDescription>
                Detailed information and EEG records
              </DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-6">
              <Card>
                <CardHeader className="pb-2">
                  <div className="flex justify-center">
                    <Avatar className="h-20 w-20">
                      <AvatarFallback className="text-xl bg-primary/10 text-primary">
                        {selectedPatient.firstName[0]}{selectedPatient.lastName[0]}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  <div className="text-center pt-2">
                    <CardTitle>{selectedPatient.firstName} {selectedPatient.lastName}</CardTitle>
                    <CardDescription>{selectedPatient.id}</CardDescription>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <UserRound className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Age:</span>
                    <span className="font-medium">{selectedPatient.age}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm">
                    <UserRound className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Gender:</span>
                    <span className="font-medium">{selectedPatient.gender}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Added on:</span>
                    <span className="font-medium">{selectedPatient.dateAdded}</span>
                  </div>
                  
                  {selectedPatient.nextAppointment && (
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4 text-primary" />
                      <span className="text-muted-foreground">Next appointment:</span>
                      <span className="font-medium">{selectedPatient.nextAppointment}</span>
                    </div>
                  )}
                </CardContent>
                <CardFooter className="flex flex-col items-stretch gap-2">
                  <Badge className={`justify-center ${getRiskBadgeColor(selectedPatient.riskLevel)}`} variant="secondary">
                    {selectedPatient.riskLevel} Risk Level
                  </Badge>
                  <Button variant="outline" className="w-full" onClick={() => router.push(`/dashboard/services/upload-eeg?patientId=${selectedPatient.id}`)}>
                    <Activity className="mr-2 h-4 w-4" />
                    Upload New EEG
                  </Button>
                </CardFooter>
              </Card>
              
              <div className="space-y-4">
                <Tabs defaultValue="eeg">
                  <TabsList className="w-full grid grid-cols-3">
                    <TabsTrigger value="eeg">EEG Records</TabsTrigger>
                    <TabsTrigger value="twins">Digital Twins</TabsTrigger>
                    <TabsTrigger value="reports">Reports</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="eeg" className="space-y-4">
                    <div className="rounded-md border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Date</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {selectedPatient.eegCount > 0 ? (
                            Array.from({ length: Math.min(selectedPatient.eegCount, 3) }).map((_, i) => (
                              <TableRow key={i}>
                                <TableCell>
                                  {new Date(new Date(selectedPatient.lastEEG).getTime() - i * 30 * 24 * 60 * 60 * 1000)
                                    .toISOString().split('T')[0]}
                                </TableCell>
                                <TableCell>
                                  <Badge variant="outline">Standard</Badge>
                                </TableCell>
                                <TableCell>
                                  <Badge variant="default">Analyzed</Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                  <Button variant="ghost" size="icon">
                                    <ChevronRight className="h-4 w-4" />
                                  </Button>
                                </TableCell>
                              </TableRow>
                            ))
                          ) : (
                            <TableRow>
                              <TableCell colSpan={4} className="text-center">
                                <div className="py-4 text-muted-foreground">
                                  No EEG records found
                                </div>
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </div>
                    {selectedPatient.eegCount > 3 && (
                      <div className="text-center">
                        <Button variant="link">View all {selectedPatient.eegCount} EEG records</Button>
                      </div>
                    )}
                  </TabsContent>
                  
                  <TabsContent value="twins">
                    <div className="border rounded-lg p-6 text-center min-h-[180px] flex flex-col items-center justify-center">
                      {selectedPatient.eegCount > 0 ? (
                        <div className="space-y-4">
                          <div className="flex justify-center">
                            <Brain className="h-12 w-12 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-medium">Brain Digital Twin Available</h3>
                            <p className="text-sm text-muted-foreground">
                              Last updated on {selectedPatient.lastEEG}
                            </p>
                          </div>
                          <Button>
                            View Digital Twin
                          </Button>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <p className="text-muted-foreground">No digital twin models available</p>
                          <p className="text-sm text-muted-foreground">Upload EEG data to create a digital twin</p>
                        </div>
                      )}
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="reports" className="space-y-4">
                    {selectedPatient.eegCount > 0 ? (
                      <div className="space-y-2">
                        <Card>
                          <CardContent className="p-4 flex justify-between items-center">
                            <div className="flex items-center gap-3">
                              <FileBarChart2 className="h-8 w-8 text-primary" />
                              <div>
                                <h4 className="font-medium">Comprehensive Analysis Report</h4>
                                <p className="text-sm text-muted-foreground">Generated on {selectedPatient.lastEEG}</p>
                              </div>
                            </div>
                            <Button variant="outline" size="sm">View</Button>
                          </CardContent>
                        </Card>
                        
                        <Card>
                          <CardContent className="p-4 flex justify-between items-center">
                            <div className="flex items-center gap-3">
                              <Activity className="h-8 w-8 text-primary" />
                              <div>
                                <h4 className="font-medium">Longitudinal Comparison</h4>
                                <p className="text-sm text-muted-foreground">Last 3 EEG sessions</p>
                              </div>
                            </div>
                            <Button variant="outline" size="sm">View</Button>
                          </CardContent>
                        </Card>
                        
                        {selectedPatient.condition && (
                          <Card>
                            <CardContent className="p-4 flex justify-between items-center">
                              <div className="flex items-center gap-3">
                                <FileText className="h-8 w-8 text-primary" />
                                <div>
                                  <h4 className="font-medium">{selectedPatient.condition} Assessment</h4>
                                  <p className="text-sm text-muted-foreground">Specialized analysis report</p>
                                </div>
                              </div>
                              <Button variant="outline" size="sm">View</Button>
                            </CardContent>
                          </Card>
                        )}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        <p>No reports available</p>
                        <p className="text-sm">Upload EEG data to generate reports</p>
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
      
      {/* Add New Patient Dialog */}
      <Dialog open={isAddPatientOpen} onOpenChange={setIsAddPatientOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Patient</DialogTitle>
            <DialogDescription>
              Enter the patient's information to create a new record
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleAddPatient} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input 
                  id="firstName" 
                  name="firstName"
                  value={newPatient.firstName}
                  onChange={handleNewPatientChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input 
                  id="lastName" 
                  name="lastName"
                  value={newPatient.lastName}
                  onChange={handleNewPatientChange}
                  required
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="age">Age</Label>
                <Input 
                  id="age" 
                  name="age"
                  type="number"
                  min="0"
                  max="120"
                  value={newPatient.age}
                  onChange={handleNewPatientChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label>Gender</Label>
                <RadioGroup 
                  defaultValue={newPatient.gender}
                  onValueChange={(value) => setNewPatient(prev => ({ ...prev, gender: value }))}
                  className="flex gap-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Male" id="male" />
                    <Label htmlFor="male">Male</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Female" id="female" />
                    <Label htmlFor="female">Female</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="condition">Neurological Condition (if known)</Label>
              <Input 
                id="condition" 
                name="condition"
                value={newPatient.condition}
                onChange={handleNewPatientChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="notes">Clinical Notes</Label>
              <Input 
                id="notes" 
                name="notes"
                value={newPatient.notes}
                onChange={handleNewPatientChange}
              />
            </div>
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsAddPatientOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Add Patient</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}

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
import { fetchPatients, createPatient } from "@/app/actions/patients";

export default function PatientRecordsPage() {
  const router = useRouter();
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [conditionFilter, setConditionFilter] = useState("all");
  const [sortField, setSortField] = useState("uid");
  const [sortDirection, setSortDirection] = useState("desc");
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [isAddPatientOpen, setIsAddPatientOpen] = useState(false);
  const [newPatient, setNewPatient] = useState({
    name: "",
    age: "",
    gender: "Male",
    note: "",
    status: "Active",
    conditions: [],
    risk: "Not assessed"
  });

  useEffect(() => {
    // Check authentication
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    // Fetch patients from the server
    const loadPatients = async () => {
      try {
        const response = await fetchPatients();
        console.log("Fetched patients:", response);
        if (!response.error && response.data) {
          setPatients(response.data);
        } else {
          console.error("Error fetching patients:", response.message);
        }
      } catch (error) {
        console.error("Failed to load patients:", error);
      } finally {
        setLoading(false);
      }
    };

    loadPatients();
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

  // Apply filters and search
  const filteredPatients = patients.filter(patient => {
    const matchesSearch = 
      patient.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.id?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || patient.status?.toLowerCase() === statusFilter.toLowerCase();
    
    // Check for conditions as an array
    const patientConditions = patient.conditions || [];
    const hasMatchingCondition = conditionFilter === "all" || 
      (Array.isArray(patientConditions) && 
       patientConditions.some(c => c.toLowerCase() === conditionFilter.toLowerCase()));
    
    return matchesSearch && matchesStatus && hasMatchingCondition;
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
  const allConditions = patients.flatMap(p => p.conditions || []);
  const conditions = ["all", ...new Set(allConditions.map(c => c.toLowerCase()))];

  // Get risk level badge color
  const getRiskBadgeColor = (risk) => {
    switch(risk?.toLowerCase()) {
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
                      <div className="flex items-center cursor-pointer" onClick={() => handleSort("uid")}>
                        Patient ID
                        {sortField === "id" && (
                          <ArrowUpDown className={`ml-2 h-4 w-4 ${sortDirection === "desc" ? "transform rotate-180" : ""}`} />
                        )}
                      </div>
                    </TableHead>
                    <TableHead>
                      <div className="flex items-center cursor-pointer" onClick={() => handleSort("name")}>
                        Patient Name
                        {sortField === "name" && (
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
                    <TableHead>Conditions</TableHead>
                    <TableHead>Risk Level</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedPatients.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="h-24 text-center">
                        No patients found matching your filters
                      </TableCell>
                    </TableRow>
                  ) : (
                    sortedPatients.map((patient) => (
                      <TableRow 
                        key={patient.id} 
                        className="cursor-pointer hover:bg-muted/50"
                      >
                        <TableCell className="font-medium">{patient.id.substring(0,8)}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback className="text-xs bg-primary/10 text-primary">
                                {patient.name.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              {patient.name}
                              <div className="text-xs text-muted-foreground">
                                {patient.gender}, {patient.age} years
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{patient.age}</TableCell>
                        <TableCell>
                          {patient.conditions && patient.conditions.length > 0 ? (
                            <div className="flex flex-wrap gap-1">
                              {patient.conditions.map((condition, index) => (
                                <Badge key={index} variant="outline">
                                  {condition}
                                </Badge>
                              ))}
                            </div>
                          ) : (
                            <span className="text-muted-foreground text-sm">None specified</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge className={getRiskBadgeColor(patient.risk)} variant="secondary">
                            {patient.risk}
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
                      <Badge variant="outline">{patient.id.substring(0, 8)}</Badge>
                      <Badge variant={patient.status === "Active" ? "default" : "secondary"}>
                        {patient.status}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center gap-3 pt-2">
                      <Avatar className="h-12 w-12">
                        <AvatarFallback className="bg-primary/10 text-primary">
                          {patient.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-lg">{patient.name}</CardTitle>
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
                          <span>Conditions:</span>
                        </div>
                        <div className="font-medium">
                          {patient.conditions && patient.conditions.length > 0 
                            ? patient.conditions.join(", ") 
                            : "None specified"}
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 text-sm">
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <UserRound className="h-3.5 w-3.5" />
                          <span>Status:</span>
                        </div>
                        <div className="font-medium">{patient.status}</div>
                      </div>
                      
                      <div className="grid grid-cols-2 text-sm">
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <FileText className="h-3.5 w-3.5" />
                          <span>Notes:</span>
                        </div>
                        <div className="font-medium">
                          {patient.note || "None"}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="pt-1">
                    <Badge className={`w-full justify-center ${getRiskBadgeColor(patient.risk)}`} variant="secondary">
                      {patient.risk} Risk
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
      
    </DashboardLayout>
  );
}

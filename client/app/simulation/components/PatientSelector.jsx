"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, Activity } from "lucide-react";

// Sample patient data
const samplePatients = [
  {
    id: "PAT-1001",
    name: "John Doe",
    age: 45,
    gender: "Male",
    condition: "Epilepsy",
    lastEEG: "2025-04-01",
    hasTwin: true
  },
  {
    id: "PAT-1002",
    name: "Emma Wilson",
    age: 32,
    gender: "Female",
    condition: "Cognitive Stress",
    lastEEG: "2025-04-05",
    hasTwin: true
  },
  {
    id: "PAT-1003",
    name: "Robert Johnson",
    age: 67,
    gender: "Male",
    condition: "Parkinson's",
    lastEEG: "2025-03-25",
    hasTwin: true
  },
  {
    id: "PAT-1004",
    name: "Sarah Martinez",
    age: 29,
    gender: "Female",
    condition: "Depression",
    lastEEG: "2025-03-22",
    hasTwin: true
  },
  {
    id: "PAT-1005",
    name: "Michael Brown",
    age: 52,
    gender: "Male",
    condition: "Epilepsy",
    lastEEG: "2025-03-18",
    hasTwin: false
  }
];

export default function PatientSelector({ onSelectPatient }) {
  const [patients, setPatients] = useState([]);
  const [selectedPatientId, setSelectedPatientId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call to fetch patients
    const fetchPatients = async () => {
      // In a real application, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 600));
      setPatients(samplePatients.filter(p => p.hasTwin));
      setLoading(false);
    };

    fetchPatients();
  }, []);

  const handleSelectPatient = (patient) => {
    setSelectedPatientId(patient.id);
    onSelectPatient(patient);
  };

  // Filter patients by search term
  const filteredPatients = patients.filter(patient => 
    patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.condition.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-medium">Select Patient</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Search input */}
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search patients..." 
              className="pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          {/* Patient list */}
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <ScrollArea className="h-[calc(100vh-450px)] pr-3">
              <div className="space-y-2">
                {filteredPatients.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No patients with brain digital twins found
                  </div>
                ) : (
                  filteredPatients.map(patient => (
                    <div
                      key={patient.id}
                      className={`p-3 rounded-lg cursor-pointer transition-colors flex items-center gap-3 ${
                        selectedPatientId === patient.id 
                          ? "bg-primary text-primary-foreground" 
                          : "hover:bg-muted"
                      }`}
                      onClick={() => handleSelectPatient(patient)}
                    >
                      <Avatar className="h-10 w-10">
                        <AvatarFallback className={`text-xs ${
                          selectedPatientId === patient.id 
                            ? "bg-primary-foreground text-primary" 
                            : "bg-primary/10 text-primary"
                        }`}>
                          {patient.name.split(" ").map(n => n[0]).join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <div className="font-medium truncate">{patient.name}</div>
                          <Badge variant={selectedPatientId === patient.id ? "outline" : "secondary"} className="ml-2">
                            {patient.id}
                          </Badge>
                        </div>
                        <div className={`text-sm ${
                          selectedPatientId === patient.id 
                            ? "text-primary-foreground/80" 
                            : "text-muted-foreground"
                        }`}>
                          {patient.condition} • {patient.age} years
                        </div>
                        <div className="flex items-center gap-1 text-xs mt-1">
                          <Activity className={`h-3 w-3 ${
                            selectedPatientId === patient.id 
                              ? "text-primary-foreground/70" 
                              : "text-primary"
                          }`} />
                          <span className={selectedPatientId === patient.id 
                            ? "text-primary-foreground/70" 
                            : "text-muted-foreground"
                          }>
                            Last EEG: {patient.lastEEG}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </ScrollArea>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

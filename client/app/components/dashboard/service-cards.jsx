import React from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Upload, 
  Brain, 
  Activity, 
  LineChart, 
  FilePlus2, 
  History, 
  ArrowRight, 
  Pill, 
  Scalpel
} from "lucide-react";
import Link from "next/link";

const services = [
  {
    id: 1,
    name: "Upload EEG Data",
    description: "Upload EEG reports for AI analysis and create a personalized Digital Twin of the Brain.",
    icon: Upload,
    iconColor: "text-blue-500",
    iconBg: "bg-blue-500/10",
    status: "Primary",
    link: "/dashboard/services/upload-eeg"
  },
  {
    id: 2,
    name: "Medication Simulation",
    description: "Model the potential effects of medications on the patient's brain activity.",
    icon: Pill,
    iconColor: "text-cyan-500",
    iconBg: "bg-cyan-500/10",
    status: "Available",
    link: "/dashboard/services/medication-simulation"
  },
  {
    id: 3,
    name: "Surgical Intervention Planning",
    description: "Support clinical decision-making for surgical interventions with brain simulations.",
    icon: Scalpel,
    iconColor: "text-indigo-500",
    iconBg: "bg-indigo-500/10",
    status: "Available",
    link: "/dashboard/services/surgical-planning"
  },
  {
    id: 4,
    name: "Patient History",
    description: "Access historical EEG data and track changes in brain activity over time.",
    icon: History,
    iconColor: "text-teal-500",
    iconBg: "bg-teal-500/10",
    status: "Available",
    link: "/dashboard/services/patient-history"
  }
];

export default function ServiceCards() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {services.map(service => {
        const IconComponent = service.icon;
        
        return (
          <Card key={service.id} className="flex flex-col overflow-hidden border border-muted/30">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full ${service.iconBg} flex items-center justify-center`}>
                  {IconComponent && <IconComponent className={`w-4 h-4 ${service.iconColor}`} />}
                </div>
                <CardTitle className="text-lg font-semibold">{service.name}</CardTitle>
              </div>
              {service.status === "Primary" && (
                <Badge className="absolute top-3 right-3 bg-primary text-white">
                  Primary
                </Badge>
              )}
            </CardHeader>
            <CardContent className="flex-1 pb-4">
              <p className="text-sm text-muted-foreground">
                {service.description}
              </p>
            </CardContent>
            <CardFooter className="pt-0">
              <Link href={service.link} className="w-full">
                <Button variant="outline" className="w-full group">
                  <span>Access Tool</span>
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
}

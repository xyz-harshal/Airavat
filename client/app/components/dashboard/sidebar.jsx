"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Brain,
  BarChart2,
  Settings,
  Users,
  Upload,
  Activity,
  Pill,
  Microscope,
  LineChart,
  FileBarChart2,
  FilePlus2,
  History,
  Scalpel,
  Bell,
  MessageSquare,
} from "lucide-react";

const navItems = [
  { name: "Dashboard", href: "/dashboard", icon: Home },
  { name: "NeuroAssistant", href: "/chat", icon: MessageSquare },
  { 
    name: "EEG Analysis", 
    href: "#", 
    icon: Brain,
    subItems: [
      { name: "Upload EEG Data", href: "/dashboard/services/upload-eeg", icon: Upload },
      { name: "Brain Analysis", href: "/dashboard/services/brain-analysis", icon: Microscope },
      { name: "Epilepsy Detection", href: "/dashboard/services/epilepsy-detection", icon: Activity },
      { name: "Cognitive Stress", href: "/dashboard/services/cognitive-analysis", icon: LineChart },
      { name: "Depression Indicators", href: "/dashboard/services/depression-indicators", icon: FilePlus2 },
    ]
  },
  { 
    name: "Treatment Planning", 
    href: "#", 
    icon: Pill,
    subItems: [
      { name: "Medication Simulation", href: "/dashboard/services/medication-simulation", icon: Pill },
      { name: "Surgical Planning", href: "/dashboard/services/surgical-planning", icon: Scalpel },
    ]
  },
  { name: "Patient Records", href: "/dashboard/patient-records", icon: Users },
  { name: "Historical Data", href: "/dashboard/services/patient-history", icon: History },
  { name: "Analytics", href: "/dashboard/analytics", icon: BarChart2 },
  { name: "Reports", href: "/dashboard/reports", icon: FileBarChart2 },
  { name: "Notifications", href: "/dashboard/notifications", icon: Bell },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
];

export default function DashboardSidebar() {
  const pathname = usePathname();
  
  return (
    <div className="w-64 h-full bg-card border-r flex flex-col overflow-y-auto">
      <div className="p-6">
        <h2 className="text-2xl font-bold text-primary">BrainTwin</h2>
        <p className="text-sm text-muted-foreground">Digital Twin of the Brain</p>
      </div>
      
      <nav className="flex-1 space-y-1 px-4 pb-6">
        {navItems.map((item) => {
          const isActive = pathname === item.href || 
                          (item.subItems && item.subItems.some(sub => pathname === sub.href));
          
          return (
            <div key={item.name}>
              {item.subItems ? (
                <div className="mb-2">
                  <div className={`flex items-center px-3 py-2 rounded-md text-sm ${isActive ? 'bg-muted text-foreground font-medium' : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'}`}>
                    <item.icon className="mr-2 h-4 w-4" />
                    <span>{item.name}</span>
                  </div>
                  <div className="pl-4 mt-1 space-y-1">
                    {item.subItems.map((subItem) => {
                      const isSubActive = pathname === subItem.href;
                      const IconComponent = subItem.icon;
                      
                      return (
                        <Link
                          key={subItem.name}
                          href={subItem.href}
                          className={`flex items-center px-3 py-2 rounded-md text-xs ${isSubActive ? 'bg-muted text-foreground font-medium' : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'}`}
                        >
                          {IconComponent && <IconComponent className="mr-2 h-3 w-3" />}
                          <span>{subItem.name}</span>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <Link
                  href={item.href}
                  className={`flex items-center px-3 py-2 rounded-md text-sm mb-1 ${isActive ? 'bg-muted text-foreground font-medium' : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'}`}
                >
                  <item.icon className="mr-2 h-4 w-4" />
                  <span>{item.name}</span>
                </Link>
              )}
            </div>
          );
        })}
      </nav>
      
      <div className="px-4 py-4 border-t">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
            <Users className="h-4 w-4 text-primary" />
          </div>
          <div>
            <p className="text-sm font-medium">Clinical Team</p>
            <p className="text-xs text-muted-foreground">Neurology Department</p>
          </div>
        </div>
      </div>
    </div>
  );
}

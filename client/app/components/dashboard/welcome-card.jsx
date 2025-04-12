import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Upload, FileCheck, Users } from "lucide-react";
import Link from "next/link";

export default function WelcomeCard({ username }) {
  return (
    <Card className="shadow-sm h-full">
      <CardHeader className="pb-2">
        <CardTitle>Welcome back, Dr. {username || 'Clinician'}</CardTitle>
        <CardDescription>
          Your Digital Twin Brain Analysis Dashboard
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Make the stats more responsive with grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
          <div className="bg-muted/20 p-4 rounded-md">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium text-muted-foreground">Patient Records</h4>
              <Users className="h-4 w-4 text-muted-foreground" />
            </div>
            <p className="text-2xl font-bold">28</p>
            <p className="text-xs text-muted-foreground mt-1">12 active treatment plans</p>
          </div>
          <div className="bg-muted/20 p-4 rounded-md">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium text-muted-foreground">EEG Uploads</h4>
              <Upload className="h-4 w-4 text-muted-foreground" />
            </div>
            <p className="text-2xl font-bold">14</p>
            <p className="text-xs text-muted-foreground mt-1">3 pending analysis</p>
          </div>
          <div className="bg-muted/20 p-4 rounded-md">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium text-muted-foreground">Reports Generated</h4>
              <FileCheck className="h-4 w-4 text-muted-foreground" />
            </div>
            <p className="text-2xl font-bold">42</p>
            <p className="text-xs text-muted-foreground mt-1">Last report: 2 hours ago</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-muted-foreground">Quick Actions</h4>
            <div className="grid grid-cols-2 gap-2">
              <Link href="/dashboard/services/upload-eeg">
                <Button variant="outline" className="w-full justify-start">
                  <Upload className="mr-2 h-4 w-4" />
                  <span>Upload New EEG</span>
                </Button>
              </Link>
              <Link href="/dashboard/patient-records">
                <Button variant="outline" className="w-full justify-start">
                  <Users className="mr-2 h-4 w-4" />
                  <span>Patient Records</span>
                </Button>
              </Link>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="text-sm font-medium text-muted-foreground">Recent Activity</h4>
            <div className="space-y-2">
              <div className="bg-muted/10 p-2 rounded-md text-xs">
                <p className="font-medium">EEG Analysis Completed</p>
                <p className="text-muted-foreground">Patient ID: 8294 • 45 minutes ago</p>
              </div>
              <div className="bg-muted/10 p-2 rounded-md text-xs">
                <p className="font-medium">Treatment Simulation Saved</p>
                <p className="text-muted-foreground">Patient ID: 7156 • 2 hours ago</p>
              </div>
            </div>
          </div>
        </div>

      </CardContent>
    </Card>
  );
}

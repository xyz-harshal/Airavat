import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export default function WelcomeCard({ username }) {
  return (
    <Card className="shadow-sm h-full">
      <CardHeader className="pb-2">
        <CardTitle>Welcome back, {username || 'User'}</CardTitle>
        <CardDescription>
          Here's an overview of your AI services and usage
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Make the stats more responsive with grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
          <div className="bg-muted/20 p-4 rounded-md">
            <h4 className="text-sm font-medium text-muted-foreground">API Credits</h4>
            <p className="text-2xl font-bold">2,500</p>
            <p className="text-xs text-muted-foreground mt-1">5,000 credits total</p>
          </div>
          <div className="bg-muted/20 p-4 rounded-md">
            <h4 className="text-sm font-medium text-muted-foreground">Active Services</h4>
            <p className="text-2xl font-bold">4</p>
            <p className="text-xs text-muted-foreground mt-1">Out of 6 total services</p>
          </div>
          <div className="bg-muted/20 p-4 rounded-md">
            <h4 className="text-sm font-medium text-muted-foreground">Current Plan</h4>
            <p className="text-2xl font-bold">Pro</p>
            <p className="text-xs text-muted-foreground mt-1">Renews on Nov 1, 2023</p>
          </div>
        </div>
        <div>
          <Link href="/dashboard/services">
            <Button className="flex w-full sm:w-auto items-center gap-2">
              <span>Explore AI Services</span> 
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

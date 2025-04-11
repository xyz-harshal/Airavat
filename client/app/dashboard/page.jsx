"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import DashboardLayout from "@/app/components/dashboard/layout";
import WelcomeCard from "@/app/components/dashboard/welcome-card";
import StatisticsPanel from "@/app/components/dashboard/statistics-panel";
import RecentActivity from "@/app/components/dashboard/recent-activity";
import ServiceCards from "@/app/components/dashboard/service-cards";

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if the user is authenticated
    const token = localStorage.getItem('token');
    const username = localStorage.getItem('username');
    
    if (!token) {
      router.push('/login');
      return;
    }
    
    setUser({ username });
    setLoading(false);
    
    // Here you would typically fetch user data from your API
    // For example: fetchUserData(token).then(data => setUser(data))
  }, [router]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  return (
    <DashboardLayout>
      <div className="grid gap-6">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        
        {/* Improve the grid layout for better responsiveness */}
        <div className="grid gap-6 grid-cols-1 lg:grid-cols-4">
          {/* Welcome card takes full width on mobile, 2 columns on larger screens */}
          <div className="col-span-1 lg:col-span-2">
            <WelcomeCard username={user?.username} />
          </div>
          
          {/* Statistics panel takes full width on mobile, 2 columns on larger screens */}
          <div className="col-span-1 lg:col-span-2">
            <StatisticsPanel />
          </div>
        </div>
        
        <h2 className="text-2xl font-bold mt-6">AI Services</h2>
        <div className="w-full overflow-x-auto">
          <ServiceCards />
        </div>
        
        <div className="mt-6">
          <RecentActivity />
        </div>
      </div>
    </DashboardLayout>
  );
}

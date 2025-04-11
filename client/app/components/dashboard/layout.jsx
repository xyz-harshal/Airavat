"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import DashboardSidebar from "./sidebar";
import { ModeToggle } from "../toggleTheme";
import NotificationsModal from "./notifications-modal";
import { Badge } from "@/components/ui/badge";
import { 
  User,
  ChevronDown,
  Menu,
} from "lucide-react";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import Link from "next/link";

export default function DashboardLayout({ children }) {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
      setUsername(storedUsername);
    } else {
      router.push('/login');
    }

    // Close sidebar when screen is resized beyond mobile breakpoint
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setSidebarOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [router]);

  const handleSignOut = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    router.push('/login');
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex h-screen bg-background">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <DashboardSidebar />
      </div>
      
      {/* Mobile Sidebar */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden ">
          <div className="absolute inset-0 bg-black/50" onClick={toggleSidebar}></div>
          <div className="absolute left-0 top-0 h-full w-64 bg-card shadow-lg overflow-scroll pt-6">
            <DashboardSidebar />
          </div>
        </div>
      )}
      
      {/* Main Content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Top Navigation */}
        <header className="flex items-center justify-between px-4 sm:px-6 py-4 border-b">
          <div className="flex items-center space-x-4">
            <button 
              className="lg:hidden p-2 rounded-md hover:bg-muted" 
              onClick={toggleSidebar}
            >
              <Menu className="w-5 h-5" />
            </button>
            <Badge variant="outline" className="px-3 py-1 text-lg font-bold text-primary">
              Airavat
            </Badge>
          </div>
          
          <div className="flex items-center space-x-2 sm:space-x-4">
            <ModeToggle />
            
            {/* Add the notifications modal */}
            <NotificationsModal />
            
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center space-x-1 sm:space-x-2 cursor-pointer">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                  <User className="w-5 h-5" />
                </div>
                <span className="hidden sm:inline">{username}</span>
                <ChevronDown className="w-4 h-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <Link href="/dashboard/profile">
                  <DropdownMenuItem>Profile</DropdownMenuItem>
                </Link>
                <Link href="/dashboard/settings">
                  <DropdownMenuItem>Settings</DropdownMenuItem>
                </Link>
                <Link href="/dashboard/billing">
                  <DropdownMenuItem>Billing</DropdownMenuItem>
                </Link>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut}>
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>
        
        {/* Dashboard Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}

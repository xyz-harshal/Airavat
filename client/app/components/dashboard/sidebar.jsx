"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Layers,
  BarChart2,
  Settings,
  CreditCard,
  MessageSquare,
  Image,
  FileText,
  Code,
  Wand2,
  Bell,
} from "lucide-react";

const navItems = [
  { name: "Overview", href: "/dashboard", icon: Home },
  { 
    name: "Tools", 
    href: "#", 
    icon: Wand2,
    subItems: [
      { name: "Chat Assistant", href: "/chat", icon: MessageSquare },
      { name: "Image Generation", href: "/dashboard/services/image", icon: Image },
      { name: "Text Generation", href: "/dashboard/services/text", icon: FileText },
      { name: "Code Assistant", href: "/dashboard/services/code", icon: Code },
    ]
  },
  { name: "Analytics", href: "/dashboard/analytics", icon: BarChart2 },
  { name: "Notifications", href: "/dashboard/notifications", icon: Bell },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
  { name: "Billing", href: "/dashboard/billing", icon: CreditCard },
];

export default function DashboardSidebar() {
  const pathname = usePathname();
  
  return (
    <div className="w-64 h-full bg-card border-r flex flex-col overflow-y-auto">
      <div className="p-6">
        <h2 className="text-2xl font-bold text-primary">Airavat</h2>
        <p className="text-sm text-muted-foreground">AI Services Platform</p>
      </div>
      
      <nav className="flex-1 space-y-1 px-4 pb-6">
        {navItems.map((item) => {
          const isActive = pathname === item.href || 
                          (item.subItems && item.subItems.some(sub => pathname === sub.href));
          const IconComponent = item.icon;
          
          return (
            <div key={item.name}>
              <Link href={item.href}>
                <div 
                  className={`
                    flex items-center px-3 py-2 rounded-md text-sm font-medium cursor-pointer
                    ${isActive 
                      ? 'bg-primary text-primary-foreground' 
                      : 'text-foreground hover:bg-muted'
                    }
                  `}
                >
                  <IconComponent className="mr-3 h-5 w-5" />
                  {item.name}
                </div>
              </Link>
              
              {item.subItems && (
                <div className="ml-6 mt-1 space-y-1">
                  {item.subItems.map((subItem) => {
                    const isSubActive = pathname === subItem.href;
                    const SubIconComponent = subItem.icon;
                    
                    return (
                      <Link href={subItem.href} key={subItem.name}>
                        <div 
                          className={`
                            flex items-center px-3 py-2 rounded-md text-sm font-medium cursor-pointer
                            ${isSubActive 
                              ? 'bg-primary text-primary-foreground' 
                              : 'text-foreground hover:bg-muted'
                            }
                          `}
                        >
                          <SubIconComponent className="mr-3 h-4 w-4" />
                          {subItem.name}
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>
      
      <div className="p-4 border-t">
        <div className="bg-muted/50 rounded-md p-4">
          <p className="text-sm font-medium">Usage</p>
          <div className="mt-2 space-y-2">
            <div>
              <div className="flex justify-between text-xs">
                <span>API Calls</span>
                <span>65%</span>
              </div>
              <div className="h-2 bg-muted mt-1 rounded-full">
                <div className="h-2 bg-primary rounded-full" style={{ width: "65%" }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs">
                <span>Storage</span>
                <span>40%</span>
              </div>
              <div className="h-2 bg-muted mt-1 rounded-full">
                <div className="h-2 bg-primary rounded-full" style={{ width: "40%" }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

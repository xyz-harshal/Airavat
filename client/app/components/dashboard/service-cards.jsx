import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MessageSquare, Image as ImageIcon, FileText, Code, Sparkles, ArrowRight } from "lucide-react";
import Link from "next/link";

const services = [
  {
    id: 1,
    name: "AI Chat Assistant",
    description: "Interact with an AI assistant for help with various tasks, answering questions, and more.",
    icon: MessageSquare,
    iconColor: "text-blue-500",
    iconBg: "bg-blue-500/10",
    status: "Available",
    link: "/dashboard/services/chat"
  },
  {
    id: 2,
    name: "Image Generation",
    description: "Create unique, realistic images from text descriptions for your projects.",
    icon: ImageIcon,
    iconColor: "text-purple-500",
    iconBg: "bg-purple-500/10",
    status: "Available",
    link: "/dashboard/services/image"
  },
  {
    id: 3,
    name: "Text Generation",
    description: "Generate high-quality content like articles, stories, and product descriptions.",
    icon: FileText,
    iconColor: "text-green-500",
    iconBg: "bg-green-500/10",
    status: "Available",
    link: "/dashboard/services/text"
  },
  {
    id: 4,
    name: "Code Assistant",
    description: "Get help writing, explaining, and refactoring code across multiple programming languages.",
    icon: Code,
    iconColor: "text-amber-500",
    iconBg: "bg-amber-500/10",
    status: "Available",
    link: "/dashboard/services/code"
  },
  {
    id: 5,
    name: "AI Workflow Automation",
    description: "Build automated workflows powered by AI to streamline your business processes.",
    icon: Sparkles,
    iconColor: "text-pink-500",
    iconBg: "bg-pink-500/10",
    status: "Coming Soon",
    link: "#"
  },
];

export default function ServiceCards() {
  return (
    // Improve grid responsiveness with explicit breakpoints
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
      {services.map((service) => {
        const IconComponent = service.icon;
        const isComingSoon = service.status === "Coming Soon";
        
        return (
          <Card key={service.id} className="overflow-hidden h-full flex flex-col">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div className={`p-2 rounded-md ${service.iconBg}`}>
                  <IconComponent className={`h-5 w-5 ${service.iconColor}`} />
                </div>
                <Badge 
                  variant="outline" 
                  className={`
                    ${isComingSoon 
                      ? 'bg-amber-500/10 text-amber-500' 
                      : 'bg-green-500/10 text-green-500'
                    }
                  `}
                >
                  {service.status}
                </Badge>
              </div>
              <CardTitle className="mt-4 text-lg sm:text-xl">{service.name}</CardTitle>
            </CardHeader>
            <CardContent className="flex-grow">
              <p className="text-sm text-muted-foreground">
                {service.description}
              </p>
            </CardContent>
            <CardFooter>
              <Link href={service.link} className="w-full">
                <Button 
                  variant={isComingSoon ? "outline" : "default"}
                  className="w-full" 
                  disabled={isComingSoon}
                >
                  {isComingSoon ? "Coming Soon" : "Launch"} 
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
}

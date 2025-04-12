import { ModeToggle } from "./toggleTheme";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

export function Navbar() {
  return (
    <nav className="w-full bg-background border-b border-muted/20">
      <div className="container mx-auto px-4 md:px-6 flex items-center justify-between py-4">
        <Link href="/">
          <Badge variant="outline" className="px-3 py-1 text-lg font-bold text-primary cursor-pointer hover:bg-primary/5 transition-colors">
            BrainTwin
          </Badge>
        </Link>
        <div className="flex items-center gap-6">
          <Link href="/dashboard" className="text-sm font-medium hover:text-primary transition-colors">Dashboard</Link>
          <Link href="/chat" className="text-sm font-medium hover:text-primary transition-colors">AI Assistant</Link>
          <Link href="/dashboard/services" className="text-sm font-medium hover:text-primary transition-colors">Analysis Tools</Link>
          <ModeToggle />
        </div>
      </div>
    </nav>
  );
}
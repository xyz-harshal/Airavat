import { useState } from "react";
import { 
  Menu, 
  Edit2, 
  MoreHorizontal, 
  Download, 
  Share2, 
  Trash2, 
  Plus,
  ArrowLeft
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import Link from "next/link";

export default function ChatHeader({ conversation, onToggleSidebar, onNewChat }) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(conversation?.title || "New NeuroAssistant Session");
  
  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };
  
  const handleTitleSubmit = (e) => {
    e.preventDefault();
    // Here you would update the conversation title
    // For now, we just exit edit mode
    setIsEditing(false);
  };
  
  const startEditing = () => {
    setIsEditing(true);
  };
  
  return (
    <div className="p-4 border-b flex items-center justify-between">
      <div className="flex items-center gap-3">
        {/* Mobile menu button */}
        <Button 
          variant="ghost" 
          size="icon" 
          className="md:hidden" 
          onClick={onToggleSidebar}
        >
          <Menu className="h-5 w-5" />
        </Button>

        {/* Mobile back to dashboard button */}
        <Link href="/dashboard" className="md:hidden">
          <Button 
            variant="ghost" 
            size="icon"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        
        {isEditing ? (
          <form onSubmit={handleTitleSubmit} className="flex-1">
            <Input
              value={title}
              onChange={handleTitleChange}
              className="h-9"
              autoFocus
              onBlur={() => setIsEditing(false)}
            />
          </form>
        ) : (
          <h2 className="font-medium truncate max-w-[200px] sm:max-w-md">
            {conversation?.title || "New Conversation"}
          </h2>
        )}
      </div>
      
      <div className="flex gap-2">
        <Button 
          variant="ghost" 
          size="icon" 
          className="hidden sm:flex" 
          onClick={onNewChat}
        >
          <Plus className="h-5 w-5" />
        </Button>
        
        <Button 
          variant="ghost" 
          size="icon"
          onClick={startEditing}
        >
          <Edit2 className="h-5 w-5" />
        </Button>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Conversation Options</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Download className="mr-2 h-4 w-4" />
              <span>Export chat</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Share2 className="mr-2 h-4 w-4" />
              <span>Share conversation</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <Link href="/dashboard" className="w-full">
              <DropdownMenuItem>
                <ArrowLeft className="mr-2 h-4 w-4" />
                <span>Back to Dashboard</span>
              </DropdownMenuItem>
            </Link>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive focus:text-destructive">
              <Trash2 className="mr-2 h-4 w-4" />
              <span>Delete conversation</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}

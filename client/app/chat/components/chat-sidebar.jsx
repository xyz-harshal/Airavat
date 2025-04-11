import { MessageSquare, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState } from "react";

export default function ChatSidebar({ conversations, currentConversationId, onSelectConversation }) {
  const [searchQuery, setSearchQuery] = useState("");
  
  const filteredConversations = conversations.filter(
    conv => conv.title.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  return (
    <div className="flex flex-col max-h-screen ">
      <div className="p-4 pb-0">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search conversations..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      
      <ScrollArea className="flex-1  ">
        <div className="px-2 py-2">
          {filteredConversations.length > 0 ? (
            filteredConversations.map(conversation => (
              <button
                key={conversation.id}
                className={`w-full text-left px-3 py-2 rounded-md mb-1 transition-colors ${
                  conversation.id === currentConversationId 
                    ? 'bg-accent text-accent-foreground' 
                    : 'hover:bg-muted'
                }`}
                onClick={() => onSelectConversation(conversation)}
              >
                <div className="flex items-start gap-2">
                  <MessageSquare className="h-5 w-5 mt-0.5 text-muted-foreground" />
                  <div className="flex-1 overflow-hidden">
                    <p className="font-medium truncate">{conversation.title}</p>
                    <p className="text-xs text-muted-foreground truncate mt-1">
                      {conversation.messages[conversation.messages.length - 1]?.content.substring(0, 30) || "New conversation"}
                      {conversation.messages[conversation.messages.length - 1]?.content.length > 30 ? "..." : ""}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">{conversation.date}</p>
                  </div>
                </div>
              </button>
            ))
          ) : (
            <div className="px-3 py-8 text-center">
              <p className="text-muted-foreground">No conversations found</p>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}

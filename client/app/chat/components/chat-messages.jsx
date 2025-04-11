import { User, Bot, Copy, Check, Trash2, Download } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function ChatMessages({ messages }) {
  const [copiedId, setCopiedId] = useState(null);

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (!messages || messages.length === 0) {
    return (
      <div className="h-full flex items-center justify-center flex-col p-8">
        <Bot className="h-12 w-12 text-primary mb-4" />
        <h2 className="text-xl font-bold mb-2">How can I help you today?</h2>
        <p className="text-muted-foreground text-center max-w-md">
          Ask me anything! I can help with coding, answer questions, generate content, and much more.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {messages.map((message) => (
        <div key={message.id} className="flex gap-3 group">
          {message.role === "user" ? (
            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <User className="h-5 w-5" />
            </div>
          ) : (
            <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
              <Bot className="h-5 w-5" />
            </div>
          )}
          
          <div className="flex-1 space-y-2">
            <div className="flex items-center">
              <span className="font-medium">{message.role === "user" ? "You" : "AI Assistant"}</span>
              <span className="ml-2 text-xs text-muted-foreground">{message.timestamp}</span>
            </div>
            
            <div className="prose dark:prose-invert max-w-none">
              <p>{message.content}</p>
            </div>

            {/* File attachments */}
            {message.attachments && message.attachments.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {message.attachments.map((attachment, idx) => (
                  <div 
                    key={idx} 
                    className="flex items-center gap-2 bg-muted p-2 rounded-md"
                  >
                    <Badge variant="outline" className="gap-1">
                      {getFileIcon(attachment.type)}
                      <span className="max-w-[150px] truncate">{attachment.name}</span>
                    </Badge>
                    <Button variant="ghost" size="icon" className="h-6 w-6">
                      <Download className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
            
            {/* Message actions */}
            <div className="flex gap-2 items-center invisible group-hover:visible">
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-8 px-2 text-muted-foreground" 
                onClick={() => copyToClipboard(message.content, message.id)}
              >
                {copiedId === message.id ? <Check className="h-3.5 w-3.5 mr-1" /> : <Copy className="h-3.5 w-3.5 mr-1" />}
                {copiedId === message.id ? "Copied" : "Copy"}
              </Button>
              
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-8 px-2 text-muted-foreground"
              >
                <Trash2 className="h-3.5 w-3.5 mr-1" />
                Delete
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function getFileIcon(type) {
  if (type?.startsWith('image/')) {
    return <ImageIcon className="h-3.5 w-3.5" />;
  } else if (type?.includes('pdf')) {
    return <FileIcon className="h-3.5 w-3.5" />;
  } else if (type?.includes('word') || type?.includes('doc')) {
    return <FileWordIcon className="h-3.5 w-3.5" />;
  } else {
    return <FileIcon className="h-3.5 w-3.5" />;
  }
}

function ImageIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
      <circle cx="9" cy="9" r="2" />
      <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
    </svg>
  );
}

function FileIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
      <polyline points="14 2 14 8 20 8" />
    </svg>
  );
}

function FileWordIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
      <polyline points="14 2 14 8 20 8" />
      <path d="M9 13h-2l3 7" />
      <path d="M17 13h-2l-3 7" />
    </svg>
  );
}

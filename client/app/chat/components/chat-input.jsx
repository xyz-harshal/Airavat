import { useState, useRef } from "react";
import { 
  SendHorizontal, 
  Paperclip, 
  Mic, 
  Image as ImageIcon, 
  File,
  Activity,
  Brain, 
  UserSquare,
  FileBarChart2,
  X,
  Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function ChatInput({ onSendMessage }) {
  const [message, setMessage] = useState("");
  const [attachments, setAttachments] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);
  
  const handleKeyDown = (e) => {
    // Submit on Enter (without shift)
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  const handleSendMessage = () => {
    if (message.trim() || attachments.length > 0) {
      onSendMessage(message, attachments);
      setMessage("");
      setAttachments([]);
    }
  };
  
  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    
    if (!files.length) return;
    
    setIsUploading(true);
    
    // Simulate upload delay
    setTimeout(() => {
      const newAttachments = files.map(file => ({
        id: `file-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        name: file.name,
        size: file.size,
        type: file.type,
        url: URL.createObjectURL(file)
      }));
      
      setAttachments([...attachments, ...newAttachments]);
      setIsUploading(false);
    }, 1000);
  };
  
  const removeAttachment = (id) => {
    setAttachments(attachments.filter(attachment => attachment.id !== id));
  };
  
  // Added specialized attachment handlers for EEG data
  const handleEEGAttachment = () => {
    // Set specific file types for EEG data
    fileInputRef.current.accept = ".edf,.bdf,.gdf,.csv,.set,.txt";
    fileInputRef.current.click();
  };

  const handlePatientRecord = () => {
    // Simulating patient record attachment
    const patientRecord = {
      id: `patient-${Date.now()}`,
      name: `Patient Record #${Math.floor(1000 + Math.random() * 9000)}`,
      type: "patient-record",
      recordType: "Patient EEG History",
      url: "#"
    };
    
    setAttachments([...attachments, patientRecord]);
  };
  
  const handleDigitalTwin = () => {
    // Simulating digital twin model attachment
    const twinModel = {
      id: `twin-${Date.now()}`,
      name: `Brain Digital Twin Model #${Math.floor(1000 + Math.random() * 9000)}`,
      type: "brain-model",
      modelType: "Digital Twin Simulation",
      url: "#"
    };
    
    setAttachments([...attachments, twinModel]);
  };

  return (
    <div className="w-full mb-0">
      {/* Attachments preview */}
      {attachments.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {attachments.map(attachment => {
            // Select icon based on attachment type
            let AttachmentIcon = File;
            if (attachment.type?.startsWith('image')) {
              AttachmentIcon = ImageIcon;
            } else if (attachment.type === 'patient-record') {
              AttachmentIcon = UserSquare;
            } else if (attachment.type === 'brain-model') {
              AttachmentIcon = Brain;
            } else if (attachment.name?.endsWith('.edf') || 
                      attachment.name?.endsWith('.bdf') ||
                      attachment.name?.endsWith('.gdf')) {
              AttachmentIcon = Activity;
            }
            
            return (
              <div 
                key={attachment.id} 
                className="group relative bg-muted p-2 rounded-md flex items-center gap-2 pr-8"
              >
              {attachment.type.startsWith('image/') ? (
                <ImageIcon className="h-4 w-4 text-blue-500" />
              ) : (
                <File className="h-4 w-4 text-amber-500" />
              )}
              <span className="text-sm truncate max-w-[140px]">{attachment.name}</span>
              <button 
                className="absolute right-1 top-1 rounded-full p-1 hover:bg-background"
                onClick={() => removeAttachment(attachment.id)}
              >
                <X className="h-3 w-3" />
              </button>
            </div>
            );
          })}
          
          {isUploading && (
            <div className="bg-muted p-2 rounded-md flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span className="text-sm">Uploading...</span>
            </div>
          )}
        </div>
      )}
      
      {/* Input area */}
      <div className="relative flex items-center">
        <Textarea
          placeholder="Type your message here..."
          className="min-h-[60px] pr-24 resize-none py-3"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        
        <div className="absolute right-2 bottom-2 flex gap-1">
          {/* EEG Data Attachment */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8 rounded-full"
                  onClick={handleEEGAttachment}
                  disabled={isUploading}
                >
                  <Activity className="h-5 w-5 text-primary" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Attach EEG data</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          {/* Patient Record Attachment */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8 rounded-full"
                  onClick={handlePatientRecord}
                  disabled={isUploading}
                >
                  <UserSquare className="h-5 w-5 text-blue-500" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Attach patient record</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          {/* Brain Digital Twin Model */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8 rounded-full"
                  onClick={handleDigitalTwin}
                  disabled={isUploading}
                >
                  <Brain className="h-5 w-5 text-purple-500" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Attach brain digital twin model</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          {/* Regular File Attachment */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8 rounded-full"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                >
                  <Paperclip className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Attach other file</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          {/* Voice input button */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8 rounded-full"
                >
                  <Mic className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Voice input</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          {/* Send button */}
          <Button 
            size="icon" 
            className="h-8 w-8 rounded-full"
            onClick={handleSendMessage}
            disabled={!message.trim() && attachments.length === 0}
          >
            <SendHorizontal className="h-5 w-5" />
          </Button>
        </div>
      </div>
      
      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        multiple
        onChange={handleFileSelect}
        accept="image/*,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain"
      />
      
      <div className="text-xs text-muted-foreground mt-2 mb-0">
        <p>
          Supports text, images, PDFs, and other file types up to 10MB.
          Press Enter to send, Shift+Enter for a new line.
        </p>
      </div>
    </div>
  );
}

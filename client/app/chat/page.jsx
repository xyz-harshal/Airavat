"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import ChatSidebar from "./components/chat-sidebar";
import ChatHeader from "./components/chat-header";
import ChatMessages from "./components/chat-messages";
import ChatInput from "./components/chat-input";
import { Button } from "@/components/ui/button";
import { Loader2, Plus, ArrowLeft } from "lucide-react";
import Link from "next/link";

// Sample data for multiple conversations
const sampleConversations = [
  {
    id: "1",
    title: "AI Assistant Help",
    date: "Just now",
    messages: [
      {
        id: "msg1",
        role: "assistant",
        content: "Hello! How can I help you today?",
        timestamp: "2:30 PM"
      }
    ]
  },
  {
    id: "2",
    title: "Project Planning",
    date: "Yesterday",
    messages: [
      {
        id: "msg2",
        role: "assistant",
        content: "Welcome back! Let's continue planning your project.",
        timestamp: "5:45 PM"
      }
    ]
  },
  {
    id: "3",
    title: "Code Review",
    date: "2 days ago",
    messages: [
      {
        id: "msg3",
        role: "assistant",
        content: "I can help you review your React code. What specific issues are you facing?",
        timestamp: "11:20 AM"
      }
    ]
  }
];

export default function ChatPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [conversations, setConversations] = useState(sampleConversations);
  const [currentConversation, setCurrentConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const messagesEndRef = useRef(null);

  // Check authentication
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }
    
    // Load latest conversation
    if (conversations.length > 0) {
      setCurrentConversation(conversations[0]);
      setMessages(conversations[0].messages);
    }
    
    setLoading(false);
  }, [router, conversations]);

  // Scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = (message, attachments = []) => {
    if (!message.trim() && attachments.length === 0) return;
    
    const newUserMessage = {
      id: `msg-${Date.now()}`,
      role: "user",
      content: message,
      attachments: attachments,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    // Add user message
    const updatedMessages = [...messages, newUserMessage];
    setMessages(updatedMessages);
    
    // Simulate AI response after 1 second
    setTimeout(() => {
      const aiResponse = {
        id: `msg-${Date.now()}`,
        role: "assistant",
        content: "I'm an AI assistant. This is a placeholder response. The actual integration with your AI backend will replace this message.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages([...updatedMessages, aiResponse]);
      
      // Update conversation in the list
      if (currentConversation) {
        const updatedConversations = conversations.map(conv => {
          if (conv.id === currentConversation.id) {
            return {
              ...conv,
              messages: [...updatedMessages, aiResponse],
              date: "Just now"
            };
          }
          return conv;
        });
        
        setConversations(updatedConversations);
        setCurrentConversation({
          ...currentConversation,
          messages: [...updatedMessages, aiResponse]
        });
      }
    }, 1000);
  };

  const createNewConversation = () => {
    const newConversation = {
      id: `conv-${Date.now()}`,
      title: "New Conversation",
      date: "Just now",
      messages: []
    };
    
    setConversations([newConversation, ...conversations]);
    setCurrentConversation(newConversation);
    setMessages([]);
  };

  const selectConversation = (conversation) => {
    setCurrentConversation(conversation);
    setMessages(conversation.messages);
    setMobileSidebarOpen(false);
  };

  const toggleMobileSidebar = () => {
    setMobileSidebarOpen(!mobileSidebarOpen);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-8rem)]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex h-screen ">
      {/* Chat sidebar for desktop */}
      <div className={`hidden md:block w-64 border-r`}>
        <div className="p-4 border-b flex flex-col gap-2">
          <Link href="/dashboard">
            <Button 
              variant="outline" 
              className="w-full flex items-center justify-center gap-2 mb-2"
            >
              <ArrowLeft className="h-4 w-4" /> Back to Dashboard
            </Button>
          </Link>
          <Button 
            className="w-full flex items-center justify-center gap-2" 
            onClick={createNewConversation}
          >
            <Plus className="h-4 w-4" /> New Chat
          </Button>
        </div>
        <ChatSidebar 
          conversations={conversations} 
          currentConversationId={currentConversation?.id}
          onSelectConversation={selectConversation}
        />
      </div>

      {/* Chat main area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <ChatHeader 
          conversation={currentConversation}
          onToggleSidebar={toggleMobileSidebar}
          onNewChat={createNewConversation}
        />

        <div className="flex-1 overflow-auto p-4">
          <ChatMessages messages={messages} />
          <div ref={messagesEndRef} />
        </div>

        <div className="border-t p-4 pb-0 mb-0">
          <ChatInput onSendMessage={handleSendMessage} />
        </div>
      </div>

      {/* Mobile sidebar overlay */}
      {mobileSidebarOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-black/50" onClick={() => setMobileSidebarOpen(false)}>
          <div className="absolute left-0 top-0 h-full w-64 bg-background" onClick={e => e.stopPropagation()}>
            <div className="p-4 border-b flex flex-col gap-2">
              <Link href="/dashboard">
                <Button 
                  variant="outline" 
                  className="w-full flex items-center justify-center gap-2 mb-2"
                >
                  <ArrowLeft className="h-4 w-4" /> Back to Dashboard
                </Button>
              </Link>
              <Button 
                className="w-full flex items-center justify-center gap-2" 
                onClick={createNewConversation}
              >
                <Plus className="h-4 w-4" /> New Chat
              </Button>
            </div>
            <ChatSidebar 
              conversations={conversations} 
              currentConversationId={currentConversation?.id}
              onSelectConversation={selectConversation}
            />
          </div>
        </div>
      )}
    </div>
  );
}

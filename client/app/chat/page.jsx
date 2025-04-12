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

// Sample data for multiple conversations with neurological health focus
const sampleConversations = [
  {
    id: "1",
    title: "EEG Analysis Assistance",
    date: "Just now",
    messages: [
      {
        id: "msg1",
        role: "assistant",
        content: "Hello Dr. I'm your NeuroAssistant. I can help interpret EEG patterns, provide insights into neurological conditions, and support your clinical decision-making. What would you like to discuss today?",
        timestamp: "2:30 PM"
      }
    ]
  },
  {
    id: "2",
    title: "Epilepsy Case Review",
    date: "Yesterday",
    messages: [
      {
        id: "msg2",
        role: "assistant",
        content: "I've analyzed the patterns in patient #7156's EEG data. The temporal lobe readings show characteristics consistent with focal epilepsy. Would you like me to compare with previous scans?",
        timestamp: "5:45 PM"
      }
    ]
  },
  {
    id: "3",
    title: "Medication Simulation",
    date: "2 days ago",
    messages: [
      {
        id: "msg3",
        role: "assistant",
        content: "Based on the digital twin simulation, a reduced dosage of 150mg might maintain efficacy while minimizing side effects. The frequency patterns suggest positive response.",
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

  const sendMessageToBackend = async (message, conversation) => {
    try {
      const response = await fetch("http://localhost:8000/chat/chatbot", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          alphaContext: "", // Placeholder for future context
          conversation: conversation.map(msg => ({ role: msg.role, content: msg.content })),
          newMessage: message,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch response from backend");
      }

      const data = await response.json();
      return data.response;
    } catch (error) {
      console.error("Error communicating with backend:", error);
      return "I'm sorry, I couldn't process your request.";
    }
  };

  const handleSendMessage = async (message, attachments = []) => {
    if (!message.trim() && attachments.length === 0) return;

    const newUserMessage = {
      id: `msg-${Date.now()}`,
      role: "user",
      content: message,
      attachments: attachments,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const updatedMessages = [...messages, newUserMessage];
    setMessages(updatedMessages);

    const aiResponseContent = await sendMessageToBackend(message, updatedMessages);

    const aiResponse = {
      id: `msg-${Date.now()}`,
      role: "assistant",
      content: aiResponseContent,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages([...updatedMessages, aiResponse]);

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

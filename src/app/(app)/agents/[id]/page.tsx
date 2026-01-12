"use client";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { 
  CheckCircle2, 
  Pause, 
  Play, 
  MessageSquare, 
  Settings, 
  ArrowLeft
} from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import { useState, useEffect } from "react";
import Image from "next/image";
import { useIsMobile } from "@/hooks/use-mobile";

type AgentStatus = "active" | "paused" | "not active";

interface Agent {
  id: string;
  name: string;
  avatar?: string;
  status: AgentStatus;
  function: string;
  lastUsed?: Date;
  message?: string;
}

// Mock agents data - in a real app, this would come from your data source
const mockAgents: Agent[] = [
  { 
    id: "1", 
    name: "Vyra", 
    avatar: "/Vyra.png", 
    status: "active", 
    function: "Sales Manager", 
    lastUsed: new Date(Date.now() - 1000 * 60 * 30), 
    message: "Closed 3 deals today worth $45K. Following up on 5 warm leads." 
  },
  { 
    id: "2", 
    name: "Kairo", 
    avatar: "/Kairo.png", 
    status: "paused", 
    function: "Finance Agent", 
    lastUsed: new Date(Date.now() - 1000 * 60 * 60 * 2), 
    message: "Reviewed monthly budget reports. Identified 2 cost-saving opportunities." 
  },
  { 
    id: "3", 
    name: "Noxa", 
    avatar: "/Noxa.png", 
    status: "active", 
    function: "Marketing Manager", 
    lastUsed: new Date(Date.now() - 1000 * 60 * 60 * 5), 
    message: "Launched new campaign. Generated 150+ leads and increased engagement by 30%." 
  },
];

export default function AgentDetailPage() {
  const router = useRouter();
  const params = useParams();
  const agentId = params?.id as string;
  const isMobile = useIsMobile();
  const [mounted, setMounted] = useState(false);

  const [agent, setAgent] = useState<Agent | null>(null);

  useEffect(() => {
    setMounted(true);
    // Find agent by ID
    const foundAgent = mockAgents.find(a => a.id === agentId);
    if (foundAgent) {
      setAgent(foundAgent);
    }
  }, [agentId]);

  const handleBack = () => {
    router.push("/agents");
  };

  const handleToggleStatus = () => {
    if (agent) {
      const newStatus: AgentStatus = agent.status === "active" ? "paused" : "active";
      setAgent({ ...agent, status: newStatus });
    }
  };

  const handleChat = () => {
    console.log("Chat with agent", agentId);
  };

  const handleSettings = () => {
    console.log("Open settings for agent", agentId);
  };

  const getStatusBadgeClass = (status: AgentStatus) => {
    switch (status) {
      case "active":
        return "bg-[rgba(50,196,96,0.2)] text-[rgba(50,196,96,1)] border border-[rgba(50,196,96,0.1)]";
      case "paused":
        return "bg-[rgba(236,145,49,0.2)] text-[rgba(236,145,49,1)] border border-[rgba(236,145,49,0.1)]";
      case "not active":
        return "bg-gray-500 text-white border-0";
      default:
        return "bg-gray-500 text-white border-0";
    }
  };

  const getStatusIcon = (status: AgentStatus) => {
    switch (status) {
      case "active":
        return <CheckCircle2 className="size-3" />;
      case "paused":
        return <Pause className="size-3" />;
      case "not active":
        return null;
      default:
        return null;
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  if (!agent) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-51px)]">
        <p className="text-muted-foreground">Agent not found</p>
        <Button onClick={handleBack} variant="outline" className="mt-4">
          <ArrowLeft className="size-4 mr-2" />
          Back to Agents
        </Button>
      </div>
    );
  }

  return (
    <div 
      className={`flex flex-col gap-6 min-w-0 ${mounted ? 'animate-in fade-in slide-in-from-bottom-4' : 'opacity-0'} transition-all duration-300`}
      style={{ paddingLeft: '5px' }}
    >
      {/* Header Section */}
      <div className="flex items-center gap-4 mb-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={handleBack}
          className="shrink-0"
        >
          <ArrowLeft className="size-4" />
        </Button>
        <div className="flex items-center gap-4 flex-1 min-w-0">
          {agent.avatar ? (
            <div className="size-16 shrink-0 rounded-xl overflow-hidden relative">
              <Image
                src={agent.avatar}
                alt={agent.name}
                width={64}
                height={64}
                className="rounded-xl object-cover"
                priority
              />
            </div>
          ) : (
            <div className="size-16 shrink-0 rounded-xl bg-primary/10 text-primary flex items-center justify-center text-xl font-semibold">
              {getInitials(agent.name)}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-2xl font-semibold truncate">{agent.name}</h1>
              <Badge
                variant="outline"
                className={`${getStatusBadgeClass(agent.status)} text-xs px-2 py-1 h-5 rounded-lg flex items-center gap-1 shrink-0`}
              >
                {getStatusIcon(agent.status)}
                {agent.status}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground truncate">{agent.function}</p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-2">
        <Button
          onClick={handleToggleStatus}
          variant="outline"
          size="sm"
          className="gap-2 glassy-outline border-0 rounded-[10px]"
        >
          {agent.status === "active" ? (
            <>
              <Pause className="size-4" />
              Pause
            </>
          ) : (
            <>
              <Play className="size-4" />
              Resume
            </>
          )}
        </Button>
        <Button
          onClick={handleChat}
          variant="outline"
          size="sm"
          className="gap-2 glassy-outline border-0 rounded-[10px]"
        >
          <MessageSquare className="size-4" />
          Chat
        </Button>
        <Button
          onClick={handleSettings}
          variant="outline"
          size="sm"
          className="gap-2 glassy-outline border-0 rounded-[10px]"
        >
          <Settings className="size-4" />
          Settings
        </Button>
      </div>

      {/* Coming Soon */}
      <div className="flex items-center justify-center min-h-[calc(100vh-300px)]">
        <h1 className="text-xl font-semibold text-muted-foreground">Coming Soon</h1>
      </div>
    </div>
  );
}


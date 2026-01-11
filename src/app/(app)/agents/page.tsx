"use client";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Plus, CheckCircle2, Pause, XCircle, Play, MessageSquare, ExternalLink } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

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

export default function AgentsPage() {
  const router = useRouter();

  // Mock agents data - in a real app, this would come from your data source
  const initialAgents: Agent[] = [
    { id: "1", name: "Vyra", avatar: "/Vyra.png", status: "active", function: "Sales Manager", lastUsed: new Date(Date.now() - 1000 * 60 * 30), message: "Closed 3 deals today worth $45K. Following up on 5 warm leads." },
    { id: "2", name: "Kairo", avatar: "/Kairo.png", status: "paused", function: "Finance Agent", lastUsed: new Date(Date.now() - 1000 * 60 * 60 * 2), message: "Reviewed monthly budget reports. Identified 2 cost-saving opportunities." },
    { id: "3", name: "Noxa", avatar: "/Noxa.png", status: "active", function: "Marketing Manager", lastUsed: new Date(Date.now() - 1000 * 60 * 60 * 5), message: "Launched new campaign. Generated 150+ leads and increased engagement by 30%." },
  ];

  const [agents, setAgents] = useState<Agent[]>(initialAgents);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleHireAgent = () => {
    // This would typically open a hire agent dialog
    // For now, we'll just log it
    console.log("Hire an Agent");
  };

  const handleAgentClick = (agentId: string) => {
    router.push(`/agents/${agentId}`);
  };

  const handleToggleStatus = (agentId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setAgents(agents.map(agent => {
      if (agent.id === agentId) {
        const newStatus: AgentStatus = agent.status === "active" ? "paused" : "active";
        return { ...agent, status: newStatus };
      }
      return agent;
    }));
  };

  const handleChat = (agentId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    // Handle chat action
    console.log("Chat with agent", agentId);
  };

  const handleOpenAgent = (agentId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    router.push(`/agents/${agentId}`);
  };

  const formatLastUsed = (date?: Date) => {
    if (!date) return "Never used";
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
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
        return <XCircle className="size-3" />;
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

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4 min-w-0" style={{ paddingLeft: '5px' }}>
        <span className="text-foreground text-lg font-semibold shrink-0" style={{ fontSize: '20px', fontWeight: 600 }}>Home</span>
        <Button 
          onClick={handleHireAgent} 
          className="gap-2 shrink-0 w-full sm:w-auto"
          size="sm"
        >
          <Plus className="size-4" />
          <span className="hidden sm:inline">Hire an Agent</span>
          <span className="sm:hidden">Hire</span>
        </Button>
      </div>
      <div className="grid gap-4 min-w-0" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))' }}>
        {agents.map((agent, index) => (
          <div
            key={agent.id}
            onClick={() => handleAgentClick(agent.id)}
            className={`group rounded-xl glassy-outline p-1 cursor-pointer hover:bg-accent/50 transition-all duration-300 ease-out flex flex-col gap-1 hover:scale-[1.02] hover:shadow-lg min-w-0 overflow-hidden h-full ${
              mounted 
                ? 'animate-in fade-in slide-in-from-bottom-4' 
                : 'opacity-0 translate-y-4'
            }`}
            style={{
              animationDelay: `${index * 100}ms`,
              animationFillMode: 'both',
            }}
          >
            <div className="rounded-xl p-2 relative" style={{ backgroundColor: '#252525' }}>
              <Badge
                variant="outline"
                className={`${getStatusBadgeClass(agent.status)} text-[10px] px-2 py-2 h-4 absolute top-2 right-2 !rounded-[8px] flex items-center gap-1 transition-all duration-300 ease-out`}
              >
                <span className="transition-all duration-300 ease-out inline-block">
                  {getStatusIcon(agent.status)}
                </span>
                {agent.status}
              </Badge>
              <div className="flex items-center gap-3 pr-12">
                <Avatar className="size-[80px] shrink-0 rounded-[10px] transition-transform duration-300 ease-out group-hover:scale-105">
                  {agent.avatar ? (
                    <AvatarImage src={agent.avatar} alt={agent.name} className="rounded-[10px] transition-opacity duration-300" />
                  ) : null}
                  <AvatarFallback className="bg-primary/10 text-primary rounded-[10px] transition-all duration-300">
                    {getInitials(agent.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="mb-1">
                    <span className="font-semibold text-[22px] truncate transition-colors duration-300">{agent.name}</span>
                  </div>
                  <p className="text-xs text-muted-foreground truncate transition-colors duration-300">{agent.function}</p>
                </div>
              </div>
            </div>
            <div className="flex flex-col flex-1 min-h-0">
              {agent.message && (
                <div className="animate-in fade-in slide-in-from-top-2 duration-300 ease-out">
                  <div className="flex items-start gap-2 pr-0 pl-2 pb-2 pt-2">
                    <Avatar className="size-6 shrink-0 rounded-full mt-0.5">
                      {agent.avatar ? (
                        <AvatarImage src={agent.avatar} alt={agent.name} className="rounded-full" />
                      ) : null}
                      <AvatarFallback className="bg-primary/10 text-primary rounded-full text-[10px]">
                        {getInitials(agent.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="rounded-lg rounded-tl-sm px-3 py-2 inline-block max-w-full transition-all duration-300 ease-out group-hover:shadow-md" style={{ backgroundColor: '#252525' }}>
                        <p className="text-xs text-foreground leading-relaxed break-words transition-colors duration-300">{agent.message}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div className="flex items-center gap-2 px-0 pb-0 min-w-0 mt-auto">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={(e) => handleToggleStatus(agent.id, e)}
                  className="flex-1 gap-1.5 opacity-60 glassy-outline border-0 rounded-[10px] transition-all duration-200 ease-out hover:opacity-100 hover:scale-[1.02] active:scale-[0.98] min-w-0"
                >
                  <span className="transition-all duration-200 ease-out inline-block shrink-0">
                    {agent.status === "active" ? (
                      <Pause className="size-3.5" />
                    ) : (
                      <Play className="size-3.5" />
                    )}
                  </span>
                  <span className="truncate">{agent.status === "active" ? "Pause" : "Resume"}</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={(e) => handleChat(agent.id, e)}
                  className="flex-1 gap-1.5 opacity-60 glassy-outline border-0 rounded-[10px] transition-all duration-200 ease-out hover:opacity-100 hover:scale-[1.02] active:scale-[0.98] min-w-0"
                >
                  <MessageSquare className="size-3.5 transition-transform duration-200 ease-out group-hover:scale-110 shrink-0" />
                  <span className="truncate">Chat</span>
                </Button>
                <Button
                  size="sm"
                  onClick={(e) => handleOpenAgent(agent.id, e)}
                  className="flex-[2] gap-1.5 glassy-outline border-0 rounded-[10px] transition-all duration-200 ease-out hover:scale-[1.02] active:scale-[0.98] min-w-0"
                >
                  <ExternalLink className="size-3.5 transition-transform duration-200 ease-out group-hover:scale-110 shrink-0" />
                  <span className="truncate">Open Agent</span>
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

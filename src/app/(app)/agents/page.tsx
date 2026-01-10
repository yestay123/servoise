"use client";

import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";

interface Agent {
  id: string;
  name: string;
  lastUsed?: Date;
}

export default function AgentsPage() {
  const router = useRouter();

  // Mock agents data - in a real app, this would come from your data source
  const agents: Agent[] = [
    { id: "1", name: "Growth Agent", lastUsed: new Date(Date.now() - 1000 * 60 * 30) },
    { id: "2", name: "Support Agent", lastUsed: new Date(Date.now() - 1000 * 60 * 60 * 2) },
    { id: "3", name: "Sales Agent", lastUsed: new Date(Date.now() - 1000 * 60 * 60 * 5) },
    { id: "4", name: "Marketing Agent" },
    { id: "5", name: "Research Agent" },
  ];

  const handleHireAgent = () => {
    // This would typically open a hire agent dialog
    // For now, we'll just log it
    console.log("Hire an Agent");
  };

  const handleAgentClick = (agentId: string) => {
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

  return (
    <>
      <div className="flex items-center justify-between mb-4" style={{ paddingLeft: '5px' }}>
        <span className="text-foreground text-lg font-semibold" style={{ fontSize: '20px', fontWeight: 600 }}>Home</span>
        <Button onClick={handleHireAgent} className="gap-2">
          <Plus className="size-4" />
          Hire an Agent
        </Button>
      </div>
      <div className="grid grid-cols-3 gap-4">
        {agents.map((agent) => (
          <div
            key={agent.id}
            onClick={() => handleAgentClick(agent.id)}
            className="rounded-lg border border-sidebar-border p-4 cursor-pointer hover:bg-accent/50 transition-colors"
          >
            <h3 className="font-semibold text-foreground mb-1">{agent.name}</h3>
            <p className="text-sm text-muted-foreground">
              {formatLastUsed(agent.lastUsed)}
            </p>
          </div>
        ))}
      </div>
    </>
  );
}

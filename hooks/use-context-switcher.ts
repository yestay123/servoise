"use client";

import { useState, useEffect, useCallback } from "react";

type Scope = "my-agents" | "marketplace" | "credits" | "settings";

export interface Agent {
  id: string;
  name: string;
  lastUsed?: Date;
}

interface UseContextSwitcherOptions {
  initialScope?: Scope;
  initialAgents?: Agent[];
}

const STORAGE_KEY_SCOPE = "servoise-active-scope";
const STORAGE_KEY_AGENT = "servoise-active-agent";
const STORAGE_KEY_LAST_AGENT_PREFIX = "servoise-last-agent-";

export function useContextSwitcher(options: UseContextSwitcherOptions = {}) {
  const { initialScope = "my-agents", initialAgents = [] } = options;

  // Load persisted state from localStorage
  const [activeScope, setActiveScope] = useState<Scope>(() => {
    if (typeof window === "undefined") return initialScope;
    const stored = localStorage.getItem(STORAGE_KEY_SCOPE);
    return (stored as Scope) || initialScope;
  });

  const [activeAgent, setActiveAgent] = useState<Agent | null>(() => {
    if (typeof window === "undefined") return null;
    const stored = localStorage.getItem(STORAGE_KEY_AGENT);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        return null;
      }
    }
    // Try to load last selected agent for current scope
    const lastAgentKey = `${STORAGE_KEY_LAST_AGENT_PREFIX}${activeScope}`;
    const lastAgent = localStorage.getItem(lastAgentKey);
    if (lastAgent) {
      try {
        return JSON.parse(lastAgent);
      } catch {
        return null;
      }
    }
    return null;
  });

  const [agents, setAgents] = useState<Agent[]>(initialAgents);

  // Persist scope changes
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY_SCOPE, activeScope);
    }
  }, [activeScope]);

  // Persist agent changes
  useEffect(() => {
    if (typeof window !== "undefined") {
      if (activeAgent) {
        localStorage.setItem(STORAGE_KEY_AGENT, JSON.stringify(activeAgent));
        // Also persist as last agent for current scope
        const lastAgentKey = `${STORAGE_KEY_LAST_AGENT_PREFIX}${activeScope}`;
        localStorage.setItem(lastAgentKey, JSON.stringify(activeAgent));
      } else {
        localStorage.removeItem(STORAGE_KEY_AGENT);
      }
    }
  }, [activeAgent, activeScope]);

  // When scope changes, try to restore last agent for that scope
  useEffect(() => {
    if (typeof window !== "undefined") {
      const lastAgentKey = `${STORAGE_KEY_LAST_AGENT_PREFIX}${activeScope}`;
      const lastAgent = localStorage.getItem(lastAgentKey);
      if (lastAgent) {
        try {
          const parsed = JSON.parse(lastAgent);
          // Verify agent still exists in current agents list
          const exists = agents.some((a) => a.id === parsed.id);
          if (exists) {
            setActiveAgent(parsed);
          } else {
            setActiveAgent(null);
          }
        } catch {
          setActiveAgent(null);
        }
      } else {
        setActiveAgent(null);
      }
    }
  }, [activeScope, agents]);

  const handleScopeChange = useCallback((scope: Scope) => {
    setActiveScope(scope);
  }, []);

  const handleAgentChange = useCallback((agent: Agent | null) => {
    setActiveAgent(agent);
    // Update lastUsed timestamp
    if (agent) {
      setAgents((prev) =>
        prev.map((a) =>
          a.id === agent.id ? { ...a, lastUsed: new Date() } : a
        )
      );
    }
  }, []);

  const handleAgentRename = useCallback((agentId: string) => {
    // This would typically open a rename dialog
    // For now, we'll just log it
    console.log("Rename agent:", agentId);
  }, []);

  const handleAgentDuplicate = useCallback((agentId: string) => {
    // This would typically duplicate the agent
    // For now, we'll just log it
    console.log("Duplicate agent:", agentId);
  }, []);

  const handleCreateAgent = useCallback(() => {
    // This would typically open a hire agent dialog
    // For now, we'll just log it
    console.log("Hire an Agent");
  }, []);

  return {
    activeScope,
    activeAgent,
    agents,
    setAgents,
    onScopeChange: handleScopeChange,
    onAgentChange: handleAgentChange,
    onAgentRename: handleAgentRename,
    onAgentDuplicate: handleAgentDuplicate,
    onCreateAgent: handleCreateAgent,
  };
}


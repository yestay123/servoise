"use client";

import * as React from "react";
import { ChevronDown, Plus, Copy, Edit } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";

type Scope = "my-agents" | "marketplace" | "credits" | "settings";

interface Agent {
  id: string;
  name: string;
  lastUsed?: Date;
}

interface HeaderContextSwitcherProps {
  activeScope?: Scope;
  activeAgent?: Agent | null;
  agents?: Agent[];
  onScopeChange?: (scope: Scope) => void;
  onAgentChange?: (agent: Agent | null) => void;
  onAgentRename?: (agentId: string) => void;
  onAgentDuplicate?: (agentId: string) => void;
  onCreateAgent?: () => void;
  agentSwitcherOpen?: boolean;
  onAgentSwitcherOpenChange?: (open: boolean) => void;
  showEntitySwitcher?: boolean;
  showHome?: boolean;
}

const scopeLabels: Record<Scope, string> = {
  "my-agents": "My Agents",
  marketplace: "Marketplace",
  credits: "Credits",
  settings: "Settings",
};

export function HeaderContextSwitcher({
  activeScope = "my-agents",
  activeAgent = null,
  agents = [],
  onScopeChange,
  onAgentChange,
  onAgentRename,
  onAgentDuplicate,
  onCreateAgent,
  agentSwitcherOpen: controlledAgentOpen,
  onAgentSwitcherOpenChange,
  showEntitySwitcher = false,
  showHome = false,
}: HeaderContextSwitcherProps) {
  const [scopeOpen, setScopeOpen] = React.useState(false);
  const [internalAgentOpen, setInternalAgentOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");

  // Use controlled state if provided, otherwise use internal state
  const agentOpen = controlledAgentOpen !== undefined ? controlledAgentOpen : internalAgentOpen;
  const setAgentOpen = (open: boolean) => {
    if (onAgentSwitcherOpenChange) {
      onAgentSwitcherOpenChange(open);
    } else {
      setInternalAgentOpen(open);
    }
  };

  // Get recently used agents (last 5, sorted by lastUsed)
  const recentlyUsedAgents = React.useMemo(() => {
    return agents
      .filter((agent) => agent.lastUsed)
      .sort((a, b) => {
        if (!a.lastUsed || !b.lastUsed) return 0;
        return b.lastUsed.getTime() - a.lastUsed.getTime();
      })
      .slice(0, 5);
  }, [agents]);

  // Filter agents based on search query
  const filteredAgents = React.useMemo(() => {
    if (!searchQuery) return agents;
    const query = searchQuery.toLowerCase();
    return agents.filter((agent) =>
      agent.name.toLowerCase().includes(query)
    );
  }, [agents, searchQuery]);

  const handleScopeSelect = (scope: Scope) => {
    onScopeChange?.(scope);
    setScopeOpen(false);
  };

  const handleAgentSelect = (agent: Agent) => {
    onAgentChange?.(agent);
    setAgentOpen(false);
    setSearchQuery("");
  };

  const handleAgentAction = (
    e: React.MouseEvent,
    agentId: string,
    action: "rename" | "duplicate"
  ) => {
    e.stopPropagation();
    if (action === "rename") {
      onAgentRename?.(agentId);
    } else if (action === "duplicate") {
      onAgentDuplicate?.(agentId);
    }
  };

  return (
    <div className="flex items-center gap-1">
      {/* Scope Switcher */}
      <DropdownMenu open={scopeOpen} onOpenChange={setScopeOpen}>
        <DropdownMenuTrigger asChild>
          <button
            className={cn(
              "flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-sm transition-colors",
              "text-muted-foreground hover:text-foreground hover:bg-accent",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            )}
          >
            <span>{scopeLabels[activeScope]}</span>
            <ChevronDown
              className={cn(
                "size-3.5 transition-transform duration-200 ease-out",
                scopeOpen && "rotate-180"
              )}
            />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="start"
          className="w-48 rounded-lg"
          sideOffset={8}
        >
          <DropdownMenuItem
            onClick={() => handleScopeSelect("my-agents")}
            className={cn(
              "rounded-md",
              activeScope === "my-agents" && "bg-accent"
            )}
          >
            My Agents
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => handleScopeSelect("marketplace")}
            className={cn(
              "rounded-md",
              activeScope === "marketplace" && "bg-accent"
            )}
          >
            Marketplace
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => handleScopeSelect("credits")}
            className={cn(
              "rounded-md",
              activeScope === "credits" && "bg-accent"
            )}
          >
            Credits
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => {
              onCreateAgent?.();
              setScopeOpen(false);
            }}
            className="rounded-md"
          >
            <Plus className="size-4" />
            <span>Hire an Agent</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Visual Separator - only show when entity switcher is visible */}
      {showEntitySwitcher && (
        <>
          <span className="text-muted-foreground/50 px-1">/</span>

          {/* Entity Switcher */}
          {showHome ? (
            <span className="px-2.5 py-1.5 text-sm font-medium text-foreground">
              Home
            </span>
          ) : (
            <Popover open={agentOpen} onOpenChange={setAgentOpen}>
        <PopoverTrigger asChild>
          <button
            className={cn(
              "flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-sm font-medium transition-colors",
              "text-foreground hover:bg-accent",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            )}
          >
            <span>
              {activeAgent?.name || "Select an agent"}
            </span>
            <ChevronDown
              className={cn(
                "size-3.5 transition-transform duration-200 ease-out",
                agentOpen && "rotate-180"
              )}
            />
          </button>
        </PopoverTrigger>
        <PopoverContent
          align="start"
          className="w-80 rounded-lg p-0"
          sideOffset={8}
        >
          <Command shouldFilter={false}>
            <CommandInput
              placeholder="Search agents..."
              value={searchQuery}
              onValueChange={setSearchQuery}
            />
            <CommandList>
              {recentlyUsedAgents.length > 0 && (
                <>
                  <CommandGroup heading="Recently used">
                    {recentlyUsedAgents.map((agent) => (
                      <CommandItem
                        key={agent.id}
                        value={agent.id}
                        onSelect={() => handleAgentSelect(agent)}
                        className="group/item flex items-center justify-between rounded-md px-2 py-1.5"
                      >
                        <span className="flex-1">{agent.name}</span>
                        <div className="flex items-center gap-1 opacity-0 group-hover/item:opacity-100 transition-opacity">
                          <button
                            onClick={(e) => handleAgentAction(e, agent.id, "rename")}
                            className="p-1 rounded hover:bg-accent"
                            aria-label="Rename agent"
                          >
                            <Edit className="size-3.5" />
                          </button>
                          <button
                            onClick={(e) =>
                              handleAgentAction(e, agent.id, "duplicate")
                            }
                            className="p-1 rounded hover:bg-accent"
                            aria-label="Duplicate agent"
                          >
                            <Copy className="size-3.5" />
                          </button>
                        </div>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                  {filteredAgents.length > 0 && <CommandSeparator />}
                </>
              )}
              <CommandGroup heading="All agents">
                {filteredAgents.length > 0 ? (
                  filteredAgents.map((agent) => (
                    <CommandItem
                      key={agent.id}
                      value={agent.id}
                      onSelect={() => handleAgentSelect(agent)}
                      className={cn(
                        "group/item flex items-center justify-between rounded-md px-2 py-1.5",
                        activeAgent?.id === agent.id && "bg-accent"
                      )}
                    >
                      <span className="flex-1">{agent.name}</span>
                      <div className="flex items-center gap-1 opacity-0 group-hover/item:opacity-100 transition-opacity">
                        <button
                          onClick={(e) => handleAgentAction(e, agent.id, "rename")}
                          className="p-1 rounded hover:bg-accent"
                          aria-label="Rename agent"
                        >
                          <Edit className="size-3.5" />
                        </button>
                        <button
                          onClick={(e) =>
                            handleAgentAction(e, agent.id, "duplicate")
                          }
                          className="p-1 rounded hover:bg-accent"
                          aria-label="Duplicate agent"
                        >
                          <Copy className="size-3.5" />
                        </button>
                      </div>
                    </CommandItem>
                  ))
                ) : (
                  <CommandEmpty>No agents found.</CommandEmpty>
                )}
              </CommandGroup>
            </CommandList>
            <CommandSeparator />
            <div className="px-2 py-1.5 text-xs text-muted-foreground flex items-center justify-between">
              <span>Press ⌘K to search</span>
            </div>
          </Command>
        </PopoverContent>
      </Popover>
          )}
        </>
      )}
    </div>
  );
}


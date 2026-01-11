"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Bot,
  BarChart3,
  Settings,
  ChevronDown,
  Sparkles,
  User,
  CreditCard,
  Bell,
  LogOut,
  Store,
  PanelRight,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  SidebarInset,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { HeaderContextSwitcher } from "@/components/header-context-switcher";
import { useContextSwitcher } from "@/hooks/use-context-switcher";

const workspaceItems = [
  { name: "My Agents", href: "/agents", icon: Bot },
  { name: "Marketplace", href: "/marketplace", icon: Store },
  { name: "Credits", href: "/credits", icon: CreditCard },
];

const systemItems = [{ name: "Settings", href: "/settings", icon: Settings }];

function AppSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    router.push("/sign-in");
  };

  return (
    <Sidebar collapsible="offcanvas" className="h-svh">
      <SidebarHeader>
        <div className="flex items-center gap-2 px-2 py-2">
          <Image
            src="/servoise-logo.svg"
            alt="Servoise"
            width={69}
            height={21}
            priority
            className="h-[19px] w-auto"
          />
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Workspace</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {workspaceItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <SidebarMenuItem key={item.name}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      className={
                        isActive
                          ? "bg-primary/10 border border-primary data-[active=true]:bg-primary/10 data-[active=true]:border-primary"
                          : ""
                      }
                    >
                      <Link href={item.href}>
                        <item.icon className="size-4" />
                        <span>{item.name}</span>
                      </Link>
                    </SidebarMenuButton>
                    {item.name === "Credits" && (
                      <SidebarMenuBadge className="flex items-center gap-1">
                        <Image
                          src="/servoise-coin.png"
                          alt="Servoise Coin"
                          width={12}
                          height={12}
                          className="shrink-0"
                        />
                        <span>1.2k</span>
                      </SidebarMenuBadge>
                    )}
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>System</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {systemItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <SidebarMenuItem key={item.name}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      className={
                        isActive
                          ? "bg-primary/10 border border-primary data-[active=true]:bg-primary/10 data-[active=true]:border-primary"
                          : ""
                      }
                    >
                      <Link href={item.href}>
                        <item.icon className="size-4" />
                        <span>{item.name}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                >
                  <Avatar className="size-8 rounded-lg">
                    <AvatarImage src="" alt="Yestay Anuarbekov" />
                    <AvatarFallback className="rounded-lg">YA</AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">Yestay Anuarbekov</span>
                    <span className="truncate text-xs text-muted-foreground">
                      yestay@armeta.ai
                    </span>
                  </div>
                  <ChevronDown className="ml-auto size-4" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                side="bottom"
                align="end"
                sideOffset={4}
              >
                <DropdownMenuItem>
                  <Sparkles className="size-4" />
                  <span>Upgrade to Pro</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <User className="size-4" />
                  <span>Account</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <CreditCard className="size-4" />
                  <span>Billing</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Bell className="size-4" />
                  <span>Notifications</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="size-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const router = useRouter();
  const isMobile = useIsMobile();
  const [rightSidebarOpen, setRightSidebarOpen] = useState(!isMobile);
  const [agentSwitcherOpen, setAgentSwitcherOpen] = useState(false);

  // Extract first name from full name
  const fullName = "Yestay Anuarbekov";
  const firstName = fullName.split(" ")[0] || "there";

  // Determine scope from current route
  const getScopeFromPath = (path: string): "my-agents" | "marketplace" | "credits" | "settings" => {
    if (path === "/dashboard" || path === "/") return "my-agents";
    if (path.startsWith("/agents")) return "my-agents";
    if (path.startsWith("/marketplace")) return "marketplace";
    if (path.startsWith("/credits")) return "credits";
    if (path.startsWith("/settings")) return "settings";
    return "my-agents"; // default to my-agents for initial page
  };

  // Check if we're in a detail view (e.g., /agents/[id])
  const isDetailView = (path: string): boolean => {
    // Check if path has more segments than just the base route
    // e.g., /agents/123 or /agents/123/settings
    if (path.startsWith("/agents/")) {
      const segments = path.split("/").filter(Boolean);
      return segments.length > 1; // More than just "agents"
    }
    if (path.startsWith("/marketplace/")) {
      const segments = path.split("/").filter(Boolean);
      return segments.length > 1;
    }
    return false;
  };

  const currentScope = getScopeFromPath(pathname);
  const isInDetailView = isDetailView(pathname);
  const isAgentsPage = pathname.startsWith("/agents");

  // Mock agents data - in a real app, this would come from your data source
  const mockAgents = [
    { id: "1", name: "Growth Agent", lastUsed: new Date(Date.now() - 1000 * 60 * 30) },
    { id: "2", name: "Support Agent", lastUsed: new Date(Date.now() - 1000 * 60 * 60 * 2) },
    { id: "3", name: "Sales Agent", lastUsed: new Date(Date.now() - 1000 * 60 * 60 * 5) },
    { id: "4", name: "Marketing Agent" },
    { id: "5", name: "Research Agent" },
  ];

  // Extract agent ID from path if in detail view
  const getAgentIdFromPath = (path: string): string | null => {
    if (path.startsWith("/agents/")) {
      const segments = path.split("/").filter(Boolean);
      return segments[1] || null;
    }
    return null;
  };

  const currentAgentId = isInDetailView ? getAgentIdFromPath(pathname) : null;
  const currentAgent = currentAgentId
    ? mockAgents.find((a) => a.id === currentAgentId) || null
    : null;

  // Only use state management hook when in detail view
  const contextSwitcher = useContextSwitcher({
    initialScope: currentScope,
    initialAgents: mockAgents,
  });

  // Update active agent when route changes
  useEffect(() => {
    if (isInDetailView && currentAgent) {
      contextSwitcher.onAgentChange(currentAgent);
    } else if (!isInDetailView) {
      contextSwitcher.onAgentChange(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  // Handle scope change navigation
  const handleScopeChange = (scope: "my-agents" | "marketplace" | "credits" | "settings") => {
    const scopeRoutes: Record<typeof scope, string> = {
      "my-agents": "/agents",
      marketplace: "/marketplace",
      credits: "/credits",
      settings: "/settings",
    };
    router.push(scopeRoutes[scope]);
  };

  // Responsive behavior: adjust right sidebar based on screen size
  useEffect(() => {
    // On mobile, hide by default; on larger screens, show if on agents page
    if (isMobile) {
      setRightSidebarOpen(false);
    } else if (isAgentsPage) {
      setRightSidebarOpen(true);
    }
  }, [isMobile, isAgentsPage]);

  // Keyboard shortcut: ⌘K (or Ctrl+K) to open agent switcher
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setAgentSwitcherOpen((prev) => !prev);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const toggleRightSidebar = () => {
    setRightSidebarOpen((prev) => !prev);
  };

  return (
    <SidebarProvider defaultOpen={true} className="h-svh">
      <AppSidebar />
      <SidebarInset>
        <header
          className={`flex h-[51px] shrink-0 items-center gap-2 px-4 transition-all duration-300 ease-in-out ${
            rightSidebarOpen && !isMobile && isAgentsPage ? "w-[calc(100%-20rem)]" : "w-full"
          }`}
        >
          <SidebarTrigger />
          <HeaderContextSwitcher
            activeScope={currentScope}
            activeAgent={isInDetailView ? (currentAgent || contextSwitcher.activeAgent) : null}
            agents={mockAgents}
            onScopeChange={handleScopeChange}
            onAgentChange={(agent) => {
              if (agent) {
                // Navigate to agent detail page
                router.push(`/agents/${agent.id}`);
              }
            }}
            onAgentRename={contextSwitcher.onAgentRename}
            onAgentDuplicate={contextSwitcher.onAgentDuplicate}
            onCreateAgent={contextSwitcher.onCreateAgent}
            agentSwitcherOpen={agentSwitcherOpen}
            onAgentSwitcherOpenChange={setAgentSwitcherOpen}
            showEntitySwitcher={isAgentsPage}
            showHome={isAgentsPage && !isInDetailView}
          />
          {isAgentsPage && (
            <Button
              variant="ghost"
              size="icon"
              className="size-7 ml-auto"
              onClick={toggleRightSidebar}
              aria-label="Toggle right sidebar"
            >
              <PanelRight className="size-4" />
            </Button>
          )}
        </header>
        {isAgentsPage ? (
          <div className="flex flex-1 overflow-hidden relative min-w-0">
            <div
              className={`overflow-auto px-4 pb-4 transition-all duration-300 ease-in-out min-w-0 ${
                rightSidebarOpen && !isMobile 
                  ? "w-[calc(100%-20rem)]" 
                  : "w-full"
              }`}
            >
              {children}
            </div>
          </div>
        ) : (
          <div className="flex flex-1 flex-col p-4 overflow-hidden min-w-0">{children}</div>
        )}
      </SidebarInset>
      {/* Right Sidebar - Separate from content, similar to left sidebar */}
      {isAgentsPage && !isMobile && (
        <aside
          className={`fixed right-0 top-0 h-svh w-80 bg-sidebar border-l border-l-[rgba(33,33,33,1)] flex flex-col z-10 transition-[right] duration-300 ease-in-out ${
            rightSidebarOpen ? "right-0" : "right-[calc(20rem*-1)]"
          }`}
        >
          <div className="p-4 border-sidebar-border">
            <h2 className="text-lg font-medium" style={{ letterSpacing: '-0.6px' }}>
              Hey {firstName}, ready to{" "}
              <span className="bg-gradient-to-r from-purple-300 to-purple-100 bg-clip-text text-transparent">
                get things done
              </span>
              ?
            </h2>
          </div>
          <div className="flex-1 overflow-auto p-4">
            {/* Right sidebar content */}
          </div>
        </aside>
      )}
      {isAgentsPage && isMobile && (
        <Sheet open={rightSidebarOpen} onOpenChange={setRightSidebarOpen}>
          <SheetContent
            side="right"
            className="bg-sidebar text-sidebar-foreground w-80 p-0 [&>button]:hidden data-[state=closed]:duration-300 data-[state=open]:duration-300"
          >
            <SheetHeader className="sr-only">
              <SheetTitle>Right Sidebar</SheetTitle>
              <SheetDescription>Right sidebar content.</SheetDescription>
            </SheetHeader>
            <div className="flex h-full w-full flex-col">
              <div className="p-4 border-sidebar-border">
                <h2 className="text-lg font-medium" style={{ letterSpacing: '-0.6px' }}>
                  Hey {firstName}, ready to{" "}
                  <span className="bg-gradient-to-r from-purple-300 to-purple-100 bg-clip-text text-transparent">
                    get things done
                  </span>
                  ?
                </h2>
              </div>
              <div className="flex-1 overflow-auto p-4">
                {/* Right sidebar content */}
              </div>
            </div>
          </SheetContent>
        </Sheet>
      )}
    </SidebarProvider>
  );
}


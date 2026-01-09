"use client";

import {
  Bot,
  RefreshCw,
  Users,
  DollarSign,
  Calendar,
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  Clock,
  TrendingUp,
  FileText,
  MessageSquare,
  Download,
  BarChart3,
  Activity,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

// Mini Sparkline Chart Component
function SparklineChart({ data, color = "rgb(139, 92, 246)" }: { data: number[]; color?: string }) {
  const width = 60;
  const height = 20;
  const padding = 2;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;

  const points = data.map((value, index) => {
    const x = (index / (data.length - 1 || 1)) * (width - padding * 2) + padding;
    const y = height - padding - ((value - min) / range) * (height - padding * 2);
    return `${x},${y}`;
  });

  const path = `M ${points.join(" L ")}`;

  return (
    <svg width={width} height={height} className="overflow-visible">
      <path
        d={path}
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.8"
      />
    </svg>
  );
}

// Circular Progress Component
function CircularProgress({ value, max = 100, color = "rgb(34, 197, 94)" }: { value: number; max?: number; color?: string }) {
  const percentage = Math.min((value / max) * 100, 100);
  const radius = 30;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative size-16">
      <svg className="transform -rotate-90" width="64" height="64">
        <circle
          cx="32"
          cy="32"
          r={radius}
          stroke="currentColor"
          strokeWidth="4"
          fill="none"
          className="text-muted/20"
        />
        <circle
          cx="32"
          cy="32"
          r={radius}
          stroke={color}
          strokeWidth="4"
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-500"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-xs font-semibold">{Math.round(percentage)}%</span>
      </div>
    </div>
  );
}

// Agent Type Card Component
function AgentTypeCard({
  icon: Icon,
  role,
  status,
  metric,
  metricValue,
  sparklineData,
  className,
}: {
  icon: typeof Bot;
  role: string;
  status: "active" | "attention" | "idle";
  metric: string;
  metricValue: string | number;
  sparklineData: number[];
  className?: string;
}) {
  const statusConfig = {
    active: { label: "Active", color: "bg-green-500", glow: "shadow-green-500/20" },
    attention: { label: "Attention", color: "bg-yellow-500", glow: "shadow-yellow-500/20" },
    idle: { label: "Idle", color: "bg-gray-500", glow: "shadow-gray-500/20" },
  };

  const config = statusConfig[status];

  return (
    <Card
      className={cn(
        "hover:shadow-lg transition-all duration-200 hover:scale-[1.02]",
        status === "active" && "bg-gradient-to-br from-card to-card/80 border-primary/20",
        className
      )}
    >
      <CardContent className="pt-4 pb-3 px-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className={cn("size-8 rounded-lg flex items-center justify-center", status === "active" ? "bg-primary/20" : "bg-muted")}>
              <Icon className={cn("size-4", status === "active" ? "text-primary" : "text-muted-foreground")} />
            </div>
            <div>
              <p className="text-xs font-medium">{role}</p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <div className={cn("size-1.5 rounded-full", config.color)} />
                <span className="text-xs text-muted-foreground">{config.label}</span>
              </div>
            </div>
          </div>
        </div>
        <div className="space-y-2">
          <div>
            <p className="text-2xl font-bold">{metricValue}</p>
            <p className="text-xs text-muted-foreground">{metric}</p>
          </div>
          <div className="flex items-center justify-between">
            <SparklineChart data={sparklineData} color={status === "active" ? "rgb(139, 92, 246)" : "rgb(107, 114, 128)"} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Activity Item Component
function ActivityItem({ agent, action, time }: { agent: string; action: string; time: string }) {
  const initials = agent
    .split(" ")
    .map((n) => n[0])
    .join("");

  return (
    <div className="flex items-start gap-3 py-2 border-b border-border/50 last:border-0">
      <Avatar className="size-7">
        <AvatarFallback className="bg-primary/10 text-primary text-xs">{initials}</AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <p className="text-sm leading-tight">{action}</p>
        <p className="text-xs text-muted-foreground mt-0.5">{time}</p>
      </div>
    </div>
  );
}

// Main Sidebar Component
export function AgentActivitySidebar() {
  // Mock data
  const overallStatus = "active"; // or "attention"
  const agentTypes = [
    {
      icon: Users,
      role: "Customer Support",
      status: "active" as const,
      metric: "Tickets handled today",
      metricValue: "42",
      sparklineData: [12, 15, 18, 22, 28, 35, 42],
    },
    {
      icon: DollarSign,
      role: "Finance",
      status: "attention" as const,
      metric: "Cash status",
      metricValue: "Healthy",
      sparklineData: [85, 82, 88, 90, 87, 85, 88],
    },
    {
      icon: Calendar,
      role: "Meetings",
      status: "active" as const,
      metric: "Summarized this week",
      metricValue: "18",
      sparklineData: [2, 4, 6, 8, 12, 15, 18],
    },
  ];

  const activities = [
    { agent: "Support Agent", action: "resolved 5 tickets", time: "2h ago" },
    { agent: "Finance Agent", action: "flagged expense anomaly", time: "3h ago" },
    { agent: "Meeting Agent", action: "summarized board call", time: "4h ago" },
    { agent: "Support Agent", action: "escalated priority issue", time: "5h ago" },
    { agent: "Finance Agent", action: "generated weekly report", time: "1d ago" },
  ];

  const insights = [
    { severity: "warning", text: "Customers are confused about onboarding", recommendation: "Review onboarding flow" },
    { severity: "info", text: "Expenses increased 12% this week", recommendation: "Review budget" },
    { severity: "attention", text: "Recurring decision delays in meetings", recommendation: "Optimize agenda" },
  ];

  return (
    <div className="w-[380px] h-full bg-background border-l border-border overflow-y-auto shrink-0">
      <div className="p-4 space-y-4">
        {/* Header Section */}
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-lg font-semibold">Agent Activity</h2>
            <p className="text-xs text-muted-foreground mt-0.5">Live overview of your AI team</p>
          </div>
          <div className="flex items-center gap-2">
            <div
              className={cn(
                "size-2 rounded-full",
                overallStatus === "active" ? "bg-green-500 animate-pulse" : "bg-yellow-500"
              )}
            />
            <Button variant="ghost" size="icon-sm" className="h-7 w-7">
              <RefreshCw className="size-3.5" />
            </Button>
          </div>
        </div>

        {/* Agent Status Overview */}
        <div className="grid grid-cols-2 gap-2">
          {agentTypes.map((agent, index) => (
            <AgentTypeCard key={index} {...agent} />
          ))}
        </div>

        {/* Activity Timeline */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold">Today's Activity</CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <div className="space-y-0">
              {activities.map((activity, index) => (
                <ActivityItem key={index} {...activity} />
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Performance Snapshot */}
        <div className="space-y-3">
          {/* Operational Efficiency */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold">Operational Efficiency</CardTitle>
            </CardHeader>
            <CardContent className="px-4 pb-4 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">Avg response time</p>
                  <p className="text-xl font-bold">2.3s</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Tasks completed</p>
                  <p className="text-xl font-bold">127</p>
                </div>
              </div>
              <div className="pt-2">
                <SparklineChart data={[45, 52, 48, 55, 50, 47, 42]} color="rgb(139, 92, 246)" />
              </div>
            </CardContent>
          </Card>

          {/* Financial Health */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold">Financial Pulse</CardTitle>
            </CardHeader>
            <CardContent className="px-4 pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Runway health</p>
                  <CircularProgress value={78} max={100} color="rgb(34, 197, 94)" />
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted-foreground mb-1">Expense stability</p>
                  <div className="flex items-center gap-1">
                    <TrendingUp className="size-4 text-green-500" />
                    <span className="text-sm font-semibold">+5.2%</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Meetings & Decisions */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold">Meetings</CardTitle>
            </CardHeader>
            <CardContent className="px-4 pb-4 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">Summarized today</p>
                  <p className="text-xl font-bold">8</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Action items</p>
                  <p className="text-xl font-bold">24</p>
                </div>
              </div>
              <div className="pt-2">
                <SparklineChart data={[2, 4, 6, 5, 7, 6, 8]} color="rgb(139, 92, 246)" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Insights & Alerts */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold">Agent Insights</CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <div className="space-y-3">
              {insights.map((insight, index) => (
                <div key={index} className="flex items-start gap-2">
                  <div
                    className={cn(
                      "size-2 rounded-full mt-1.5 shrink-0",
                      insight.severity === "warning" && "bg-yellow-500",
                      insight.severity === "info" && "bg-blue-500",
                      insight.severity === "attention" && "bg-orange-500"
                    )}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs leading-tight">{insight.text}</p>
                    <Button variant="ghost" size="sm" className="h-6 mt-1 text-xs px-2">
                      {insight.recommendation} →
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" className="flex-1 text-xs">
            <BarChart3 className="size-3.5 mr-1.5" />
            Full reports
          </Button>
          <Button variant="outline" size="sm" className="flex-1 text-xs">
            <MessageSquare className="size-3.5 mr-1.5" />
            Message all
          </Button>
          <Button variant="outline" size="sm" className="w-full text-xs">
            <Download className="size-3.5 mr-1.5" />
            Download summary
          </Button>
        </div>
      </div>
    </div>
  );
}

